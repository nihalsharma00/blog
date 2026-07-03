import { useState, useCallback, useEffect } from 'react';
import { toggleBookmark, isBookmarked } from '../api/supabase';
import { useAuth } from '../context/AuthContext';

export function useBookmarks(postId) {
  const { user, isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (isAuthenticated && postId) {
      isBookmarked(user.id, postId).then((v) => {
        if (!cancelled) setBookmarked(v);
      });
    } else {
      setBookmarked(false);
    }
    return () => { cancelled = true; };
  }, [user?.id, postId, isAuthenticated]);

  const toggle = useCallback(async () => {
    if (!isAuthenticated || !postId) return null;
    setLoading(true);
    try {
      const result = await toggleBookmark({ userId: user.id, postId });
      setBookmarked(result);
      return result;
    } catch (err) {
      console.error('Bookmark toggle error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id, postId, isAuthenticated]);

  return { bookmarked, toggle, loading };
}
