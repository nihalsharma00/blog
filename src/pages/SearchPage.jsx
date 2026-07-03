import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, X, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PostCard } from '../components/blog/PostCard';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/States';
import { fetchPosts, fetchUsers, fetchAlbums, fetchComments } from '../api/posts';
import { extractTags } from '../utils/truncate';
import { slugify } from '../utils/slugify';

const POSTS_PER_PAGE = 9;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  const query = searchParams.get('q') || '';

  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers, staleTime: 5 * 60 * 1000 });
  const { data: albums = [] } = useQuery({ queryKey: ['albums'], queryFn: fetchAlbums, staleTime: 5 * 60 * 1000 });
  const { data: comments = [] } = useQuery({ queryKey: ['comments'], queryFn: fetchComments, staleTime: 5 * 60 * 1000 });

  const userMap = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);
  const albumMap = useMemo(() => Object.fromEntries(albums.map(a => [a.id, a])), [albums]);
  const commentsByPost = useMemo(() => {
    const map = {};
    comments.forEach(c => { map[c.postId] = (map[c.postId] || 0) + 1; });
    return map;
  }, [comments]);

  // Tags for suggestions
  const tags = useMemo(() => extractTags(posts.map(p => p.title), 12), [posts]);

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleSearch = (val) => {
    setSearchParams(val ? { q: val } : {});
    setCurrentPage(1);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  // Sync input with URL param
  useEffect(() => {
    setInputValue(searchParams.get('q') || '');
  }, [searchParams]);

  return (
    <Layout>
      <title>Search{query ? ` — "${query}"` : ''} — Inkwell</title>

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
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
          {query ? `Results for "${query}"` : 'Explore Topics'}
        </h1>
        {query && (
          <p className="text-zinc-500 dark:text-zinc-400">
            Found {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </motion.div>

      {/* Search bar */}
      <form onSubmit={handleInputSubmit} className="relative mb-6 max-w-xl" role="search">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search articles, topics, authors…"
          className="input pl-12 pr-12 py-3.5 text-base"
          aria-label="Search"
          id="search-page-input"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => { setInputValue(''); handleSearch(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Tag suggestions */}
      {!query && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
            Popular Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="px-4 py-2 text-sm font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : paginated.length === 0 && query ? (
        <EmptyState message={`No articles found for "${query}". Try a different search term.`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              user={userMap[post.userId]}
              album={albumMap[post.userId]}
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
