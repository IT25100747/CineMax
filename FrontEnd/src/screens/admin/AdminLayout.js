import { Sidebar } from './Sidebar.js';

export function AdminLayout(activePage, pageContent) {
  return `
    <section class="min-h-screen pt-20 bg-[#08080d] text-white">
      <div class="grid lg:grid-cols-[260px_1fr] min-h-screen">
        ${Sidebar(activePage)}

        <main class="p-6 md:p-10">
          ${pageContent}
        </main>
      </div>
    </section>

    <!-- Modal Container -->
    <div id="modalContainer"></div>
  `;
}
