import { renderLayout } from '../../components/layout.js';
import { setRoute } from '../../utils/router.js';
import { AdminLayout } from './AdminLayout.js';
import { dashboardPage } from './Dashboard.js';
import { usersPage, bindUserEvents } from './UserManagement.js';
import { moviesPage, bindMovieEvents } from './Movies.js';
import { screenTimesPage, bindScreenTimeEvents } from './ScreenTimes.js';
import { bookingsPage, bindBookingEvents } from './Bookings.js';
import { promoCodesPage, bindPromoCodeEvents } from './PromoCodes.js';

export async function adminPage(page = 'dashboard') {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'ADMIN') {
    renderLayout(`
      <section class="pt-24 px-4 min-h-screen text-white">
        <div class="max-w-xl mx-auto bg-[#0d0d14] border border-white/10 rounded-3xl p-8 text-center">
          <h1 class="text-3xl font-bold">Admin Login Required</h1>
          <p class="text-white/50 mt-3">Please login with an admin account to access dashboard.</p>
          <button id="goLogin" class="mt-6 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold">
            Go to Login
          </button>
        </div>
      </section>
    `);

    document.getElementById('goLogin').addEventListener('click', () => {
      setRoute('/login');
    });

    return;
  }

  let pageContent = '';

  try {
    pageContent = await renderContent(page);
  } catch (error) {
    console.error(error);
    pageContent = `
      <div class="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-6">
        <h2 class="text-xl font-bold">Something went wrong</h2>
        <p class="mt-2">${error.message || 'Failed to load admin dashboard'}</p>
      </div>
    `;
  }

  renderLayout(AdminLayout(page, pageContent));
  bindAdminEvents(page);
}

async function renderContent(page) {
  switch (page) {
    case 'users':
      return await usersPage();
    case 'movies':
      return await moviesPage();
    case 'screenTimes':
      return await screenTimesPage();
    case 'bookings':
      return await bookingsPage();
    case 'promoCodes':
      return await promoCodesPage();
    default:
      return await dashboardPage();
  }
}

function refreshAdminPage(page) {
  setRoute(`/admin/${page}`);

  if (location.hash === `#/admin/${page}`) {
    adminPage(page);
  }
}

function bindAdminEvents(page) {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setRoute('/');
      window.location.reload();
    });
  }

  // Bind events specific to the active page
  if (page === 'users') {
    bindUserEvents(refreshAdminPage);
  } else if (page === 'movies') {
    bindMovieEvents(refreshAdminPage);
  } else if (page === 'screenTimes') {
    bindScreenTimeEvents(refreshAdminPage);
  } else if (page === 'bookings') {
    bindBookingEvents(refreshAdminPage);
  } else if (page === 'promoCodes') {
    bindPromoCodeEvents(refreshAdminPage);
  }
}