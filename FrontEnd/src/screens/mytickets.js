import { renderLayout } from '../components/layout.js';

const API_BASE_URL = 'http://localhost:8080';
const ROWS = ['A','B','C','D','E','F','G','H','I','J'];
const SEATS_PER_ROW = 14;

function buildSeatGrid(currentSeats, reservedByOthers, selectedSeats) {
  const reserved = new Set(reservedByOthers), current = new Set(currentSeats), selected = new Set(selectedSeats);
  let html = `<div class="mb-4 text-center"><div class="inline-block bg-white/5 rounded-xl px-8 py-2 text-xs text-white/40 tracking-widest mb-4">SCREEN</div></div><div class="overflow-x-auto"><div class="flex flex-col gap-1.5 min-w-max mx-auto" style="width:fit-content">`;
  for (const row of ROWS) {
    html += `<div class="flex items-center gap-1"><span class="text-white/40 text-xs w-4 text-right mr-1">${row}</span>`;
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const seatId = `${row}${n}`;
      let cls = reserved.has(seatId) ? 'bg-white/10 border-white/10 cursor-not-allowed text-white/20' : selected.has(seatId) ? 'bg-red-600 border-red-500 text-white cursor-pointer' : 'bg-white/5 border-white/10 hover:bg-white/15 text-white/60 cursor-pointer';
      html += `<button class="w-7 h-7 rounded border text-[9px] font-bold transition-all ${cls}" data-seat="${seatId}" ${reserved.has(seatId)?'disabled':''} onclick="toggleSeat('${seatId}')">${n}</button>`;
    }
    html += `</div>`;
  }
  return html + `</div></div><div class="flex justify-center gap-5 mt-4 text-xs text-white/50"><span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-white/5 border border-white/10 inline-block"></span>Available</span><span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-600 inline-block"></span>Selected</span><span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-white/10 inline-block"></span>Reserved</span></div>`;
}

function starsDisplay(rating) {
  return Array.from({length:5}, (_,i) => `<span class="${i < rating ? 'text-yellow-400' : 'text-white/20'}">★</span>`).join('');
}

function starsInput(current = 0) {
  return `<div class="flex gap-1" id="starInput">${Array.from({length:5},(_,i)=>`<button type="button" data-star="${i+1}" onclick="selectStar(${i+1})" class="text-3xl transition-all ${i < current ? 'text-yellow-400' : 'text-white/20'} hover:text-yellow-400">★</button>`).join('')}</div>`;
}

