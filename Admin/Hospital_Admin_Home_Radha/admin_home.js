// ===== Sidebar Navigation =====
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    console.log(`Navigating to: ${this.textContent.trim()}`);
  });
});

// ===== Stat Card "View all" Links =====
document.querySelectorAll('.stat-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const label = this.closest('.stat-card').querySelector('.stat-label').textContent;
    alert(`Viewing all: ${label}`);
  });
});

// ===== Week Selector for Chart =====
const weekSelect = document.querySelector('.week-select');
if (weekSelect) {
  weekSelect.addEventListener('change', function () {
    console.log(`Loading chart data for: ${this.value}`);
    // Replace with real data-fetch + chart re-render logic
  });
}

// ===== Bell Notification Click =====
const bellWrap = document.querySelector('.bell-wrap');
if (bellWrap) {
  bellWrap.addEventListener('click', function () {
    alert('You have 2 new notifications.');
  });
}

// ===== Profile Dropdown =====
const userWrap = document.getElementById('userWrap');
const dropdownMenu = document.getElementById('dropdownMenu');
const chevronIcon = document.getElementById('chevronIcon');

if (userWrap && dropdownMenu) {
  userWrap.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    chevronIcon.classList.toggle('rotated');
  });

  document.addEventListener('click', function (e) {
    if (!userWrap.contains(e.target)) {
      dropdownMenu.classList.remove('show');
      chevronIcon.classList.remove('rotated');
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) {
      alert('Logged out successfully.');
    }
  });
}