document.addEventListener("DOMContentLoaded", () => {
    requireLogin();
    const username = sessionStorage.getItem("curonex_username");

if (username) {
    document.querySelector(".username").textContent = username;
}
});

// ===== Sidebar Navigation =====
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== Tab Switching (Doctor / Hospital / Specialization) =====
const tabs = document.querySelectorAll('.tab');
const searchInput = document.querySelector('.search-input');

tabs.forEach(tab => {
  tab.addEventListener('click', function () {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const tabText = this.textContent.trim();
    if (tabText.includes('Doctor')) {
      searchInput.lastChild.textContent = "Search by doctor's name...";
    } else if (tabText.includes('Hospital')) {
      searchInput.lastChild.textContent = "Search by hospital name...";
    } else if (tabText.includes('Specialization')) {
      searchInput.lastChild.textContent = "Search by specialization...";
    }
  });
});

// ===== Live Search Filtering =====
const searchBox = document.getElementById('searchBox');
const hospitalCards = document.querySelectorAll('.hospital-grid .card');

function filterHospitals(query) {
  const term = query.trim().toLowerCase();
  let anyVisible = false;

  hospitalCards.forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    const loc = card.querySelector('.card-loc').textContent.toLowerCase();
    const desc = card.querySelector('.card-desc').textContent.toLowerCase();

    const matches = name.includes(term) || loc.includes(term) || desc.includes(term);
    card.classList.toggle('hidden', !matches);
    if (matches) anyVisible = true;
  });

  let noResultsMsg = document.querySelector('.no-results');
  if (!noResultsMsg) {
    noResultsMsg = document.createElement('p');
    noResultsMsg.className = 'no-results';
    noResultsMsg.textContent = 'No hospitals found matching your search.';
    document.querySelector('.hospital-grid').after(noResultsMsg);
  }
  noResultsMsg.style.display = (!anyVisible && term !== '') ? 'block' : 'none';
}

if (searchBox) {
  searchBox.addEventListener('input', function () {
    filterHospitals(this.value);
  });

  searchBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      filterHospitals(this.value);
    }
  });
}

const searchBtn = document.querySelector('.search-btn');
if (searchBtn && searchBox) {
  searchBtn.addEventListener("click", function () {

    const query = searchBox.value.trim();

    if (query === "") {

        alert("Please enter a hospital, doctor or specialization.");

        searchBox.focus();

        return;

    }

    filterHospitals(query);

    const visibleCard = document.querySelector(
        ".hospital-grid .card:not(.hidden)"
    );

    if (visibleCard) {

        const hospital =
            visibleCard.querySelector("h3").textContent;

        sessionStorage.setItem(
            "selectedHospital",
            hospital
        );

        setTimeout(() => {

            window.location.href =
            "../Profile_List_Page_Radha/profile_list.html";

        }, 500);

    }

});
}

// ===== Bell Notification Click =====
const bellWrap = document.querySelector('.bell-wrap');
if (bellWrap) {
  bellWrap.addEventListener('click', function () {
    alert('You have 2 new notifications.');
  });
}

// ===== User Dropdown =====
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

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!userWrap.contains(e.target)) {
      dropdownMenu.classList.remove('show');
      chevronIcon.classList.remove('rotated');
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) {
      logoutUser();
      // window.location.href = 'login.html';
    }
  });
}

// ===== Enter Key Triggers Search =====
if (searchInput) {
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && searchBtn) {
      searchBtn.click();
    }
  });
}
document.querySelectorAll(".hospital-grid .card").forEach(card => {

    card.addEventListener("click", function () {

        const hospital =
            this.querySelector("h3").textContent;

        sessionStorage.setItem(
            "selectedHospital",
            hospital
        );

    });

});
sessionStorage.setItem("appointmentFilter","history");
sessionStorage.setItem("appointmentFilter","upcoming");
sessionStorage.setItem("appointmentFilter","cancelled");