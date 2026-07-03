import { useEffect } from 'react';

// Category theme data
export const CATEGORIES = [
  {
    id: 'tech',
    label: 'Tech',
    theme: 'tech',
    color: '#22c55e',
    description: 'Programming, AI, software & hardware',
    emoji: '💻',
  },
  {
    id: 'travel',
    label: 'Travel',
    theme: 'travel',
    color: '#d97706',
    description: 'Destinations, culture & adventures',
    emoji: '✈️',
  },
  {
    id: 'food',
    label: 'Food',
    theme: 'food',
    color: '#b45309',
    description: 'Recipes, restaurants & food culture',
    emoji: '🍳',
  },
  {
    id: 'fashion',
    label: 'Fashion',
    theme: 'fashion',
    color: '#d4a853',
    description: 'Style, trends & editorial',
    emoji: '👗',
  },
  {
    id: 'study',
    label: 'Study',
    theme: 'study',
    color: '#374151',
    description: 'Guides, notes & learning resources',
    emoji: '📚',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    theme: 'gaming',
    color: '#84cc16',
    description: 'Games, reviews & culture',
    emoji: '🎮',
  },
  {
    id: 'personal',
    label: 'Personal',
    theme: 'personal',
    color: '#92400e',
    description: 'Diaries, reflections & life',
    emoji: '📓',
  },
  {
    id: 'news',
    label: 'News',
    theme: 'news',
    color: '#dc2626',
    description: 'Current events & opinions',
    emoji: '📰',
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

/**
 * Wraps a page in a category-specific theme via a data attribute.
 * CSS variables are defined in index.css per [data-category="*"].
 */
export function CategoryTheme({ category, children }) {
  useEffect(() => {
    if (category) {
      document.documentElement.setAttribute('data-category', category);
    }
    return () => {
      document.documentElement.removeAttribute('data-category');
    };
  }, [category]);

  return (
    <div data-category={category || undefined} className="category-theme-wrapper">
      {children}
    </div>
  );
}
