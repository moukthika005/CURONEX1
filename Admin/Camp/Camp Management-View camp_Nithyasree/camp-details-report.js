/* ==========================================================================
   CAMP DETAILS & REPORT — shown for COMPLETED camps
   Reads ?campId=... from the URL. Replace mock data with real API calls.
   ========================================================================== */
requireLogin();

const username =
sessionStorage.getItem("curonex_username");

const profileName =
document.getElementById("profileName");

const avatar =
document.querySelector(".profile-avatar");

if(username){

    if(profileName)
        profileName.textContent=username;

    if(avatar)
        avatar.textContent=username.charAt(0).toUpperCase();

}
const urlParams = new URLSearchParams(window.location.search);
const campId = urlParams.get('campId') || 'CMP-2025-00045';
const selectedCamp =

sessionStorage.getItem(
"selectedCamp"
);

if(selectedCamp){

    document.getElementById(
    "infoCampId"
    ).textContent=selectedCamp;

}

const CAMP = {
  id: campId,
  name: 'Healthy Hearts Camp',
  doctor: 'Dr. Anil Verma (Cardiologist)',
  type: 'Cardiology',
  date: 'May 28, 2025',
  time: '09:00 AM - 03:00 PM',
  city: 'Bhopal',
  address: 'Community Health Center, Bhopal, Madhya Pradesh',
  totalRegistrations: 125,
  totalConsultations: 118,
  followUpCases: 23
};

document.getElementById('infoCampId').textContent = CAMP.id;
document.getElementById('infoCampName').textContent = CAMP.name;
document.getElementById('infoTotalPatients').textContent = CAMP.totalRegistrations;

const icon = (path) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

document.getElementById('campInfoList').innerHTML = `
  <li><span class="label">${icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>')} Doctor / Specialist</span><span class="value">${CAMP.doctor}</span></li>
  <li><span class="label">${icon('<circle cx="12" cy="12" r="10"/>')} Camp Type</span><span class="value">${CAMP.type}</span></li>
  <li><span class="label">${icon('<rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>')} Date</span><span class="value">${CAMP.date}</span></li>
  <li><span class="label">${icon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>')} Time</span><span class="value">${CAMP.time}</span></li>
  <li><span class="label">${icon('<path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>')} City</span><span class="value">${CAMP.city}</span></li>
  <li><span class="label">${icon('<path d="M9 20l-5.5 3V7L9 4l6 3 5.5-3v16L15 23z"/>')} Address</span><span class="value">${CAMP.address}</span></li>
  <li><span class="label">${icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>')} Total Registrations</span><span class="value">${CAMP.totalRegistrations}</span></li>
  <li><span class="label">${icon('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>')} Total Consultations</span><span class="value">${CAMP.totalConsultations}</span></li>
  <li><span class="label">${icon('<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>')} Follow-up Cases</span><span class="value">${CAMP.followUpCases}</span></li>
`;

/* ---------- Bar chart: patients by age group ---------- */
const AGE_DATA = [
  { label:'0-18',  value:5  },
  { label:'19-30', value:12 },
  { label:'31-45', value:28 },
  { label:'46-60', value:45 },
  { label:'60+',   value:35 },
];
const maxVal = Math.max(...AGE_DATA.map(d => d.value));
document.getElementById('ageChart').innerHTML = AGE_DATA.map(d => `
  <div class="bar-col">
    <span class="bar-value">${d.value}</span>
    <div class="bar" style="height:${(d.value / maxVal) * 100}%;"></div>
    <span class="bar-label">${d.label}</span>
  </div>
`).join('');

