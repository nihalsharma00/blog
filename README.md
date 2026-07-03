# Inkwell Blog Platform

A modern, high-performance blog platform built with React (Vite) and Tailwind CSS. It features a stunning category-based UI, complete with rich dual-mode functionality (Demo Mode & Full Production Mode with Supabase).

## Features
- **Category Themes**: Dynamic UI colors matching 8 specific topics (Tech, Travel, Food, Fashion, Study, Gaming, Personal, News).
- **Responsive Layout**: Designed for optimal reading experiences on both desktop and mobile.
- **Rich Editor**: Fully functional WYSIWYG editor using Tiptap.
- **Dual Mode Architecture**: Gracefully defaults to a mock backend (Demo Mode) when no database configuration is present.

---

## Architecture: Demo Mode vs Full Mode

### Demo Mode (JSONPlaceholder)
When the application is run without a `.env.local` file (or empty variables), it defaults to **Demo Mode**. 
- It fetches dummy posts, authors, and comments from the JSONPlaceholder API.
- Authentication UI is presented, but gracefully warns the user that Supabase is unconfigured.
- Subscriptions are safely stored in `localStorage` for testing.
- Perfect for evaluating the UI without deploying a real database.

### Full Mode (Supabase)
When configured with Supabase credentials, the application unlocks **Full Mode**:
- **Authentication**: Secure sign-up, log-in, and session management.
- **Database**: Persistent storage of Profiles, Posts, Bookmarks, Comments, and Subscriptions.
- **Row Level Security**: Strict database rules ensuring users can only edit or delete content they explicitly own.
- **Storage**: Real cover image uploads to Supabase Buckets.

---

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the dev server (Demo Mode):**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

---

## Supabase Setup (Full Mode)

To enable Full Mode, you must create a free [Supabase](https://supabase.com) project and configure it as follows:

1. Create a new Supabase project.
2. In the project dashboard, go to SQL Editor and run the schema script located at `supabase_schema.sql` in this repository. This script handles:
   - Creating tables for `profiles`, `posts`, `comments`, `bookmarks`, and `subscriptions`.
   - Setting up foreign key relationships.
   - Enabling **Row Level Security (RLS)**.
   - Creating secure access policies.
   - Registering a trigger to automatically create a profile when a new user signs up.
3. In the Supabase Dashboard, go to **Storage** and create a new public bucket named `blog-images`. Make sure the bucket is set to **Public**.

### Environment Variables
Create a file named `.env.local` in the root of the project with your project's URL and Anon Key:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Security Notes
- **Never expose your Service Role Key.** Only use the `ANON_KEY` in your `.env.local` file.
- All database security relies on **Row Level Security (RLS)** configured in the SQL schema. The React frontend safely queries the database directly, and Supabase automatically rejects any unauthorized edits (like attempting to modify another user's post).
- Passwords are never stored manually or locally; Supabase Auth securely handles hashing and session persistence.

---

## Vercel Deployment Steps

This project is fully ready to be deployed to Vercel:

1. **Push your code to GitHub**, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository. Vercel will automatically detect the **Vite** preset.
4. Expand the **Environment Variables** section. Add:
   - `VITE_SUPABASE_URL` = `your_production_url`
   - `VITE_SUPABASE_ANON_KEY` = `your_production_anon_key`
5. Click **Deploy**. Vercel will automatically run `npm run build` and publish your blog!

Enjoy building with Inkwell!
