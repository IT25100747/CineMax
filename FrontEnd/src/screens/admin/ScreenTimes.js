import { adminData, apiRequest, pageHeader, safe, encodeAttr, decodeAttr } from './adminUtils.js';

export async function screenTimesPage() {
  adminData.screenTimes = await apiRequest('/api/admin/screentimes', 'GET', null, true);

  return `
    ${pageHeader('Screen Time Management', 'Manage movie showtimes and schedules')}

    <div class="mb-6 flex justify-end">
      <button id="addScreenTimeBtn" class="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
        <span class="text-xl">+</span> Add Screen Time
      </button>
    </div>

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Screen Times List</h2>
          <input 
            type="text" 
            id="screenTimeSearch"
            placeholder="Search by movie name..."
            class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-red-500"
          >
        </div>
        <p class="text-white/50 text-sm">${adminData.screenTimes.length} screen times found</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">ID</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie Name</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Date</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Time</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Screen</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Price</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Actions</th>
            </tr>
          </thead>

          <tbody id="screenTimeTableBody">
            ${renderScreenTimeRows(adminData.screenTimes)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function formatShowDate(date) {
  if (!date) return '';
  return String(date).slice(0, 10);
}

function formatShowTime(time) {
  if (!time) return '';
  return String(time).slice(0, 5);
}

function formatTicketPrice(price) {
  if (price === null || price === undefined || price === '') {
    return '-';
  }
  const amount = Number(price);
  const formatted = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `$${formatted}`;
}

function formatScreenLabel(screenNumber) {
  if (screenNumber === null || screenNumber === undefined || screenNumber === '') {
    return '-';
  }
  return `Screen ${screenNumber}`;
}

function renderScreenTimeRows(screenTimes, searchTerm = '') {
  if (!screenTimes.length) {
    const message = searchTerm
      ? `No screen times found matching "${searchTerm}"`
      : 'No screen times found. Add your first screen time.';

    return `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-white/50">
          ${message}
        </td>
      </tr>
    `;
  }

  return screenTimes.map(st => `
    <tr class="border-b border-white/5 hover:bg-white/5">
      <td class="px-5 py-4 text-sm text-white/80">${safe(st.id)}</td>
      <td class="px-5 py-4 text-sm font-semibold text-white">${safe(st.movieName)}</td>
      <td class="px-5 py-4 text-sm text-white/80">${safe(formatShowDate(st.showDate))}</td>
      <td class="px-5 py-4 text-sm text-white/80">${safe(formatShowTime(st.showTime))}</td>
      <td class="px-5 py-4 text-sm text-white/80">${safe(formatScreenLabel(st.screenNumber))}</td>
      <td class="px-5 py-4 text-sm font-semibold text-green-400">${safe(formatTicketPrice(st.ticketPrice))}</td>
      <td class="px-5 py-4">
        <div class="flex gap-3">
          <button
            data-edit-screentime="${st.id}"
            data-screentime='${encodeAttr(JSON.stringify(st))}'
            class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            data-delete-screentime="${st.id}"
            class="text-red-400 hover:text-red-300 font-semibold text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

export function bindScreenTimeEvents(refreshCallback) {
  const addScreenTimeBtn = document.getElementById('addScreenTimeBtn');
  if (addScreenTimeBtn) {
    addScreenTimeBtn.addEventListener('click', () => {
      showAddScreenTimeModal(null, refreshCallback);
    });
  }

  const screenTimeSearch = document.getElementById('screenTimeSearch');
  if (screenTimeSearch) {
    screenTimeSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const tableBody = document.getElementById('screenTimeTableBody');

      if (!tableBody) return;

      const filtered = adminData.screenTimes.filter(st => 
        (st.movieName && st.movieName.toLowerCase().includes(searchTerm)) ||
        (st.hall && st.hall.toString().toLowerCase().includes(searchTerm))
      );

      tableBody.innerHTML = renderScreenTimeRows(filtered, searchTerm);
      bindActionButtons(refreshCallback);
    });
  }

  bindActionButtons(refreshCallback);
}

