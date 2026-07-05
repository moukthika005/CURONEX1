document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    const username = sessionStorage.getItem("curonex_username");

    if (username) {
        document.querySelector(".username").textContent = username;
    }

    const hospital = sessionStorage.getItem("selectedHospital");

    if (hospital) {

        document.querySelector(".search-banner strong").textContent = hospital;

    }

});
// ===== Sidebar Navigation =====
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== Favorite Heart Toggle =====
document.querySelectorAll('.heart').forEach(heart => {
  heart.addEventListener('click', function () {
    const isFavorited = this.classList.toggle('favorited');
    this.textContent = isFavorited ? '♥' : '♡';
    this.style.color = isFavorited ? '#D32F2F' : '#6B7280';
  });
});


// ===== Sort Dropdown =====
const sortSelect = document.querySelector('.sort-box select');
if (sortSelect) {
  sortSelect.addEventListener('change', function () {
    const sortValue = this.value;
    sortDoctors(sortValue);
  });
}

function sortDoctors(criteria) {
  const grid = document.querySelector('.doctor-grid');
  const cards = Array.from(grid.querySelectorAll('.doctor-card'));

  cards.sort((a, b) => {
    if (criteria === 'Rating: High to Low') {
      const ratingA = parseFloat(a.querySelector('.rating strong').textContent);
      const ratingB = parseFloat(b.querySelector('.rating strong').textContent);
      return ratingB - ratingA;
    }
    if (criteria === 'Experience: High to Low') {
      const expA = parseInt(a.querySelector('.exp').textContent);
      const expB = parseInt(b.querySelector('.exp').textContent);
      return expB - expA;
    }
    return 0; // Most Relevant (default order)
  });

  cards.forEach(card => grid.appendChild(card));
}

// ===== Pagination =====
document.querySelectorAll('.page-num').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.page-num').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const page = this.textContent;
    loadPage(page);
  });
});

document.querySelectorAll('.page-arrow').forEach((arrow, index) => {
  arrow.addEventListener('click', function () {
    const activePage = document.querySelector('.page-num.active');
    const pageNums = Array.from(document.querySelectorAll('.page-num'));
    const currentIndex = pageNums.indexOf(activePage);

    let nextIndex;
    if (index === 0) {
      // Previous arrow
      nextIndex = Math.max(0, currentIndex - 1);
    } else {
      // Next arrow
      nextIndex = Math.min(pageNums.length - 1, currentIndex + 1);
    }

    pageNums.forEach(p => p.classList.remove('active'));
    pageNums[nextIndex].classList.add('active');
    loadPage(pageNums[nextIndex].textContent);
  });
});

function loadPage(pageNumber) {
  console.log(`Loading page ${pageNumber}...`);
  // Replace with actual data fetch/render logic, e.g.:
  // fetchDoctors(pageNumber).then(renderDoctorGrid);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Bell Notification Click =====
const bellWrap = document.querySelector('.bell-wrap');
if (bellWrap) {
  bellWrap.addEventListener('click', function () {
    alert('You have 2 new notifications.');
  });
}

// ===== User Dropdown (avatar + chevron) =====
const userWrap = document.querySelector('.user-wrap');
if (userWrap) {
  userWrap.addEventListener('click', function () {
    //alert('User menu clicked (Profile / Settings / Logout)');
    // Replace with actual dropdown toggle UI
  });
}
document.querySelectorAll(".doctor-card").forEach(card => {

    const button = card.querySelector(".view-profile");

    button.addEventListener("click", function (e) {

        e.preventDefault();

        const doctorName =
            card.querySelector("h4").textContent;

        const specialization =
            card.querySelector(".specialty").textContent;

        sessionStorage.setItem("selectedDoctor", doctorName);

        sessionStorage.setItem("selectedSpecialization", specialization);

        window.location.href =
        "../Slot_Booking_Page_Radha/slot_booking.html";

    });

});
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(e){

        e.preventDefault();

        logoutUser();

    });

}
const profileBtn = document.getElementById("myProfileBtn");

if(profileBtn){

    profileBtn.addEventListener("click", function(e){

        e.preventDefault();

        goToProfile();

    });

}
sessionStorage.setItem(
    "appointmentFilter",
    "history"
);
sessionStorage.setItem(
    "appointmentFilter",
    "cancelled"
);