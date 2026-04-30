// filepath: src/components/navbar.js
import { icon } from '../utils/helpers.js';
import { route, setRoute } from '../utils/router.js';

/**
 * Renders the navigation bar component
 * @returns {string} HTML string for the navbar
 */
export function navbar() {
  return `
  <nav class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <button data-route="/" class="flex items-center gap-2 group">
          <span class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">${icon('film', 'w-4 h-4 text-white')}</span>
          <span class="text-white text-lg font-bold tracking-tight">Cine<span class="text-red-500">Max</span></span>
        </button>
        <div class="hidden md:flex items-center gap-8 text-sm">
          <button data-route="/" class="${route()==='/'?'text-red-400':'text-white/70 hover:text-white'} transition-colors">Movies</button>
          <button data-route="/" class="text-white/70 hover:text-white transition-colors">Cinemas</button>
          <button data-route="/" class="text-white/70 hover:text-white transition-colors">Offers</button>
        </div>
        <div class="hidden md:flex items-center gap-3">
          <button class="p-2 text-white/70 hover:text-white transition-colors">${icon('search', 'w-5 h-5')}</button>
          <button data-route="/login" class="text-white/70 hover:text-white px-3 py-2 text-sm transition-colors">Sign In</button>
          <button data-route="/register" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">Register</button>
          <button data-route="/confirmation/demo" class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">${icon('ticket')} My Tickets</button>
        </div>
        <button id="mobileBtn" class="md:hidden p-2 text-white/70 hover:text-white">${icon('menu', 'w-5 h-5')}</button>
      </div>
      <div id="mobileMenu" class="hidden md:hidden border-t border-white/10 py-4 flex-col gap-4">
        <button data-route="/" class="text-left text-white/80 text-sm">Movies</button>
        <button data-route="/" class="text-left text-white/80 text-sm">Cinemas</button>
        <button data-route="/" class="text-left text-white/80 text-sm">Offers</button>
        <button data-route="/login" class="text-left text-white/80 text-sm">Sign In</button>
        <button data-route="/register" class="text-left text-white/80 text-sm">Register</button>
        <button data-route="/confirmation/demo" class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-fit">${icon('ticket')} My Tickets</button>
      </div>
    </div>
  </nav>`;
}

/**
 * Binds click events to navigation elements
 */
export function bindNav() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      setRoute(btn.dataset.route);
    });
  });
  
  const mobileBtn = document.getElementById('mobileBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('hidden');
    });
  }
}