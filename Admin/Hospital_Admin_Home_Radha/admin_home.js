// ===== Sidebar Navigation =====
document.addEventListener("DOMContentLoaded", () => {

    requireLogin();
    /* ===========================
ICU Availability
=========================== */

const availableBeds =
sessionStorage.getItem("icuBeds");

if(availableBeds){

    const value =
    document.querySelector(".donut-value");

    if(value){

        value.textContent =
        availableBeds;

    }

}
/* ===========================
Today's Appointments
=========================== */

const appointments =
JSON.parse(
sessionStorage.getItem(
"todayAppointments"
)
)||[];

const appointmentCard =
document.querySelectorAll(
".stat-value"
)[0];

if(appointmentCard){

    appointmentCard.textContent =
    appointments.length;

}

    /* Logged in hospital */

    const username =
    sessionStorage.getItem("curonex_username");

    if(username){

        const hospitalName =
        document.getElementById("hospitalName");

        if(hospitalName){

            hospitalName.textContent =
            username;

        }

    }
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    const routes={

"Create Doctor Profile":
"../Appointment/Doctor_Profiles_Radha/doctor_profile.html",

"Update Doctor Availability":
"../Appointment/Doctor_Availability_Radha/doctor_availability.html",

"Update ICU Bed Availability":
"../Appointment/ICU_Availability_Radha/icu_availability.html",

"Show Previous Appointments":
"../Appointment/Prev_Appointments_Radha/prev_appointments.html",

"Camp Management":
"../Camp/Camp Management- Dashboard_Nithyasree/dashboard.html",

"Resource Management":
"../Resource/Inventory Management_S Gokulakrishnan/Ilp2.0/resource-availability.html"

};

const label=
this.textContent.trim();

if(routes[label]){

window.location.href=
routes[label];

}
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
      logoutUser();
    }
  });
}
document
.getElementById("myProfileBtn")
.addEventListener("click",function(e){

    e.preventDefault();

    goToProfile();

});
});