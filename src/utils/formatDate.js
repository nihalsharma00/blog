// Seed-based deterministic date generation so posts always show consistent dates
const BASE_DATE = new Date('2024-01-01T00:00:00Z').getTime();
const DAY_MS = 86400000;

/**
 * Generates a deterministic mock publish date from a post id.
 * @param {number} id
 * @returns {Date}
 */
export function mockDate(id) {
  return new Date(BASE_DATE + id * DAY_MS * 3);
}

/**
 * Formats a Date object to a human-readable string.
 * @param {Date|string|number} date
 * @returns {string} e.g. "January 15, 2024"
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Relative time string (e.g. "3 days ago").
 * @param {Date|string|number} date
 * @returns {string}
 */
export function relativeDate(date) {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}
