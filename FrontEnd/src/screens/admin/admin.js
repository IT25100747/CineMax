// import { renderLayout } from '../../components/layout.js';
// import { setRoute } from '../../utils/router.js';

// const adminData = {
//   users: [
//     { name: 'Admin User', email: 'admin@gmail.com', role: 'ADMIN', status: 'Active' },
//     { name: 'Gobi Galli', email: 'gobi@gmail.com', role: 'USER', status: 'Active' },
//     { name: 'Nadia Silva', email: 'nadia@example.com', role: 'USER', status: 'Active' }
//   ],
//   bookings: [
//     { id: 'BK10241', movie: 'Stellar Void', user: 'Gobi Galli', seats: 'A3, A4', amount: 'LKR34.00', status: 'Paid' },
//     { id: 'BK10242', movie: 'Shadow Protocol', user: 'Nadia Silva', seats: 'C5', amount: 'LKR12.00', status: 'Pending' },
//     { id: 'BK10243', movie: 'Iron Tempest', user: 'Maya Chen', seats: 'B1, B2, B3', amount: 'LKR51.00', status: 'Paid' }
//   ],
//   movies: [
//     { title: 'Stellar Void', genre: 'Sci-Fi', rating: 'PG-13', status: 'Now Showing' },
//     { title: 'Shadow Protocol', genre: 'Action', rating: 'R', status: 'Now Showing' },
//     { title: 'Iron Tempest', genre: 'Adventure', rating: 'PG', status: 'Coming Soon' }
//   ],
//   halls: [
//     { hall: 'Hall A', capacity: 100, available: 42, status: 'Open' },
//     { hall: 'Hall B', capacity: 120, available: 78, status: 'Open' },
//     { hall: 'Hall C', capacity: 80, available: 18, status: 'Maintenance' }
//   ]
// };

// export function adminPage(page = 'dashboard') {
//   const role = localStorage.getItem('role');

//   if (role !== 'ADMIN') {
//     renderLayout(`
//       <section class="pt-24 px-4 min-h-screen text-white">
//         <div class="max-w-xl mx-auto bg-[#0d0d14] border border-white/10 rounded-3xl p-8 text-center">
//           <h1 class="text-3xl font-bold">Admin Login Required</h1>
//           <p class="text-white/50 mt-3">Please login with an admin account to access dashboard.</p>
//           <button id="goLogin" class="mt-6 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold">
//             Go to Login
//           </button>
//         </div>
//       </section>
//     `);

//     document.getElementById('goLogin').addEventListener('click', () => {
//       setRoute('/login');
//     });

//     return;
//   }

//   renderLayout(`
//     <section class="min-h-screen pt-20 bg-[#08080d] text-white">
//       <div class="grid lg:grid-cols-[260px_1fr] min-h-screen">
        
//         <aside class="bg-[#0d0d14] border-r border-white/10 p-6">
//           <h2 class="text-2xl font-black mb-8">
//             Cine<span class="text-red-500">Max</span> Admin
//           </h2>

//           <nav class="space-y-2">
//             ${navItem('dashboard', 'Dashboard', page)}
//             ${navItem('users', 'Users', page)}
//             ${navItem('movies', 'Movies', page)}
//             ${navItem('bookings', 'Bookings', page)}
//             ${navItem('halls', 'Halls', page)}
//           </nav>

//           <button id="logoutBtn" class="w-full mt-10 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold">
//             Logout
//           </button>
//         </aside>

//         <main class="p-6 md:p-10">
//           ${renderContent(page)}
//         </main>
//       </div>
//     </section>
//   `);

//   document.getElementById('logoutBtn').addEventListener('click', () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     setRoute('/login');
//   });
// }

// function navItem(key, label, active) {
//   const isActive = active === key || (!active && key === 'dashboard');

//   return `
//     <a 
//       href="#/admin/${key === 'dashboard' ? '' : key}"
//       class="block px-4 py-3 rounded-xl font-semibold transition
//       ${isActive ? 'bg-red-600 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}"
//     >
//       ${label}
//     </a>
//   `;
// }

// function renderContent(page) {
//   switch (page) {
//     case 'users':
//       return usersPage();
//     case 'movies':
//       return moviesPage();
//     case 'bookings':
//       return bookingsPage();
//     case 'halls':
//       return hallsPage();
//     default:
//       return dashboardPage();
//   }
// }

// function dashboardPage() {
//   const revenue = adminData.bookings.reduce(
//     (sum, booking) => sum + Number(booking.amount.replace('LKR', '')),
//     0
//   );

//   return `
//     ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

