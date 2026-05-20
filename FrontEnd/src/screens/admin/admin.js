
// import { renderLayout } from '../../components/layout.js';
// import { setRoute } from '../../utils/router.js';

// const API_BASE_URL = 'http://localhost:8080';

// const adminData = {
//   bookings: [
//     { id: 'BK10241', movie: 'Stellar Void', user: 'Gobi Galli', seats: 'A3, A4', amount: '$34.00', status: 'Paid' },
//     { id: 'BK10242', movie: 'Shadow Protocol', user: 'Nadia Silva', seats: 'C5', amount: '$12.00', status: 'Pending' },
//     { id: 'BK10243', movie: 'Iron Tempest', user: 'Maya Chen', seats: 'B1, B2, B3', amount: '$51.00', status: 'Paid' }
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

// export async function adminPage(page = 'dashboard') {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token || role !== 'ADMIN') {
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

//   let pageContent = '';

//   try {
//     pageContent = await renderContent(page);
//   } catch (error) {
//     console.error(error);
//     pageContent = `
//       <div class="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-6">
//         <h2 class="text-xl font-bold">Something went wrong</h2>
//         <p class="mt-2">${error.message || 'Failed to load admin dashboard'}</p>
//       </div>
//     `;
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
//           ${pageContent}
//         </main>
//       </div>
//     </section>
//   `);

//   bindAdminEvents();
// }

// async function renderContent(page) {
//   switch (page) {
//     case 'users':
//       return await usersPage();
//     case 'movies':
//       return moviesPage();
//     case 'bookings':
//       return bookingsPage();
//     case 'halls':
//       return hallsPage();
//     default:
//       return await dashboardPage();
//   }
// }

// async function dashboardPage() {
//   const users = await getUsers();

//   const revenue = adminData.bookings.reduce(
//     (sum, booking) => sum + Number(booking.amount.replace('$', '')),
//     0
//   );

//   return `
//     ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

//     <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
//       ${statCard('Total Users', users.length)}
//       ${statCard('Movies', adminData.movies.length)}
//       ${statCard('Bookings', adminData.bookings.length)}
//       ${statCard('Revenue', '$' + revenue.toFixed(2))}
//     </div>

//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
//       <h2 class="text-xl font-bold mb-4">Recent Bookings</h2>
//       ${table(
//         ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
//         adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
//         false
//       )}
//     </div>
//   `;
// }

// async function usersPage() {
//   const users = await getUsers();

//   return `
//     ${pageHeader('Users', '')}

//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
//       <table class="w-full text-left">
//         <thead>
//           <tr class="border-b border-white/10">
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">ID</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Name</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Gmail</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Phone</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Role</th>
//             <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           ${users.length === 0 ? `
//             <tr>
//               <td colspan="6" class="px-5 py-6 text-center text-white/50">
//                 No users found
//               </td>
//             </tr>
//           ` : users.map(user => `
//             <tr class="border-b border-white/5 hover:bg-white/5">
//               <td class="px-5 py-4 text-sm text-white/80">${user.id}</td>
//               <td class="px-5 py-4 text-sm text-white/80">${user.fullName || '-'}</td>
//               <td class="px-5 py-4 text-sm text-white/80">${user.gmail || '-'}</td>
//               <td class="px-5 py-4 text-sm text-white/80">${user.phoneNumber || '-'}</td>
//               <td class="px-5 py-4 text-sm">
//                 <span class="px-3 py-1 rounded-full text-xs font-bold ${
//                   user.role === 'ADMIN'
//                     ? 'bg-red-500/20 text-red-300'
//                     : 'bg-green-500/20 text-green-300'
//                 }">
//                   ${user.role}
//                 </span>
//               </td>
//               <td class="px-5 py-4">
//                 ${user.role === 'ADMIN'
//                   ? `<span class="text-white/30 text-sm">Protected</span>`
//                   : `<button data-delete-user="${user.id}" class="text-red-400 hover:text-red-300 font-semibold text-sm">Delete</button>`
//                 }
//               </td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     </div>
//   `;
// }

