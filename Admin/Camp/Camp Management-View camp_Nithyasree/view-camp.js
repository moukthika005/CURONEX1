/* ==========================================================================
   VIEW CAMP DATA — table logic
   Replace CAMP_DATA with a real API response when the backend is ready.
   ========================================================================== */

const CAMP_DATA = [
  { id:'CMP-2025-00045', name:'Healthy Hearts Camp',      type:'Cardiology',    date:'May 28, 2025', city:'Pune',       status:'upcoming',  registrations:125 },
  { id:'CMP-2025-00044', name:'Diabetes Awareness Camp',  type:'General',       date:'May 20, 2025', city:'Nagpur',     status:'completed', registrations:210 },
  { id:'CMP-2025-00043', name:"Women's Health Camp",      type:'Gynecology',    date:'May 18, 2025', city:'Mumbai',     status:'completed', registrations:178 },
  { id:'CMP-2025-00042', name:'Eye Check-up Camp',        type:'Ophthalmology', date:'May 25, 2025', city:'Nashik',     status:'ongoing',   registrations:96  },
  { id:'CMP-2025-00041', name:'Child Health Camp',        type:'Pediatrics',    date:'Jun 02, 2025', city:'Aurangabad', status:'upcoming',  registrations:142 },
  { id:'CMP-2025-00040', name:'Dental Care Camp',         type:'Dentistry',     date:'May 15, 2025', city:'Thane',      status:'completed', registrations:160 },
  { id:'CMP-2025-00039', name:'Orthopedic Camp',          type:'Orthopedics',   date:'May 30, 2025', city:'Kolhapur',   status:'upcoming',  registrations:110 },
  { id:'CMP-2025-00038', name:'General Health Camp',      type:'General',       date:'May 12, 2025', city:'Solapur',    status:'completed', registrations:234 },
  { id:'CMP-2025-00037', name:'Skin Care Camp',           type:'Dermatology',   date:'May 22, 2025', city:'Pune',       status:'ongoing',   registrations:88  },
  { id:'CMP-2025-00036', name:'Blood Donation Camp',      type:'General',       date:'Jun 05, 2025', city:'Mumbai',     status:'upcoming',  registrations:75  },
];

const state = { search:'', status:'all', page:1, perPage:10 };

const tbody   = document.getElementById('campTableBody');
const showing = document.getElementById('showingText');
const pager   = document.getElementById('pagination');

function statusLabel(s){
  return s === 'upcoming' ? 'Upcoming' : s === 'ongoing' ? 'Ongoing' : 'Completed';
}

function getFiltered(){
  return CAMP_DATA.filter(c => {
    const matchesSearch = !state.search ||
      c.id.toLowerCase().includes(state.search) ||
      c.name.toLowerCase().includes(state.search);
    const matchesStatus = state.status === 'all' || c.status === state.status;
    return matchesSearch && matchesStatus;
  });
}

function render(){
  const filtered = getFiltered();
  const start = (state.page - 1) * state.perPage;
  const pageItems = filtered.slice(start, start + state.perPage);

  tbody.innerHTML = pageItems.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.type}</td>
      <td>${c.date}</td>
      <td>${c.city}</td>
      <td><span class="status-pill status-${c.status}">${statusLabel(c.status)}</span></td>
      <td>${c.registrations}</td>
      <td>
        <button class="view-btn" data-id="${c.id}" data-status="${c.status}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--c-secondary);">No camps found.</td></tr>`;

  const total = filtered.length;
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + state.perPage, total);
  showing.textContent = `Showing ${from} to ${to} of ${total} camps`;

  renderPagination(total);
  attachViewHandlers();
}

function renderPagination(total){
  const pageCount = Math.max(1, Math.ceil(total / state.perPage));
  let html = `<button data-nav="prev" ${state.page === 1 ? 'disabled' : ''}>&lsaquo;</button>`;
  for (let i = 1; i <= pageCount; i++) {
    html += `<button data-nav="${i}" class="${i === state.page ? 'active' : ''}">${i}</button>`;
  }
  html += `<button data-nav="next" ${state.page === pageCount ? 'disabled' : ''}>&rsaquo;</button>`;
  pager.innerHTML = html;

  pager.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = btn.getAttribute('data-nav');
      if (nav === 'prev') state.page = Math.max(1, state.page - 1);
      else if (nav === 'next') state.page = Math.min(pageCount, state.page + 1);
      else state.page = parseInt(nav, 10);
      render();
    });
  });
}

function attachViewHandlers(){
  tbody.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const status = btn.getAttribute('data-status');
      // Completed camps -> Camp Details & Report (with patient consultation history)
      // Upcoming / Ongoing camps -> Registered Patients page
      if (status === 'completed') {
        window.location.href = `camp-details-report.html?campId=${encodeURIComponent(id)}`;
      } else {
        window.location.href = `registered-patients.html?campId=${encodeURIComponent(id)}`;
      }
    });
  });
}

document.getElementById('campSearch').addEventListener('input', (e) => {
  state.search = e.target.value.trim().toLowerCase();
  state.page = 1;
  render();
});

document.getElementById('statusFilter').addEventListener('change', (e) => {
  state.status = e.target.value;
  state.page = 1;
  render();
});

document.getElementById('perPage').addEventListener('change', (e) => {
  state.perPage = parseInt(e.target.value, 10) || 10;
  state.page = 1;
  render();
});

render();
