import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookMarked, Clock, Calendar } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/States';
import { fetchBookmarks } from '../api/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { BookmarkButton } from '../components/blog/BookmarkButton';
import { CATEGORY_MAP } from '../components/blog/CategoryTheme';

export default function BookmarksPage() {
  const { user } = useAuth();

  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: () => fetchBookmarks(user.id),
    enabled: !!user?.id,
    staleTime: 0,
  });

  return (
    <Layout>
      <title>Bookmarks — Inkwell</title>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
          <BookMarked className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Bookmarks</h1>
          <p className="text-sm text-zinc-400">{posts.length} saved article{posts.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message="Failed to load bookmarks." onRetry={refetch} />
      ) : posts.length === 0 ? (
        <EmptyState message="No bookmarks yet. Save articles you love with the bookmark button." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const cat = CATEGORY_MAP[post.category];
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              >
                <Link to={`/post/${post.id}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-5xl"
                        style={{ backgroundColor: `${cat?.color}20` }}
                      >
                        {cat?.emoji || '📝'}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  {cat && (
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                      {cat.emoji} {cat.label}
                    </span>
                  )}
                  <Link to={`/post/${post.id}`}>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 capitalize mt-1 mb-2">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      {post.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.reading_time} min read
                        </span>
                      )}
                      {post.bookmarked_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Saved {formatDate(new Date(post.bookmarked_at))}
                        </span>
                      )}
                    </div>
                    <BookmarkButton postId={post.id} size="sm" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
