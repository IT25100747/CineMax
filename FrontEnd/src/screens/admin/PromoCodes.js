import { adminData, apiRequest, pageHeader, safe, statusBadge } from './adminUtils.js';

export async function promoCodesPage() {
  try {
    const promoCodes = await apiRequest('/api/promo-codes', 'GET', null, true);
    adminData.promoCodes = promoCodes; // Cache for edit

    let tableRows = promoCodes.map(p => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition">
        <td class="px-5 py-4 whitespace-nowrap text-white font-medium">${safe(p.code)}</td>
        <td class="px-5 py-4 whitespace-nowrap text-white/70">${p.discountPercentage}%</td>
        <td class="px-5 py-4 whitespace-nowrap text-white/70">${safe(p.expiryDate)}</td>
        <td class="px-5 py-4 whitespace-nowrap">${statusBadge(p.status)}</td>
        <td class="px-5 py-4 whitespace-nowrap text-white/70">${p.createdAt ? p.createdAt.slice(0, 10) : '-'}</td>
        <td class="px-5 py-4 whitespace-nowrap">
          <div class="flex gap-2">
            <button class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition" data-edit-promocode="${p.id}">Edit</button>
            <button class="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition" data-delete-promocode="${p.id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    if (promoCodes.length === 0) {
      tableRows = `<tr><td colspan="6" class="px-5 py-8 text-center text-white/50">No promo codes found</td></tr>`;
    }

    const tableHTML = `
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-white/10">
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Code</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Discount</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Expiry Date</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Status</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Created</th>
            <th class="px-5 py-4 text-xs uppercase tracking-wider text-white/40">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    return `
      ${pageHeader('Promo Codes', 'Manage discount codes and promotional offers')}
      
      <div class="mb-6 flex justify-end">
        <button id="addPromoCodeBtn" class="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Promo Code
        </button>
      </div>

      <div class="bg-[#0d0d14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div>
            <h2 class="text-xl font-bold text-white">All Promo Codes</h2>
            <p class="text-white/50 text-sm mt-1">${promoCodes.length} active/inactive codes</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          ${tableHTML}
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Promo Codes load error:", error);
    return `
      ${pageHeader('Promo Codes', 'Manage discount codes and promotional offers')}
      <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
        Failed to load promo codes.
      </div>
    `;
  }
}

export function bindPromoCodeEvents(refreshCallback) {
  const addBtn = document.getElementById('addPromoCodeBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      showPromoCodeModal(null, refreshCallback);
    });
  }

  document.querySelectorAll('[data-edit-promocode]').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-edit-promocode'));
      showPromoCodeModal(id, refreshCallback);
    });
  });

  document.querySelectorAll('[data-delete-promocode]').forEach(button => {
    button.addEventListener('click', async () => {
      const id = parseInt(button.getAttribute('data-delete-promocode'));
      if (!confirm('Are you sure you want to delete this promo code?')) return;
      try {
        await apiRequest(`/api/promo-codes/${id}`, 'DELETE', null, true);
        alert('Promo code deleted');
        refreshCallback('promoCodes');
      } catch (err) {
        alert(err.message || 'Delete failed');
      }
    });
  });
}

function showPromoCodeModal(id = null, refreshCallback) {
  const modalContainer = document.getElementById('modalContainer');
  let promo = null;
  if (id && adminData.promoCodes) {
    promo = adminData.promoCodes.find(p => p.id === id);
  }

  const isEditing = !!promo;
  
  const modalHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#15151a] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all scale-100 opacity-100">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-extrabold text-white">${isEditing ? 'Edit Promo Code' : 'New Promo Code'}</h2>
            <p class="text-white/50 text-sm mt-1">${isEditing ? 'Update existing discount' : 'Create a new discount offer'}</p>
          </div>
          <button id="closePromoModal" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form id="promoCodeForm" class="space-y-5">
          <input type="hidden" id="promoId" value="${isEditing ? promo.id : ''}">
          
          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Promo Code <span class="text-red-500">*</span></label>
            <input type="text" id="promoCodeStr" value="${isEditing ? safe(promo.code) : ''}" required class="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition uppercase" placeholder="e.g. SUMMER2026">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/70 mb-2">Discount (%) <span class="text-red-500">*</span></label>
              <input type="number" id="promoDiscount" value="${isEditing ? promo.discountPercentage : ''}" required min="1" max="100" class="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" placeholder="10">
            </div>
            <div>
              <label class="block text-sm font-medium text-white/70 mb-2">Status <span class="text-red-500">*</span></label>
              <select id="promoStatus" class="w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition appearance-none cursor-pointer">
                <option value="ACTIVE" ${isEditing && promo.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                <option value="INACTIVE" ${isEditing && promo.status === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/70 mb-2">Expiry Date <span class="text-red-500">*</span></label>
            <input type="date" id="promoExpiry" value="${isEditing && promo.expiryDate ? promo.expiryDate : ''}" required class="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder-white/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition [color-scheme:dark]">
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" id="cancelPromoModal" class="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" id="savePromoBtn" class="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center">
              ${isEditing ? 'Update Code' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHTML;

  const closeFn = () => { modalContainer.innerHTML = ''; };
  document.getElementById('closePromoModal').addEventListener('click', closeFn);
  document.getElementById('cancelPromoModal').addEventListener('click', closeFn);

  document.getElementById('promoCodeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('savePromoBtn');
    btn.disabled = true;
    btn.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...';

    const data = {
      code: document.getElementById('promoCodeStr').value.trim().toUpperCase(),
      discountPercentage: parseFloat(document.getElementById('promoDiscount').value),
      expiryDate: document.getElementById('promoExpiry').value,
      status: document.getElementById('promoStatus').value
    };

    try {
      if (isEditing) {
        await apiRequest(`/api/promo-codes/${promo.id}`, 'PUT', data, true);
        alert('Promo code updated successfully!');
      } else {
        await apiRequest('/api/promo-codes', 'POST', data, true);
        alert('Promo code created successfully!');
      }
      closeFn();
      refreshCallback('promoCodes');
    } catch (err) {
      alert(err.message || 'Failed to save promo code');
      btn.disabled = false;
      btn.textContent = isEditing ? 'Update Code' : 'Create Code';
    }
  });
}