// function moviesPage() {
//   return `
//     ${pageHeader('Movies', 'Manage movie listings')}
//     ${table(
//       ['Title', 'Genre', 'Rating', 'Status'],
//       adminData.movies.map(m => [m.title, m.genre, m.rating, m.status]),
//       true
//     )}
//   `;
// }

// function bookingsPage() {
//   return `
//     ${pageHeader('Bookings', 'Track customer ticket bookings')}
//     ${table(
//       ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
//       adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
//       true
//     )}
//   `;
// }

// function hallsPage() {
//   return `
//     ${pageHeader('Halls', 'Monitor cinema hall availability')}
//     ${table(
//       ['Hall', 'Capacity', 'Available', 'Status'],
//       adminData.halls.map(h => [h.hall, h.capacity, h.available, h.status]),
//       true
//     )}
//   `;
// }

// async function getUsers() {
//   const token = localStorage.getItem('token');

//   const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   if (response.status === 401 || response.status === 403) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     throw new Error('Admin session expired. Please login again.');
//   }

//   if (!response.ok) {
//     throw new Error('Failed to load users from backend');
//   }

//   return await response.json();
// }

// async function deleteUser(id) {
//   const token = localStorage.getItem('token');

//   const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   if (!response.ok) {
//     throw new Error('Failed to delete user');
//   }
// }

// function bindAdminEvents() {
//   const logoutBtn = document.getElementById('logoutBtn');

//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('role');
//       setRoute('/login');
//     });
//   }

//   document.querySelectorAll('[data-delete-user]').forEach(button => {
//     button.addEventListener('click', async () => {
//       const id = button.getAttribute('data-delete-user');

//       const confirmed = confirm('Are you sure you want to delete this user?');

//       if (!confirmed) {
//         return;
//       }

//       try {
//         await deleteUser(id);
//         alert('User deleted successfully');
//         setRoute('/admin/users');

//         if (location.hash === '#/admin/users') {
//           adminPage('users');
//         }
//       } catch (error) {
//         alert(error.message || 'Failed to delete user');
//       }
//     });
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

// function table(headers, rows, showAction = true) {
//   return `
//     <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-x-auto">
//       <table class="w-full text-left">
//         <thead>
//           <tr class="border-b border-white/10">
//             ${headers.map(h => `
//               <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">${h}</th>
//             `).join('')}
//             ${showAction ? `<th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Action</th>` : ''}
//           </tr>
//         </thead>

//         <tbody>
//           ${rows.map(row => `
//             <tr class="border-b border-white/5 hover:bg-white/5">
//               ${row.map(cell => `
//                 <td class="px-5 py-4 text-sm text-white/80">${cell}</td>
//               `).join('')}
//               ${showAction ? `
//                 <td class="px-5 py-4">
//                   <button class="text-red-400 hover:text-red-300 font-semibold text-sm">
//                     Edit
//                   </button>
//                 </td>
//               ` : ''}
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
      return await moviesPage();
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
  const movies = await getMovies();

  const revenue = adminData.bookings.reduce(
    (sum, booking) => sum + Number(booking.amount.replace('$', '')),
    0
  );

  return `
    ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      ${statCard('Total Users', users.length)}
      ${statCard('Movies', movies.length)}
      ${statCard('Bookings', adminData.bookings.length)}
      ${statCard('Revenue', '$' + revenue.toFixed(2))}
    </div>

    <div class="grid xl:grid-cols-2 gap-6">
      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
        <h2 class="text-xl font-bold mb-4">Latest Movies</h2>
        ${movies.length === 0 ? emptyBox('No movies added yet') : table(
          ['Movie', 'Genre', 'Rating', 'Status'],
          movies.slice(0, 5).map(m => [m.movieName, m.genre, m.rating, m.status]),
          false
        )}
      </div>

      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
        <h2 class="text-xl font-bold mb-4">Recent Bookings</h2>
        ${table(
          ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
          adminData.bookings.map(b => [b.id, b.movie, b.user, b.seats, b.amount, b.status]),
          false
        )}
      </div>
    </div>
  `;
}

