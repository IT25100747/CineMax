// filepath: src/screens/checkout.js
import { renderLayout } from '../components/layout.js';
import { icon, money } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';

const API_BASE_URL = 'http://localhost:8080';
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

export async function checkoutPage(showtimeId, query) {
  try {
    const screenTime = await fetchScreenTimeById(showtimeId);
    if (!screenTime) {
      throw new Error('Showtime not found');
    }

    const movieResponse = await fetch(`${API_BASE_URL}/api/movies/${screenTime.movieId}`);
    if (!movieResponse.ok) {
      throw new Error('Movie not found');
    }

    const backendMovie = await movieResponse.json();
    const screenNumber = screenTime.screenNumber || 1;

    const movie = {
      id: backendMovie.id,
      title: backendMovie.movieName,
      image: backendMovie.posterUrl,
    };

    const showtime = {
      id: String(screenTime.id),
      date: screenTime.showDate,
      time: formatTime12h(screenTime.showTime),
      hall: screenNumberToHall(screenNumber),
      format: screenNumberToFormat(screenNumber),
    };

    const params = new URLSearchParams(query || '');
    const seats = (params.get('seats') || '').split(',').filter(Boolean);
    const ticketsTotal = Number(params.get('total') || 0);
    const serviceFee = 1.99;
    const finalTotal = ticketsTotal + serviceFee;

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    let personalInfoHtml = '';
    if (!isLoggedIn) {
      personalInfoHtml = `
            <!-- Personal Information -->
            <div class="bg-[#15151a] border border-white/10 rounded-2xl p-6" id="personalInfoSection">
              <h2 class="font-bold text-xl mb-5 flex items-center gap-2">
                ${icon('ticket', 'w-5 h-5 text-red-500')} Personal Information
              </h2>
              <div class="space-y-4">
                <label class="block text-sm text-white/60">
                  Full Name
                  <input id="guestName" class="mt-2 w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" placeholder="John Doe">
                </label>
                <label class="block text-sm text-white/60">
                  Email Address
                  <input id="guestEmail" type="email" class="mt-2 w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" placeholder="john@example.com">
                </label>
                <label class="block text-sm text-white/60">
                  Phone Number
                  <input id="guestPhone" type="tel" class="mt-2 w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" placeholder="+1 234 567 8900">
                </label>
              </div>
            </div>`;
    }

    const content = `
    <section class="pt-24 pb-16 px-4 min-h-screen">
      <div class="max-w-6xl mx-auto">
        
        <div class="flex items-center gap-4 mb-8">
          <button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm">
            ${icon('arrow')} Back
          </button>
          <h1 class="text-3xl font-bold">Checkout</h1>
        </div>

        <div class="grid lg:grid-cols-[1fr_400px] gap-8">
          
          <!-- Left Column -->
          <div class="space-y-6">
            
            ${personalInfoHtml}

            <!-- Payment Details -->
            <div class="bg-[#15151a] border border-white/10 rounded-2xl p-6">
              <h2 class="font-bold text-xl mb-5 flex items-center gap-2">
                ${icon('card', 'w-5 h-5 text-red-500')} Payment Details
              </h2>
              <div class="space-y-4">
                <label class="block text-sm text-white/60">
                  Card Number
                  <input id="cardNumber" placeholder="1234 5678 9012 3456" class="mt-2 w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 font-mono tracking-widest transition-colors">
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <label class="block text-sm text-white/60">
                    Expiry
                    <input id="cardExpiry" placeholder="MM/YY" class="mt-2 w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors">
                  </label>
                  <label class="block text-sm text-white/60">
                    CVV
                    <input id="cardCvv" type="password" placeholder="123" class="mt-2 w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors">
                  </label>
                </div>
                <div class="flex items-center gap-2 mt-4 text-white/40 text-xs">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Secured with 256-bit SSL encryption
                </div>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="bg-[#15151a] border border-white/10 rounded-2xl p-6">
              <h2 class="font-bold text-xl mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                Promo Code
              </h2>
              <div class="flex gap-3">
                <input id="promoInput" placeholder="Enter promo code (try CINE10)" class="flex-1 rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors uppercase">
                <button id="applyPromoBtn" class="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 rounded-xl transition-colors">Apply</button>
              </div>
              <div id="promoMessage" class="mt-3 text-sm hidden"></div>
            </div>

            <!-- Pay Button (Mobile) -->
            <button id="payBtnMobile" class="w-full lg:hidden bg-red-600 hover:bg-red-500 rounded-xl py-4 font-bold flex justify-center items-center gap-2 text-lg transition-colors">
              Pay ${money(finalTotal)} <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </button>

          </div>
          
          <!-- Right Column: Order Summary -->
          <aside class="h-fit sticky top-24">
            <div class="bg-[#15151a] border border-white/10 rounded-2xl p-6">
              <h2 class="font-bold text-xl mb-6">Order Summary</h2>
              
              <div class="flex gap-4 mb-6">
                <img src="${movie.image}" class="w-20 h-28 object-cover rounded-xl" onerror="this.src='https://via.placeholder.com/120x180?text=Movie'">
                <div>
                  <h3 class="font-bold text-lg leading-tight mb-2">${movie.title}</h3>
                  <p class="text-white/50 text-xs mb-1">${showtime.date}</p>
                  <p class="text-white/50 text-xs mb-1">${showtime.time} · ${showtime.hall}</p>
                  <span class="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full mt-2">${showtime.format}</span>
                </div>
              </div>

              <div class="mb-6">
                <p class="text-white/40 text-xs tracking-wider mb-3 uppercase">SEATS</p>
                <div class="flex flex-wrap gap-2">
                  ${seats.map(s => `<span class="bg-white/10 border border-white/10 text-white text-xs px-3 py-1.5 rounded-full font-medium">${s}</span>`).join('')}
                </div>
              </div>

              <div class="border-t border-white/10 pt-6 space-y-4 text-sm">
                <div class="flex justify-between items-center text-white/70">
                  <span>${seats.length}x Ticket (${showtime.format})</span>
                  <span>${money(ticketsTotal)}</span>
                </div>
                <div class="flex justify-between items-center text-white/70">
                  <span>Service Fee</span>
                  <span>+${money(serviceFee)}</span>
                </div>
                <div id="discountRow" class="flex justify-between items-center text-green-400 hidden">
                  <span>Discount</span>
                  <span id="discountAmountSpan">-$0.00</span>
                </div>
                <div class="flex justify-between items-center text-xl pt-4 border-t border-white/10">
                  <span class="font-bold text-white">Total</span>
                  <span id="summaryTotalSpan" class="font-bold text-white">${money(finalTotal)}</span>
                </div>
              </div>
            </div>

            <button id="payBtn" class="hidden lg:flex w-full mt-6 bg-red-600 hover:bg-red-500 rounded-xl py-4 font-bold justify-center items-center gap-2 text-lg transition-colors">
              Pay ${money(finalTotal)} <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </aside>
        </div>
      </div>
    </section>`;

    renderLayout(content);

    let currentPromoCode = '';
    let currentDiscount = 0;
    let currentTotal = finalTotal;

    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');
    const promoMessage = document.getElementById('promoMessage');

    applyPromoBtn?.addEventListener('click', async () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      applyPromoBtn.disabled = true;
      applyPromoBtn.textContent = '...';

      try {
        const res = await fetch(`${API_BASE_URL}/api/promo-codes/validate?code=${code}`);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }
        const data = await res.json();
        
        currentPromoCode = data.code;
        currentDiscount = (finalTotal * (data.discountPercentage / 100));
        currentTotal = finalTotal - currentDiscount;

        // Update UI
        promoMessage.textContent = `${data.discountPercentage}% discount applied successfully!`;
        promoMessage.className = 'mt-3 text-sm text-green-400 block font-medium';
        
        document.getElementById('discountRow').classList.remove('hidden');
        document.getElementById('discountAmountSpan').textContent = `-${money(currentDiscount)}`;
        document.getElementById('summaryTotalSpan').textContent = money(currentTotal);
        
        const payBtnMobile = document.getElementById('payBtnMobile');
        const payBtn = document.getElementById('payBtn');
        if (payBtnMobile) payBtnMobile.innerHTML = `Pay ${money(currentTotal)} <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>`;
        if (payBtn) payBtn.innerHTML = `Pay ${money(currentTotal)} <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>`;

        promoInput.disabled = true;
        applyPromoBtn.textContent = 'Applied';
      } catch (e) {
        promoMessage.textContent = e.message || 'Invalid promo code';
        promoMessage.className = 'mt-3 text-sm text-red-400 block font-medium';
        applyPromoBtn.disabled = false;
        applyPromoBtn.textContent = 'Apply';
      }
    });

    const handlePay = async (e) => {
      const btn = e.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Processing...';
      btn.disabled = true;

      try {
        const guestName = document.getElementById('guestName')?.value || '';
        const guestEmail = document.getElementById('guestEmail')?.value || '';
        const guestPhone = document.getElementById('guestPhone')?.value || '';
        const cardNumber = document.getElementById('cardNumber')?.value || '';
        const cardExpiry = document.getElementById('cardExpiry')?.value || '';
        const cardCvv = document.getElementById('cardCvv')?.value || '';

        if (!isLoggedIn && (!guestName || !guestEmail)) {
          alert('Please fill in your personal information.');
          btn.innerHTML = originalText;
          btn.disabled = false;
          return;
        }

        if (!cardNumber || !cardExpiry || !cardCvv) {
          alert('Please fill in your payment details.');
          btn.innerHTML = originalText;
          btn.disabled = false;
          return;
        }

        const payload = {
          screenTimeId: Number(showtime.id),
          seatNumbers: seats,
          totalAmount: currentTotal,
          promoCode: currentPromoCode,
          guestName,
          guestEmail,
          guestPhone,
          cardNumber,
          cardExpiry,
          cardCvv,
          paymentMethod: 'CREDIT_CARD'
        };

        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/bookings/checkout`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Payment failed');
        }

        setRoute(`/confirmation/${result.bookingReference}?movie=${movie.id}&showtime=${showtime.id}&seats=${seats.join(',')}&total=${currentTotal.toFixed(2)}`);

      } catch (err) {
        console.error(err);
        alert('Booking error: ' + err.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    };

    const payBtn = document.getElementById('payBtn');
    if (payBtn) payBtn.addEventListener('click', handlePay);
    
    const payBtnMobile = document.getElementById('payBtnMobile');
    if (payBtnMobile) payBtnMobile.addEventListener('click', handlePay);

  } catch (error) {
    console.error('Checkout error:', error);
    renderLayout(`
      <div class="min-h-screen pt-32 px-4 text-center">
        <h1 class="text-3xl font-bold text-red-500 mb-4">Error</h1>
        <p class="text-white/60">Could not load checkout page. Please try again.</p>
        <button onclick="history.back()" class="mt-8 bg-white/10 px-6 py-2 rounded-xl">Go Back</button>
      </div>
    `);
  }
}