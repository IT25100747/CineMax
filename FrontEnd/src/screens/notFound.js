// filepath: src/screens/notFound.js
import { renderLayout } from '../components/layout.js';

/**
 * Renders a 404 not found page
 * @param {string} message - Custom error message to display
 */
export function notFound(message = 'Page not found') {
  const content = `
  <section class="min-h-screen pt-16 flex items-center justify-center">
    <div class="text-center">
      <p class="text-xl font-semibold text-white/70">${message}</p>
      <button data-route="/" class="mt-4 text-red-400 hover:text-red-300 text-sm">Back to Home</button>
    </div>
  </section>`;

  renderLayout(content);
}