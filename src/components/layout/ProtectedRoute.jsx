import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f13]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  // In Demo Mode, protected routes show an informative message
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f0f13] p-8 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Demo Mode Active</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            This feature requires a Supabase backend. Set up your{' '}
            <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">.env.local</code>
            {' '}with Supabase credentials to enable authentication and blog creation.
          </p>
          <p className="text-xs text-zinc-400 mt-3">
            See the README for setup instructions.
          </p>
          <a href="/" className="btn-primary mt-6 inline-flex">Back to Home</a>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, openAuth: true }} replace />;
  }

  return children;
}
