/**
 * Calculates estimated reading time from text content.
 * @param {string} text - The content text
 * @param {number} wpm - Words per minute (default 230)
 * @returns {string} e.g. "4 min read"
 */
export function readingTime(text = '', wpm = 230) {
  if (!text) return '1 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}
