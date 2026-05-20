export const API_BASE_URL = 'http://localhost:8080';

export const adminData = {
  bookings: [],
  halls: [
    { hall: 'Hall A', capacity: 100, available: 42, status: 'Open' },
    { hall: 'Hall B', capacity: 120, available: 78, status: 'Open' },
    { hall: 'Hall C', capacity: 80, available: 18, status: 'Maintenance' }
  ],
  screenTimes: [],
  promoCodes: []
};

export async function apiRequest(path, method = 'GET', body = null, auth = false) {
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

export function safe(value) {
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

export function encodeAttr(value) {
  return safe(value);
}

export function decodeAttr(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

export function pageHeader(title, subtitle) {
  return `
    <div class="mb-8">
      <h1 class="text-4xl font-black">${title}</h1>
      ${subtitle ? `<p class="text-white/50 mt-2">${subtitle}</p>` : ''}
    </div>
  `;
}

export function statCard(title, value) {
  return `
    <div class="bg-[#0d0d14] border border-white/10 rounded-2xl p-6">
      <p class="text-white/50 text-sm">${title}</p>
      <h3 class="text-3xl font-black mt-2">${value}</h3>
    </div>
  `;
}

export function table(headers, rows, showAction = true) {
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

export function inputField(label, id, type, placeholder) {
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

export function emptyBox(message) {
  return `
    <div class="text-center text-white/50 py-8">
      ${message}
    </div>
  `;
}

export function roleBadge(role) {
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

export function statusBadge(status) {
  let styles = 'bg-white/10 text-white/70';

  if (status === 'NOW_SHOWING' || status === 'ACTIVE') {
    styles = 'bg-green-500/20 text-green-300';
  }

  if (status === 'NOT_SHOWING' || status === 'INACTIVE' || status === 'CANCELLED') {
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
