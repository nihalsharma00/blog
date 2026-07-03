import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Provides instant search filtering over a list of posts.
 * @param {Array} posts
 * @returns {{ query, setQuery, results }}
 */
export function useSearch(posts = []) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return posts;
    const q = debouncedQuery.toLowerCase();
    return posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q)
    );
  }, [posts, debouncedQuery]);

  return { query, setQuery, results, debouncedQuery };
}
