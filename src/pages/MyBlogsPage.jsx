import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Eye, EyeOff, Clock, Calendar, Plus
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/States';
import { fetchMyPosts } from '../api/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDate, mockDate } from '../utils/formatDate';
import { CATEGORY_MAP } from '../components/blog/CategoryTheme';
import { PostActions } from '../components/blog/PostActions';

export default function MyBlogsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['my-posts', user?.id],
    queryFn: () => fetchMyPosts(user.id),
    enabled: !!user?.id,
    staleTime: 0,
  });

  const handleDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ['my-posts', user?.id] });
  };

  const published = posts.filter(p => p.published);
  const drafts = posts.filter(p => !p.published);

  return (
    <Layout showSidebar={false}>
      <title>My Blogs — Inkwell</title>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">My Blogs</h1>
              <p className="text-sm text-zinc-400">
                {posts.length} post{posts.length !== 1 ? 's' : ''} · {published.length} published · {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link to="/create" className="btn-primary self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Posts', value: posts.length, color: 'text-primary-600' },
            { label: 'Published', value: published.length, color: 'text-emerald-600' },
            { label: 'Drafts', value: drafts.length, color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message="Failed to load your posts." onRetry={refetch} />
        ) : posts.length === 0 ? (
          <EmptyState message="You haven't written any posts yet. Start your first story!" />
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => {
              const cat = CATEGORY_MAP[post.category];
              const date = post.created_at ? new Date(post.created_at) : mockDate(i);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="card p-5 flex flex-col sm:flex-row gap-4"
                >
                  {/* Thumbnail */}
                  {post.cover_image ? (
                    <div className="w-full sm:w-32 h-24 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={post.cover_image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full sm:w-32 h-24 sm:h-auto rounded-xl flex-shrink-0 flex items-center justify-center text-3xl"
                      style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}
                    >
                      {cat?.emoji || '📝'}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 capitalize line-clamp-2 flex-1">
                        {post.title}
                      </h2>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        post.published
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-3">
                      {cat && (
                        <span className="flex items-center gap-1" style={{ color: cat.color }}>
                          {cat.emoji} {cat.label}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(date)}
                      </span>
                      {post.reading_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.reading_time} min read
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/post/${post.id}`}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                      >
                        View post →
                      </Link>
                      <PostActions post={post} onDeleted={handleDeleted} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
