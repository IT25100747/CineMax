

import { icon } from '../utils/helpers.js';

/**
 * Renders a movie card component
 * @param {object} movie - The movie object to render
 * @returns {string} HTML string for the movie card
 */
export function movieCard(movie) {
  return `
  <article
  class="group cursor-pointer"
  onclick="window.location.hash='/movie/${movie.id}'"
>
    <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-900 poster-shadow">
      
      <img 
        src="${movie.image}" 
        alt="${movie.title}" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">
        ${icon('star','w-3 h-3 fill-yellow-400')}
        <b>${movie.score}</b>
      </div>

      <div class="absolute top-3 right-3 bg-red-600/90 text-white text-xs px-2 py-1 rounded-md font-bold">
        ${movie.rating}
      </div>

      ${
        movie.status === 'coming-soon'
          ? `
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div class="bg-amber-500 text-black text-sm px-3 py-1 rounded-full font-bold -rotate-3">
              Coming Soon
            </div>
          </div>
          `
          : `
          <div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">

            <button
  onclick="event.stopPropagation(); window.location.hash='/movie/${movie.id}'"
  class="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-semibold"
>
  Book Now
</button>

          </div>
          `
      }
    </div>

    <div class="mt-3 space-y-1">
      <h3 class="text-white truncate font-semibold">
        ${movie.title}
      </h3>

      <div class="flex items-center gap-3 text-white/50 text-xs">
        <span class="flex items-center gap-1">
          ${icon('clock','w-3 h-3')}
          ${movie.duration}
        </span>

        ${
          movie.status === 'coming-soon'
            ? `
            <span class="flex items-center gap-1">
              ${icon('calendar','w-3 h-3')}
              ${movie.releaseDate}
            </span>
            `
            : ''
        }
      </div>

      <div class="flex flex-wrap gap-1 mt-1">
        ${genres(movie)}
      </div>
    </div>
  </article>
  `;
}

/**
 * Generates genre tags HTML for a movie
 * @param {object} movie - The movie object with genre array
 * @returns {string} HTML string of genre tags
 */
function genres(movie) {
  return movie.genre.map(g => 
    `<span class="text-xs text-white/45 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">${g}</span>`
  ).join('');
}