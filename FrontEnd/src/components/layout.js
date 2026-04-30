// filepath: src/components/layout.js
import { navbar, bindNav } from './navbar.js';

/**
 * Renders the main layout wrapper with navbar and content
 * @param {string} content - The main content HTML to render
 * @returns {string} Full page HTML with layout
 */
export function layout(content) {
  return `
    <div class="min-h-screen bg-[#0a0a0f]">
      ${navbar()}
      <main class="fade-in">${content}</main>
    </div>`;
}

/**
 * Applies the layout to the DOM and binds navigation events
 * @param {string} content - The main content HTML to render
 */
export function renderLayout(content) {
  const app = document.getElementById('app');
  app.innerHTML = layout(content);
  bindNav();
}