
  const appointments = [
    {
      hospital: "City Care Hospital", doctor: "Dr. Rajesh Kumar", spec: "Cardiologist",image:"images/Hospital.jpg",
      date: "20 May 2025", day: "Tuesday", time: "09:00 AM", status: "upcoming"
    },
    {
      hospital: "Hope Medical Center", doctor: "Dr. Arvind B", spec: "Orthopedic Surgeon",image:"images/Hospital1.jpg",
      date: "28 May 2025", day: "Wednesday", time: "02:00 PM", status: "upcoming"
    },
    {
      hospital: "City Care Hospital", doctor: "Dr. Rajesh Kumar", spec: "Cardiologist",image:"images/Hospital2.webp",
      date: "20 May 2025", day: "Tuesday", time: "09:00 AM", status: "upcoming"
    },
    {
      hospital: "Hope Medical Center", doctor: "Dr. Arvind B", spec: "Orthopedic Surgeon",image:"images/Hospital3.webp",
      date: "28 May 2025", day: "Wednesday", time: "02:00 PM", status: "upcoming"
    },
    {
      hospital: "City Care Hospital", doctor: "Dr. Rajesh Kumar", spec: "Cardiologist",
      date: "20 May 2025", day: "Tuesday", time: "09:00 AM", status: "upcoming"
    },
    {
      hospital: "Hope Medical Center", doctor: "Dr. Arvind B", spec: "Orthopedic Surgeon",
      date: "28 May 2025", day: "Wednesday", time: "02:00 PM", status: "upcoming"
    },
    {
      hospital: "City Care Hospital", doctor: "Dr. Rajesh Kumar", spec: "Cardiologist",image:"images/Hospital1.jpg",
      date: "05 May 2025", day: "Monday", time: "10:30 AM", status: "history"
    },
    {
      hospital: "Green Valley Hospital", doctor: "Dr. Meena S", spec: "Neurologist",image:"images/Hospital.jpg",
      date: "15 Apr 2025", day: "Tuesday", time: "11:00 AM", status: "history"
    },
    {
      hospital: "Life Line Multispeciality", doctor: "Dr. Priya Sharma", spec: "Pulmonologist",
      date: "02 Apr 2025", day: "Wednesday", time: "04:30 PM", status: "history"
    },
    {
      hospital: "City Care Hospital", doctor: "Dr. Priya Sharma", spec: "Pulmonologist",image:"images/Hospital.jpg",
      date: "10 May 2025", day: "Saturday", time: "03:00 PM", status: "cancelled"
    }
  ];

  const statusMeta = {
    upcoming:  { label: "Upcoming",  icon: "🕐", class: "upcoming" },
    history:   { label: "Completed", icon: "✔",  class: "completed" },
    cancelled: { label: "Cancelled", icon: "✕",  class: "cancelled" }
  };

  const sectionMeta = {
    upcoming:  { title: "Upcoming Appointments", sub: "Appointments you have scheduled ahead" },
    history:   { title: "Appointment History",   sub: "Your past completed appointments" },
    cancelled: { title: "Cancelled Appointments",sub: "Appointments that were cancelled" }
  };

  function renderList(tab) {
    const list = document.getElementById('appt-list');
    const items = appointments.filter(a => a.status === tab);

    document.getElementById('section-title').textContent = sectionMeta[tab].title;
    document.getElementById('section-sub').textContent = sectionMeta[tab].sub;

    if (items.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="ico">icon</div>
          <p>No ${tab} appointments to show.</p>
        </div>`;
      return;
    }

    list.innerHTML = items.map(a => {
      const s = statusMeta[a.status];
      return `
        <div class="appt-row">
          <img src="${a.image}" alt="hospital">
          <div class="appt-info">
            <h3>${a.hospital}</h3>
            <div class="doc">${a.doctor}</div>
            <div class="spec">${a.spec}</div>
          </div>
          <div class="appt-datetime">
            <div class="row"><span class="ico"></span> ${a.date}</div>
            <div class="sub">${a.day}</div>
            <div class="row"><span class="ico"></span> ${a.time}</div>
          </div>
          <div class="status ${s.class}">${s.icon} ${s.label}</div>
        </div>`;
    }).join('');
  }

  function updateCounts() {
    ['upcoming','history','cancelled'].forEach(tab => {
      const n = appointments.filter(a => a.status === tab).length;
      document.getElementById('count-' + tab).textContent = n;
    });
  }

  function setActiveTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(i => i.classList.toggle('active', i.dataset.tab === tab));
    document.querySelectorAll('.quick-card').forEach(i => i.classList.toggle('active-quick', i.dataset.quick === tab));
    renderList(tab);
  }

  document.querySelectorAll('.tab-btn').forEach(item => {
    item.addEventListener('click', () => setActiveTab(item.dataset.tab));
  });

  document.querySelectorAll('.quick-card').forEach(item => {
    item.addEventListener('click', () => setActiveTab(item.dataset.quick));
  });

  // Initial load: Upcoming shown first
  updateCounts();
  setActiveTab('upcoming');
