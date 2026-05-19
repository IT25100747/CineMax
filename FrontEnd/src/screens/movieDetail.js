import { renderLayout } from '../components/layout.js';
import { icon, money, genres } from '../utils/helpers.js';
import { state } from '../state/store.js';
import { notFound } from './notFound.js';

const API_BASE_URL = 'http://localhost:8080';

const HALL_CAPACITIES = [100, 120, 80, 90, 110, 95];
const SCREEN_FORMATS = ['2D', '2D', 'Dolby', '3D', 'IMAX'];

let detailContext = {
  movieId: null,
  movie: null,
  screenTimes: []
};

/**
 * Movie Detail Page
 */
export async function detailPage(id) {
  try {
    const movieResponse = await fetch(`${API_BASE_URL}/api/movies/${id}`);

    if (!movieResponse.ok) {
      return notFound('Movie not found');
    }

    const backendMovie = await movieResponse.json();
    
    if (backendMovie.status === 'INACTIVE') {
      return notFound('Movie is no longer available for booking');
    }

    const backendScreenTimes = await fetchScreenTimes(id);

    detailContext = {
      movieId: String(id),
      movie: convertBackendMovie(backendMovie),
      screenTimes: backendScreenTimes.filter(st => st.status !== 'CANCELLED').map(mapScreenTime)
    };

    ensureSelectedDate(detailContext.screenTimes);
    renderMovieDetail();

  } catch (error) {
    console.error('Movie Detail Error:', error);
    return notFound('Failed to load movie');
  }
}

async function fetchScreenTimes(movieId) {
  const urls = [
    `${API_BASE_URL}/api/movies/screentimes?movieId=${movieId}`,
    `${API_BASE_URL}/api/movies/${movieId}/screentimes`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }

      console.warn('Showtimes request failed:', url, response.status);
    } catch (error) {
      console.warn('Showtimes request error:', url, error);
    }
  }

  return [];
}

/**
 * Render Movie Detail UI
 */
