document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    const username = sessionStorage.getItem("curonex_username");

    if (username) {
        document.querySelector(".username").textContent = username;
    }

    const doctor = sessionStorage.getItem("selectedDoctor");
    const speciality = sessionStorage.getItem("selectedSpecialization");

    if (doctor) {
        document.querySelector(".doctor-info h3").innerHTML =
            doctor + ' <span class="verified">✔</span>';
    }

    if (speciality) {
        document.querySelector(".specialty").textContent = speciality;
    }

}); 
// ===== Sidebar Navigation =====
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ===== Global selection tracker (only ONE slot allowed across all hospitals) =====
let currentSelection = null; // { card, hospital, date, timeBox, time }

const confirmBtn = document.getElementById('confirmBookingBtn');
const cancelBtn = document.getElementById('cancelBookingBtn');

function updateConfirmState() {
  confirmBtn.disabled = currentSelection === null;
}

function clearAllSelections() {
  document.querySelectorAll('.time-box.selected').forEach(box => box.classList.remove('selected'));
  document.querySelectorAll('.hospital-slot-card').forEach(card => card.classList.remove('has-selection'));
  currentSelection = null;
  updateConfirmState();
}

// ===== Date Selection (per hospital card) =====
document.querySelectorAll('.hospital-slot-card').forEach(card => {
  const dateBoxes = card.querySelectorAll('.date-box');
  dateBoxes.forEach(box => {
    box.addEventListener('click', function () {
      dateBoxes.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // If this card currently holds the global selection, clear it (date changed)
      if (currentSelection && currentSelection.card === card) {
        clearAllSelections();
      }
    });
  });
});

// ===== Time Slot Selection (ONLY ONE slot allowed globally) =====
document.querySelectorAll('.hospital-slot-card').forEach(card => {
  const hospitalName = card.getAttribute('data-hospital');
  const timeBoxes = card.querySelectorAll('.time-box:not(.booked)');

  timeBoxes.forEach(box => {
    box.addEventListener('click', function () {
      // Clear any existing selection (in this card or any other card)
      document.querySelectorAll('.time-box.selected').forEach(b => b.classList.remove('selected'));
      document.querySelectorAll('.hospital-slot-card').forEach(c => c.classList.remove('has-selection'));

      // Apply new selection
      this.classList.add('selected');
      card.classList.add('has-selection');

      const selectedDate = card.querySelector('.date-box.active')?.textContent.trim().replace(/\s+/g, ' ');

      currentSelection = {
        card: card,
        hospital: hospitalName,
        date: selectedDate,
        timeBox: this,
        time: this.textContent.trim()
      };

      updateConfirmState();
    });
  });
});

// ===== Date Row Arrows (prev/next) =====
document.querySelectorAll('.date-row').forEach(row => {
  const arrows = row.querySelectorAll('.arrow');
  arrows[0].addEventListener('click', function () {
    console.log('Loading earlier dates...');
  });
  arrows[1].addEventListener('click', function () {
    console.log('Loading later dates...');
  });
});

// ===== Confirm Appointment Button =====
confirmBtn.addEventListener('click', function () {

  if (!currentSelection) {
    alert('Please select a time slot before confirming.');
    return;
  }
  if(!currentSelection.date || !currentSelection.time){

    alert("Please select both a date and a time slot.");

    return;

}
    sessionStorage.setItem(
    "selectedHospital",
    currentSelection.hospital
);

sessionStorage.setItem(
    "selectedDate",
    currentSelection.date
);

sessionStorage.setItem(
    "selectedTime",
    currentSelection.time
);
window.location.href =
"../Appointment_Cofirmation_Aravind/appoinment_confirm.html";

 
});

// ===== Cancel Button =====
cancelBtn.addEventListener('click', function () {
  if (!currentSelection) {
    alert('No slot is currently selected.');
    return;
  }

  if (confirm('Are you sure you want to cancel this slot selection?')) {
    clearAllSelections();
  }
});

// Initialize confirm button state on page load
updateConfirmState();

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
      // window.location.href = 'login.html';
    }
  });
}
document.getElementById("myProfileBtn").addEventListener("click", function(e){

    e.preventDefault();

    goToProfile();

});