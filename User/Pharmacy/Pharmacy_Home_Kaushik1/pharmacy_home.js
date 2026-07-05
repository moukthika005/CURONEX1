// ============================================================
// pharmacy.js — Curonex Pharmacy Page Interactions
// Link via: <script src="./pharmacy.js" defer></script>
// (No HTML changes required — all elements are selected via
//  existing classes, and the file input is injected at runtime.)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  requireLogin();

// Display logged-in username
const username = sessionStorage.getItem("curonex_username");

if (username) {
    document.querySelector(".user-name").textContent = username;
}

  /* ---------------------------------------------------------
     1. FILE UPLOAD (Choose File / drag-drop / validation)
  --------------------------------------------------------- */
  const uploadBox     = document.querySelector('.upload-box');
  const chooseFileBtn = document.querySelector('.choose-file');
  const supportText   = document.querySelector('.support-text');
  const placeOrderBtn = document.querySelector('.place-order');
  const placeOrderNote = document.querySelector('.place-order-note');

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  const MAX_SIZE_MB   = 5;
  let uploadedFile = null;

  // Create a hidden file input dynamically (keeps HTML untouched)
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.jpg,.jpeg,.png,.pdf';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  // Disable Place Order until a valid prescription is uploaded
  function setOrderButtonState(enabled) {
    placeOrderBtn.disabled = !enabled;
    placeOrderBtn.style.opacity = enabled ? '1' : '0.5';
    placeOrderBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }
  setOrderButtonState(false); // disabled on load, no file yet

  function validateFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload JPG, PNG, or PDF.';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Max size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }

  function handleFile(file) {
    const error = validateFile(file);
    sessionStorage.setItem(
    "uploadedPrescriptionName",
    file.name
);

sessionStorage.setItem(
    "uploadedPrescriptionSize",
    file.size
);

sessionStorage.setItem(
    "uploadedPrescriptionType",
    file.type
);
    if (error) {
      showToast(error, 'error');
      resetUpload();
      return;
    }
    uploadedFile = file;
    uploadBox.style.borderColor = '#1976D2';
    uploadBox.style.background = '#F2F8FE';
    supportText.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    placeOrderNote.textContent = 'Prescription uploaded. Ready to place your order.';
    setOrderButtonState(true);
    showToast('Prescription uploaded successfully.', 'success');
  }

  function resetUpload() {
    uploadedFile = null;
    fileInput.value = '';
    uploadBox.style.borderColor = '';
    uploadBox.style.background = '';
    supportText.textContent = 'Supports: JPG, PNG, PDF (Max size: 5MB)';
    placeOrderNote.textContent = 'Upload prescription to place your medicine order';
    setOrderButtonState(false);
  }

  // Click "Choose File" -> open native file dialog
  chooseFileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });

  // File selected via dialog
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleFile(fileInput.files[0]);
    }
  });

  // Drag & drop support on the upload box
  ['dragenter', 'dragover'].forEach(evt => {
    uploadBox.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadBox.style.background = '#E3F2FD';
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadBox.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!uploadedFile) uploadBox.style.background = '';
    });
  });
  uploadBox.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });


  /* ---------------------------------------------------------
     2. PLACE ORDER
  --------------------------------------------------------- */
  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      showToast('Please upload a prescription before placing your order.', 'error');
      return;
    }
    // Simulate order submission — replace with real API call
    placeOrderBtn.textContent = 'Placing order...';
    setOrderButtonState(false);

    setTimeout(() => {

    showToast(
        "Prescription uploaded successfully!",
        "success"
    );

    window.location.href =
    "../Pharmacy_Preview_Kaushik1/preview.html";

},1000);
  });


  /* ---------------------------------------------------------
     3. TOAST NOTIFICATIONS (lightweight, no HTML needed)
  --------------------------------------------------------- */
  function showToast(message, type = 'info') {
    const colors = {
      success: { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
      error:   { bg: '#FFEBEE', text: '#D32F2F', border: '#D32F2F' },
      info:    { bg: '#E3F2FD', text: '#1976D2', border: '#1976D2' }
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '28px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: c.bg,
      color: c.text,
      border: `1.5px solid ${c.border}`,
      padding: '12px 22px',
      borderRadius: '14px',
      fontFamily: "'Poppins', sans-serif",
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      opacity: '0',
      transition: 'opacity 0.25s ease, transform 0.25s ease',
      zIndex: '9999'
    });
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }


  /* ---------------------------------------------------------
     4. NOTIFICATION BELL DROPDOWN
  --------------------------------------------------------- */
  const bellWrap = document.querySelector('.bell-wrap');
  let notifPanel = null;

  const sampleNotifications = [
    { title: 'Order Delivered', desc: 'Order #MC5247891 has been delivered.', time: '2h ago' },
    { title: 'Prescription Approved', desc: 'Your uploaded prescription was verified.', time: '5h ago' }
  ];

  function buildNotifPanel() {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute',
      top: '52px',
      right: '32px',
      width: '300px',
      background: '#fff',
      border: '1px solid #D9E6F5',
      borderRadius: '16px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
      padding: '10px',
      zIndex: '1000',
      fontFamily: "'Poppins', sans-serif"
    });

    sampleNotifications.forEach(n => {
      const item = document.createElement('div');
      item.style.padding = '12px';
      item.style.borderRadius = '10px';
      item.style.cursor = 'pointer';
      item.innerHTML = `
        <div style="font-size:14px;font-weight:600;color:#102A43;">${n.title}</div>
        <div style="font-size:12.5px;color:#6B7280;margin-top:2px;">${n.desc}</div>
        <div style="font-size:11px;color:#9AA1A0;margin-top:4px;">${n.time}</div>
      `;
      item.addEventListener('mouseenter', () => item.style.background = '#F2F8FE');
      item.addEventListener('mouseleave', () => item.style.background = 'transparent');
      panel.appendChild(item);
    });

    return panel;
  }

  bellWrap.style.position = 'relative';
  bellWrap.addEventListener('click', (e) => {
    e.stopPropagation();
    if (notifPanel) {
      notifPanel.remove();
      notifPanel = null;
      return;
    }
    notifPanel = buildNotifPanel();
    document.querySelector('.topnav').appendChild(notifPanel);
  });


  /* ------------
  const userChip = document.querySelector('.user-chip');
  let userMenu = null;

  function buildUserMenu() {
    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'absolute',
      top: '52px',
      right: '32px',
      width: '180px',
      background: '#fff',
      border: '1px solid #D9E6F5',
      borderRadius: '14px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
      padding: '8px',
      zIndex: '1000',
      fontFamily: "'Poppins', sans-serif"
    });

    const options = ['My Profile', 'My Orders', 'Settings', 'Logout'];
    options.forEach(label => {
      const opt = document.createElement('div');
      opt.textContent = label;
      opt.style.padding = '10px 12px';
      opt.style.fontSize = '14px';
      opt.style.color = '#102A43';
      opt.style.borderRadius = '8px';
      opt.style.cursor = 'pointer';
      opt.addEventListener('mouseenter', () => opt.style.background = '#F2F8FE');
      opt.addEventListener('mouseleave', () => opt.style.background = 'transparent');
      opt.addEventListener('click', () => {
        showToast(`${label} clicked`, 'info');
        menu.remove();
        userMenu = null;
      });
      menu.appendChild(opt);
    });

    return menu;
  }

  userChip.addEventListener('click', (e) => {
    e.stopPropagation();
    if (userMenu) {
      userMenu.remove();
      userMenu = null;
      return;
    }
    userMenu = buildUserMenu();
    document.querySelector('.topnav').appendChild(userMenu);
  });

  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', () => {
    if (notifPanel) { notifPanel.remove(); notifPanel = null; }
    if (userMenu) { userMenu.remove(); userMenu = null; }
  });


  /* ---------------------------------------------------------
     6. LEFT SIDEBAR NAVIGATION
  --------------------------------------------------------- */
  const navItems = document.querySelectorAll('.sidebar-left .nav-item');
  const navRoutes = {
    'Appointment Scheduling': 'appointment_scheduling.html',
    'Pharmacy': 'pharmacy.html',
    'Emergency Service': 'emergency_service.html',
    'Critical Resource Service': 'critical_resource_service.html',
    'Medical Camp': 'medical_camp.html'
  };

  navItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const label = item.querySelector('span').textContent.trim();

      // Update active state visually
      navItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      const route = navRoutes[label];
      if (route && route !== 'pharmacy.html') {
        window.location.href = route;
      }
    });
  });


  /* ---------------------------------------------------------
     7. RIGHT SIDEBAR QUICK-ACTION CARDS
  --------------------------------------------------------- */
  const sideCards = document.querySelectorAll('.sidebar-right .side-card');
  const sideRoutes = {
    'Order History': 'order_history.html',
    'Need Help?': 'support_center.html'
  };

  sideCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.side-card-title').textContent.trim();
      const route = sideRoutes[title];
      if (route) {
        window.location.href = route;
      }
    });
  });


  /* ---------------------------------------------------------
     8. TOP NAV LINKS (About / Contact)
  --------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const topRoutes = { 'About': 'about.html', 'Contact': 'contact.html' };

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const route = topRoutes[link.textContent.trim()];
      if (route) window.location.href = route;
    });
  });

});
document
.getElementById("myProfileBtn")
.addEventListener("click", function(e){

    e.preventDefault();

    goToProfile();

});
document
.getElementById("logoutBtn")
.addEventListener("click", function(e){

    e.preventDefault();

    if(confirm("Are you sure you want to logout?")){

        logoutUser();

    }

});