//     <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
//       ${statCard('Total Users', adminData.users.length)}
//       ${statCard('Movies', adminData.movies.length)}
//       ${statCard('Bookings', adminData.bookings.length)}
//       ${statCard('Revenue', '$' + revenue.toFixed(2))}
//     </div>

//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//       <h2 class="text-xl font-bold mb-4">Recent Bookings</h2>
//       ${table(
//         ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
//         adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status])
//       )}
//     </div>
//   `;
// }

// function usersPage() {
//   return `
//     ${pageHeader('Users', 'Manage registered users')}
//     ${table(
//       ['Name', 'Email', 'Role', 'Status'],
//       adminData.users.map(u => [u.name, u.email, u.role, u.status])
//     )}
//   `;
// }

// function moviesPage() {
//   return `
//     ${pageHeader('Movies', 'Manage movie listings')}
//     ${table(
//       ['Title', 'Genre', 'Rating', 'Status'],
//       adminData.movies.map(m => [m.title, m.genre, m.rating, m.status])
//     )}
//   `;
// }

// function bookingsPage() {
//   return `
//     ${pageHeader('Bookings', 'Track customer ticket bookings')}
//     ${table(
//       ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
//       adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status])
//     )}
//   `;
// }

// function hallsPage() {
//   return `
//     ${pageHeader('Halls', 'Monitor cinema hall availability')}
//     ${table(
//       ['Hall', 'Capacity', 'Available', 'Status'],
//       adminData.halls.map(h => [h.hall, h.capacity, h.available, h.status])
//     )}
//   `;
// }

// function pageHeader(title, subtitle) {
//   return `
//     <div class="mb-8">
//       <h1 class="text-4xl font-black">${title}</h1>
//       <p class="text-white/50 mt-2">${subtitle}</p>
//     </div>
//   `;
// }

// function statCard(title, value) {
//   return `
//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//       <p class="text-white/50 text-sm">${title}</p>
//       <h3 class="text-3xl font-black mt-2">${value}</h3>
//     </div>
//   `;
// }

