/* ==========================================================================
   REPORTS & ANALYTICS — aggregate view across all camps
   Replace the mock datasets with real API responses when the backend is ready.
   ========================================================================== */

/* ---------- Camps per month ---------- */
const MONTH_DATA = [
  { label:'Jan', value:3 }, { label:'Feb', value:4 }, { label:'Mar', value:5 },
  { label:'Apr', value:6 }, { label:'May', value:9 }, { label:'Jun', value:7 },
  { label:'Jul', value:5 }, { label:'Aug', value:4 }, { label:'Sep', value:3 },
  { label:'Oct', value:2 },
];
const monthMax = Math.max(...MONTH_DATA.map(d => d.value));
document.getElementById('monthChart').innerHTML = MONTH_DATA.map(d => `
  <div class="bar-col">
    <span class="bar-value">${d.value}</span>
    <div class="bar" style="height:${(d.value / monthMax) * 100}%;"></div>
    <span class="bar-label">${d.label}</span>
  </div>
`).join('');

/* ---------- Camp status breakdown (pie) ---------- */
const STATUS_DATA = [
  { label:'Completed', value:56, count:27, color:'#2E7D32' },
  { label:'Upcoming',  value:31, count:15, color:'#1976D2' },
  { label:'Ongoing',   value:13, count:6,  color:'#F5A623' },
];
const gradientStops = (() => {
  let acc = 0;
  return STATUS_DATA.map(d => {
    const start = acc;
    acc += d.value;
    return `${d.color} ${start}% ${acc}%`;
  }).join(', ');
})();
document.getElementById('statusChart').innerHTML =
  `<div style="width:150px; height:150px; border-radius:50%; background:conic-gradient(${gradientStops});"></div>`;
document.getElementById('statusLegend').innerHTML = STATUS_DATA.map(d => `
  <div class="legend-item">
    <span class="left"><span class="legend-swatch" style="background:${d.color};"></span>${d.label}</span>
    <span class="count">${d.value}% (${d.count})</span>
  </div>
`).join('');

/* ---------- Camps by specialization (horizontal bars) ---------- */
const SPEC_DATA = [
  { label:'General',       value:12 },
  { label:'Cardiology',    value:9  },
  { label:'Dentistry',     value:7  },
  { label:'Gynecology',    value:6  },
  { label:'Pediatrics',    value:5  },
  { label:'Ophthalmology', value:5  },
  { label:'Orthopedics',   value:4  },
];
renderHBar('specChart', SPEC_DATA);

/* ---------- Top cities by patients served ---------- */
const CITY_DATA = [
  { label:'Mumbai',    value:2840 },
  { label:'Pune',      value:2410 },
  { label:'Nagpur',    value:1980 },
  { label:'Nashik',    value:1520 },
  { label:'Thane',     value:1290 },
  { label:'Aurangabad',value:980  },
];
renderHBar('cityChart', CITY_DATA);

function renderHBar(elId, data) {
  const max = Math.max(...data.map(d => d.value));
  document.getElementById(elId).innerHTML = data.map(d => `
    <div class="hbar-row">
      <span class="hlabel">${d.label}</span>
      <div class="hbar-track"><div class="hbar-fill" style="width:${(d.value / max) * 100}%;"></div></div>
      <span class="hvalue">${d.value.toLocaleString()}</span>
    </div>
  `).join('');
}

/* ---------- Top performing camps table ---------- */
const TOP_CAMPS = [
  { name:'General Health Camp',     city:'Solapur', spec:'General',       patients:234, rate:96, rating:4.8 },
  { name:'Diabetes Awareness Camp', city:'Nagpur',  spec:'General',       patients:210, rate:94, rating:4.7 },
  { name:"Women's Health Camp",     city:'Mumbai',  spec:'Gynecology',    patients:178, rate:91, rating:4.6 },
  { name:'Dental Care Camp',        city:'Thane',   spec:'Dentistry',     patients:160, rate:89, rating:4.5 },
  { name:'Healthy Hearts Camp',     city:'Pune',    spec:'Cardiology',    patients:125, rate:94, rating:4.9 },
];
document.getElementById('topCampsBody').innerHTML = TOP_CAMPS.map(c => `
  <tr>
    <td>${c.name}</td>
    <td>${c.city}</td>
    <td>${c.spec}</td>
    <td>${c.patients}</td>
    <td>${c.rate}%</td>
    <td><span class="rating-pill">★ ${c.rating}</span></td>
  </tr>
`).join('');

/* ---------- Actions ---------- */
document.getElementById('exportBtn').addEventListener('click', () => {
  alert('Export report — connect this to your backend export endpoint.');
});
document.getElementById('rangeFilter').addEventListener('change', (e) => {
  // TODO: refetch aggregate data for the selected range and re-render charts
  console.log('Selected range (days):', e.target.value);
});
