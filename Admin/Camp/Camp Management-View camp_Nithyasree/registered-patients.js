/* ==========================================================================
   REGISTERED PATIENTS — shown for UPCOMING / ONGOING camps
   Reads ?campId=... from the URL (set by view-camp.js) to know which camp
   to load. Replace PATIENT_DATA with a real API call keyed by campId.
   ========================================================================== */

const urlParams = new URLSearchParams(window.location.search);
const campId = urlParams.get('campId') || 'CMP-2025-00045';

// Mock camp header info — in production, fetch by campId
const CAMP_INFO = {
  id: campId,
  name: 'Healthy Hearts Camp',
  totalRegistrations: 125,
  availableSlots: 75
};

document.getElementById('infoCampId').textContent = CAMP_INFO.id;
document.getElementById('infoCampName').textContent = CAMP_INFO.name;
document.getElementById('infoTotalReg').textContent = CAMP_INFO.totalRegistrations;
document.getElementById('infoSlots').textContent = CAMP_INFO.availableSlots;

const PATIENT_DATA = [
  { regId:'REG-2025-00125', name:'Rahul Sharma',  age:45, gender:'Male',   phone:'9876543210', date:'May 28, 2025 09:15 AM', status:'registered' },
  { regId:'REG-2025-00124', name:'Anita Deshmukh',age:38, gender:'Female', phone:'9765432109', date:'May 28, 2025 09:05 AM', status:'registered' },
  { regId:'REG-2025-00123', name:'Suresh Patil',  age:52, gender:'Male',   phone:'9654321098', date:'May 28, 2025 08:58 AM', status:'pending' },
  { regId:'REG-2025-00122', name:'Priya Kulkarni',age:29, gender:'Female', phone:'9543210987', date:'May 27, 2025 05:40 PM', status:'registered' },
  { regId:'REG-2025-00121', name:'Vijay More',    age:60, gender:'Male',   phone:'9432109876', date:'May 27, 2025 04:22 PM', status:'pending' },
  { regId:'REG-2025-00120', name:'Meena Joshi',   age:33, gender:'Female', phone:'9321098765', date:'May 27, 2025 03:18 PM', status:'registered' },
  { regId:'REG-2025-00119', name:'Arun Khot',     age:41, gender:'Male',   phone:'9210987654', date:'May 27, 2025 02:47 PM', status:'pending' },
  { regId:'REG-2025-00118', name:'Neha Gaikwad',  age:26, gender:'Female', phone:'9109876543', date:'May 27, 2025 01:33 PM', status:'registered' },
  { regId:'REG-2025-00117', name:'Ramesh Jadhav', age:55, gender:'Male',   phone:'9008765432', date:'May 27, 2025 12:05 PM', status:'pending' },
  { regId:'REG-2025-00116', name:'Pooja Shetty',  age:35, gender:'Female', phone:'8897654321', date:'May 27, 2025 11:22 AM', status:'registered' },
];

const state = { search:'', status:'all', page:1, perPage:10 };

const tbody   = document.getElementById('patientTableBody');
const showing = document.getElementById('showingText');
const pager   = document.getElementById('pagination');

function statusLabel(s){ return s === 'registered' ? 'Registered' : 'Pending'; }

function getFiltered(){
  return PATIENT_DATA.filter(p => {
    const matchesSearch = !state.search ||
      p.name.toLowerCase().includes(state.search) ||
      p.regId.toLowerCase().includes(state.search);
    const matchesStatus = state.status === 'all' || p.status === state.status;
    return matchesSearch && matchesStatus;
  });
}

function render(){
  const filtered = getFiltered();
  const start = (state.page - 1) * state.perPage;
  const pageItems = filtered.slice(start, start + state.perPage);

  tbody.innerHTML = pageItems.map(p => `
    <tr>
      <td>${p.regId}</td>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.gender}</td>
      <td>${p.phone}</td>
      <td>${p.date}</td>
      <td><span class="status-pill status-${p.status}">${statusLabel(p.status)}</span></td>
      <td>
        <button class="view-btn" data-reg="${p.regId}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--c-secondary);">No patients found.</td></tr>`;

  const total = filtered.length;
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + state.perPage, total);
  showing.textContent = `Showing ${from} to ${to} of ${total} patients`;

  renderPagination(total);

  tbody.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Hook this up to a patient-detail modal/page when ready
      alert(`Patient detail view for ${btn.getAttribute('data-reg')} — connect to patient detail page.`);
    });
  });
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

document.getElementById('patientSearch').addEventListener('input', (e) => {
  state.search = e.target.value.trim().toLowerCase();
  state.page = 1;
  render();
});
document.getElementById('regStatusFilter').addEventListener('change', (e) => {
  state.status = e.target.value;
  state.page = 1;
  render();
});
document.getElementById('perPage').addEventListener('change', (e) => {
  state.perPage = parseInt(e.target.value, 10) || 10;
  state.page = 1;
  render();
});
document.getElementById('downloadExcelBtn').addEventListener('click', () => {
  // Hook up to a real export (e.g. SheetJS) when wiring the backend
  alert('Export to Excel — connect this to your backend export endpoint.');
});

render();
