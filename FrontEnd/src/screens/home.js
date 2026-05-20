
import { renderLayout } from '../components/layout.js';
import { movieCard } from '../components/movieCard.js';

const API_BASE_URL = 'http://localhost:8080';

export function homePage() {
  renderLayout(`
    <section class="hero-bg pt-28 pb-14 px-4">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
        <div>
          <span class="inline-flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-5">
            Now Showing
          </span>
          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Book your next <span class="text-red-500">cinema</span> experience
          </h1>
          <p class="mt-5 text-white/60 max-w-xl leading-relaxed">
            Browse movies, choose showtimes, pick your seats, and check out in a modern movie booking flow.
          </p>

        </div>

        <div id="featuredMovieBox" class="relative hidden md:block">
          <div class="rounded-3xl aspect-[16/10] bg-white/10 animate-pulse"></div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold">Now Showing</h2>
          <p class="text-white/45 text-sm mt-1">Choose a movie and reserve your seat.</p>
        </div>
        <span id="nowShowingCount" class="text-white/40 text-sm">Loading...</span>
      </div>

      <div id="nowShowingMovies" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        ${loadingCards()}
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 pb-20">
      <h2 class="text-2xl font-bold mb-8">Coming Soon</h2>
      <div id="comingSoonMovies" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        ${loadingCards()}
      </div>
    </section>
  `);

  loadMovies();
}

async function loadMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/movies`);

    if (!response.ok) {
      throw new Error('Failed to load movies');
    }

    const backendMovies = await response.json();

    const movies = backendMovies.map(convertBackendMovie);

    const nowShowing = movies.filter(movie => movie.status === 'now-showing');
    const comingSoon = movies.filter(movie => movie.status === 'coming-soon');

    renderFeatured(nowShowing[0] || movies[0]);
    renderMovieSection('nowShowingMovies', nowShowing);
    renderMovieSection('comingSoonMovies', comingSoon);

    document.getElementById('nowShowingCount').textContent = `${nowShowing.length} movies`;

  } catch (error) {
    console.error(error);

    document.getElementById('nowShowingMovies').innerHTML = errorMessage();
    document.getElementById('comingSoonMovies').innerHTML = '';
    document.getElementById('nowShowingCount').textContent = '0 movies';
  }
}

function convertBackendMovie(movie) {
  return {
    id: movie.id,
    title: movie.movieName,
    genre: movie.genre ? movie.genre.split(',').map(g => g.trim()) : [],
    rating: movie.rating || 'N/A',
    status: convertStatus(movie.status),
    duration: movie.movieTime || 'Time TBA',
    image: movie.posterUrl || 'https://via.placeholder.com/400x600?text=CineMax',
    description: movie.description || '',
    cast: movie.cast || '',
    score: movie.rating || '8.0'
  };
}

function convertStatus(status) {
  if (status === 'NOW_SHOWING') {
    return 'now-showing';
  }

  if (status === 'COMING_SOON') {
    return 'coming-soon';
  }

  return 'not-showing';
}

function renderFeatured(featured) {
  const box = document.getElementById('featuredMovieBox');
  if (!featured) {
    box.innerHTML = '';
    return;
  }

  box.innerHTML = `
    <img
      class="rounded-3xl aspect-[16/10] object-cover poster-shadow"
      src="${safe(featured.image)}"
      alt="${safe(featured.title)}"
      onerror="this.src='https://via.placeholder.com/800x500?text=CineMax'"
    >

    <div class="absolute -bottom-6 -left-6 glass border border-white/10 rounded-2xl p-5 max-w-xs">
      <p class="text-white/50 text-xs">Featured Movie</p>
      <h2 class="font-bold text-xl">${safe(featured.title)}</h2>
      <p class="text-white/60 text-sm mt-1">
        ${safe(featured.duration)} · ${safe(featured.genre.join(' / '))}
      </p>
    </div>
  `;
}

function renderMovieSection(containerId, movies) {
  const container = document.getElementById(containerId);

  if (!movies || movies.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-white/40 text-sm">
        No movies found.
      </div>
    `;
    return;
  }

  container.innerHTML = movies.map(movieCard).join('');
}

function loadingCards() {
  return Array(5).fill(0).map(() => `
    <div class="rounded-2xl overflow-hidden bg-white/5 animate-pulse">
      <div class="aspect-[2/3] bg-white/10"></div>
      <div class="p-3 space-y-2">
        <div class="h-4 bg-white/10 rounded"></div>
        <div class="h-3 bg-white/10 rounded w-2/3"></div>
      </div>
    </div>
  `).join('');
}

function errorMessage() {
  return `
    <div class="col-span-full bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-5">
      Failed to load movies from backend.
    </div>
  `;
}

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