export async function myTicketsPage() {
  const token = localStorage.getItem('token');
  if (!token) {
    renderLayout(`<section class="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center"><div class="text-center text-white/50"><p class="text-2xl font-bold mb-4">Please log in to view your tickets</p><button data-route="/login" class="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl transition-colors">Sign In</button></div></section>`);
    return;
  }

  let tickets = [], ticketsHTML = '';
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/my-tickets`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to load tickets');
    tickets = await res.json();
  } catch(e) {
    ticketsHTML = `<div class="col-span-full py-10 text-center text-red-400"><p class="font-bold text-lg mb-2">Error</p><p>${e.message}</p></div>`;
  }

  // Fetch user's existing reviews (one call each per movie)
  const reviewMap = {}; // movieId -> review
  if (tickets.length) {
    const movieIds = [...new Set(tickets.map(t => t.movieId).filter(Boolean))];
    await Promise.all(movieIds.map(async mid => {
      try {
        const r = await fetch(`${API_BASE_URL}/api/reviews/my?movieId=${mid}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (r.ok) { const d = await r.json(); if (d) reviewMap[mid] = d; }
      } catch(_) {}
    }));
  }

  const today = new Date(); today.setHours(0,0,0,0);

  if (!ticketsHTML) {
    if (!tickets.length) {
      ticketsHTML = `<div class="col-span-full py-20 text-center text-white/50"><svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg><p class="text-xl">No bookings found</p></div>`;
    } else {
      ticketsHTML = tickets.map(ticket => {
        const seatsBadges = ticket.seats ? ticket.seats.map(s=>`<span class="bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('') : '<span class="text-white/40 text-xs">No seats</span>';
        const showDate = ticket.showDate ? new Date(ticket.showDate) : null;
        const hasPassed = showDate && showDate < today;
        const myReview = ticket.movieId ? reviewMap[ticket.movieId] : null;

        let reviewBtn = '';
        if (hasPassed) {
          if (myReview) {
            reviewBtn = `<div class="flex gap-2">
              <button onclick="openEditReview(${ticket.movieId}, ${myReview.id}, ${myReview.rating}, ${JSON.stringify(myReview.reviewText||'').replace(/"/g,'&quot;')})" class="flex items-center gap-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition">✏️ Edit Review</button>
              <button onclick="deleteReview(${myReview.id}, ${ticket.movieId})" class="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition">🗑 Delete</button>
            </div>`;
          } else {
            reviewBtn = `<button onclick="openAddReview(${ticket.movieId}, ${ticket.internalBookingId||'null'})" class="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition">★ Add Review</button>`;
          }
        }

        return `<div class="bg-[#0d0d14] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
          <div class="flex justify-between items-start gap-2">
            <div class="flex gap-4 flex-1 min-w-0">
              <img src="${ticket.moviePoster||'https://via.placeholder.com/150x225?text=No+Poster'}" class="w-20 h-28 object-cover rounded-xl shadow-lg shrink-0">
              <div class="flex flex-col py-1 min-w-0">
                <h3 class="text-lg font-bold text-white mb-1 truncate">${ticket.movieName}</h3>
                <p class="text-white/60 text-sm mb-1">${ticket.showDate} • ${ticket.showTime}</p>
                <p class="text-white/60 text-sm mb-3">${ticket.hallName} • ${ticket.screenType}</p>
                <div class="flex flex-wrap gap-1.5" id="seats-${ticket.bookingId}">${seatsBadges}</div>
              </div>
            </div>
            <button onclick="openEditSeatsModal('${ticket.bookingId}')" class="shrink-0 flex items-center gap-1 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-white/70 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all">✏ Edit Seats</button>
          </div>
          ${ticket.movieStatus==='INACTIVE'?`<div class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs px-4 py-2 rounded-xl">⚠ This movie is no longer available for new bookings</div>`:''}
          ${myReview ? `<div class="bg-white/3 border border-white/8 rounded-xl px-4 py-3"><div class="flex items-center gap-2 mb-1"><span class="text-sm font-semibold text-white">Your Review</span><span class="text-yellow-400 text-sm">${starsDisplay(myReview.rating)}</span></div><p class="text-white/60 text-sm">${myReview.reviewText||''}</p></div>` : ''}
          <div class="pt-3 border-t border-white/10 flex justify-between items-center">
            <div class="flex items-center gap-3">${reviewBtn}</div>
            <span class="text-xl font-bold text-white">$${ticket.totalPaid?ticket.totalPaid.toFixed(2):'0.00'}</span>
          </div>
        </div>`;
      }).join('');
    }
  }

  const content = `
    <section class="pt-32 pb-24 px-4 min-h-screen">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-extrabold text-white mb-10">My Tickets</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">${ticketsHTML}</div>
      </div>
    </section>

    <!-- Edit Seats Modal -->
    <div id="editSeatsModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeEditSeatsModal()"></div>
      <div class="relative bg-[#12121a] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-[#12121a] border-b border-white/10 px-6 py-4 flex justify-between items-center rounded-t-3xl z-10">
          <div><h2 class="text-xl font-bold text-white">Edit Seats</h2><p id="seatModalSubtitle" class="text-white/50 text-sm mt-0.5"></p></div>
          <button onclick="closeEditSeatsModal()" class="p-2 text-white/40 hover:text-white">✕</button>
        </div>
        <div class="px-6 py-5">
          <div id="seatModalError" class="hidden mb-4 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm"></div>
          <div id="seatGridContainer" class="mb-6"><div class="text-center text-white/40 py-10">Loading seats...</div></div>
          <div class="flex justify-between items-center border-t border-white/10 pt-4">
            <div class="text-sm text-white/50">Selected: <span id="selectedCount" class="font-bold text-white">0</span> / <span id="requiredCount" class="font-bold text-white">0</span></div>
            <div class="flex gap-3">
              <button onclick="closeEditSeatsModal()" class="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-semibold transition">Cancel</button>
              <button id="updateSeatsBtn" onclick="confirmUpdateSeats()" class="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition disabled:opacity-40" disabled>Update Seats</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div id="reviewModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeReviewModal()"></div>
      <div class="relative bg-[#12121a] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl">
        <div class="border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 id="reviewModalTitle" class="text-xl font-bold text-white">Add Review</h2>
          <button onclick="closeReviewModal()" class="text-white/40 hover:text-white text-xl">✕</button>
        </div>
        <div class="px-6 py-5 space-y-5">
          <div id="reviewError" class="hidden bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm"></div>
          <div>
            <label class="block text-sm text-white/60 mb-2">Your Rating</label>
            ${starsInput(0)}
            <input type="hidden" id="reviewRating" value="0">
          </div>
          <div>
            <label class="block text-sm text-white/60 mb-2">Your Review</label>
            <textarea id="reviewText" rows="4" placeholder="Share your thoughts about this movie..." class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-yellow-500 transition-colors resize-none"></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button onclick="closeReviewModal()" class="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-semibold transition">Cancel</button>
            <button onclick="submitReview()" id="reviewSubmitBtn" class="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold transition">Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  `;

  renderLayout(content);
  bindMyTicketsLogic(token);
}

function bindMyTicketsLogic(token) {
  // ── Seat editing ──────────────────────────────────────────────────────────
  let currentBookingRef = null, selectedSeats = new Set(), requiredCount = 0;

  window.openEditSeatsModal = async function(bookingRef) {
    currentBookingRef = bookingRef; selectedSeats = new Set();
    document.getElementById('editSeatsModal').classList.remove('hidden');
    document.getElementById('seatModalError').classList.add('hidden');
    document.getElementById('seatGridContainer').innerHTML = '<div class="text-center text-white/40 py-10">Loading seats...</div>';
    document.getElementById('updateSeatsBtn').disabled = true;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingRef}/seats`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load seat data');
      const data = await res.json();
      requiredCount = (data.currentSeats||[]).length;
      selectedSeats = new Set(data.currentSeats||[]);
      document.getElementById('seatModalSubtitle').textContent = `Booking: ${bookingRef} — Select ${requiredCount} seat(s)`;
      document.getElementById('requiredCount').textContent = requiredCount;
      document.getElementById('selectedCount').textContent = selectedSeats.size;
      document.getElementById('updateSeatsBtn').disabled = selectedSeats.size !== requiredCount;
      document.getElementById('seatGridContainer').innerHTML = buildSeatGrid(data.currentSeats||[], data.reservedByOthers||[], [...selectedSeats]);
    } catch(err) { showSeatError(err.message); }
  };
  window.closeEditSeatsModal = function() { document.getElementById('editSeatsModal').classList.add('hidden'); currentBookingRef = null; selectedSeats.clear(); };
  window.toggleSeat = function(seatId) {
    selectedSeats.has(seatId) ? selectedSeats.delete(seatId) : selectedSeats.add(seatId);
    const btn = document.querySelector(`[data-seat="${seatId}"]`);
    if (btn) btn.className = selectedSeats.has(seatId) ? 'w-7 h-7 rounded border text-[9px] font-bold transition-all bg-red-600 border-red-500 text-white cursor-pointer' : 'w-7 h-7 rounded border text-[9px] font-bold transition-all bg-white/5 border-white/10 hover:bg-white/15 text-white/60 cursor-pointer';
    document.getElementById('selectedCount').textContent = selectedSeats.size;
    document.getElementById('updateSeatsBtn').disabled = selectedSeats.size !== requiredCount;
  };
  window.confirmUpdateSeats = async function() {
    const btn = document.getElementById('updateSeatsBtn'); btn.disabled = true; btn.textContent = 'Updating...';
    document.getElementById('seatModalError').classList.add('hidden');
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${currentBookingRef}/seats`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ newSeats: [...selectedSeats] }) });
      if (!res.ok) { const e = await res.json().catch(()=>null); throw new Error(e?.error||'Failed to update seats'); }
      const updated = await res.json();
      const sc = document.getElementById(`seats-${currentBookingRef}`);
      if (sc && updated.seats) sc.innerHTML = updated.seats.map(s=>`<span class="bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold">${s}</span>`).join('');
      window.closeEditSeatsModal();
    } catch(err) { showSeatError(err.message); btn.disabled = false; btn.textContent = 'Update Seats'; }
  };
  function showSeatError(msg) { const el = document.getElementById('seatModalError'); el.textContent = msg; el.classList.remove('hidden'); }

  // ── Review logic ──────────────────────────────────────────────────────────
  let reviewMovieId = null, reviewBookingId = null, editReviewId = null, currentRating = 0;

  window.selectStar = function(n) {
    currentRating = n;
    document.getElementById('reviewRating').value = n;
    document.querySelectorAll('#starInput button').forEach((b,i) => b.className = `text-3xl transition-all hover:text-yellow-400 ${i<n?'text-yellow-400':'text-white/20'}`);
  };
  window.openAddReview = function(movieId, bookingId) {
    reviewMovieId = movieId; reviewBookingId = bookingId; editReviewId = null; currentRating = 0;
    document.getElementById('reviewModalTitle').textContent = 'Add Review';
    document.getElementById('reviewText').value = '';
    document.getElementById('reviewRating').value = 0;
    document.getElementById('reviewError').classList.add('hidden');
    document.querySelectorAll('#starInput button').forEach(b => b.className = 'text-3xl transition-all hover:text-yellow-400 text-white/20');
    document.getElementById('reviewModal').classList.remove('hidden');
  };
  window.openEditReview = function(movieId, reviewId, rating, text) {
    reviewMovieId = movieId; editReviewId = reviewId; reviewBookingId = null; currentRating = rating;
    document.getElementById('reviewModalTitle').textContent = 'Edit Review';
    document.getElementById('reviewText').value = text;
    document.getElementById('reviewRating').value = rating;
    document.getElementById('reviewError').classList.add('hidden');
    document.querySelectorAll('#starInput button').forEach((b,i) => b.className = `text-3xl transition-all hover:text-yellow-400 ${i<rating?'text-yellow-400':'text-white/20'}`);
    document.getElementById('reviewModal').classList.remove('hidden');
  };
  window.closeReviewModal = function() { document.getElementById('reviewModal').classList.add('hidden'); };
  window.submitReview = async function() {
    const rating = parseInt(document.getElementById('reviewRating').value);
    const text = document.getElementById('reviewText').value.trim();
    if (!rating || rating < 1) { showReviewError('Please select a star rating'); return; }
    const btn = document.getElementById('reviewSubmitBtn'); btn.disabled = true; btn.textContent = 'Saving...';
    document.getElementById('reviewError').classList.add('hidden');
    try {
      const url = editReviewId ? `${API_BASE_URL}/api/reviews/${editReviewId}` : `${API_BASE_URL}/api/reviews`;
      const method = editReviewId ? 'PUT' : 'POST';
      const body = editReviewId ? { rating, reviewText: text } : { movieId: reviewMovieId, bookingId: reviewBookingId, rating, reviewText: text };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json().catch(()=>null); throw new Error(e?.error||'Failed to save review'); }
      window.closeReviewModal();
      myTicketsPage(); // refresh
    } catch(err) { showReviewError(err.message); btn.disabled = false; btn.textContent = 'Submit Review'; }
  };
  window.deleteReview = async function(reviewId, movieId) {
    if (!confirm('Delete your review for this movie?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to delete review');
      myTicketsPage();
    } catch(err) { alert(err.message); }
  };
  function showReviewError(msg) { const el = document.getElementById('reviewError'); el.textContent = msg; el.classList.remove('hidden'); }
}
