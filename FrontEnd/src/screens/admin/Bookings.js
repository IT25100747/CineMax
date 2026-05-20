import { adminData, apiRequest, pageHeader, safe, encodeAttr, decodeAttr, API_BASE_URL } from './adminUtils.js';

export async function bookingsPage() {
  try {
    const bookings = await apiRequest('/api/admin/bookings', 'GET', null, true);
    adminData.bookings = bookings; // Store in state for searching/modals
  } catch (error) {
    adminData.bookings = [];
    console.error("Failed to load bookings", error);
  }

  return `
    ${pageHeader('Bookings', 'Track customer ticket bookings')}

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden">
      <div class="p-6 border-b border-white/10 flex justify-between items-center gap-4">
        <div>
          <h2 class="text-xl font-bold">All Bookings</h2>
          <p class="text-white/50 text-sm mt-1">${adminData.bookings.length} total bookings</p>
        </div>
        <div class="relative w-64">
          <input 
            type="text" 
            id="bookingSearch" 
            placeholder="Search reference, movie, customer..." 
            class="w-full bg-[#1a1a24] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-red-500"
          >
          <svg class="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Ref</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Movie / Time</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Customer</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Seats</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Total</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Status</th>
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
            </tr>
          </thead>
          <tbody id="bookingTableBody">
            ${renderBookingRows(adminData.bookings)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderBookingRows(bookings, searchTerm = '') {
  if (!bookings.length) {
    const message = searchTerm
      ? `No bookings found matching "${searchTerm}"`
      : 'No bookings found in the system.';

    return `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-white/50">
          ${message}
        </td>
      </tr>
    `;
  }

  return bookings.map(b => `
    <tr class="border-b border-white/5 hover:bg-white/5">
      <td class="px-5 py-4 text-sm text-white/80">${safe(b.bookingReference)}</td>
      <td class="px-5 py-4">
        <p class="font-semibold text-white">${safe(b.movieName)}</p>
        <p class="text-xs text-white/40">${safe(b.showDate)} • ${safe(b.showTime)} • Screen ${safe(b.screenNumber)}</p>
      </td>
      <td class="px-5 py-4">
        <p class="font-semibold text-white">${safe(b.customerName || 'Guest')}</p>
        <p class="text-xs text-white/40">${safe(b.customerEmail || '-')}</p>
      </td>
      <td class="px-5 py-4">
        <div class="flex flex-wrap gap-1 max-w-[150px]">
          ${b.seats && b.seats.length > 0 
            ? b.seats.map(s => `<span class="bg-white/10 text-xs px-2 py-0.5 rounded">${safe(s)}</span>`).join('') 
            : '<span class="text-white/40">-</span>'}
        </div>
      </td>
      <td class="px-5 py-4 text-sm font-semibold text-green-400">$${b.totalAmount ? b.totalAmount.toFixed(2) : '0.00'}</td>
      <td class="px-5 py-4">
        <span class="px-3 py-1 rounded-full text-xs font-bold ${
          b.status === 'CONFIRMED' || b.status === 'SUCCESS' ? 'bg-green-500/20 text-green-300' : 
          b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
        }">${safe(b.status)}</span>
      </td>
      <td class="px-5 py-4">
        ${(b.status === 'CONFIRMED' || b.status === 'SUCCESS') ? `
          <div class="flex gap-3">
            <button
              data-edit-booking="${b.id}"
              data-booking='${encodeAttr(JSON.stringify(b))}'
              class="text-blue-400 hover:text-blue-300 font-semibold text-sm"
              title="Edit Seats"
            >
              Edit
            </button>
            <button
              data-cancel-booking="${b.id}"
              class="text-red-400 hover:text-red-300 font-semibold text-sm"
              title="Cancel Booking"
            >
              Cancel
            </button>
          </div>
        ` : `<span class="text-white/30 text-xs italic">N/A</span>`}
      </td>
    </tr>
  `).join('');
}

export function bindBookingEvents(refreshCallback) {
  const bookingSearch = document.getElementById('bookingSearch');
  if (bookingSearch) {
    bookingSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const tableBody = document.getElementById('bookingTableBody');

      if (!tableBody) return;

      const filtered = adminData.bookings.filter(b =>
        (b.bookingReference && b.bookingReference.toLowerCase().includes(searchTerm)) ||
        (b.movieName && b.movieName.toLowerCase().includes(searchTerm)) ||
        (b.customerName && b.customerName.toLowerCase().includes(searchTerm)) ||
        (b.customerEmail && b.customerEmail.toLowerCase().includes(searchTerm))
      );

      tableBody.innerHTML = renderBookingRows(filtered, searchTerm);
      bindBookingActionButtons(refreshCallback);
    });
  }

  bindBookingActionButtons(refreshCallback);
}

function bindBookingActionButtons(refreshCallback) {
  document.querySelectorAll('[data-cancel-booking]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-cancel-booking');

      if (!confirm('Are you sure you want to cancel this booking? The seats will be released immediately.')) return;

      try {
        await apiRequest(`/api/admin/bookings/${id}/cancel`, 'POST', null, true);
        alert('Booking cancelled successfully.');
        refreshCallback('bookings');
      } catch (error) {
        alert(error.message || 'Failed to cancel booking.');
      }
    });
  });

  document.querySelectorAll('[data-edit-booking]').forEach(button => {
    button.addEventListener('click', () => {
      const booking = JSON.parse(decodeAttr(button.getAttribute('data-booking')));
      showEditSeatsModal(booking, refreshCallback);
    });
  });
}

function showEditSeatsModal(booking, refreshCallback) {
  const modalContainer = document.getElementById('modalContainer');
  
  const modalHTML = `
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-[#1a1a24] border border-white/20 rounded-2xl w-full max-w-4xl p-8 flex flex-col max-h-[90vh]">
        
        <div class="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 class="text-2xl font-bold text-white">Edit Seats for ${safe(booking.bookingReference)}</h2>
            <p class="text-white/50 text-sm mt-1">${safe(booking.movieName)} • Screen ${safe(booking.screenNumber)}</p>
          </div>
          <button id="closeEditSeatsBtn" class="text-white/50 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div id="editSeatsContent" class="flex-1 overflow-y-auto min-h-[300px] flex items-center justify-center">
          <p class="text-white/50 animate-pulse">Loading seat layout...</p>
        </div>

        <div class="mt-6 pt-6 border-t border-white/10 flex justify-between items-center shrink-0">
          <div class="flex gap-4 text-sm">
            <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-white/10"></div> <span class="text-white/60">Available</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-red-600"></div> <span class="text-white/60">Selected</span></div>
            <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-white/5 border border-white/10 text-white/20 flex items-center justify-center">×</div> <span class="text-white/60">Taken</span></div>
          </div>
          <div class="flex gap-3">
            <button id="cancelEditSeatsBtn" class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-colors">Cancel</button>
            <button id="saveEditSeatsBtn" disabled class="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-colors">Save Changes</button>
          </div>
        </div>

      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHTML;

  const closeFn = () => { modalContainer.innerHTML = ''; };
  document.getElementById('closeEditSeatsBtn').addEventListener('click', closeFn);
  document.getElementById('cancelEditSeatsBtn').addEventListener('click', closeFn);

  loadSeatMapForAdmin(booking, closeFn, refreshCallback);
}

