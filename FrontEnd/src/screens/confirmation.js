// filepath: src/screens/confirmation.js
import { renderLayout } from '../components/layout.js';
import { icon, money } from '../utils/helpers.js';
import { findMovie, findShowtime, MOVIES, SHOWTIMES } from '../state/store.js';

/**
 * Renders the confirmation page after successful booking
 * @param {string} id - The booking ID
 * @param {string} query - Query string with booking details
 */
export function confirmationPage(id, query) {
  const params = new URLSearchParams(query || '');
  const movie = findMovie(params.get('movie')) || MOVIES[0];
  const showtime = findShowtime(params.get('showtime')) || SHOWTIMES[0];
  const seats = params.get('seats') || 'A1, A2';
  const total = Number(params.get('total') || 37.98);

  const content = `
  <section class="pt-24 px-4 pb-16 min-h-screen flex items-center">
    <div class="max-w-2xl mx-auto w-full text-center">
      <div class="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6 text-green-400">
        ${icon('check','w-10 h-10')}
      </div>
      <h1 class="text-4xl font-extrabold">Booking Confirmed!</h1>
      <p class="text-white/55 mt-3">Your tickets are ready. Booking ID: <b class="text-white">CM-${id}</b></p>
      <div class="mt-8 text-left bg-[#0d0d14] border border-white/10 rounded-3xl p-6">
        <div class="flex gap-5">
          <img src="${movie.image}" class="w-28 h-40 rounded-2xl object-cover">
          <div class="flex-1">
            <h2 class="text-2xl font-bold">${movie.title}</h2>
            <p class="text-white/50 mt-2">${showtime.date} · ${showtime.time}</p>
            <p class="text-white/50">${showtime.hall} · ${showtime.format}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              ${seats.split(',').map(s => `<span class="bg-red-600/30 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/30">${s.trim()}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 mt-6 pt-6 flex justify-between">
          <span class="text-white/50">Total Paid</span>
          <b class="text-xl">${money(total)}</b>
        </div>
      </div>
      <div class="mt-8 flex justify-center gap-3 flex-wrap">
        <button data-route="/" class="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-semibold">Back to Home</button>
        <button onclick="window.print()" class="border border-white/15 hover:bg-white/10 rounded-xl px-6 py-3 font-semibold">Print Ticket</button>
      </div>
    </div>
  </section>`;

  renderLayout(content);
}