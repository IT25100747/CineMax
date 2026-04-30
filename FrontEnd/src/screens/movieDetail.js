// filepath: src/screens/movieDetail.js
import { renderLayout } from '../components/layout.js';
import { icon, money, genres } from '../utils/helpers.js';
import { state, findMovie, byMovie, DATES, TICKET_PRICES } from '../state/store.js';
import { notFound } from './notFound.js';

/**
 * Renders the movie detail page with showtime selection
 * @param {string} id - The movie ID to display
 */
export function detailPage(id) {
  const movie = findMovie(id);
  if (!movie) {
    return notFound('Movie not found');
  }

  const dates = DATES.map(d => `
    <button class="dateBtn px-4 py-3 rounded-xl border text-left ${state.selectedDate === d.value ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}" data-date="${d.value}">
      <span class="block text-xs">${d.label}</span>
      <b>${d.display}</b>
    </button>
  `).join('');

  const showtimes = byMovie(movie.id).filter(s => s.date === state.selectedDate);

  const content = `
  <section class="pt-16">
    <div class="relative min-h-[520px] flex items-end">
      <img src="${movie.image}" class="absolute inset-0 w-full h-full object-cover opacity-35">
      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-12 w-full">
        <button data-route="/" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">${icon('arrow')} Back to Movies</button>
        <div class="grid md:grid-cols-[260px_1fr] gap-8 items-end">
          <img src="${movie.image}" class="hidden md:block rounded-2xl aspect-[2/3] object-cover poster-shadow">
          <div>
            <div class="flex gap-2 mb-4">${genres(movie)}</div>
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">${movie.title}</h1>
            <div class="mt-4 flex flex-wrap gap-4 text-white/60 text-sm">
              <span class="flex items-center gap-1">${icon('star','w-4 h-4 text-yellow-400 fill-yellow-400')} ${movie.score}/10</span>
              <span>${movie.rating}</span>
              <span>${movie.duration}</span>
              <span>Director: ${movie.director}</span>
            </div>
            <p class="mt-6 text-white/70 max-w-3xl leading-relaxed">${movie.description}</p>
            <p class="mt-5 text-white/45 text-sm">Cast: ${movie.cast.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h2 class="text-2xl font-bold mb-5">Select Showtime</h2>
      <div class="flex gap-3 overflow-x-auto pb-3 mb-8">${dates}</div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${showtimes.length 
          ? showtimes.map(s => `
            <button data-route="/seats/${s.id}" class="text-left bg-[#0d0d14] hover:bg-white/10 border border-white/10 hover:border-red-500/60 rounded-2xl p-5 transition">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-bold text-xl">${s.time}</p>
                  <p class="text-white/45 text-sm mt-1">${s.hall} · ${s.format}</p>
                </div>
                <span class="text-red-400">${icon('chevron')}</span>
              </div>
              <div class="mt-4 flex items-center justify-between text-xs text-white/45">
                <span>${s.availableSeats} seats available</span>
                <span>${money(TICKET_PRICES[s.format])}</span>
              </div>
            </button>
          `).join('')
          : '<div class="col-span-full text-white/45 border border-white/10 rounded-2xl p-8 text-center">No showtimes for this date.</div>'
        }
      </div>
    </div>
  </section>`;

  renderLayout(content);

  // Bind date button events
  document.querySelectorAll('.dateBtn').forEach(b => {
    b.addEventListener('click', () => {
      state.selectedDate = b.dataset.date;
      detailPage(id);
    });
  });
}