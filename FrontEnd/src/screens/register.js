import { renderLayout } from '../components/layout.js';
import { icon } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';

const API_BASE_URL = 'http://localhost:8080';

export function registerPage() {
    console.log('Updated register page loaded');
  const content = `
  <section class="pt-24 pb-16 px-4 min-h-screen">
    <div class="max-w-md mx-auto">
      <button onclick="history.back()" class="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8">
        ${icon('arrow')} Back
      </button>
      
      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            ${icon('user', 'w-8 h-8 text-red-400')}
          </div>
          <h1 class="text-3xl font-bold">Create Account</h1>
          <p class="text-white/50 mt-2">Join CineMax today</p>
        </div>
        
        <form id="registerForm" class="space-y-4">
          <div>
            <label class="block text-sm text-white/60 mb-2">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              placeholder="Enter your full name"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm text-white/60 mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>

          <div>
            <label class="block text-sm text-white/60 mb-2">Mobile Number</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              placeholder="Enter your mobile number"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm text-white/60 mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Create a password"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm text-white/60 mb-2">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Confirm your password"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>
          
          <div id="registerError" class="hidden text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"></div>
          <div id="registerSuccess" class="hidden text-green-400 text-sm text-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl"></div>
          
          <button 
            type="submit" 
            id="registerBtn"
            class="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Create Account
          </button>
        </form>
        
        <p class="text-center text-white/50 text-sm mt-6">
          Already have an account? 
          <button data-route="/login" class="text-red-400 hover:text-red-300 font-medium">Sign In</button>
        </p>
      </div>
    </div>
  </section>`;

  renderLayout(content);

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    const registerBtn = document.getElementById('registerBtn');

    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      showError(errorDiv, 'Please fill in all fields');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showError(errorDiv, 'Please enter a valid email address');
      return;
    }

    if (phoneNumber.length < 10) {
      showError(errorDiv, 'Please enter a valid mobile number');
      return;
    }

    if (password.length < 6) {
      showError(errorDiv, 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showError(errorDiv, 'Passwords do not match');
      return;
    }

    try {
      registerBtn.disabled = true;
      registerBtn.textContent = 'Creating Account...';
      registerBtn.classList.add('opacity-60', 'cursor-not-allowed');

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName,
          gmail: email,
          phoneNumber: phoneNumber,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      successDiv.textContent = data.message || 'Account created successfully';
      successDiv.classList.remove('hidden');

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setTimeout(() => {
        setRoute('/login');
      }, 1000);

    } catch (error) {
      showError(errorDiv, error.message || 'Something went wrong');
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = 'Create Account';
      registerBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });
}

function showError(errorDiv, message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}