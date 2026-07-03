import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/layout/Layout';
import { BlogForm } from '../components/blog/BlogForm';
import { SkeletonArticle } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { fetchSupabasePost } from '../api/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

export default function EditPostPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['supabase-post', id],
    queryFn: () => fetchSupabasePost(id),
    enabled: !!id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Layout showSidebar={false}>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <SkeletonArticle />
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout showSidebar={false}>
        <div className="max-w-3xl mx-auto px-4 py-20">
          <ErrorState message="Post not found or you don't have access to edit it." />
        </div>
      </Layout>
    );
  }

  // Ownership check in UI (RLS also enforces this at DB level)
  if (post.author_id !== user?.id) {
    return <Navigate to={`/post/${id}`} replace />;
  }

  return (
    <Layout showSidebar={false}>
      <title>Edit Post — Inkwell</title>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Edit Post</h1>
              <p className="text-sm text-zinc-400 line-clamp-1 capitalize">{post.title}</p>
            </div>
          </div>
          <BlogForm mode="edit" postId={id} initialData={post} />
        </motion.div>
      </div>
    </Layout>
  );
}
