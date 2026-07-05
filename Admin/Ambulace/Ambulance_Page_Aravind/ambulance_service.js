

document.addEventListener('DOMContentLoaded', () => {
  requireLogin();

/* Logged in user */

const username =
sessionStorage.getItem("curonex_username");

if(username){

    document.getElementById("userName")
    .textContent=username;

    document.getElementById("userAvatar")
    .textContent=
    username.charAt(0).toUpperCase();

}
/* Profile */

document
.getElementById("myProfileBtn")
.addEventListener("click",(e)=>{

    e.preventDefault();

    goToProfile();

});

/* Logout */

document
.getElementById("logoutBtn")
.addEventListener("click",(e)=>{

    e.preventDefault();

    logoutUser();

});

  function showMessage(el, text, type = 'success', duration = 4000) {
    if (!el) return;
    el.textContent = (type === 'success' ? '✔ ' : '✕ ') + text;
    el.className = `field-msg show ${type}`;

    if (duration) {
      clearTimeout(el._hideTimer);
      el._hideTimer = setTimeout(() => {
        el.classList.remove('show');
      }, duration);
    }
  }

  const enableLocationBtn = document.querySelector('.btn-red');
  const locationText = document.querySelector('.location-text');
  const locationMsg = document.getElementById('location-msg');

  if (enableLocationBtn && locationText) {
    enableLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showMessage(locationMsg, 'Geolocation is not supported by your browser.', 'error');
        return;
      }

      enableLocationBtn.textContent = 'Locating...';
      enableLocationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sessionStorage.setItem(
"userLatitude",
latitude
);

sessionStorage.setItem(
"userLongitude",
longitude
);

          locationText.innerHTML = `
            <strong>Location Enabled</strong>
            <span>Showing hospitals near your current location</span>
          `;

          enableLocationBtn.textContent = 'Location Active';
          enableLocationBtn.style.background = 'var(--green, #2e7d32)';
          enableLocationBtn.disabled = true;

          showMessage(locationMsg, 'Location enabled successfully. Showing nearby hospitals.', 'success');

          console.log('User location:', latitude, longitude);
          // sortHospitalsByDistance(latitude, longitude);
        },
        (error) => {
          enableLocationBtn.textContent = 'Enable Location';
          enableLocationBtn.disabled = false;
          showMessage(locationMsg, 'Unable to fetch location. Please allow location access and try again.', 'error');
          console.error('Geolocation error:', error);
        }
      );
    });
  }

  const searchInput = document.querySelector('.search-bar input');
  const searchBtn = document.querySelector('.search-bar button');
  const searchMsg = document.getElementById('search-msg');
  const basedOnEl = document.querySelector('.based-on b');
  const hospitalCards = document.querySelectorAll('.hospital-card');

  function runSymptomSearch() {
    const query = searchInput.value.trim();
    sessionStorage.setItem(
"emergencySymptoms",
query
);

    if (!query) {
      showMessage(searchMsg, 'Please enter a symptom to search.', 'error');
      searchInput.style.borderColor = 'var(--red, #c62828)';
      setTimeout(() => { searchInput.style.borderColor = ''; }, 1500);
      return;
    }

    if (basedOnEl) {
      basedOnEl.textContent = query;
    }

    hospitalCards.forEach(card => {
      card.style.transition = 'box-shadow 0.3s ease';
      card.style.boxShadow = '0 0 0 2px var(--primary, #1976D2)';
      setTimeout(() => {
        card.style.boxShadow = '';
      }, 700);
    });

    showMessage(searchMsg, `Showing hospitals matching "${query}".`, 'success');

    console.log('Searching hospitals for symptom:', query);
    // fetchHospitalsBySymptom(query);
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', runSymptomSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        runSymptomSearch();
      }
    });
  }

  const tags = document.querySelectorAll('.tag');

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.textContent.trim();
        searchInput.focus();
      }
      runSymptomSearch();
    });
  });

  const warnBoxes = document.querySelectorAll('.status-box.warn');

  warnBoxes.forEach(box => {
    const notifyBtn = box.querySelector('button');
    const note = box.querySelector('.note');
    const hospitalCard = box.closest('.hospital-card');
    const hospitalName = hospitalCard
      ? hospitalCard.querySelector('.hosp-info h3').childNodes[0].textContent.trim()
      : 'this hospital';

    // Create a dedicated inline message element under the note
    const msgEl = document.createElement('div');
    msgEl.className = 'field-msg';
    box.appendChild(msgEl);

    if (notifyBtn) {
      notifyBtn.addEventListener('click', () => {
        notifyBtn.disabled = true;
        sessionStorage.setItem(
"hospitalNotification",
hospitalName
);
        notifyBtn.textContent = 'Notified ✔';
        notifyBtn.style.background = 'var(--green, #2e7d32)';

        if (note) {
          note.textContent = `We have notified ${hospitalName}. They will update availability shortly.`;
        }

        showMessage(msgEl, `Notification sent to ${hospitalName}.`, 'success');

        console.log(`Notification sent to ${hospitalName} about specialist requirement.`);
        // sendHospitalNotification(hospitalName);
      });
    }
  });

  const notifyAllBtn = document.querySelector('.notify-right button');
  const notifyAllMsg = document.getElementById('notify-all-msg');

  if (notifyAllBtn) {
    notifyAllBtn.addEventListener('click', () => {
      notifyAllBtn.disabled = true;
      notifyAllBtn.textContent = 'Notifying...';

      setTimeout(() => {
        notifyAllBtn.textContent = 'All Hospitals Notified ✔';
        notifyAllBtn.style.background = 'var(--green, #2e7d32)';

        showMessage(
          notifyAllMsg,
          'All nearby hospitals have been notified. We will contact you once a specialist becomes available.',
          'success',
          0 // 0 = do not auto-hide this one
        );

        console.log('Notify-all request sent to all nearby hospitals.');
        // notifyAllNearbyHospitals();
      }, 800);
    });
  }


  const directionButtons = document.querySelectorAll('.direction-btn');

  directionButtons.forEach(btn => {
    if (!btn.hasAttribute('onclick')) {
      const hospitalCard = btn.closest('.hospital-card');
      const hospitalName = hospitalCard
        ? hospitalCard.querySelector('.hosp-info h3').childNodes[0].textContent.trim()
        : '';

      btn.addEventListener('click', () => {
        const query = encodeURIComponent(hospitalName);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
      });
    }
  });


  const sideItems = document.querySelectorAll('.side-item');

  sideItems.forEach(item => {
    item.addEventListener('click', () => {
      sideItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
/* Save selected hospital */

document
.querySelectorAll(".hospital-card")
.forEach(card=>{

    card.addEventListener("click",()=>{

        const hospital=
        card.querySelector("h3")
        .childNodes[0]
        .textContent
        .trim();

        sessionStorage.setItem(
        "selectedHospital",
        hospital
        );

    });

});
});