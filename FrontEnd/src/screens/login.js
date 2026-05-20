
import { renderLayout } from '../components/layout.js';
import { icon } from '../utils/helpers.js';
import { setRoute } from '../utils/router.js';

const API_BASE_URL = 'http://localhost:8080';

export function loginPage() {
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
          <h1 class="text-3xl font-bold">Welcome Back</h1>
          <p class="text-white/50 mt-2">Sign in to your account</p>
        </div>
        
        <form id="loginForm" class="space-y-5">
          <div>
            <label class="block text-sm text-white/60 mb-2">Email or Phone</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter email or phone number"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm text-white/60 mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password"
              class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 placeholder-white/30"
              required
            >
          </div>
          
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="remember" class="w-4 h-4 rounded bg-white/10 border-white/20 text-red-600 focus:ring-red-500">
              <span class="text-sm text-white/60">Remember me</span>
            </label>
            </div>
          
          <div id="loginError" class="hidden text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"></div>
          
          <button 
            type="submit" 
            id="loginBtn"
            class="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <p class="text-center text-white/50 text-sm mt-6">
          Don't have an account? 
          <button data-route="/register" class="text-red-400 hover:text-red-300 font-medium">Register</button>
        </p>
      </div>
    </div>
  </section>`;

  renderLayout(content);

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim(); // email OR phone
    const password = document.getElementById('password').value;

    const errorDiv = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    errorDiv.classList.add('hidden');

    if (!username || !password) {
      showError(errorDiv, 'Please fill in all fields');
      return;
    }

    try {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in...';
      loginBtn.classList.add('opacity-60', 'cursor-not-allowed');

     const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: username,
    password: password
  })
});

let data = null;

try {
  data = await response.json();
} catch (e) {
  data = {};
}

if (!response.ok) {
  throw new Error(data.message || "Invalid email/phone or password");
}

      // Save token
      

        if (data.token) {
          console.log('role is : '), data.role
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
  }

  if (data.role === 'ADMIN') {
    setRoute('/admin');
  } else {
    setRoute('/');
  }
  

    } catch (error) {
      showError(errorDiv, error.message || 'Invalid credentials');
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign In';
      loginBtn.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  });
}

function showError(errorDiv, message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}