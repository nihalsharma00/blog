-- Supabase Database Setup for Inkwell Blog

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Automatically synced with auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Posts Table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null,
  tags text[] default '{}',
  excerpt text,
  content text not null,
  cover_image text,
  published boolean default true,
  reading_time integer,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Index for faster queries
create index idx_posts_author on posts(author_id);
create index idx_posts_category on posts(category);

-- RLS for Posts
alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone."
  on posts for select
  using ( published = true );

create policy "Users can view their own unpublished posts."
  on posts for select
  using ( auth.uid() = author_id );

create policy "Authenticated users can insert posts."
  on posts for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own posts."
  on posts for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own posts."
  on posts for delete
  using ( auth.uid() = author_id );


-- 3. Comments Table
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index idx_comments_post on comments(post_id);

-- RLS for Comments
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone."
  on comments for select
  using ( true );

create policy "Authenticated users can insert comments."
  on comments for insert
  with check ( auth.uid() = author_id );

create policy "Users can delete their own comments."
  on comments for delete
  using ( auth.uid() = author_id );


-- 4. Bookmarks Table
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  bookmarked_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, post_id)
);

create index idx_bookmarks_user on bookmarks(user_id);

-- RLS for Bookmarks
alter table public.bookmarks enable row level security;

create policy "Users can view their own bookmarks."
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks."
  on bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks."
  on bookmarks for delete
  using ( auth.uid() = user_id );


-- 5. Storage Bucket (for post cover images)
-- Create bucket "blog-images" manually in Supabase dashboard, then set these policies:
-- Policy: Public read access
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'blog-images' );
-- Policy: Authenticated users can upload
-- create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );
-- Policy: Users can update their own images
-- create policy "Auth Update" on storage.objects for update using ( bucket_id = 'blog-images' and auth.uid() = owner );


-- 6. Triggers
-- Trigger to sync auth.users to profiles
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_posts_updated_at
    before update on posts
    for each row
    execute procedure update_updated_at_column();

-- 7. Subscriptions Table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index idx_subscriptions_email on subscriptions(email);
create index idx_subscriptions_user on subscriptions(user_id);

-- RLS for Subscriptions
alter table public.subscriptions enable row level security;

-- Users can insert their own email (or anyone can if we allow guests)
-- Since guests can subscribe, we allow insert for anyone, but maybe we enforce check if user_id is provided
create policy "Anyone can insert subscriptions."
  on subscriptions for insert
  with check ( true );

-- Users can only view their own subscriptions
create policy "Users can view own subscription."
  on subscriptions for select
  using ( auth.uid() = user_id );

