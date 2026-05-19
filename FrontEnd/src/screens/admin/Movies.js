import { apiRequest, pageHeader, inputField, safe, statusBadge, encodeAttr, decodeAttr } from './adminUtils.js';

export async function moviesPage() {
  const movies = await apiRequest('/api/movies', 'GET', null, false);

  return `
    ${pageHeader('Movies', 'Add, edit, and delete movies from MySQL database')}

    <div class="grid xl:grid-cols-[420px_1fr] gap-6">
      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
        <h2 id="movieFormTitle" class="text-xl font-bold mb-5">Add New Movie</h2>

        <form id="movieForm" class="space-y-4">
          <input type="hidden" id="movieId">

          ${inputField('Movie Name', 'movieName', 'text', 'Enter movie name')}
          ${inputField('Genre', 'genre', 'text', 'Sci-Fi, Action, Drama')}
          ${inputField('Rating', 'rating', 'text', 'PG-13 / R / 8.5')}
          
          <div>
            <label class="block text-sm text-white/60 mb-2">Status</label>
            <select id="status" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500">
              <option class="bg-[#0d0d14]" value="NOW_SHOWING">NOW_SHOWING</option>
              <option class="bg-[#0d0d14]" value="NOT_SHOWING">NOT_SHOWING</option>
              <option class="bg-[#0d0d14]" value="COMING_SOON">COMING_SOON</option>
            </select>
          </div>

          ${inputField('Movie Time', 'movieTime', 'text', '2026-05-01 18:30')}

          <div>
            <label class="block text-sm text-white/60 mb-2">Description</label>
            <textarea id="description" rows="4" placeholder="Enter movie description"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"></textarea>
          </div>

          <div>
            <label class="block text-sm text-white/60 mb-2">Cast</label>
            <textarea id="cast" rows="3" placeholder="Actor 1, Actor 2, Actor 3"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"></textarea>
          </div>

          ${inputField('Poster Image URL', 'posterUrl', 'url', 'https://example.com/poster.jpg')}

          <div id="movieFormError" class="hidden text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"></div>

          <div class="flex gap-3">
            <button id="movieSubmitBtn" type="submit" class="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-semibold">
              Add Movie
            </button>
            <button id="movieResetBtn" type="button" class="px-5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold">
              Clear
            </button>
          </div>
        </form>
      </div>

      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-white/10">
          <h2 class="text-xl font-bold">Movie List</h2>
          <p class="text-white/50 text-sm mt-1">${movies.length} movies found</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/10">
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Poster</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Genre</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Rating</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Status</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Time</th>
                <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
              </tr>
            </thead>

            <tbody>
              ${movies.length === 0 ? `
                <tr>
                  <td colspan="7" class="px-5 py-8 text-center text-white/50">
                    No movies found. Add your first movie.
                  </td>
                </tr>
              ` : movies.map(movie => `
                <tr class="border-b border-white/5 hover:bg-white/5">
                  <td class="px-5 py-4">
                    <img 
                      src="${safe(movie.posterUrl)}" 
                      alt="${safe(movie.movieName)}"
                      class="w-12 h-16 object-cover rounded-lg bg-white/10"
                      onerror="this.src='https://via.placeholder.com/80x110?text=Movie'"
                    >
                  </td>
                  <td class="px-5 py-4">
                    <p class="font-semibold text-white">${safe(movie.movieName)}</p>
                    <p class="text-xs text-white/40 max-w-[220px] truncate">${safe(movie.description)}</p>
                  </td>
                  <td class="px-5 py-4 text-sm text-white/80">${safe(movie.genre)}</td>
                  <td class="px-5 py-4 text-sm text-white/80">${safe(movie.rating)}</td>
                  <td class="px-5 py-4">${statusBadge(movie.status)}</td>
                  <td class="px-5 py-4 text-sm text-white/80">${safe(movie.movieTime)}</td>
                  <td class="px-5 py-4">
                    <div class="flex gap-3">
                      <button 
                        data-edit-movie="${movie.id}"
                        data-movie='${encodeAttr(JSON.stringify(movie))}'
                        class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        data-delete-movie="${movie.id}" 
                        class="text-red-400 hover:text-red-300 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindMovieEvents(refreshCallback) {
  const movieForm = document.getElementById('movieForm');

  if (movieForm) {
    movieForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const movieId = document.getElementById('movieId').value;
      const errorDiv = document.getElementById('movieFormError');
      const submitBtn = document.getElementById('movieSubmitBtn');

      errorDiv.classList.add('hidden');

      const movieData = {
        movieName: document.getElementById('movieName').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        rating: document.getElementById('rating').value.trim(),
        status: document.getElementById('status').value,
        movieTime: document.getElementById('movieTime').value.trim(),
        description: document.getElementById('description').value.trim(),
        cast: document.getElementById('cast').value.trim(),
        posterUrl: document.getElementById('posterUrl').value.trim()
      };

      if (!movieData.movieName || !movieData.genre || !movieData.rating || !movieData.status || !movieData.movieTime) {
        showFormError('Please fill movie name, genre, rating, status, and movie time.');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = movieId ? 'Updating...' : 'Adding...';

        if (movieId) {
          await apiRequest(`/api/admin/movies/${movieId}`, 'PUT', movieData, true);
          alert('Movie updated successfully');
        } else {
          await apiRequest('/api/admin/movies', 'POST', movieData, true);
          alert('Movie added successfully');
        }

        refreshCallback('movies');
      } catch (error) {
        showFormError(error.message || 'Failed to save movie');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = movieId ? 'Update Movie' : 'Add Movie';
      }
    });
  }

  const movieResetBtn = document.getElementById('movieResetBtn');
  if (movieResetBtn) {
    movieResetBtn.addEventListener('click', () => {
      resetMovieForm();
    });
  }

  document.querySelectorAll('[data-edit-movie]').forEach(button => {
    button.addEventListener('click', () => {
      const movie = JSON.parse(decodeAttr(button.getAttribute('data-movie')));
      fillMovieForm(movie);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-delete-movie]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-movie');

      if (!confirm('Are you sure you want to delete this movie?')) return;

      try {
        await apiRequest(`/api/admin/movies/${id}`, 'DELETE', null, true);
        alert('Movie deleted successfully');
        refreshCallback('movies');
      } catch (error) {
        alert(error.message || 'Failed to delete movie');
      }
    });
  });
}

function fillMovieForm(movie) {
  document.getElementById('movieId').value = movie.id || '';
  document.getElementById('movieName').value = movie.movieName || '';
  document.getElementById('genre').value = movie.genre || '';
  document.getElementById('rating').value = movie.rating || '';
  document.getElementById('status').value = movie.status || 'NOW_SHOWING';
  document.getElementById('movieTime').value = movie.movieTime || '';
  document.getElementById('description').value = movie.description || '';
  document.getElementById('cast').value = movie.cast || '';
  document.getElementById('posterUrl').value = movie.posterUrl || '';

  document.getElementById('movieFormTitle').textContent = 'Edit Movie';
  document.getElementById('movieSubmitBtn').textContent = 'Update Movie';
}

function resetMovieForm() {
  document.getElementById('movieForm').reset();
  document.getElementById('movieId').value = '';
  document.getElementById('movieFormTitle').textContent = 'Add New Movie';
  document.getElementById('movieSubmitBtn').textContent = 'Add Movie';
  document.getElementById('movieFormError').classList.add('hidden');
}

function showFormError(message) {
  const errorDiv = document.getElementById('movieFormError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}
