// ============================================================
// delivery_tracking.js — Curonex Delivery Order Tracking Page
// Link via: <script src="./delivery_tracking.js" defer></script>
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. SHARED UTILITIES (toast, dropdowns)
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
      position: 'fixed', bottom: '28px', left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: c.bg, color: c.text, border: `1.5px solid ${c.border}`,
      padding: '12px 22px', borderRadius: '14px',
      fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: '500',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', opacity: '0',
      transition: 'opacity 0.25s ease, transform 0.25s ease', zIndex: '9999'
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

  function buildDropdown(items, onSelect) {
    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'absolute', top: '52px', right: '32px', width: '190px',
      background: '#fff', border: '1px solid #D9E6F5', borderRadius: '14px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.12)', padding: '8px', zIndex: '1000',
      fontFamily: "'Poppins', sans-serif"
    });
    items.forEach(label => {
      const opt = document.createElement('div');
      opt.textContent = label;
      Object.assign(opt.style, {
        padding: '10px 12px', fontSize: '14px', color: '#102A43',
        borderRadius: '8px', cursor: 'pointer'
      });
      opt.addEventListener('mouseenter', () => opt.style.background = '#F2F8FE');
      opt.addEventListener('mouseleave', () => opt.style.background = 'transparent');
      opt.addEventListener('click', () => { onSelect(label); menu.remove(); });
      menu.appendChild(opt);
    });
    return menu;
  }

  let openMenu = null;
  function toggleMenu(anchorSelector, items, onSelect) {
    const anchor = document.querySelector(anchorSelector);
    anchor.style.position = 'relative';
    anchor.addEventListener('click', (e) => {
      e.stopPropagation();
      if (openMenu) { openMenu.remove(); openMenu = null; return; }
      openMenu = buildDropdown(items, onSelect);
      document.querySelector('.topnav').appendChild(openMenu);
    });
  }
  document.addEventListener('click', () => {
    if (openMenu) { openMenu.remove(); openMenu = null; }
  });

  toggleMenu('.bell-wrap', ['Delivery Partner Assigned', 'ETA Updated'], () => {});
  toggleMenu('.user-chip', ['My Profile', 'My Orders', 'Settings', 'Logout'],
    (label) => showToast(`${label} clicked`, 'info'));


  /* ---------------------------------------------------------
     1. LIVE ETA COUNTDOWN
  --------------------------------------------------------- */
  const etaPill = document.querySelector('.eta-pill');
  let minutesLeft = parseInt(etaPill.textContent.match(/\d+/)?.[0] || '22', 10);

  const countdownInterval = setInterval(() => {
    minutesLeft -= 1;
    if (minutesLeft <= 0) {
      etaPill.textContent = 'Arriving now';
      clearInterval(countdownInterval);
      triggerOutForDelivery();
    } else {
      etaPill.textContent = `Arriving in ${minutesLeft} mins`;
    }
  }, 60000); // updates every real minute; use a shorter interval for demo/testing


  /* ---------------------------------------------------------
     2. TRACKER STEP PROGRESSION
     (simulates status updates: Assigned -> Out for Delivery -> Delivered)
  --------------------------------------------------------- */
  const trackSteps = document.querySelectorAll('.track-step');
  const trackLines = document.querySelectorAll('.track-line');

  function activateStep(index) {
    const step = trackSteps[index];
    const icon = step.querySelector('.track-icon');
    icon.classList.remove('inactive');
    icon.classList.add('active');

    const timeEl = step.querySelector('.track-time');
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (trackLines[index]) {
      trackLines[index].classList.remove('empty');
      trackLines[index].classList.add('filled');
    }
  }

  function triggerOutForDelivery() {
    activateStep(1); // "Out for Delivery"
    showToast('Your order is now out for delivery!', 'info');
  }

  function triggerDelivered() {
    activateStep(2); // "Delivered"
    showToast('Your order has been delivered!', 'success');
    document.querySelector('.eta-bar').style.background = '#E8F5E9';
    etaPill.textContent = 'Delivered';
    etaPill.style.borderColor = '#2E7D32';
    etaPill.style.color = '#2E7D32';
  }

  // Demo trigger: clicking the tracker card manually advances status
  // (Replace with real-time polling / WebSocket updates in production)
  document.querySelector('.tracker').addEventListener('click', () => {
    const activeCount = document.querySelectorAll('.track-icon.active').length;
    if (activeCount === 1) {
      triggerOutForDelivery();
    } else if (activeCount === 2) {
      triggerDelivered();
    }
  });



  /* ---------------------------------------------------------
     4. CALL DELIVERY PARTNER (tel: link)
  --------------------------------------------------------- */
  const partnerPhone = document.querySelector('.partner-phone');
  partnerPhone.style.cursor = 'pointer';
  partnerPhone.addEventListener('click', () => {
    const phoneText = partnerPhone.textContent.trim().replace(/\s+/g, '');
    window.location.href = `tel:${phoneText}`;
  }); 


  /* ---------------------------------------------------------
     6. LEFT SIDEBAR NAVIGATION
  --------------------------------------------------------- */
  const navRoutes = {
    'Appointment Scheduling': 'appointment_scheduling.html',
    'Pharmacy': 'pharmacy.html',
    'Emergency Service': 'emergency_service.html',
    'Critical Resource Service': 'critical_resource_service.html',
    'Medical Camp': 'medical_camp.html'
  };
  document.querySelectorAll('.sidebar-left .nav-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const label = item.querySelector('span').textContent.trim();
      document.querySelectorAll('.sidebar-left .nav-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      const route = navRoutes[label];
      if (route) window.location.href = route;
    });
  });


  /* ---------------------------------------------------------
     7. RIGHT SIDEBAR QUICK-ACTION CARDS
  --------------------------------------------------------- */
  const sideRoutes = {
    'Order History': 'order_history.html',
    'Live Location': 'live_location.html',
    'Report an Issue': 'report_issue.html'
  };
  document.querySelectorAll('.sidebar-right .side-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.side-card-title').textContent.trim();
      const route = sideRoutes[title];
      if (route) window.location.href = route;
    });
  });

});