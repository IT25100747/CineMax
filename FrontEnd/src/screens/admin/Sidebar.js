export function Sidebar(activePage) {
  return `
    <aside class="bg-[#0d0d14] border-r border-white/10 p-6">
      <h2 class="text-2xl font-black mb-8">
        Cine<span class="text-red-500">Max</span> Admin
      </h2>

      <nav class="space-y-2">
        ${navItem('dashboard', 'Dashboard', activePage)}
        ${navItem('users', 'User Management', activePage)}
        ${navItem('movies', 'Movies', activePage)}
        ${navItem('screenTimes', 'Screen Times', activePage)}
        ${navItem('bookings', 'Bookings', activePage)}
        ${navItem('promoCodes', 'Promo Codes', activePage)}
      </nav>

      <button id="logoutBtn" class="w-full mt-10 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold">
        Logout
      </button>
    </aside>
  `;
}

function navItem(key, label, active) {
  const isActive = active === key || (!active && key === 'dashboard');

  return `
    <a 
      href="#/admin/${key === 'dashboard' ? '' : key}"
      class="block px-4 py-3 rounded-xl font-semibold transition
      ${isActive ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}"
    >
      ${label}
    </a>
  `;
}
