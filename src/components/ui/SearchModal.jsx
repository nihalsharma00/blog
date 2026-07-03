import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { truncate } from '../../utils/truncate';

export function SearchModal({ isOpen, onClose, posts = [] }) {
  const { query, setQuery, results } = useSearch(posts);
  const inputRef = useRef(null);

  // Focus input and trap focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen, setQuery]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const displayResults = query.trim() ? results.slice(0, 8) : posts.slice(0, 5);
  const label = query.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Recent posts';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Search posts"
          >
            <div className="bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, topics, authors…"
                  className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 text-base placeholder:text-zinc-400 focus:outline-none"
                  aria-label="Search"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-700">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {query.trim() ? <TrendingUp className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {label}
                </div>
                {displayResults.length === 0 ? (
                  <div className="px-5 py-10 text-center text-zinc-400">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <ul>
                    {displayResults.map((post) => (
                      <li key={post.id}>
                        <Link
                          to={`/post/${post.id}`}
                          onClick={onClose}
                          className="flex items-start gap-4 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={`https://picsum.photos/seed/post${post.id}/100/100`}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 capitalize">
                              {post.title}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                              {truncate(post.body, 80)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">↑</kbd><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">↓</kbd> navigate</span>
                <span><kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">↵</kbd> open</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
