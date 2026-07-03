/**
 * Converts a string to a URL-safe slug.
 * @param {string} str
 * @returns {string}
 */
export function slugify(str = '') {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Finds a value from a slug in an array.
 * @param {Array} arr
 * @param {string} slug
 * @param {string} field - The field to slugify for comparison
 */
export function findBySlug(arr, slug, field = 'title') {
  return arr.find(item => slugify(item[field]) === slug);
}
