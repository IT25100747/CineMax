import { navbar, bindNav } from './navbar.js';

/**
 * Renders the main layout wrapper with navbar and content
 * Hides top navbar on admin pages
 * @param {string} content - The main content HTML to render
 * @returns {string} Full page HTML with layout
 */
export function layout(content) {
  const currentRoute = window.location.hash;

  // Check if current page is admin page
  const isAdminPage = currentRoute.startsWith('#/admin');

  return `
    <div class="min-h-screen bg-[#0a0a0f]">
      
      ${
        !isAdminPage
          ? navbar()
          : ''
      }

      <main class="fade-in">
        ${content}
      </main>

    </div>
  `;
}

/**
 * Applies the layout to the DOM and binds navigation events
 * @param {string} content - The main content HTML to render
 */
export function renderLayout(content) {
  const app = document.getElementById('app');

  app.innerHTML = layout(content);

  // Only bind navbar events if navbar exists
  const isAdminPage = window.location.hash.startsWith('#/admin');

  if (!isAdminPage) {
    bindNav();
  }
}