async function loadSeatMapForAdmin(booking, closeFn, refreshCallback) {
  try {
    if (!booking.screenTimeId) throw new Error("Missing screenTimeId for this booking");

    const response = await fetch(`${API_BASE_URL}/api/screentimes/${booking.screenTimeId}/seats`);
    if (!response.ok) throw new Error("Failed to load seat availability.");
    const allReservedSeats = await response.json();

    let currentBookingSeats = [...(booking.seats || [])];
    let selectedSeats = [...currentBookingSeats];

    const contentDiv = document.getElementById('editSeatsContent');
    const saveBtn = document.getElementById('saveEditSeatsBtn');

    const renderMap = () => {
      const rows = ['A','B','C','D','E','F','G'];
      
      let html = `
        <div class="w-full max-w-2xl mx-auto py-8">
          <div class="relative w-full h-12 mb-16 perspective-1000">
            <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-full transform rotateX-45 blur-[2px]"></div>
            <div class="absolute inset-0 bg-white/10 rounded-t-full transform rotateX-45 blur-md shadow-[0_-10px_30px_rgba(255,255,255,0.1)]"></div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.5em] font-bold">SCREEN</div>
          </div>
          <div class="flex flex-col gap-3 items-center">
      `;

      rows.forEach(row => {
        html += `<div class="flex items-center gap-4"><div class="w-6 text-center font-mono text-white/30 text-sm font-bold">${row}</div><div class="flex gap-2">`;
        for (let i = 1; i <= 14; i++) {
          if (i === 4 || i === 12) html += `<div class="w-4"></div>`;

          const seatId = `${row}${i}`;
          const isCurrentBookingSeat = currentBookingSeats.includes(seatId);
          const isTakenBySomeoneElse = allReservedSeats.includes(seatId) && !isCurrentBookingSeat;
          const isSelected = selectedSeats.includes(seatId);

          let seatClass = "w-8 h-8 rounded-t-lg rounded-b-sm transition-all duration-300 flex items-center justify-center text-[10px] font-bold font-mono cursor-pointer ";

          if (isTakenBySomeoneElse) {
            seatClass += "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed";
            html += `<div class="${seatClass}">×</div>`;
          } else if (isSelected) {
            seatClass += "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] transform scale-110";
            html += `<div class="${seatClass}" data-seat="${seatId}">${i}</div>`;
          } else {
            seatClass += "bg-white/10 text-white/40 hover:bg-white/20 hover:text-white";
            html += `<div class="${seatClass}" data-seat="${seatId}">${i}</div>`;
          }
        }
        html += `</div></div>`;
      });

      html += `</div></div>`;
      contentDiv.innerHTML = html;

      contentDiv.querySelectorAll('[data-seat]').forEach(el => {
        el.addEventListener('click', (e) => {
          const s = e.currentTarget.getAttribute('data-seat');
          if (selectedSeats.includes(s)) {
            selectedSeats = selectedSeats.filter(x => x !== s);
          } else {
            selectedSeats.push(s);
          }
          
          const seatsChanged = JSON.stringify([...selectedSeats].sort()) !== JSON.stringify([...currentBookingSeats].sort());
          saveBtn.disabled = selectedSeats.length === 0 || !seatsChanged;
          
          renderMap();
        });
      });
    };

    renderMap();

    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      try {
        await apiRequest(`/api/admin/bookings/${booking.id}/seats`, 'POST', { newSeats: selectedSeats }, true);
        alert('Seats updated successfully!');
        closeFn();
        refreshCallback('bookings');
      } catch (err) {
        alert(err.message || 'Failed to update seats');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });

  } catch (error) {
    document.getElementById('editSeatsContent').innerHTML = `
      <div class="text-red-400 text-center">
        <p class="font-bold text-xl mb-2">Error</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}
