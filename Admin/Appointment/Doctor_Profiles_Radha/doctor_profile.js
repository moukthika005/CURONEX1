// ===== Sidebar Navigation =====
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    console.log(`Navigating to: ${this.textContent.trim()}`);
  });
});

// ===== Add Doctor Button (toggle form) =====
const addDoctorBtn = document.getElementById('addDoctorBtn');
const emptyStateBox = document.getElementById('emptyStateBox');
const doctorFormCard = document.getElementById('doctorFormCard');
const addDoctorForm = document.getElementById('addDoctorForm');
const cancelDoctorBtn = document.getElementById('cancelDoctorBtn');

if (addDoctorBtn) {
  addDoctorBtn.addEventListener('click', function () {
    emptyStateBox.style.display = 'none';
    doctorFormCard.style.display = 'block';
  });
}

if (cancelDoctorBtn) {
  cancelDoctorBtn.addEventListener('click', function () {
    addDoctorForm.reset();
    doctorFormCard.style.display = 'none';
    emptyStateBox.style.display = 'flex';
  });
}

// ===== Add Doctor Form Submit =====
if (addDoctorForm) {
  addDoctorForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('doctorName').value.trim();
    const specialty = document.getElementById('doctorSpecialty').value.trim();
    const experience = document.getElementById('doctorExperience').value.trim();
    const qualification = document.getElementById('doctorQualification').value.trim();

    if (!name || !specialty || !experience) {
      alert('Please fill in Name, Specialization, and Years of Experience.');
      return;
    }

    const grid = document.getElementById('doctorsGrid');

    const card = document.createElement('div');
    card.className = 'doctor-row-card';
    card.innerHTML = `
      <img class="doctor-thumb" src="https://i.pravatar.cc/150?u=${encodeURIComponent(name)}" alt="${name}">
      <div class="doctor-details">
        <h4>${name}</h4>
        <p class="specialty">${specialty}</p>
        <p class="exp">🗂 ${experience} Years Experience</p>
        <p class="qual">${qualification || 'Not specified'}</p>
      </div>
      <button class="delete-btn">🗑️</button>
    `;

    grid.prepend(card);

    // Re-attach delete listener to the new card
    card.querySelector('.delete-btn').addEventListener('click', function () {
      const doctorName = card.querySelector('h4').textContent;
      if (confirm(`Are you sure you want to delete ${doctorName}'s profile?`)) {
        card.remove();
        console.log(`${doctorName} deleted.`);
      }
    });

    addDoctorForm.reset();
    doctorFormCard.style.display = 'none';
    emptyStateBox.style.display = 'flex';
  });
}

// ===== Sort Dropdown =====
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
  sortSelect.addEventListener('change', function () {
    sortDoctors(this.value);
  });
}

function sortDoctors(criteria) {
  const grid = document.getElementById('doctorsGrid');
  const cards = Array.from(grid.querySelectorAll('.doctor-row-card'));

  function getExperience(card) {
    const text = card.querySelector('.exp').textContent;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  cards.sort((a, b) => {
    if (criteria === 'Experience (High to Low)') return getExperience(b) - getExperience(a);
    if (criteria === 'Experience (Low to High)') return getExperience(a) - getExperience(b);
    if (criteria === 'Specialization (A-Z)') {
      const specA = a.querySelector('.specialty').textContent;
      const specB = b.querySelector('.specialty').textContent;
      return specA.localeCompare(specB);
    }
    return 0;
  });

  cards.forEach(card => grid.appendChild(card));
}

// ===== Filter Button =====
const filterBtn = document.querySelector('.filter-btn');
if (filterBtn) {
  filterBtn.addEventListener('click', function () {
    alert('Opening filter options (by specialty, experience, etc.)...');
  });
}

// ===== Delete Doctor =====
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const card = this.closest('.doctor-row-card');
    const doctorName = card.querySelector('h4').textContent;

    if (confirm(`Are you sure you want to delete ${doctorName}'s profile?`)) {
      card.remove();
      console.log(`${doctorName} deleted.`);
    }
  });
});

// ===== Pagination =====
document.querySelectorAll('.page-num').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.page-num').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    loadPage(this.textContent);
  });
});

document.querySelectorAll('.page-arrow').forEach((arrow, index) => {
  arrow.addEventListener('click', function () {
    const activePage = document.querySelector('.page-num.active');
    const pageNums = Array.from(document.querySelectorAll('.page-num'));
    const currentIndex = pageNums.indexOf(activePage);

    let nextIndex;
    if (index === 0) {
      nextIndex = Math.max(0, currentIndex - 1);
    } else {
      nextIndex = Math.min(pageNums.length - 1, currentIndex + 1);
    }

    pageNums.forEach(p => p.classList.remove('active'));
    pageNums[nextIndex].classList.add('active');
    loadPage(pageNums[nextIndex].textContent);
  });
});

function loadPage(pageNumber) {
  console.log(`Loading doctors page ${pageNumber}...`);
  // fetchDoctors(pageNumber).then(renderDoctorsGrid);
  window.scrollTo({ top: 0, behavior: 'smooth' });
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