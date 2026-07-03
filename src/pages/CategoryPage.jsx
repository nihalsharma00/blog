import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PostCard } from '../components/blog/PostCard';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/States';
import { fetchPosts, fetchUsers, fetchComments } from '../api/posts';
import { fetchSupabasePosts } from '../api/supabase';
import { isSupabaseConfigured } from '../lib/supabase';
import { CATEGORIES } from '../components/blog/CategoryTheme';

const POSTS_PER_PAGE = 9;

export default function CategoryPage() {
  const { slug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: jsonPosts = [], isLoading: jsonLoading, error: jsonError, refetch: refetchJson } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: sbData, isLoading: sbLoading, error: sbError, refetch: refetchSb } = useQuery({
    queryKey: ['supabase-posts-all'],
    queryFn: () => fetchSupabasePosts({ perPage: 100 }),
    enabled: isSupabaseConfigured,
    staleTime: 5 * 60 * 1000,
  });

  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers, staleTime: 5 * 60 * 1000 });
  const { data: comments = [] } = useQuery({ queryKey: ['comments'], queryFn: fetchComments, staleTime: 5 * 60 * 1000 });

  const sbPosts = sbData?.posts || [];
  const allPosts = useMemo(() => [...sbPosts, ...jsonPosts], [sbPosts, jsonPosts]);
  const isLoading = jsonLoading || (isSupabaseConfigured && sbLoading);
  const error = jsonError || (isSupabaseConfigured && sbError);

  const handleRefetch = () => {
    refetchJson();
    if (isSupabaseConfigured) refetchSb();
  };

  const userMap = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);
  const commentsByPost = useMemo(() => {
    const map = {};
    comments.forEach(c => { map[c.postId] = (map[c.postId] || 0) + 1; });
    return map;
  }, [comments]);

  const currentCategory = useMemo(() => CATEGORIES.find(c => c.id === slug), [slug]);

  const filtered = useMemo(() => {
    if (slug === 'all') return allPosts;
    return allPosts.filter(p => p.category === slug);
  }, [allPosts, slug]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const title = slug === 'all' ? 'All Articles' : currentCategory?.label ?? slug;

  return (
    <Layout>
      <title>{title} — Inkwell</title>

      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </Link>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Category
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 capitalize">
          {title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={handleRefetch} />
      ) : paginated.length === 0 ? (
        <EmptyState message="No articles found in this category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((post, i) => (
            <PostCard
              key={`${post.created_at ? 'sb-' : 'json-'}${post.id}`}
              post={post}
              user={post.created_at ? null : userMap[post.userId]}
              commentsCount={commentsByPost[post.id] || 0}
              index={i}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </Layout>
  );
}