/* ---------- Pie chart: gender distribution ---------- */
const GENDER_DATA = [
  { label:'Male',   value:64, count:80, color:'#1976D2' },
  { label:'Female', value:36, count:45, color:'#C9DDF2' },
];
const gradientStops = (() => {
  let acc = 0;
  return GENDER_DATA.map(d => {
    const start = acc;
    acc += d.value;
    return `${d.color} ${start}% ${acc}%`;
  }).join(', ');
})();
document.getElementById('genderChart').innerHTML = `
  <div style="width:140px; height:140px; border-radius:50%; background:conic-gradient(${gradientStops});"></div>
`;
document.getElementById('genderLegend').innerHTML = GENDER_DATA.map(d => `
  <div class="legend-item">
    <span class="legend-swatch" style="background:${d.color};"></span>
    ${d.label} ${d.value}% (${d.count})
  </div>
`).join('');

/* ---------- Patient table ---------- */
const PATIENTS = [
  { name:'Rahul Sharma',  age:45, gender:'Male',   diagnosis:'Hypertension', doctor:'Dr. Anil Verma', followUp:true,  status:'Consulted' },
  { name:'Anita Deshmukh',age:38, gender:'Female', diagnosis:'Arrhythmia',   doctor:'Dr. Anil Verma', followUp:true,  status:'Consulted' },
  { name:'Suresh Patil',  age:52, gender:'Male',   diagnosis:'CAD',          doctor:'Dr. Anil Verma', followUp:false, status:'Consulted' },
  { name:'Priya Kulkarni',age:29, gender:'Female', diagnosis:'Palpitations',doctor:'Dr. Anil Verma', followUp:false, status:'Consulted' },
  { name:'Vijay More',    age:60, gender:'Male',   diagnosis:'Hypertension', doctor:'Dr. Anil Verma', followUp:true,  status:'Consulted' },
  { name:'Meena Joshi',   age:33, gender:'Female', diagnosis:'Anemia',       doctor:'Dr. Anil Verma', followUp:false, status:'Consulted' },
  { name:'Arun Khot',     age:41, gender:'Male',   diagnosis:'Chest Pain',   doctor:'Dr. Anil Verma', followUp:true,  status:'Consulted' },
  { name:'Neha Gaikwad',  age:26, gender:'Female', diagnosis:'Thyroid',      doctor:'Dr. Anil Verma', followUp:false, status:'Consulted' },
  { name:'Ramesh Jadhav', age:55, gender:'Male',   diagnosis:'Diabetes',     doctor:'Dr. Anil Verma', followUp:true,  status:'Consulted' },
  { name:'Pooja Shetty',  age:35, gender:'Female', diagnosis:'BP Elevated',  doctor:'Dr. Anil Verma', followUp:true,  status:'Consulted' },
];

const state = { page:1, perPage:10 };
const tbody   = document.getElementById('patientTableBody');
const showing = document.getElementById('showingText');
const pager   = document.getElementById('pagination');

function render(){
  const start = (state.page - 1) * state.perPage;
  const pageItems = PATIENTS.slice(start, start + state.perPage);

  tbody.innerHTML = pageItems.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.gender}</td>
      <td>${p.diagnosis}</td>
      <td>${p.doctor}</td>
      <td class="${p.followUp ? 'followup-yes' : 'followup-no'}">${p.followUp ? 'Yes' : 'No'}</td>
      <td><span class="status-pill">${p.status}</span></td>
    </tr>
  `).join('');

  const total = PATIENTS.length;
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + state.perPage, total);
  showing.textContent = `Showing ${from} to ${to} of ${total} patients`;

  renderPagination(total);
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

document.getElementById('perPage').addEventListener('change', (e) => {
  state.perPage = parseInt(e.target.value, 10) || 10;
  state.page = 1;
  render();
});

document.getElementById('downloadReportBtn').addEventListener('click', () => window.print());
document.getElementById('printReportBtn').addEventListener('click', () => window.print());
document.getElementById('exportExcelBtn').addEventListener('click', () => {
  alert('Export to Excel — connect this to your backend export endpoint.');
});

render();
document
.getElementById("myProfileBtn")
.addEventListener("click",(e)=>{

    e.preventDefault();

    goToProfile();

});

document
.getElementById("logoutBtn")
.addEventListener("click",(e)=>{

    e.preventDefault();

    logoutUser();

});