function bindActionButtons(refreshCallback) {
  document.querySelectorAll('[data-edit-screentime]').forEach(button => {
    button.addEventListener('click', () => {
      const screenTime = JSON.parse(decodeAttr(button.getAttribute('data-screentime')));
      showAddScreenTimeModal(screenTime, refreshCallback);
    });
  });

  document.querySelectorAll('[data-delete-screentime]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-screentime');

      if (!confirm('Are you sure you want to delete this screen time?')) return;

      try {
        await apiRequest(`/api/admin/screentimes/${id}`, 'DELETE', null, true);
        alert('Screen time deleted successfully');
        refreshCallback('screenTimes');
      } catch (error) {
        alert(error.message || 'Failed to delete screen time');
      }
    });
  });
}

function showAddScreenTimeModal(screenTime = null, refreshCallback) {
  const modalContainer = document.getElementById('modalContainer');
  const isEditing = !!screenTime;

  const modalHTML = `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-[#1a1a24] border border-white/20 rounded-2xl w-full max-w-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-white">
            ${isEditing ? 'Edit Screen Time' : 'Add Screen Time'}
          </h2>
          <button id="closeModalBtn" class="text-white/50 hover:text-white">✕</button>
        </div>

        <form id="screenTimeForm" class="space-y-5">
          <input type="hidden" id="screenTimeId" value="${isEditing ? screenTime.id : ''}">

          <div>
            <label class="block text-sm text-white/70 mb-2 font-semibold">Movie Name</label>
            <input type="text" id="screenTimeMovieName" value="${isEditing ? safe(screenTime.movieName) : ''}" placeholder="Enter movie name" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white" required>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">Date</label>
              <input type="date" id="screenTimeDate" value="${isEditing ? formatShowDate(screenTime.showDate) : ''}" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white" required>
            </div>
            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">Time</label>
              <input type="time" id="screenTimeTime" value="${isEditing ? formatShowTime(screenTime.showTime) : ''}" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white" required>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">Screen Number</label>
              <input type="number" id="screenTimeScreen" value="${isEditing ? screenTime.screenNumber || '' : ''}" placeholder="1-10" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white" required>
            </div>
            <div>
              <label class="block text-sm text-white/70 mb-2 font-semibold">Ticket Price</label>
              <input type="number" id="screenTimePrice" step="0.01" min="0" value="${isEditing ? screenTime.ticketPrice || '' : ''}" placeholder="12.00" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white" required>
            </div>
          </div>

          <div id="screenTimeFormError" class="hidden text-red-400 text-sm p-3 bg-red-500/10 rounded-xl"></div>

          <div class="flex gap-3 pt-4">
            <button type="button" id="cancelModalBtn" class="flex-1 bg-white/10 py-3 rounded-xl text-white">Cancel</button>
            <button type="submit" id="submitScreenTimeBtn" class="flex-1 bg-red-600 py-3 rounded-xl text-white font-semibold">
              ${isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHTML;

  const closeModal = () => { modalContainer.innerHTML = ''; };
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  document.getElementById('screenTimeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorBox = document.getElementById('screenTimeFormError');
    const submitBtn = document.getElementById('submitScreenTimeBtn');

    errorBox.classList.add('hidden');

    try {
      submitBtn.disabled = true;

      const movieName = document.getElementById('screenTimeMovieName').value.trim();
      const showDate = document.getElementById('screenTimeDate').value;
      const timeValue = document.getElementById('screenTimeTime').value;
      const showTime = timeValue.length === 5 ? `${timeValue}:00` : timeValue;
      const screenNumber = parseInt(document.getElementById('screenTimeScreen').value);
      const ticketPrice = parseFloat(document.getElementById('screenTimePrice').value);

      const movies = await apiRequest('/api/movies', 'GET', null, false);
      const matchedMovie = movies.find(movie => movie.movieName && movieName && movie.movieName.toLowerCase() === movieName.toLowerCase());

      if (!matchedMovie) {
        throw new Error('Movie not found. Please add movie first.');
      }

      const payload = {
        movieId: matchedMovie.id,
        showDate,
        showTime,
        screenNumber,
        ticketPrice
      };

      if (isEditing) {
        await apiRequest(`/api/admin/screentimes/${screenTime.id}`, 'PUT', payload, true);
        alert('Screen Time updated successfully');
      } else {
        await apiRequest('/api/admin/screentimes', 'POST', payload, true);
        alert('Screen Time added successfully');
      }

      closeModal();
      refreshCallback('screenTimes');

    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
