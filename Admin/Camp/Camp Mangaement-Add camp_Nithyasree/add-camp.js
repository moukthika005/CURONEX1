/* ==========================================================================
   ADD CAMP — form handling
   Wire submitCamp() to your real API (POST /camps) when the backend is ready.
   ========================================================================== */
requireLogin();

const username =
sessionStorage.getItem(
"curonex_username"
);

const profileName =
document.getElementById(
"profileName"
);

const avatar =
document.querySelector(
".profile-avatar"
);

if(username){

    if(profileName){

        profileName.textContent =
        username;

    }

    if(avatar){

        avatar.textContent =
        username.charAt(0)
        .toUpperCase();

    }

}
const doctorSelect =
document.getElementById(
"campDoctor"
);

const doctors =
JSON.parse(
sessionStorage.getItem(
"doctorProfiles"
)
) || [];

if(doctorSelect && doctors.length){

    doctorSelect.innerHTML =
    '<option value="">Select doctor</option>';

    doctors.forEach(doc=>{

        const option =
        document.createElement("option");

        option.textContent =
        `${doc.name} — ${doc.specialty}`;

        doctorSelect.appendChild(option);

    });

}
const form = document.getElementById('addCampForm');
const uploadBox = document.getElementById('uploadBox');
const bannerInput = document.getElementById('bannerInput');
const uploadFilename = document.getElementById('uploadFilename');

// Drag & drop banner upload
['dragover', 'dragenter'].forEach(evt =>
  uploadBox.addEventListener(evt, (e) => { e.preventDefault(); uploadBox.classList.add('dragover'); })
);
['dragleave', 'drop'].forEach(evt =>
  uploadBox.addEventListener(evt, (e) => { e.preventDefault(); uploadBox.classList.remove('dragover'); })
);
uploadBox.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    bannerInput.files = e.dataTransfer.files;
    showFilename(file);
  }
});
bannerInput.addEventListener('change', () => {
  if (bannerInput.files[0]) showFilename(bannerInput.files[0]);
});
function showFilename(file) {
  uploadFilename.textContent = `Selected: ${file.name}`;
}

// Basic end-time-after-start-time check
function validateTimes() {
  const start = document.getElementById('campStartTime').value;
  const end = document.getElementById('campEndTime').value;
  if (start && end && end <= start) {
    alert('End time must be after start time.');
    return false;
  }
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  if (!validateTimes()) return;

  const payload = {
    name: document.getElementById('campName').value,
    type: document.getElementById('campType').value,
    doctor: document.getElementById('campDoctor').value,
    capacity: document.getElementById('campCapacity').value,
    date: document.getElementById('campDate').value,
    startTime: document.getElementById('campStartTime').value,
    endTime: document.getElementById('campEndTime').value,
    city: document.getElementById('campCity').value,
    address: document.getElementById('campAddress').value,
    description: document.getElementById('campDescription').value,
    banner: bannerInput.files[0] ? bannerInput.files[0].name : null
  };
  let camps =
JSON.parse(
sessionStorage.getItem(
"campData"
)
) || [];

camps.push(payload);

sessionStorage.setItem(
"campData",
JSON.stringify(camps)
);

sessionStorage.setItem(
"latestCamp",
JSON.stringify(payload)
);
sessionStorage.setItem(

"totalCamps",

camps.length

);
  submitCamp(payload);
});

function submitCamp(payload) {
  // TODO: replace with a real API call, e.g.
  // fetch('/api/camps', { method:'POST', body: JSON.stringify(payload), headers:{'Content-Type':'application/json'} })
  //   .then(res => res.json())
  //   .then(() => window.location.href = 'view-camp.html');
  console.log('New camp payload:', payload);
  alert(`Camp "${payload.name}" created successfully!`);
  window.location.href = 'view-camp.html';
}

document.getElementById('cancelBtn').addEventListener('click', () => {
  if (confirm('Discard this camp and go back to the dashboard?')) {
    window.location.href = 'dashboard.html';
  }
  document
.getElementById("myProfileBtn")
.addEventListener("click",function(e){

    e.preventDefault();

    goToProfile();

});

document
.getElementById("logoutBtn")
.addEventListener("click",function(e){

    e.preventDefault();

    logoutUser();

});
});
