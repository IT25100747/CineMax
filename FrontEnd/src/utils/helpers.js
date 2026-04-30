// filepath: src/utils/helpers.js
// Icon definitions - SVG paths for various icons used throughout the app
const icons = {
  film: '<path d="M4 2v20M20 2v20M2 7h20M2 17h20M7 2v5M7 17v5M17 2v5M17 17v5"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  calendar: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
  ticket: '<path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrow: '<path d="m15 18-6-6 6-6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'
};

/**
 * Creates an SVG icon element
 * @param {string} name - The name of the icon to render
 * @param {string} cls - CSS classes for styling (default: 'w-4 h-4')
 * @returns {string} SVG markup string
 */
export function icon(name, cls = 'w-4 h-4') {
  return `<svg class="${cls}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${icons[name] || ''}</svg>`;
}

/**
 * Formats a number as currency
 * @param {number} n - The number to format
 * @returns {string} Formatted currency string (e.g., "$12.99")
 */
export function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

/**
 * Generates genre tags HTML for a movie
 * @param {object} movie - The movie object with genre array
 * @returns {string} HTML string of genre tags
 */
export function genres(movie) {
  return movie.genre.map(g => 
    `<span class="text-xs text-white/45 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">${g}</span>`
  ).join('');
}