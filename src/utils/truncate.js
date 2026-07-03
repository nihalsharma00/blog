/**
 * Truncates text to a maximum length, appending ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text = '', maxLength = 120) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Capitalises the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extracts unique words from an array of strings for use as tags.
 * @param {string[]} titles
 * @param {number} limit
 * @returns {string[]}
 */
export function extractTags(titles = [], limit = 20) {
  const stopWords = new Set([
    'a','an','the','and','or','but','in','on','at','to','for','of',
    'with','by','from','is','it','its','this','that','are','was',
    'be','as','do','not','i','you','he','she','we','they',
  ]);
  const freq = {};
  titles.forEach(title => {
    title.toLowerCase().split(/\W+/).forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => capitalize(word));
}
