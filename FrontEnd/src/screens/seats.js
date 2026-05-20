
import { renderLayout } from '../components/layout.js';
import { icon, money } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';
import { state, TICKET_PRICES } from '../state/store.js';
import { notFound } from './notFound.js';

const API_BASE_URL = 'http://localhost:8080';

function generateSeats(movieId) {
  const rows = 'ABCDEFGHIJ'.split('');
  const seats = {};
  const seed = String(movieId).charCodeAt(String(movieId).length - 1);

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

const SCREEN_FORMATS = ['2D', '2D', 'Dolby', '3D', 'IMAX'];

async function fetchScreenTimeById(screenTimeId) {
  const urls = [
    `${API_BASE_URL}/api/movies/screentime/${screenTimeId}`,
    `${API_BASE_URL}/api/screentimes/${screenTimeId}`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Showtime request error:', url, error);
    }
  }

  return null;
}

export async function seatsPage(screenTimeId, query = '') {
  try {
    const screenTimeResponse = await fetchScreenTimeById(screenTimeId);

    if (!screenTimeResponse) {
      return notFound('Showtime not found');
    }

    const screenTime = screenTimeResponse;
    const movieResponse = await fetch(`${API_BASE_URL}/api/movies/${screenTime.movieId}`);

    if (!movieResponse.ok) {
      return notFound('Movie not found');
    }

    const backendMovie = await movieResponse.json();
    const screenNumber = screenTime.screenNumber || 1;

    // Fetch reserved seats
    let reservedSeats = [];
    try {
      const seatsResponse = await fetch(`${API_BASE_URL}/api/screentimes/${screenTimeId}/seats`);
      if (seatsResponse.ok) {
        reservedSeats = await seatsResponse.json();
      }
    } catch (e) {
      console.warn('Failed to fetch reserved seats', e);
    }

    const movie = {
      id: backendMovie.id,
      title: backendMovie.movieName,
      image: backendMovie.posterUrl,
      movieTime: backendMovie.movieTime
    };

    const showtime = {
      id: String(screenTime.id),
      movieId: screenTime.movieId,
      date: formatDateLabel(screenTime.showDate),
      time: formatTime12h(screenTime.showTime),
      hall: screenNumberToHall(screenNumber),
      format: screenNumberToFormat(screenNumber),
      ticketPrice: screenTime.ticketPrice ?? 12
    };

    renderSeats(movie, showtime, reservedSeats);

  } catch (error) {
    console.error(error);
    return notFound('Failed to load seats');
  }
}

function screenNumberToHall(screenNumber) {
  const index = Math.max(1, Math.min(screenNumber, 26));
  return `Hall ${String.fromCharCode(64 + index)}`;
}

function screenNumberToFormat(screenNumber) {
  return SCREEN_FORMATS[(Math.max(screenNumber, 1) - 1) % SCREEN_FORMATS.length];
}

function formatTime12h(time) {
  const [hourText, minuteText] = String(time).slice(0, 5).split(':');
  let hour = Number(hourText);
  const minute = minuteText || '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
}

function formatDateLabel(value) {
  const date = parseLocalDate(value);
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  }

  if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function parseLocalDate(value) {
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function renderSeats(movie, showtime, reservedSeats = []) {
  if (!state.seats[showtime.id]) {
    state.seats[showtime.id] = generateSeats(showtime.id);
  }

  // Ensure reserved seats from backend are marked as taken
  reservedSeats.forEach(seat => {
    state.seats[showtime.id][seat] = 'taken';
  });

  const seats = state.seats[showtime.id];
  const selected = Object.keys(seats).filter(k => seats[k] === 'selected');

  const total = selected.reduce((sum, seat) => {
    const basePrice = showtime.ticketPrice || TICKET_PRICES[showtime.format] || 12;
    const vipSurcharge = ['A', 'B'].includes(seat[0]) ? 4 : 0;
    return sum + basePrice + vipSurcharge;
  }, 0);

  const rows = 'ABCDEFGHIJ'.split('').map(row => {
    const seatsHtml = Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      const key = `${row}${n}`;
      const st = seats[key];
      const seatContent = st === 'selected' ? n : '';
      const disabledAttr = st === 'taken' ? 'disabled' : '';

      return `
        <button class="seat ${st}" data-seat="${key}" title="${key} - ${st}" ${disabledAttr}>
          ${seatContent}
        </button>
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

  const colNumbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    return `<span class="w-7 text-center text-white/20 text-xs">${n}</span>${i === 5 ? '<span class="w-4"></span>' : ''}`;
  }).join('');

  const content = `
  <section class="min-h-screen pt-16 pb-32">
    <div class="bg-[#0d0d14] border-b border-white/10 px-4 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm">
          ${icon('arrow')} Back
        </button>

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

  document.querySelectorAll('[data-seat]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.seat;

      if (seats[key] === 'taken') return;

      seats[key] = seats[key] === 'selected'
        ? (['A', 'B'].includes(key[0]) ? 'vip' : 'available')
        : 'selected';

      // Re-render, we don't need to pass reservedSeats again since they are already applied to state
      renderSeats(movie, showtime, []);
    });
  });

  document.getElementById('continueBtn').addEventListener('click', () => {
    if (selected.length) {
      setRoute(`/checkout/${showtime.id}?movieId=${movie.id}&seats=${selected.join(',')}&total=${total.toFixed(2)}&time=${encodeURIComponent(showtime.time)}`);
    }
  });
}