function renderMovieDetail() {
  const { movie, screenTimes } = detailContext;
  const dateOptions = buildDateOptions(screenTimes);
  const dates = dateOptions.map(d => `
    <button
      class="dateBtn px-4 py-3 rounded-xl border text-center min-w-[88px] flex flex-col items-center justify-center transition-colors ${
        state.selectedDate === d.value
          ? 'bg-red-600 border-red-500 text-white'
          : 'bg-[#15151a] border-white/10 text-white/60 hover:text-white hover:bg-white/10'
      }"
      data-date="${d.value}"
    >
      <span class="block text-sm font-semibold mb-1">${safe(d.label)}</span>
      <b class="text-lg whitespace-nowrap">${safe(d.display)}</b>
    </button>
  `).join('');

  const showtimes = screenTimes
    .filter(show => show.showDate === state.selectedDate)
    .sort((a, b) => a.sortTime.localeCompare(b.sortTime));

  const content = `
  <section class="pt-16">

    <div class="relative min-h-[520px] flex items-end">

      <img
        src="${safe(movie.image)}"
        class="absolute inset-0 w-full h-full object-cover opacity-35"
        onerror="this.src='https://via.placeholder.com/1200x800?text=CineMax'"
      >

      <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20"></div>

      <div class="relative max-w-7xl mx-auto px-4 py-12 w-full">

        <!-- Back Button -->
        <button
          data-route="/"
          class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8"
        >
          ${icon('arrow')} Back to Movies
        </button>

        <div class="grid md:grid-cols-[260px_1fr] gap-8 items-end">

          <img
            src="${safe(movie.image)}"
            class="hidden md:block rounded-2xl aspect-[2/3] object-cover poster-shadow"
            onerror="this.src='https://via.placeholder.com/400x600?text=CineMax'"
          >

          <div>

            <div class="flex gap-2 mb-4">
              ${genres(movie)}
            </div>

            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">
              ${safe(movie.title)}
            </h1>

            <div class="mt-4 flex flex-wrap gap-4 text-white/60 text-sm">

              <span class="flex items-center gap-1">
                ${icon('star', 'w-4 h-4 text-yellow-400 fill-yellow-400')}
                ${safe(movie.score)}/10
              </span>

              <span>${safe(movie.rating)}</span>
              <span>${safe(movie.duration)}</span>
              <span>Director: ${safe(movie.director)}</span>

            </div>

            <p class="mt-6 text-white/70 max-w-3xl leading-relaxed">
              ${safe(movie.description)}
            </p>

            <p class="mt-5 text-white/45 text-sm">
              Cast: ${
                movie.cast.length
                  ? movie.cast.map(safe).join(', ')
                  : '-'
              }
            </p>

          </div>
        </div>
      </div>
    </div>

    <!-- Showtime / Reviews Tabs -->
    <div class="max-w-5xl mx-auto px-4 py-10">

      <!-- Tab Buttons -->
      <div class="flex items-center gap-3 mb-8">
        <button id="tabShowtime" onclick="switchTab('showtime')" class="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors bg-red-600 text-white">Select Showtime</button>
        <button id="tabReviews" onclick="switchTab('reviews')" class="px-5 py-2.5 rounded-xl font-bold text-sm transition-colors bg-white/5 border border-white/10 text-white/60 hover:text-white">Reviews</button>
      </div>

      <!-- Showtime Panel -->
      <div id="panelShowtime">
        <div class="flex gap-3 overflow-x-auto pb-3 mb-8">
          ${
            dateOptions.length
              ? dates
              : '<p class="text-white/50 text-sm">No showtimes scheduled for this movie yet.</p>'
          }
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${
            showtimes.length
              ? showtimes.map(show => `
                <button
                  data-route="/seats/${show.id}"
                  class="text-left bg-[#1a1a24] hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition flex flex-col justify-between min-h-[140px]"
                >
                  <div>
                    <p class="font-bold text-2xl text-white">${safe(show.time)}</p>
                    <p class="text-white/60 text-sm mt-1">${safe(show.hall)}</p>
                    <div class="mt-3"><span class="inline-block bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">${safe(show.format)}</span></div>
                  </div>
                  <div class="mt-5 flex items-center justify-between w-full">
                    <span class="text-white/60 text-sm font-medium">${money(show.ticketPrice)}/seat</span>
                    <span class="text-amber-500 text-sm flex items-center gap-1.5 font-semibold">${icon('users')} ${show.availableSeats}</span>
                  </div>
                </button>
              `).join('')
              : '<div class="col-span-full text-white/45 border border-white/10 rounded-2xl p-8 text-center bg-[#15151a]">No showtimes for this date.</div>'
          }
        </div>
      </div>

      <!-- Reviews Panel -->
      <div id="panelReviews" class="hidden">
        <div id="reviewsList"><div class="text-center text-white/40 py-12">Loading reviews...</div></div>
      </div>
    </div>

  </section>
  `;

  renderLayout(content);

  // Tab switching + reviews loader
  window.switchTab = async function(tab) {
    const isShowtime = tab === 'showtime';
    document.getElementById('panelShowtime').classList.toggle('hidden', !isShowtime);
    document.getElementById('panelReviews').classList.toggle('hidden', isShowtime);
    document.getElementById('tabShowtime').className = `px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${isShowtime ? 'bg-red-600 text-white' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`;
    document.getElementById('tabReviews').className = `px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${!isShowtime ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`;

    if (!isShowtime) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/movie/${detailContext.movieId}`);
        const reviews = res.ok ? await res.json() : [];
        document.getElementById('reviewsList').innerHTML = reviews.length
          ? reviews.map(r => {
              const stars = Array.from({length:5},(_,i)=>`<span class="${i<r.rating?'text-yellow-400':'text-white/20'}">★</span>`).join('');
              const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : '';
              return `<div class="bg-[#15151a] border border-white/10 rounded-2xl p-5 mb-4">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-bold text-white">${r.userName||'Anonymous'}</p>
                    <div class="flex items-center gap-2 mt-1"><span class="text-lg">${stars}</span><span class="text-xs text-white/40">${date}</span></div>
                  </div>
                </div>
                <p class="text-white/70 text-sm leading-relaxed mt-2">${r.reviewText||''}</p>
              </div>`;
            }).join('')
          : '<div class="text-center text-white/40 py-12 border border-white/10 rounded-2xl">No reviews yet. Be the first to review this movie!</div>';
      } catch(_) { document.getElementById('reviewsList').innerHTML = '<div class="text-red-400 py-8 text-center">Failed to load reviews</div>'; }
    }
  };

  /**
   * Date Button Events
   */
  document.querySelectorAll('.dateBtn').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedDate = button.dataset.date;
      renderMovieDetail();
    });
  });

  /**
   * Route Button Events
   */
  document.querySelectorAll('[data-route]').forEach(button => {
    button.addEventListener('click', () => {
      window.location.hash = button.dataset.route;
    });
  });
}

/**
 * Convert backend movie → frontend movie
 */
function convertBackendMovie(movie) {
  return {
    id: movie.id,
    title: movie.movieName,
    genre: movie.genre
      ? movie.genre.split(',').map(g => g.trim())
      : [],
    rating: movie.rating || 'N/A',
    status: movie.status,
    duration: movie.movieTime || 'Time TBA',
    image: movie.posterUrl || 'https://via.placeholder.com/400x600?text=CineMax',
    description: movie.description || '',
    cast: movie.cast
      ? movie.cast.split(',').map(c => c.trim())
      : [],
    score: extractScore(movie.rating),
    director: 'CineMax'
  };
}


function mapScreenTime(screenTime) {
  const screenNumber = screenTime.screenNumber || 1;

  return {
    id: screenTime.id,
    showDate: toDateKey(screenTime.showDate),
    sortTime: String(screenTime.showTime || '').slice(0, 8),
    time: formatTime12h(screenTime.showTime),
    hall: screenNumberToHall(screenNumber),
    format: screenNumberToFormat(screenNumber),
    availableSeats: estimateAvailableSeats(screenTime.id, screenNumber),
    ticketPrice: screenTime.ticketPrice ?? 12
  };
}

function buildDateOptions(screenTimes) {
  const uniqueDates = [...new Set(screenTimes.map(show => show.showDate))].sort();

  return uniqueDates.map(value => {
    const date = parseLocalDate(value);
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let label = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (sameDay(date, today)) {
      label = 'Today';
    } else if (sameDay(date, tomorrow)) {
      label = 'Tomorrow';
    }

    return {
      label,
      value,
      display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
}

function ensureSelectedDate(screenTimes) {
  const dates = [...new Set(screenTimes.map(show => show.showDate))].sort();

  if (!dates.length) {
    state.selectedDate = toDateKey(new Date());
    return;
  }

  if (!dates.includes(state.selectedDate)) {
    const todayKey = toDateKey(new Date());
    state.selectedDate = dates.includes(todayKey) ? todayKey : dates[0];
  }
}

function toDateKey(value) {
  return String(value).slice(0, 10);
}

function parseLocalDate(value) {
  const [year, month, day] = toDateKey(value).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function sameDay(left, right) {
  return left.getTime() === right.getTime();
}

function screenNumberToHall(screenNumber) {
  const index = Math.max(1, Math.min(screenNumber, 26));
  return `Hall ${String.fromCharCode(64 + index)}`;
}

function screenNumberToFormat(screenNumber) {
  return SCREEN_FORMATS[(Math.max(screenNumber, 1) - 1) % SCREEN_FORMATS.length];
}

function estimateAvailableSeats(screenTimeId, screenNumber) {
  const capacity = HALL_CAPACITIES[(Math.max(screenNumber, 1) - 1) % HALL_CAPACITIES.length];
  return Math.max(15, capacity - (Number(screenTimeId) % 35));
}

function formatTime12h(time) {
  const [hourText, minuteText] = String(time).slice(0, 5).split(':');
  let hour = Number(hourText);
  const minute = minuteText || '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
}

/**
 * Extract movie score
 */
function extractScore(rating) {
  const number = parseFloat(rating);

  if (!Number.isNaN(number)) {
    return number;
  }

  return '8.0';
}

/**
 * Safe HTML output
 */
function safe(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}