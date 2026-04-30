// filepath: src/screens/home.js
import { renderLayout } from '../components/layout.js';
import { movieCard } from '../components/movieCard.js';
import { icon } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';
import { MOVIES } from '../state/store.js';

/**
 * Renders the home page with featured movie and movie listings
 */
export function homePage() {
  const featured = MOVIES[0];
  
  const content = `
  <section class="hero-bg pt-28 pb-14 px-4">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
      <div>
        <span class="inline-flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-5">Now Showing</span>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">Book your next <span class="text-red-500">cinema</span> experience</h1>
        <p class="mt-5 text-white/60 max-w-xl leading-relaxed">Browse movies, choose showtimes, pick your seats, and check out in a modern movie booking flow.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <button data-route="/movie/${featured.id}" class="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-semibold">Book Featured</button>
          <button class="border border-white/15 hover:bg-white/10 rounded-xl px-6 py-3 font-semibold">View Offers</button>
        </div>
      </div>
      <div class="relative hidden md:block">
        <img class="rounded-3xl aspect-[16/10] object-cover poster-shadow" src="${featured.image}" alt="${featured.title}">
        <div class="absolute -bottom-6 -left-6 glass border border-white/10 rounded-2xl p-5 max-w-xs">
          <p class="text-white/50 text-xs">Featured Movie</p>
          <h2 class="font-bold text-xl">${featured.title}</h2>
          <p class="text-white/60 text-sm mt-1">${featured.duration} · ${featured.genre.join(' / ')}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold">Now Showing</h2>
        <p class="text-white/45 text-sm mt-1">Choose a movie and reserve your seat.</p>
      </div>
      <span class="text-white/40 text-sm">${MOVIES.filter(m => m.status === 'now-showing').length} movies</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      ${MOVIES.filter(m => m.status === 'now-showing').map(movieCard).join('')}
    </div>
  </section>
  <section class="max-w-7xl mx-auto px-4 pb-20">
    <h2 class="text-2xl font-bold mb-8">Coming Soon</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      ${MOVIES.filter(m => m.status === 'coming-soon').map(movieCard).join('')}
    </div>
  </section>`;

  renderLayout(content);
}