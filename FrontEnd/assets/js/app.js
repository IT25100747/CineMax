const app = document.getElementById('app');
const state = { selectedDate: '2026-03-03', seats: {} };

const icon = (name, cls = 'w-4 h-4') => {
  const icons = {
    film: '<path d="M4 2v20M20 2v20M2 7h20M2 17h20M7 2v5M7 17v5M17 2v5M17 17v5"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    calendar: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
    ticket: '<path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="m15 18-6-6 6-6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'
  };
  return `<svg class="${cls}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${icons[name] || ''}</svg>`;
};

function money(n) { return `$${Number(n || 0).toFixed(2)}`; }
function setRoute(route) { location.hash = route; }
function route() { return location.hash.replace(/^#/, '') || '/'; }
function findMovie(id) { return MOVIES.find(m => m.id === id); }
function findShowtime(id) { return SHOWTIMES.find(s => s.id === id); }
function byMovie(movieId) { return SHOWTIMES.filter(s => s.movieId === movieId); }
function genres(movie) { return movie.genre.map(g => `<span class="text-xs text-white/45 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">${g}</span>`).join(''); }

function layout(content) {
  app.innerHTML = `
    <div class="min-h-screen bg-[#0a0a0f]">
      ${navbar()}
      <main class="fade-in">${content}</main>
    </div>`;
  bindNav();
}

function navbar() {
  return `
  <nav class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <button data-route="/" class="flex items-center gap-2 group">
          <span class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">${icon('film', 'w-4 h-4 text-white')}</span>
          <span class="text-white text-lg font-bold tracking-tight">Cine<span class="text-red-500">Max</span></span>
        </button>
        <div class="hidden md:flex items-center gap-8 text-sm">
          <button data-route="/" class="${route()==='/'?'text-red-400':'text-white/70 hover:text-white'} transition-colors">Movies</button>
          <button data-route="/" class="text-white/70 hover:text-white transition-colors">Cinemas</button>
          <button data-route="/" class="text-white/70 hover:text-white transition-colors">Offers</button>
        </div>
        <div class="hidden md:flex items-center gap-3">
          <button class="p-2 text-white/70 hover:text-white transition-colors">${icon('search', 'w-5 h-5')}</button>
          <button data-route="/confirmation/demo" class="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">${icon('ticket')} My Tickets</button>
        </div>
        <button id="mobileBtn" class="md:hidden p-2 text-white/70 hover:text-white">${icon('menu', 'w-5 h-5')}</button>
      </div>
      <div id="mobileMenu" class="hidden md:hidden border-t border-white/10 py-4 flex-col gap-4">
        <button data-route="/" class="text-left text-white/80 text-sm">Movies</button>
        <button data-route="/" class="text-left text-white/80 text-sm">Cinemas</button>
        <button data-route="/" class="text-left text-white/80 text-sm">Offers</button>
        <button data-route="/confirmation/demo" class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-fit">${icon('ticket')} My Tickets</button>
      </div>
    </div>
  </nav>`;
}

function bindNav() {
  document.querySelectorAll('[data-route]').forEach(btn => btn.addEventListener('click', () => setRoute(btn.dataset.route)));
  const mobileBtn = document.getElementById('mobileBtn');
  if (mobileBtn) mobileBtn.addEventListener('click', () => document.getElementById('mobileMenu').classList.toggle('hidden'));
}

function movieCard(movie) {
  return `
  <article class="group cursor-pointer" data-route="/movie/${movie.id}">
    <div class="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-900 poster-shadow">
      <img src="${movie.image}" alt="${movie.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">${icon('star','w-3 h-3 fill-yellow-400')} <b>${movie.score}</b></div>
      <div class="absolute top-3 right-3 bg-red-600/90 text-white text-xs px-2 py-1 rounded-md font-bold">${movie.rating}</div>
      ${movie.status === 'coming-soon' ? '<div class="absolute inset-0 bg-black/50 flex items-center justify-center"><div class="bg-amber-500 text-black text-sm px-3 py-1 rounded-full font-bold -rotate-3">Coming Soon</div></div>' : '<div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"><button class="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-semibold">Book Now</button></div>'}
    </div>
    <div class="mt-3 space-y-1">
      <h3 class="text-white truncate font-semibold">${movie.title}</h3>
      <div class="flex items-center gap-3 text-white/50 text-xs"><span class="flex items-center gap-1">${icon('clock','w-3 h-3')} ${movie.duration}</span>${movie.status === 'coming-soon' ? `<span class="flex items-center gap-1">${icon('calendar','w-3 h-3')} ${movie.releaseDate}</span>` : ''}</div>
      <div class="flex flex-wrap gap-1 mt-1">${genres(movie)}</div>
    </div>
  </article>`;
}

function homePage() {
  const featured = MOVIES[0];
  layout(`
  <section class="hero-bg pt-28 pb-14 px-4">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
      <div>
        <span class="inline-flex items-center gap-2 text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-5">Now Showing</span>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">Book your next <span class="text-red-500">cinema</span> experience</h1>
        <p class="mt-5 text-white/60 max-w-xl leading-relaxed">Browse movies, choose showtimes, pick your seats, and check out in a modern movie booking flow.</p>
        <div class="mt-8 flex flex-wrap gap-3"><button data-route="/movie/${featured.id}" class="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-semibold">Book Featured</button><button class="border border-white/15 hover:bg-white/10 rounded-xl px-6 py-3 font-semibold">View Offers</button></div>
      </div>
      <div class="relative hidden md:block"><img class="rounded-3xl aspect-[16/10] object-cover poster-shadow" src="${featured.image}" alt="${featured.title}"><div class="absolute -bottom-6 -left-6 glass border border-white/10 rounded-2xl p-5 max-w-xs"><p class="text-white/50 text-xs">Featured Movie</p><h2 class="font-bold text-xl">${featured.title}</h2><p class="text-white/60 text-sm mt-1">${featured.duration} · ${featured.genre.join(' / ')}</p></div></div>
    </div>
  </section>
  <section class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex items-end justify-between gap-4 mb-8"><div><h2 class="text-2xl font-bold">Now Showing</h2><p class="text-white/45 text-sm mt-1">Choose a movie and reserve your seat.</p></div><span class="text-white/40 text-sm">${MOVIES.filter(m=>m.status==='now-showing').length} movies</span></div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">${MOVIES.filter(m=>m.status==='now-showing').map(movieCard).join('')}</div>
  </section>
  <section class="max-w-7xl mx-auto px-4 pb-20">
    <h2 class="text-2xl font-bold mb-8">Coming Soon</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">${MOVIES.filter(m=>m.status==='coming-soon').map(movieCard).join('')}</div>
  </section>`);
}

function detailPage(id) {
  const movie = findMovie(id);
  if (!movie) return notFound('Movie not found');
  const dates = DATES.map(d => `<button class="dateBtn px-4 py-3 rounded-xl border text-left ${state.selectedDate===d.value?'bg-red-600 border-red-500 text-white':'bg-white/5 border-white/10 text-white/60 hover:text-white'}" data-date="${d.value}"><span class="block text-xs">${d.label}</span><b>${d.display}</b></button>`).join('');
  const showtimes = byMovie(movie.id).filter(s => s.date === state.selectedDate);
  layout(`
  <section class="pt-16">
    <div class="relative min-h-[520px] flex items-end"><img src="${movie.image}" class="absolute inset-0 w-full h-full object-cover opacity-35"><div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/20"></div><div class="relative max-w-7xl mx-auto px-4 py-12 w-full"><button data-route="/" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">${icon('arrow')} Back to Movies</button><div class="grid md:grid-cols-[260px_1fr] gap-8 items-end"><img src="${movie.image}" class="hidden md:block rounded-2xl aspect-[2/3] object-cover poster-shadow"><div><div class="flex gap-2 mb-4">${genres(movie)}</div><h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">${movie.title}</h1><div class="mt-4 flex flex-wrap gap-4 text-white/60 text-sm"><span class="flex items-center gap-1">${icon('star','w-4 h-4 text-yellow-400 fill-yellow-400')} ${movie.score}/10</span><span>${movie.rating}</span><span>${movie.duration}</span><span>Director: ${movie.director}</span></div><p class="mt-6 text-white/70 max-w-3xl leading-relaxed">${movie.description}</p><p class="mt-5 text-white/45 text-sm">Cast: ${movie.cast.join(', ')}</p></div></div></div></div>
    <div class="max-w-5xl mx-auto px-4 py-10"><h2 class="text-2xl font-bold mb-5">Select Showtime</h2><div class="flex gap-3 overflow-x-auto pb-3 mb-8">${dates}</div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${showtimes.length ? showtimes.map(s => `<button data-route="/seats/${s.id}" class="text-left bg-[#0d0d14] hover:bg-white/10 border border-white/10 hover:border-red-500/60 rounded-2xl p-5 transition"><div class="flex justify-between items-start"><div><p class="font-bold text-xl">${s.time}</p><p class="text-white/45 text-sm mt-1">${s.hall} · ${s.format}</p></div><span class="text-red-400">${icon('chevron')}</span></div><div class="mt-4 flex items-center justify-between text-xs text-white/45"><span>${s.availableSeats} seats available</span><span>${money(TICKET_PRICES[s.format])}</span></div></button>`).join('') : '<div class="col-span-full text-white/45 border border-white/10 rounded-2xl p-8 text-center">No showtimes for this date.</div>'}</div></div>
  </section>`);
  document.querySelectorAll('.dateBtn').forEach(b => b.addEventListener('click', () => { state.selectedDate = b.dataset.date; detailPage(id); }));
}

function generateSeats(showtimeId) {
  const rows = 'ABCDEFGHIJ'.split(''); const seats = {}; const seed = showtimeId.charCodeAt(showtimeId.length - 1);
  rows.forEach(row => { for (let col = 1; col <= 12; col++) { const hash = (row.charCodeAt(0) + col * 3 + seed * 7) % 100; seats[`${row}${col}`] = ['A','B'].includes(row) ? (hash < 35 ? 'taken' : 'vip') : (hash < 40 ? 'taken' : 'available'); }});
  return seats;
}

function seatsPage(showtimeId) {
  const showtime = findShowtime(showtimeId); if (!showtime) return notFound('Showtime not found');
  const movie = findMovie(showtime.movieId); if (!state.seats[showtimeId]) state.seats[showtimeId] = generateSeats(showtimeId);
  const seats = state.seats[showtimeId]; const selected = Object.keys(seats).filter(k => seats[k] === 'selected');
  const total = selected.reduce((sum, s) => sum + TICKET_PRICES[showtime.format] + (['A','B'].includes(s[0]) ? 4 : 0), 0);
  const rows = 'ABCDEFGHIJ'.split('').map(row => `<div class="flex items-center gap-1.5 mb-1.5"><span class="text-white/30 text-xs w-5 text-center font-bold">${row}</span><div class="flex gap-1.5">${Array.from({length:12}, (_,i)=>{ const n=i+1, key=`${row}${n}`, st=seats[key]; return `<button class="seat ${st}" data-seat="${key}" title="${key} - ${st}" ${st==='taken'?'disabled':''}>${st==='selected'?n:''}</button>${n===6?'<span class="w-4"></span>':''}`; }).join('')}</div><span class="text-white/30 text-xs w-5 text-center font-bold">${row}</span></div>`).join('');
  layout(`<section class="min-h-screen pt-16 pb-32"><div class="bg-[#0d0d14] border-b border-white/10 px-4 py-4"><div class="max-w-5xl mx-auto flex items-center justify-between"><button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm">${icon('arrow')} Back</button><div class="text-center"><p class="text-white text-sm font-semibold">${movie.title}</p><p class="text-white/50 text-xs">${showtime.date} · ${showtime.time} · ${showtime.hall} · ${showtime.format}</p></div><div class="w-16"></div></div></div><div class="max-w-5xl mx-auto px-4 py-8"><div class="flex flex-col items-center mb-8"><div class="w-3/4 max-w-lg h-2 bg-gradient-to-b from-white/40 to-transparent rounded-full mb-2 screen-curve"></div><div class="flex items-center gap-2 text-white/40 text-xs">${icon('monitor')} SCREEN</div></div><div class="flex items-center justify-center gap-6 mb-6 flex-wrap text-xs text-white/50"><span class="flex items-center gap-2"><b class="seat available !w-4 !h-4"></b>Available</span><span class="flex items-center gap-2"><b class="seat vip !w-4 !h-4"></b>VIP (+$4)</span><span class="flex items-center gap-2"><b class="seat selected !w-4 !h-4"></b>Selected</span><span class="flex items-center gap-2"><b class="seat taken !w-4 !h-4"></b>Taken</span></div><div class="overflow-x-auto"><div class="min-w-max mx-auto" style="width:fit-content">${rows}<div class="flex items-center gap-1.5 mt-2"><div class="w-5"></div>${Array.from({length:12},(_,i)=>`<span class="w-7 text-center text-white/20 text-xs">${i+1}</span>${i===5?'<span class="w-4"></span>':''}`).join('')}</div></div></div><div class="flex items-center gap-2 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl max-w-sm mx-auto">${icon('info','w-4 h-4 text-amber-400 flex-shrink-0')}<p class="text-amber-300/80 text-xs">Rows A & B are VIP seats with extra legroom (+$4.00 surcharge)</p></div></div><div class="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-4 py-4 z-40"><div class="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap"><div>${selected.length ? `<span class="text-white/50 text-xs">Selected Seats</span><div class="flex flex-wrap gap-1 mt-1">${selected.map(s=>`<span class="bg-red-600/30 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-500/30">${s}</span>`).join('')}</div>` : '<span class="text-white/40 text-sm">No seats selected</span>'}</div><div class="flex items-center gap-6">${selected.length ? `<div class="text-right"><span class="text-white/50 text-xs block">Total</span><b class="text-xl">${money(total)}</b></div>` : ''}<button id="continueBtn" ${!selected.length?'disabled':''} class="bg-red-600 disabled:bg-white/10 disabled:text-white/30 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">Continue ${icon('chevron')}</button></div></div></div></section>`);
  document.querySelectorAll('[data-seat]').forEach(btn => btn.addEventListener('click', () => { const key = btn.dataset.seat; if (seats[key] === 'taken') return; seats[key] = seats[key] === 'selected' ? (['A','B'].includes(key[0]) ? 'vip' : 'available') : 'selected'; seatsPage(showtimeId); }));
  document.getElementById('continueBtn').addEventListener('click', () => { if (selected.length) setRoute(`/checkout/${showtimeId}?seats=${selected.join(',')}&total=${total.toFixed(2)}`); });
}

function checkoutPage(showtimeId, query) {
  const showtime = findShowtime(showtimeId); if (!showtime) return notFound('Checkout not found'); const movie = findMovie(showtime.movieId);
  const params = new URLSearchParams(query || ''); const seats = (params.get('seats') || '').split(',').filter(Boolean); const total = Number(params.get('total') || 0);
  layout(`<section class="pt-24 pb-16 px-4 min-h-screen"><div class="max-w-6xl mx-auto"><button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">${icon('arrow')} Back to seats</button><h1 class="text-3xl font-bold mb-8">Checkout</h1><div class="grid lg:grid-cols-[1fr_380px] gap-8"><div class="space-y-6"><div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6"><h2 class="font-bold text-xl mb-5">Contact Details</h2><div class="grid sm:grid-cols-2 gap-4"><label class="block text-sm text-white/60">Full Name<input class="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500" value="Alex Morgan"></label><label class="block text-sm text-white/60">Email<input class="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500" value="alex@example.com"></label></div></div><div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6"><h2 class="font-bold text-xl mb-5">Payment Method</h2><div class="border border-red-500/50 bg-red-500/10 rounded-xl p-4 flex items-center gap-3">${icon('card','w-5 h-5 text-red-400')}<span class="font-semibold">Credit / Debit Card</span></div><div class="grid sm:grid-cols-2 gap-4 mt-4"><input placeholder="Card number" class="sm:col-span-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"><input placeholder="MM/YY" class="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"><input placeholder="CVC" class="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500"></div></div></div><aside class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6 h-fit sticky top-24"><h2 class="font-bold text-xl mb-5">Booking Summary</h2><div class="flex gap-4"><img src="${movie.image}" class="w-24 h-36 object-cover rounded-xl"><div><h3 class="font-bold">${movie.title}</h3><p class="text-white/50 text-sm mt-1">${showtime.date}</p><p class="text-white/50 text-sm">${showtime.time} · ${showtime.hall}</p><p class="text-white/50 text-sm">${showtime.format}</p></div></div><div class="border-t border-white/10 mt-6 pt-6 space-y-3 text-sm"><div class="flex justify-between"><span class="text-white/50">Seats</span><b>${seats.join(', ') || 'None'}</b></div><div class="flex justify-between"><span class="text-white/50">Tickets</span><b>${seats.length}</b></div><div class="flex justify-between text-lg pt-3 border-t border-white/10"><span>Total</span><b>${money(total)}</b></div></div><button id="payBtn" class="w-full mt-6 bg-red-600 hover:bg-red-500 rounded-xl py-3 font-bold flex justify-center items-center gap-2">Pay & Confirm ${icon('chevron')}</button></aside></div></div></section>`);
  document.getElementById('payBtn').addEventListener('click', () => setRoute(`/confirmation/${Date.now().toString().slice(-6)}?movie=${movie.id}&showtime=${showtime.id}&seats=${seats.join(',')}&total=${total.toFixed(2)}`));
}

function confirmationPage(id, query) {
  const params = new URLSearchParams(query || ''); const movie = findMovie(params.get('movie')) || MOVIES[0]; const showtime = findShowtime(params.get('showtime')) || SHOWTIMES[0]; const seats = params.get('seats') || 'A1, A2'; const total = Number(params.get('total') || 37.98);
  layout(`<section class="pt-24 px-4 pb-16 min-h-screen flex items-center"><div class="max-w-2xl mx-auto w-full text-center"><div class="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6 text-green-400">${icon('check','w-10 h-10')}</div><h1 class="text-4xl font-extrabold">Booking Confirmed!</h1><p class="text-white/55 mt-3">Your tickets are ready. Booking ID: <b class="text-white">CM-${id}</b></p><div class="mt-8 text-left bg-[#0d0d14] border border-white/10 rounded-3xl p-6"><div class="flex gap-5"><img src="${movie.image}" class="w-28 h-40 rounded-2xl object-cover"><div class="flex-1"><h2 class="text-2xl font-bold">${movie.title}</h2><p class="text-white/50 mt-2">${showtime.date} · ${showtime.time}</p><p class="text-white/50">${showtime.hall} · ${showtime.format}</p><div class="mt-4 flex flex-wrap gap-2">${seats.split(',').map(s=>`<span class="bg-red-600/30 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/30">${s.trim()}</span>`).join('')}</div></div></div><div class="border-t border-white/10 mt-6 pt-6 flex justify-between"><span class="text-white/50">Total Paid</span><b class="text-xl">${money(total)}</b></div></div><div class="mt-8 flex justify-center gap-3 flex-wrap"><button data-route="/" class="bg-red-600 hover:bg-red-500 rounded-xl px-6 py-3 font-semibold">Back to Home</button><button onclick="window.print()" class="border border-white/15 hover:bg-white/10 rounded-xl px-6 py-3 font-semibold">Print Ticket</button></div></div></section>`);
}

function notFound(message) { layout(`<section class="min-h-screen pt-16 flex items-center justify-center"><div class="text-center"><p class="text-xl font-semibold text-white/70">${message}</p><button data-route="/" class="mt-4 text-red-400 hover:text-red-300 text-sm">Back to Home</button></div></section>`); }

function render() {
  const [path, query = ''] = route().split('?'); const parts = path.split('/').filter(Boolean);
  if (path === '/') return homePage();
  if (parts[0] === 'movie') return detailPage(parts[1]);
  if (parts[0] === 'seats') return seatsPage(parts[1]);
  if (parts[0] === 'checkout') return checkoutPage(parts[1], query);
  if (parts[0] === 'confirmation') return confirmationPage(parts[1], query);
  return notFound('Page not found');
}

window.addEventListener('hashchange', render);
render();
