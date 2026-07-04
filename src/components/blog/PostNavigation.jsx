import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { truncate } from '../../utils/truncate';

export function PostNavigation({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
      aria-label="Article navigation"
    >
      {prev ? (
        <Link
          to={`/post/${prev.id}`}
          className="card p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-300"
          rel="prev"
        >
          <ChevronLeft className="w-5 h-5 text-theme-muted group-hover:text-primary-600 flex-shrink-0 transition-colors" />
          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-theme-muted mb-1">Previous</p>
            <p className="text-sm font-bold text-theme-text group-hover:text-primary-600 transition-colors capitalize line-clamp-1">
              {truncate(prev.title, 60)}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={`/post/${next.id}`}
          className="card p-5 flex items-center justify-end gap-4 group hover:-translate-y-0.5 transition-all duration-300 text-right"
          rel="next"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-theme-muted mb-1">Next</p>
            <p className="text-sm font-bold text-theme-text group-hover:text-primary-600 transition-colors capitalize line-clamp-1">
              {truncate(next.title, 60)}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-theme-muted group-hover:text-primary-600 flex-shrink-0 transition-colors" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
