// filepath: src/screens/confirmation.js
import { renderLayout } from '../components/layout.js';
import { icon, money } from '../utils/helpers.js';

const API_BASE_URL = 'http://localhost:8080';

export async function confirmationPage(id, query) {
  // Render loading state first
  renderLayout(`
    <section class="pt-24 px-4 pb-16 min-h-screen flex items-center justify-center">
      <div class="text-white/50 animate-pulse">Loading booking details...</div>
    </section>
  `);

  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load booking details (Status: ${response.status}): ${errorText}`);
    }

    const ticket = await response.json();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrCodeData || ticket.bookingId)}`;
    const seatsBadges = ticket.seats 
          ? ticket.seats.map(s => `<span class="bg-red-600/30 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/30">${s.trim()}</span>`).join('') 
          : '<span class="text-white/40 text-xs">No seats</span>';

    const content = `
    <section class="pt-24 px-4 pb-16 min-h-screen flex items-center">
      <div class="max-w-3xl mx-auto w-full">
        
        <div class="text-center mb-10">
          <div class="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            ${icon('check','w-10 h-10')}
          </div>
          <h1 class="text-4xl font-extrabold tracking-tight">Booking Confirmed!</h1>
          <p class="text-white/60 mt-3 text-lg">Your tickets are ready. We've sent a confirmation to your email.</p>
        </div>

        <!-- Printable Ticket UI -->
        <div class="bg-white text-black rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl print:shadow-none mx-auto print:m-0 print:border print:border-gray-300">
          
          <!-- Ticket Main Section -->
          <div class="flex-1 p-8 relative bg-white">
            <div class="flex justify-between items-start mb-6 border-b border-gray-200 pb-6">
              <div>
                <p class="text-red-600 font-bold tracking-widest text-sm uppercase">CineMax Admit One</p>
                <h2 class="text-3xl font-extrabold mt-1 text-gray-900 leading-tight">${ticket.movieName}</h2>
              </div>
              <span class="text-gray-400 font-mono text-sm">#${ticket.bookingId}</span>
            </div>

            <div class="flex gap-6">
              <img src="${ticket.moviePoster || 'https://via.placeholder.com/150x225?text=No+Poster'}" class="w-32 h-48 rounded-xl object-cover shadow-md shrink-0 border border-gray-100">
              <div class="flex-1 grid grid-cols-2 gap-y-6 gap-x-4">
                
                <div>
                  <p class="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Date</p>
                  <p class="font-bold text-gray-900">${ticket.showDate}</p>
                </div>
                
                <div>
                  <p class="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Time</p>
                  <p class="font-bold text-gray-900">${ticket.showTime}</p>
                </div>

                <div>
                  <p class="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Cinema</p>
                  <p class="font-bold text-gray-900">${ticket.hallName}</p>
                </div>

                <div>
                  <p class="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Format</p>
                  <p class="font-bold text-gray-900">${ticket.screenType}</p>
                </div>

                <div class="col-span-2">
                  <p class="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Seats</p>
                  <div class="flex flex-wrap gap-2 mt-1">
                    ${ticket.seats ? ticket.seats.map(s => `<span class="bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded-md border border-gray-200">${s}</span>`).join('') : '-'}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Tear-off Stub / QR Section -->
          <div class="w-full md:w-64 bg-gray-50 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center relative print:border-gray-400">
            <!-- Cutout circles to make it look like a real ticket -->
            <div class="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-[#0a0a0f] print:bg-white rounded-full"></div>
            <div class="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 bg-[#0a0a0f] print:bg-white rounded-full"></div>
            
            <p class="text-gray-500 font-bold text-xs uppercase tracking-widest mb-4">Scan for Entry</p>
            <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
              <img src="${qrCodeUrl}" alt="QR Code" class="w-32 h-32">
            </div>
            
            <div class="mt-6 w-full text-center border-t border-gray-200 pt-4">
              <p class="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Paid</p>
              <p class="text-2xl font-black text-gray-900 mt-1">$${(ticket.totalPaid || 0).toFixed(2)}</p>
            </div>
          </div>

        </div>

        <div class="mt-12 flex justify-center gap-4 flex-wrap print:hidden">
          <button data-route="/" class="bg-white/10 hover:bg-white/20 text-white rounded-xl px-8 py-3 font-semibold transition-colors">Back to Home</button>
          <button onclick="window.print()" class="bg-red-600 hover:bg-red-500 text-white rounded-xl px-8 py-3 font-semibold transition-colors flex items-center gap-2">
            ${icon('ticket', 'w-5 h-5')} Print Ticket
          </button>
        </div>
      </div>
    </section>`;

    renderLayout(content);

  } catch (error) {
    renderLayout(`
      <section class="pt-24 px-4 pb-16 min-h-screen flex items-center justify-center">
        <div class="text-center bg-red-500/10 border border-red-500/20 rounded-3xl p-8 max-w-lg mx-auto">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p class="text-white/60 mb-6">${error.message}</p>
          <button data-route="/" class="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-semibold text-white">Return Home</button>
        </div>
      </section>
    `);
  }
}