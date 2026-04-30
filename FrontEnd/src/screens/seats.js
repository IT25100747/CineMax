// filepath: src/screens/seats.js
import { renderLayout } from '../components/layout.js';
import { icon, money } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';
import { state, findShowtime, findMovie, TICKET_PRICES } from '../state/store.js';
import { notFound } from './notFound.js';

/**
 * Generates seat layout for a showtime
 * @param {string} showtimeId - The showtime ID
 * @returns {object} Seat state object
 */
function generateSeats(showtimeId) {
  const rows = 'ABCDEFGHIJ'.split('');
  const seats = {};
  const seed = showtimeId.charCodeAt(showtimeId.length - 1);
  
  rows.forEach(row => {
    for (let col = 1; col <= 12; col++) {
      const hash = (row.charCodeAt(0) + col * 3 + seed * 7) % 100;
      seats[`${row}${col}`] = ['A', 'B'].includes(row) 
        ? (hash < 35 ? 'taken' : 'vip') 
        : (hash < 40 ? 'taken' : 'available');
    }
  });
  
  return seats;
}

/**
 * Renders the seat selection page
 * @param {string} showtimeId - The showtime ID
 */
export function seatsPage(showtimeId) {
  const showtime = findShowtime(showtimeId);
  if (!showtime) {
    return notFound('Showtime not found');
  }
  
  const movie = findMovie(showtime.movieId);
  
  // Initialize seats if not already done
  if (!state.seats[showtimeId]) {
    state.seats[showtimeId] = generateSeats(showtimeId);
  }
  
  const seats = state.seats[showtimeId];
  const selected = Object.keys(seats).filter(k => seats[k] === 'selected');
  
  // Calculate total price
  const total = selected.reduce((sum, s) => {
    const basePrice = TICKET_PRICES[showtime.format];
    const vipSurcharge = ['A', 'B'].includes(s[0]) ? 4 : 0;
    return sum + basePrice + vipSurcharge;
  }, 0);

  // Generate seat rows HTML
  const rows = 'ABCDEFGHIJ'.split('').map(row => {
    const seatsHtml = Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      const key = `${row}${n}`;
      const st = seats[key];
      const seatContent = st === 'selected' ? n : '';
      const disabledAttr = st === 'taken' ? 'disabled' : '';
      
      return `
        <button class="seat ${st}" data-seat="${key}" title="${key} - ${st}" ${disabledAttr}>${seatContent}</button>
        ${n === 6 ? '<span class="w-4"></span>' : ''}
      `;
    }).join('');
    
    return `
      <div class="flex items-center gap-1.5 mb-1.5">
        <span class="text-white/30 text-xs w-5 text-center font-bold">${row}</span>
        <div class="flex gap-1.5">${seatsHtml}</div>
        <span class="text-white/30 text-xs w-5 text-center font-bold">${row}</span>
      </div>
    `;
  }).join('');

  // Column numbers
  const colNumbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    return `<span class="w-7 text-center text-white/20 text-xs">${n}</span>${i === 5 ? '<span class="w-4"></span>' : ''}`;
  }).join('');

  const content = `
  <section class="min-h-screen pt-16 pb-32">
    <div class="bg-[#0d0d14] border-b border-white/10 px-4 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm">${icon('arrow')} Back</button>
        <div class="text-center">
          <p class="text-white text-sm font-semibold">${movie.title}</p>
          <p class="text-white/50 text-xs">${showtime.date} · ${showtime.time} · ${showtime.hall} · ${showtime.format}</p>
        </div>
        <div class="w-16"></div>
      </div>
    </div>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex flex-col items-center mb-8">
        <div class="w-3/4 max-w-lg h-2 bg-gradient-to-b from-white/40 to-transparent rounded-full mb-2 screen-curve"></div>
        <div class="flex items-center gap-2 text-white/40 text-xs">${icon('monitor')} SCREEN</div>
      </div>
      <div class="flex items-center justify-center gap-6 mb-6 flex-wrap text-xs text-white/50">
        <span class="flex items-center gap-2"><b class="seat available !w-4 !h-4"></b>Available</span>
        <span class="flex items-center gap-2"><b class="seat vip !w-4 !h-4"></b>VIP (+$4)</span>
        <span class="flex items-center gap-2"><b class="seat selected !w-4 !h-4"></b>Selected</span>
        <span class="flex items-center gap-2"><b class="seat taken !w-4 !h-4"></b>Taken</span>
      </div>
      <div class="overflow-x-auto">
        <div class="min-w-max mx-auto" style="width:fit-content">
          ${rows}
          <div class="flex items-center gap-1.5 mt-2">
            <div class="w-5"></div>
            ${colNumbers}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-sm mx-auto">
        ${icon('info','w-4 h-4 text-amber-400 flex-shrink-0')}
        <p class="text-amber-300/80 text-xs">Rows A & B are VIP seats with extra legroom (+$4.00 surcharge)</p>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-4 py-4 z-40">
      <div class="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div>
          ${selected.length 
            ? `<span class="text-white/50 text-xs">Selected Seats</span>
               <div class="flex flex-wrap gap-1 mt-1">
                 ${selected.map(s => `<span class="bg-red-600/30 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-500/30">${s}</span>`).join('')}
               </div>`
            : '<span class="text-white/40 text-sm">No seats selected</span>'
          }
        </div>
        <div class="flex items-center gap-6">
          ${selected.length 
            ? `<div class="text-right">
                 <span class="text-white/50 text-xs block">Total</span>
                 <b class="text-xl">${money(total)}</b>
               </div>`
            : ''
          }
          <button id="continueBtn" ${!selected.length ? 'disabled' : ''} class="bg-red-600 disabled:bg-white/10 disabled:text-white/30 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            Continue ${icon('chevron')}
          </button>
        </div>
      </div>
    </div>
  </section>`;

  renderLayout(content);

  // Bind seat click events
  document.querySelectorAll('[data-seat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.seat;
      if (seats[key] === 'taken') return;
      
      seats[key] = seats[key] === 'selected' 
        ? (['A', 'B'].includes(key[0]) ? 'vip' : 'available') 
        : 'selected';
      
      seatsPage(showtimeId);
    });
  });

  // Bind continue button
  document.getElementById('continueBtn').addEventListener('click', () => {
    if (selected.length) {
      setRoute(`/checkout/${showtimeId}?seats=${selected.join(',')}&total=${total.toFixed(2)}`);
    }
  });
}