// filepath: src/screens/checkout.js
import { renderLayout } from '../components/layout.js';
import { icon, money } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';
import { findShowtime, findMovie } from '../state/store.js';
import { notFound } from './notFound.js';

/**
 * Renders the checkout page
 * @param {string} showtimeId - The showtime ID
 * @param {string} query - Query string with seat and total info
 */
export function checkoutPage(showtimeId, query) {
  const showtime = findShowtime(showtimeId);
  if (!showtime) {
    return notFound('Checkout not found');
  }
  
  const movie = findMovie(showtime.movieId);
  const params = new URLSearchParams(query || '');
  const seats = (params.get('seats') || '').split(',').filter(Boolean);
  const total = Number(params.get('total') || 0);

  const content = `
  <section class="pt-24 pb-16 px-4 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">${icon('arrow')} Back to seats</button>
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>
      <div class="grid lg:grid-cols-[1fr_380px] gap-8">
        <div class="space-y-6">
          <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
            <h2 class="font-bold text-xl mb-5">Contact Details</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <label class="block text-sm text-white/60">
                Full Name
                <input class="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500" value="Alex Morgan">
              </label>
              <label class="block text-sm text-white/60">
                Email
                <input class="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500" value="alex@example.com">
              </label>
            </div>
          </div>
          <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
            <h2 class="font-bold text-xl mb-5">Payment Method</h2>
            <div class="border border-red-500/50 bg-red-500/10 rounded-xl p-4 flex items-center gap-3">
              ${icon('card','w-5 h-5 text-red-400')}
              <span class="font-semibold">Credit / Debit Card</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-4 mt-4">
              <input placeholder="Card number" class="sm:col-span-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500">
              <input placeholder="MM/YY" class="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500">
              <input placeholder="CVC" class="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500">
            </div>
          </div>
        </div>
        <aside class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
          <h2 class="font-bold text-xl mb-5">Booking Summary</h2>
          <div class="flex gap-4">
            <img src="${movie.image}" class="w-24 h-36 object-cover rounded-xl">
            <div>
              <h3 class="font-bold">${movie.title}</h3>
              <p class="text-white/50 text-sm mt-1">${showtime.date}</p>
              <p class="text-white/50 text-sm">${showtime.time} · ${showtime.hall}</p>
              <p class="text-white/50 text-sm">${showtime.format}</p>
            </div>
          </div>
          <div class="border-t border-white/10 mt-6 pt-6 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-white/50">Seats</span>
              <b>${seats.join(', ') || 'None'}</b>
            </div>
            <div class="flex justify-between">
              <span class="text-white/50">Tickets</span>
              <b>${seats.length}</b>
            </div>
            <div class="flex justify-between text-lg pt-3 border-t border-white/10">
              <span>Total</span>
              <b>${money(total)}</b>
            </div>
          </div>
          <button id="payBtn" class="w-full mt-6 bg-red-600 hover:bg-red-500 rounded-xl py-3 font-bold flex justify-center items-center gap-2">
            Pay & Confirm ${icon('chevron')}
          </button>
        </aside>
      </div>
    </div>
  </section>`;

  renderLayout(content);

  // Bind pay button
  document.getElementById('payBtn').addEventListener('click', () => {
    setRoute(`/confirmation/${Date.now().toString().slice(-6)}?movie=${movie.id}&showtime=${showtime.id}&seats=${seats.join(',')}&total=${total.toFixed(2)}`);
  });
}