async function usersPage() {
  const users = await getUsers();

  return `
    ${pageHeader('Users', 'Manage registered users')}

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
              <td colspan="6" class="px-5 py-6 text-center text-white/50">No users found</td>
            </tr>
          ` : users.map(user => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.id)}</td>
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.fullName)}</td>
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.gmail)}</td>
              <td class="px-5 py-4 text-sm text-white/80">${safe(user.phoneNumber)}</td>
              <td class="px-5 py-4 text-sm">
                ${roleBadge(user.role)}
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

async function moviesPage() {
  const movies = await getMovies();

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
  return await apiRequest('/api/admin/users', 'GET', null, true);
}

async function deleteUser(id) {
  return await apiRequest(`/api/admin/users/${id}`, 'DELETE', null, true);
}

async function getMovies() {
  return await apiRequest('/api/movies', 'GET', null, false);
}

async function addMovie(movieData) {
  return await apiRequest('/api/admin/movies', 'POST', movieData, true);
}

async function updateMovie(id, movieData) {
  return await apiRequest(`/api/admin/movies/${id}`, 'PUT', movieData, true);
}

async function deleteMovie(id) {
  return await apiRequest(`/api/admin/movies/${id}`, 'DELETE', null, true);
}

async function apiRequest(path, method = 'GET', body = null, auth = false) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (auth) {
    const token = localStorage.getItem('token');
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    throw new Error('Admin session expired. Please login again.');
  }

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (e) {
      try {
        message = await response.text();
      } catch (err) {}
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
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

      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        await deleteUser(id);
        alert('User deleted successfully');
        refreshAdminPage('users');
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    });
  });

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
          await updateMovie(movieId, movieData);
          alert('Movie updated successfully');
        } else {
          await addMovie(movieData);
          alert('Movie added successfully');
        }

        refreshAdminPage('movies');
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
        await deleteMovie(id);
        alert('Movie deleted successfully');
        refreshAdminPage('movies');
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

function refreshAdminPage(page) {
  setRoute(`/admin/${page}`);

  if (location.hash === `#/admin/${page}`) {
    adminPage(page);
  }
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
      ${subtitle ? `<p class="text-white/50 mt-2">${subtitle}</p>` : ''}
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
                <td class="px-5 py-4 text-sm text-white/80">${safe(cell)}</td>
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

function inputField(label, id, type, placeholder) {
  return `
    <div>
      <label class="block text-sm text-white/60 mb-2">${label}</label>
      <input 
        type="${type}" 
        id="${id}" 
        placeholder="${placeholder}"
        class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
      >
    </div>
  `;
}

function emptyBox(message) {
  return `
    <div class="text-center text-white/50 py-8">
      ${message}
    </div>
  `;
}

function roleBadge(role) {
  return `
    <span class="px-3 py-1 rounded-full text-xs font-bold ${
      role === 'ADMIN'
        ? 'bg-red-500/20 text-red-300'
        : 'bg-green-500/20 text-green-300'
    }">
      ${safe(role)}
    </span>
  `;
}

function statusBadge(status) {
  let styles = 'bg-white/10 text-white/70';

  if (status === 'NOW_SHOWING') {
    styles = 'bg-green-500/20 text-green-300';
  }

  if (status === 'NOT_SHOWING') {
    styles = 'bg-red-500/20 text-red-300';
  }

  if (status === 'COMING_SOON') {
    styles = 'bg-yellow-500/20 text-yellow-300';
  }

  return `
    <span class="px-3 py-1 rounded-full text-xs font-bold ${styles}">
      ${safe(status)}
    </span>
  `;
}

function safe(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function encodeAttr(value) {
  return safe(value);
}

function decodeAttr(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}