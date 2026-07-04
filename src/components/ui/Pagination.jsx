import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('…');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push('…');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 mt-10 flex-nowrap overflow-x-auto max-w-full pb-4 sm:pb-0 px-1"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-theme-border text-theme-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-border transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {getPages().map((page, i) =>
        page === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 py-2 text-theme-muted"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentPage === page
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500'
                : 'border border-theme-border text-theme-text hover:bg-theme-border'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-theme-border text-theme-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-border transition-all duration-200"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
