import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from './CategoryTheme';

export function CategoryChips({ selectedCategory, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center gap-2 mb-8">
      {/* Left scroll btn */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll categories left"
        className="flex-shrink-0 p-1.5 rounded-lg bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text shadow-sm transition-all md:hidden"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Chips row */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        role="group"
        aria-label="Filter by category"
      >
        {/* All chip */}
        <button
          onClick={() => onSelect(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-300'
              : 'bg-theme-bg text-theme-text border-theme-border hover:border-primary-400'
          }`}
          aria-pressed={selectedCategory === null}
        >
          All Posts
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 capitalize ${
                isActive
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-300'
                  : 'bg-theme-bg text-theme-text border-theme-border hover:border-primary-400 dark:hover:border-primary-600'
              }`}
              aria-pressed={isActive}
            >
              {cat.emoji} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Right scroll btn */}
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll categories right"
        className="flex-shrink-0 p-1.5 rounded-lg bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text shadow-sm transition-all md:hidden"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
