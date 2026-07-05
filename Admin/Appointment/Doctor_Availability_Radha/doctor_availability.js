requireLogin();

const username =
sessionStorage.getItem("curonex_username");

const hospitalName =
document.getElementById("hospitalName");

if(hospitalName && username){

    hospitalName.textContent =
    username;

}
// ===== Profile Dropdown (shared) =====
const userWrap = document.getElementById('userWrap');
const dropdownMenu = document.getElementById('dropdownMenu');
const chevronIcon = document.getElementById('chevronIcon');

if (userWrap && dropdownMenu) {
  userWrap.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    chevronIcon.classList.toggle('rotated');
  });
document
.getElementById("myProfileBtn")
.addEventListener("click",function(e){

    e.preventDefault();

    goToProfile();

});
  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to log out?')) {
      logoutUser();
    }
  });
}

// ===== Sidebar Navigation =====
document.querySelectorAll('.side-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.side-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    console.log(`Navigating to: ${this.textContent.trim()}`);
  });
});

// ===== Bell Notification =====
const bellWrap = document.querySelector('.bell-wrap');
if (bellWrap) {
  bellWrap.addEventListener('click', function () {
    alert('You have 2 new notifications.');
  });
}

// ===== View Blocked Slots =====
const viewBlockedBtn = document.getElementById('viewBlockedBtn');
if (viewBlockedBtn) {
  viewBlockedBtn.addEventListener('click', function () {
    alert('Opening list of all blocked slots across doctors...');
  });
}

// ===== Date Chip Selection (per card) =====
document.querySelectorAll('.date-scroller').forEach(scroller => {
  scroller.querySelectorAll('.date-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      scroller.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      console.log(`Date selected: ${this.textContent.trim()}`);
      // Real implementation: fetch and re-render slots for this doctor + date
    });
  });

  scroller.querySelectorAll('.date-arrow').forEach(arrow => {
    arrow.addEventListener('click', function () {
      const amount = this.classList.contains('prev') ? -120 : 120;
      scroller.scrollBy({ left: amount, behavior: 'smooth' });
    });
  });
});

// ===== Close all open slot dropdowns =====
function closeAllSlotDropdowns() {
  document.querySelectorAll('.slot-dropdown.show').forEach(d => d.classList.remove('show'));
}

// ===== Booked Slot Menu (Send Notification / Block Slot) =====
document.querySelectorAll('.slot-menu-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const dropdown = this.nextElementSibling;
    const isOpen = dropdown.classList.contains('show');
    closeAllSlotDropdowns();
    if (!isOpen) dropdown.classList.add('show');
  });
});

document.addEventListener('click', function () {
  closeAllSlotDropdowns();
});

// ===== Send Notification (booked slots only) =====
document.querySelectorAll('.notify-item').forEach(btn => {
  btn.addEventListener('click', function () {
    const slot = this.closest('.time-slot');
    const card = this.closest('.availability-card');
    const time = slot.dataset.time;
    const doctorName = card.dataset.doctorName;

    if (confirm(`Send a notification to the patient booked at ${time} that ${doctorName} will be unavailable?`)) {
      alert(`Notification sent via SMS and Email for the ${time} slot.`);
      sessionStorage.setItem(
    "lastNotification",
    doctorName + " - " + time
);
    }
    closeAllSlotDropdowns();
  });
});

// ===== Block Slot (from booked slot menu) =====
document.querySelectorAll('.slot-dropdown .block-item').forEach(btn => {
  btn.addEventListener('click', function () {
    const slot = this.closest('.time-slot');
    const time = slot.dataset.time;

    if (confirm(`Block the ${time} slot? This slot is currently booked — make sure the patient has been notified.`)) {
      convertSlotToBlocked(slot);
    }
    closeAllSlotDropdowns();
  });
});

// ===== Block Slot (directly from an available slot) =====
document.querySelectorAll('.slot-status-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const slot = this.closest('.time-slot');
    const time = slot.dataset.time;

    if (confirm(`Block the ${time} slot for emergency? It will no longer be visible for booking.`)) {
      convertSlotToBlocked(slot);
    }
  });
});

// ===== Helper: convert any slot into a Blocked slot =====
function convertSlotToBlocked(slot) {
  const blockedSlots =
JSON.parse(
    sessionStorage.getItem("blockedSlots")
) || [];

blockedSlots.push({

    doctor:
    slot.closest(".availability-card")
        .dataset.doctorName,

    time:
    slot.dataset.time

});

sessionStorage.setItem(
    "blockedSlots",
    JSON.stringify(blockedSlots)
);
  slot.className = 'time-slot blocked';
  slot.innerHTML = `
    <span class="slot-time">${slot.dataset.time}</span>
    <span class="slot-status-text">🔒 Blocked</span>
  `;
  console.log(`Slot ${slot.dataset.time} marked as blocked.`);
}

// ===== Search & Filter =====
const doctorSearchInput = document.getElementById('doctorSearchInput');
const specializationSelect = document.getElementById('specializationSelect');
const doctorSelect = document.getElementById('doctorSelect');

function applyFilters() {
  sessionStorage.setItem(
    "doctorSearch",
    searchTerm
);
  const specialty = specializationSelect.value;
  sessionStorage.setItem(
    "selectedDoctor",
    doctor
);

  document.querySelectorAll('.availability-card').forEach(card => {
    const name = card.dataset.doctorName;
    const cardSpecialty = card.dataset.specialty;

    const matchesSearch = !searchTerm ||
      name.toLowerCase().includes(searchTerm) ||
      cardSpecialty.toLowerCase().includes(searchTerm);
    const matchesSpecialty = !specialty || cardSpecialty === specialty;
    const matchesDoctor = !doctor || name === doctor;

    card.style.display = (matchesSearch && matchesSpecialty && matchesDoctor) ? 'grid' : 'none';
  });
}

if (doctorSearchInput) doctorSearchInput.addEventListener('input', applyFilters);
if (specializationSelect) specializationSelect.addEventListener('change', applyFilters);
if (doctorSelect) doctorSelect.addEventListener('change', applyFilters);