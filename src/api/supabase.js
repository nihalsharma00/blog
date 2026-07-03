import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { slugify } from '../utils/slugify';
import DOMPurify from 'dompurify';

// ─── Guard ────────────────────────────────────────────────────────────────────
function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Demo Mode: Supabase not configured.');
  return supabase;
}

// ─── Posts ────────────────────────────────────────────────────────────────────
export async function fetchSupabasePosts({ category, tag, sort = 'newest', search, page = 1, perPage = 9 } = {}) {
  const db = requireSupabase();
  let query = db
    .from('posts')
    .select('*, profiles(id, username, full_name, avatar_url)', { count: 'exact' })
    .eq('published', true);

  if (category && category !== 'all') query = query.eq('category', category);
  if (tag) query = query.contains('tags', [tag]);
  if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);

  if (sort === 'oldest') query = query.order('created_at', { ascending: true });
  else if (sort === 'popular') query = query.order('view_count', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const from = (page - 1) * perPage;
  query = query.range(from, from + perPage - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: data || [], total: count || 0, totalPages: Math.ceil((count || 0) / perPage) };
}

export async function fetchSupabasePost(id) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('posts')
    .select('*, profiles(id, username, full_name, avatar_url, bio, website)')
    .eq('id', id)
    .eq('published', true)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSupabasePostBySlug(slug) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('posts')
    .select('*, profiles(id, username, full_name, avatar_url, bio, website)')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMyPosts(userId) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('posts')
    .select('*, profiles(id, username, full_name, avatar_url)')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchRelatedPosts(postId, category, limit = 3) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('posts')
    .select('id, title, slug, cover_image, excerpt, category, reading_time, created_at, profiles(username, full_name, avatar_url)')
    .eq('category', category)
    .eq('published', true)
    .neq('id', postId)
    .limit(limit);
  if (error) throw error;
  return data || [];
}

function sanitizeContent(content) {
  if (typeof window === 'undefined') return content;
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','ul','ol','li','strong','em','u','a','blockquote','img','code','pre','hr','span'],
    ALLOWED_ATTR: ['href','src','alt','class','target','rel'],
    ALLOW_DATA_ATTR: false,
  });
}

export async function createPost({ title, category, tags, excerpt, content, coverImage, published = true, authorId }) {
  const db = requireSupabase();
  const slug = await generateUniqueSlug(title);
  const sanitized = sanitizeContent(content);

  const { data, error } = await db
    .from('posts')
    .insert({
      title: title.trim(),
      slug,
      category,
      tags: tags || [],
      excerpt: excerpt?.trim() || '',
      content: sanitized,
      cover_image: coverImage || null,
      published,
      author_id: authorId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(id, updates) {
  const db = requireSupabase();
  const sanitized = updates.content ? sanitizeContent(updates.content) : undefined;

  const { data, error } = await db
    .from('posts')
    .update({
      ...updates,
      ...(sanitized ? { content: sanitized } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    // RLS will reject if user is not the owner
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(id) {
  const db = requireSupabase();
  const { error } = await db.from('posts').delete().eq('id', id);
  if (error) throw error;
}

async function generateUniqueSlug(title) {
  const db = requireSupabase();
  let base = slugify(title);
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await db.from('posts').select('id').eq('slug', slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ─── Comments ─────────────────────────────────────────────────────────────────
export async function fetchSupabaseComments(postId) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('comments')
    .select('*, profiles(id, username, full_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addComment({ postId, authorId, content }) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('comments')
    .insert({ post_id: postId, author_id: authorId, content: content.trim() })
    .select('*, profiles(id, username, full_name, avatar_url)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(id) {
  const db = requireSupabase();
  const { error } = await db.from('comments').delete().eq('id', id);
  if (error) throw error;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────
export async function fetchBookmarks(userId) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('bookmarks')
    .select('post_id, created_at, posts(*, profiles(username, full_name, avatar_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(b => ({ ...b.posts, bookmarked_at: b.created_at }));
}

export async function toggleBookmark({ userId, postId }) {
  const db = requireSupabase();
  const { data: existing } = await db
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    const { error } = await db.from('bookmarks').delete().eq('user_id', userId).eq('post_id', postId);
    if (error) throw error;
    return false; // unbookmarked
  } else {
    const { error } = await db.from('bookmarks').insert({ user_id: userId, post_id: postId });
    if (error) throw error;
    return true; // bookmarked
  }
}

export async function isBookmarked(userId, postId) {
  if (!userId || !postId || !isSupabaseConfigured) return false;
  const db = requireSupabase();
  const { data } = await db
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  return !!data;
}

// ─── Storage (Cover Images) ───────────────────────────────────────────────────
export async function uploadCoverImage(file, userId) {
  const db = requireSupabase();

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
  }
  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  const ext = file.name.split('.').pop();
  const path = `covers/${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await db.storage
    .from('blog-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = db.storage.from('blog-images').getPublicUrl(path);
  return data.publicUrl;
}

// ─── Profiles ────────────────────────────────────────────────────────────────
export async function updateProfile(userId, updates) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Subscriptions ────────────────────────────────────────────────────────────
export async function subscribeEmail(email, userId = null) {
  const db = requireSupabase();
  const { data, error } = await db
    .from('subscriptions')
    .insert({ email, user_id: userId })
    .select()
    .single();
  if (error) {
    if (error.code === '23505') throw new Error('Email is already subscribed');
    throw error;
  }
  return data;
}

export async function checkSubscription(userId) {
  if (!userId || !isSupabaseConfigured) return false;
  const db = requireSupabase();
  const { data } = await db
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}