// function table(headers, rows) {
//   return `
//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
//       <table class="w-full text-left">
//         <thead>
//           <tr class="border-b border-white/10">
//             ${headers.map(h => `
//               <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">${h}</th>
//             `).join('')}
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           ${rows.map(row => `
//             <tr class="border-b border-white/5 hover:bg-white/5">
//               ${row.map(cell => `
//                 <td class="px-5 py-4 text-sm text-white/80">${cell}</td>
//               `).join('')}
//               <td class="px-5 py-4">
//                 <button class="text-red-400 hover:text-red-300 font-semibold text-sm">
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>
//   `;
// }


import { renderLayout } from '../../components/layout.js';
import { setRoute } from '../../utils/router.js';

const API_BASE_URL = 'http://localhost:8080';

const adminData = {
  bookings: [
    { id: 'BK10241', movie: 'Stellar Void', user: 'Gobi Galli', seats: 'A3, A4', amount: '$34.00', status: 'Paid' },
    { id: 'BK10242', movie: 'Shadow Protocol', user: 'Nadia Silva', seats: 'C5', amount: '$12.00', status: 'Pending' },
    { id: 'BK10243', movie: 'Iron Tempest', user: 'Maya Chen', seats: 'B1, B2, B3', amount: '$51.00', status: 'Paid' }
  ],
  movies: [
    { title: 'Stellar Void', genre: 'Sci-Fi', rating: 'PG-13', status: 'Now Showing' },
    { title: 'Shadow Protocol', genre: 'Action', rating: 'R', status: 'Now Showing' },
    { title: 'Iron Tempest', genre: 'Adventure', rating: 'PG', status: 'Coming Soon' }
  ],
  halls: [
    { hall: 'Hall A', capacity: 100, available: 42, status: 'Open' },
    { hall: 'Hall B', capacity: 120, available: 78, status: 'Open' },
    { hall: 'Hall C', capacity: 80, available: 18, status: 'Maintenance' }
  ]
};

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

  renderLayout(`
    <section class="min-h-screen pt-20 bg-[#08080d] text-white">
      <div class="grid lg:grid-cols-[260px_1fr] min-h-screen">
        
        <aside class="bg-[#0d0d14] border-r border-white/10 p-6">
          <h2 class="text-2xl font-black mb-8">
            Cine<span class="text-red-500">Max</span> Admin
          </h2>

          <nav class="space-y-2">
            ${navItem('dashboard', 'Dashboard', page)}
            ${navItem('users', 'Users', page)}
            ${navItem('movies', 'Movies', page)}
            ${navItem('bookings', 'Bookings', page)}
            ${navItem('halls', 'Halls', page)}
          </nav>

          <button id="logoutBtn" class="w-full mt-10 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold">
            Logout
          </button>
        </aside>

        <main class="p-6 md:p-10">
          ${pageContent}
        </main>
      </div>
    </section>
  `);

  bindAdminEvents();
}

async function renderContent(page) {
  switch (page) {
    case 'users':
      return await usersPage();
    case 'movies':
      return moviesPage();
    case 'bookings':
      return bookingsPage();
    case 'halls':
      return hallsPage();
    default:
      return await dashboardPage();
  }
}

async function dashboardPage() {
  const users = await getUsers();

  const revenue = adminData.bookings.reduce(
    (sum, booking) => sum + Number(booking.amount.replace('$', '')),
    0
  );

  return `
    ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      ${statCard('Total Users', users.length)}
      ${statCard('Movies', adminData.movies.length)}
      ${statCard('Bookings', adminData.bookings.length)}
      ${statCard('Revenue', '$' + revenue.toFixed(2))}
    </div>

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
      <h2 class="text-xl font-bold mb-4">Recent Bookings</h2>
      ${table(
        ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
        adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
        false
      )}
    </div>
  `;
}

async function usersPage() {
  const users = await getUsers();

  return `
    ${pageHeader('Users', '')}

    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">ID</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Name</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Gmail</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Phone</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Role</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
          </tr>
        </thead>

        <tbody>
          ${users.length === 0 ? `
            <tr>
              <td colspan="6" class="px-5 py-6 text-center text-white/50">
                No users found
              </td>
            </tr>
          ` : users.map(user => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-5 py-4 text-sm text-white/80">${user.id}</td>
              <td class="px-5 py-4 text-sm text-white/80">${user.fullName || '-'}</td>
              <td class="px-5 py-4 text-sm text-white/80">${user.gmail || '-'}</td>
              <td class="px-5 py-4 text-sm text-white/80">${user.phoneNumber || '-'}</td>
              <td class="px-5 py-4 text-sm">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'ADMIN'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-green-500/20 text-green-300'
                }">
                  ${user.role}
                </span>
              </td>
              <td class="px-5 py-4">
                ${user.role === 'ADMIN'
                  ? `<span class="text-white/30 text-sm">Protected</span>`
                  : `<button data-delete-user="${user.id}" class="text-red-400 hover:text-red-300 font-semibold text-sm">Delete</button>`
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function moviesPage() {
  return `
    ${pageHeader('Movies', 'Manage movie listings')}
    ${table(
      ['Title', 'Genre', 'Rating', 'Status'],
      adminData.movies.map(m => [m.title, m.genre, m.rating, m.status]),
      true
    )}
  `;
}

function bookingsPage() {
  return `
    ${pageHeader('Bookings', 'Track customer ticket bookings')}
    ${table(
      ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
      adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
      true
    )}
  `;
}

function hallsPage() {
  return `
    ${pageHeader('Halls', 'Monitor cinema hall availability')}
    ${table(
      ['Hall', 'Capacity', 'Available', 'Status'],
      adminData.halls.map(h => [h.hall, h.capacity, h.available, h.status]),
      true
    )}
  `;
}

async function getUsers() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    throw new Error('Admin session expired. Please login again.');
  }

  if (!response.ok) {
    throw new Error('Failed to load users from backend');
  }

  return await response.json();
}

async function deleteUser(id) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

function bindAdminEvents() {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setRoute('/login');
    });
  }

  document.querySelectorAll('[data-delete-user]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-user');

      const confirmed = confirm('Are you sure you want to delete this user?');

      if (!confirmed) {
        return;
      }

      try {
        await deleteUser(id);
        alert('User deleted successfully');
        setRoute('/admin/users');

        if (location.hash === '#/admin/users') {
          adminPage('users');
        }
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    });
  });
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

function pageHeader(title, subtitle) {
  return `
    <div class="mb-8">
      <h1 class="text-4xl font-black">${title}</h1>
      <p class="text-white/50 mt-2">${subtitle}</p>
    </div>
  `;
}

function statCard(title, value) {
  return `
    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
      <p class="text-white/50 text-sm">${title}</p>
      <h3 class="text-3xl font-black mt-2">${value}</h3>
    </div>
  `;
}

function table(headers, rows, showAction = true) {
  return `
    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            ${headers.map(h => `
              <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">${h}</th>
            `).join('')}
            ${showAction ? `<th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>` : ''}
          </tr>
        </thead>

        <tbody>
          ${rows.map(row => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              ${row.map(cell => `
                <td class="px-5 py-4 text-sm text-white/80">${cell}</td>
              `).join('')}
              ${showAction ? `
                <td class="px-5 py-4">
                  <button class="text-red-400 hover:text-red-300 font-semibold text-sm">
                    Edit
                  </button>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}