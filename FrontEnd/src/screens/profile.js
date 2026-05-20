const API_BASE_URL = 'http://localhost:8080';
import { icon } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';

export async function profilePage() {
  const token = localStorage.getItem('token');
  if (!token) {
    setRoute('/login');
    return '';
  }

  let userProfile = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load profile');
    userProfile = await res.json();
  } catch (error) {
    console.error(error);
    return `<div class="max-w-3xl mx-auto px-4 py-24 text-red-500 font-bold">Error loading profile data.</div>`;
  }

  const content = `
    <div class="max-w-3xl mx-auto px-4 py-24">
      <div class="mb-6">
        <button id="backToHomeBtn" class="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Home
        </button>
      </div>
      <div class="bg-[#15151a] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-600/20">
            ${userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 class="text-2xl font-extrabold text-white">My Profile</h1>
            <p class="text-white/50 text-sm">Manage your account information and password</p>
          </div>
        </div>

        <form id="profileForm" class="space-y-6">
          <div id="profileMessage" class="hidden px-4 py-3 rounded-xl text-sm font-medium"></div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm text-white/60 mb-2">Full Name</label>
              <input type="text" id="fullName" value="${userProfile.fullName || ''}" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" required>
            </div>
            <div>
              <label class="block text-sm text-white/60 mb-2">Mobile Number</label>
              <input type="tel" id="phoneNumber" value="${userProfile.phoneNumber || ''}" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" required>
            </div>
          </div>

          <div>
            <label class="block text-sm text-white/60 mb-2">Email Address (Gmail)</label>
            <input type="email" id="gmail" value="${userProfile.gmail || ''}" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" required>
          </div>

          <div class="pt-6 border-t border-white/10">
            <h3 class="font-bold text-white mb-4">Change Password (Optional)</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm text-white/60 mb-2">Current Password</label>
                <input type="password" id="currentPassword" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" placeholder="Enter current password">
              </div>
              <div>
                <label class="block text-sm text-white/60 mb-2">New Password</label>
                <input type="password" id="newPassword" class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 transition-colors" placeholder="Enter new password">
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
            <button type="button" id="deleteAccountBtn" class="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-600 border border-red-500/50 px-6 py-3 rounded-xl font-bold transition-colors">
              Delete Account
            </button>
            <button type="submit" id="updateProfileBtn" class="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-colors">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = content;

  // Back button
  document.getElementById('backToHomeBtn').addEventListener('click', () => {
    setRoute('/');
  });

  // Form submission
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('updateProfileBtn');
    const msg = document.getElementById('profileMessage');
    btn.disabled = true;
    btn.textContent = 'Updating...';
    msg.classList.add('hidden');

    try {
      // 1. Update Profile Details
      const profileData = {
        fullName: document.getElementById('fullName').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        gmail: document.getElementById('gmail').value.trim(),
      };

      const resProfile = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!resProfile.ok) throw new Error(await resProfile.text() || 'Failed to update profile');

      // 2. Update Password if fields are filled
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;

      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          throw new Error('Both current and new passwords are required to change password.');
        }

        const resPass = await fetch(`${API_BASE_URL}/api/users/profile/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });

        if (!resPass.ok) {
          // Parse clean JSON error from backend
          const errData = await resPass.json().catch(() => null);
          const errMsg = errData?.error || '';
          // Map known backend messages to user-friendly text
          if (errMsg.toLowerCase().includes('incorrect') || errMsg.toLowerCase().includes('password')) {
            throw new Error('Entered current password is incorrect');
          }
          throw new Error(errMsg || 'Failed to update password');
        }
        
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
      }

      msg.textContent = 'Profile updated successfully!';
      msg.className = 'bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-3 rounded-xl text-sm font-medium mb-6 block';
      
    } catch (error) {
      msg.textContent = error.message;
      msg.className = 'bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl text-sm font-medium mb-6 block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Update Profile';
    }
  });

  // Delete Account
  document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete account');
      
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userRole');
      window.location.hash = '#/';
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });
}
