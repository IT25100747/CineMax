import { apiRequest, pageHeader, safe, roleBadge } from './adminUtils.js';

export async function usersPage() {
  const users = await apiRequest('/api/admin/users', 'GET', null, true);

  return `
    ${pageHeader('User Management', 'Manage registered users')}

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

export function bindUserEvents(refreshCallback) {
  document.querySelectorAll('[data-delete-user]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-delete-user');

      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        await apiRequest(`/api/admin/users/${id}`, 'DELETE', null, true);
        alert('User deleted successfully');
        refreshCallback('users');
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    });
  });
}
