import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { FeaturedHero } from '../components/blog/FeaturedHero';
import { PostCard } from '../components/blog/PostCard';
import { CategoryChips } from '../components/blog/CategoryChips';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard, SkeletonHero } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/States';
import { fetchPosts, fetchUsers, fetchComments } from '../api/posts';
import { fetchSupabasePosts } from '../api/supabase';
import { isSupabaseConfigured } from '../lib/supabase';
import { useSearch } from '../hooks/useSearch';

const POSTS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'mostComments', label: 'Most Comments' },
  { value: 'readingTime', label: 'Reading Time' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showSort, setShowSort] = useState(false);

  // Demo Mode Data fetching
  const { data: jsonPosts = [], isLoading: jsonLoading, error: jsonError, refetch: refetchJson } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers, staleTime: 5 * 60 * 1000 });
  const { data: comments = [] } = useQuery({ queryKey: ['comments'], queryFn: fetchComments, staleTime: 5 * 60 * 1000 });

  // Full Mode Data fetching
  const { data: sbData, isLoading: sbLoading, error: sbError, refetch: refetchSb } = useQuery({
    queryKey: ['supabase-posts-all'],
    queryFn: () => fetchSupabasePosts({ perPage: 100 }), // fetch enough to mix for discovery
    enabled: isSupabaseConfigured,
    staleTime: 5 * 60 * 1000,
  });

  const sbPosts = sbData?.posts || [];
  
  // Combine posts (Supabase posts first)
  const allPosts = useMemo(() => [...sbPosts, ...jsonPosts], [sbPosts, jsonPosts]);
  const postsLoading = jsonLoading || (isSupabaseConfigured && sbLoading);
  const postsError = jsonError || (isSupabaseConfigured && sbError);

  const handleRefetch = () => {
    refetchJson();
    if (isSupabaseConfigured) refetchSb();
  };

  // Maps for Demo Mode cross-referencing
  const userMap = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);
  const commentsByPost = useMemo(() => {
    const map = {};
    comments.forEach(c => { map[c.postId] = (map[c.postId] || 0) + 1; });
    return map;
  }, [comments]);

  // Search
  const { query, setQuery, results: searchResults } = useSearch(allPosts);

  // Filter by category
  const filteredByCategory = useMemo(() => {
    if (selectedCategory === null) return searchResults;
    return searchResults.filter(p => p.category === selectedCategory);
  }, [searchResults, selectedCategory]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filteredByCategory];
    switch (sortBy) {
      case 'oldest':
        return arr.sort((a, b) => {
          const tA = a.created_at ? new Date(a.created_at).getTime() : a.id;
          const tB = b.created_at ? new Date(b.created_at).getTime() : b.id;
          return tA - tB;
        });
      case 'mostComments':
        return arr.sort((a, b) => (commentsByPost[b.id] || 0) - (commentsByPost[a.id] || 0));
      case 'readingTime':
        return arr.sort((a, b) => (b.body?.length || b.content?.length || 0) - (a.body?.length || a.content?.length || 0));
      default: // newest
        return arr.sort((a, b) => {
          const tA = a.created_at ? new Date(a.created_at).getTime() : a.id;
          const tB = b.created_at ? new Date(b.created_at).getTime() : b.id;
          return tB - tA; // For JSON posts, higher ID is newer
        });
    }
  }, [filteredByCategory, sortBy, commentsByPost]);

  // Pagination (exclude featured from grid)
  const gridPosts = sorted.slice(1); // hero uses sorted[0]
  const totalPages = Math.ceil(gridPosts.length / POSTS_PER_PAGE);
  const paginated = gridPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSort = (val) => {
    setSortBy(val);
    setCurrentPage(1);
    setShowSort(false);
  };

  const handleSearch = (val) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const featuredPost = sorted[0];
  const featuredUser = featuredPost && !featuredPost.created_at ? userMap[featuredPost.userId] : null;

  return (
    <Layout>
      <title>Inkwell — Modern Blog for Curious Minds</title>

      {/* Hero */}
      {postsLoading ? (
        <SkeletonHero />
      ) : postsError ? (
        <ErrorState message="Failed to load posts. Please try again." onRetry={handleRefetch} />
      ) : featuredPost ? (
        <FeaturedHero
          post={featuredPost}
          user={featuredUser}
          commentsCount={commentsByPost[featuredPost.id] || 0}
        />
      ) : null}

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* Inline search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles…"
            className="input pl-10 pr-10 py-2.5 text-sm"
            aria-label="Search articles"
            id="home-search-input"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowSort(p => !p)}
            className="btn-outline text-sm py-2.5 px-4 flex items-center gap-2"
            aria-expanded={showSort}
            aria-haspopup="listbox"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{SORT_OPTIONS.find(s => s.value === sortBy)?.label}</span>
            <span className="sm:hidden">Sort</span>
          </button>

          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1a24] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden"
                role="listbox"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    role="option"
                    aria-selected={sortBy === opt.value}
                    onClick={() => handleSort(opt.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === opt.value
                        ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category Chips */}
      {!query && (
        <div className="mb-10">
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>
      )}

      {/* Grid */}
      {postsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState message="No articles found matching your criteria." />
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
