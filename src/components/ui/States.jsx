import { AlertTriangle, RefreshCw, ServerCrash } from 'lucide-react';

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
        <ServerCrash className="w-8 h-8 text-rose-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-theme-text mb-1">
          Oops! Something went wrong
        </h3>
        <p className="text-theme-muted text-sm max-w-sm">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'No posts found.', icon: Icon = AlertTriangle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-theme-border/50 flex items-center justify-center">
        <Icon className="w-8 h-8 text-theme-muted" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-theme-text mb-1">
          Nothing to show
        </h3>
        <p className="text-theme-muted text-sm max-w-sm">
          {message}
        </p>
      </div>
    </div>
  );
}
