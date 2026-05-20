import { adminData, apiRequest, pageHeader, statCard, emptyBox, table } from './adminUtils.js';

export async function dashboardPage() {
  const users = await apiRequest('/api/admin/users', 'GET', null, true);
  const movies = await apiRequest('/api/movies', 'GET', null, false);
  adminData.screenTimes = await apiRequest('/api/admin/screentimes', 'GET', null, true);

  let bookings = [];
  try {
    bookings = await apiRequest('/api/admin/bookings', 'GET', null, true);
    adminData.bookings = bookings;
  } catch (error) {
    console.error("Failed to load bookings for dashboard", error);
  }

  const revenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount || 0),
    0
  );

  return `
    ${pageHeader('Dashboard', 'Overview of CineMax booking system')}

    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      ${statCard('Total Users', users.length)}
      ${statCard('Movies', movies.length)}
      ${statCard('Screen Times', adminData.screenTimes.length)}
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
        ${bookings.length === 0 ? emptyBox('No bookings yet') : table(
          ['ID', 'Movie', 'User', 'Seats', 'Amount', 'Status'],
          bookings.slice(0, 5).map(b => [
            b.bookingReference || b.id, 
            b.movieName || '-', 
            b.customerName || 'Guest', 
            (b.seats && b.seats.length > 0) ? b.seats.join(', ') : '-', 
            b.totalAmount ? '$' + b.totalAmount.toFixed(2) : '$0.00', 
            b.status || '-'
          ]),
          false
        )}
      </div>
    </div>
  `;
}
