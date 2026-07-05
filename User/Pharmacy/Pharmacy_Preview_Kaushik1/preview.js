// ============================================================
// order_preview.js — Curonex Order Preview Page Interactions
// Link via: <script src="./order_preview.js" defer></script>
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. SHARED UTILITIES (toast, dropdowns) — same pattern
        as pharmacy.js, duplicated here for standalone use
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

  toggleMenu('.bell-wrap', ['Order Delivered', 'Prescription Approved'], () => {});
  toggleMenu('.user-chip', ['My Profile', 'My Orders', 'Settings', 'Logout'],
    (label) => showToast(`${label} clicked`, 'info'));


  /* ---------------------------------------------------------
     1. BACK ARROW
  --------------------------------------------------------- */
  const backArrow = document.querySelector('.back-arrow');
  backArrow.style.cursor = 'pointer';
  backArrow.addEventListener('click', () => {
    if (document.referrer) {
      window.history.back();
    } else {
      window.location.href = 'pharmacy.html';
    }
  });


  /* ---------------------------------------------------------
     2. EDIT PATIENT DETAILS
  --------------------------------------------------------- */
  const editBtn = document.querySelector('.edit-btn');
  const detailValues = document.querySelectorAll('.details-box .detail-value');
  let editing = false;

  editBtn.addEventListener('click', () => {
    if (!editing) {
      // Turn each detail into an editable field
      detailValues.forEach(el => {
        const original = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        el.dataset.original = el.innerHTML;
        const textarea = document.createElement('textarea');
        textarea.value = original;
        textarea.rows = original.split('\n').length;
        Object.assign(textarea.style, {
          width: '100%', fontFamily: "'Poppins', sans-serif", fontSize: '16px',
          fontWeight: '600', color: '#102A43', border: '1px solid #1976D2',
          borderRadius: '8px', padding: '6px 8px', resize: 'vertical'
        });
        el.innerHTML = '';
        el.appendChild(textarea);
      });
      editBtn.innerHTML = editBtn.innerHTML.replace('Edit', 'Save');
      editing = true;
    } else {
      // Save edited values back
      detailValues.forEach(el => {
        const textarea = el.querySelector('textarea');
        const value = textarea ? textarea.value : el.textContent;
        el.innerHTML = value.replace(/\n/g, '<br>');
      });
      editBtn.innerHTML = editBtn.innerHTML.replace('Save', 'Edit');
      editing = false;
      showToast('Patient details updated.', 'success');
    }
  });


  /* ---------------------------------------------------------
     3. MEDICINE QUANTITY CONTROLS
  --------------------------------------------------------- */
  const MIN_QTY = 1;
  const MAX_QTY = 30;

  document.querySelectorAll('.table-row').forEach(row => {
    const minusBtn = row.querySelector('.qty-btn.minus');
    const plusBtn  = row.querySelector('.qty-btn.plus');
    const qtyValue = row.querySelector('.qty-value');

    minusBtn.addEventListener('click', () => {
      let qty = parseInt(qtyValue.textContent, 10);
      if (qty > MIN_QTY) {
        qtyValue.textContent = qty - 1;
      }
    });

    plusBtn.addEventListener('click', () => {
      let qty = parseInt(qtyValue.textContent, 10);
      if (qty < MAX_QTY) {
        qtyValue.textContent = qty + 1;
      } else {
        showToast(`Maximum quantity is ${MAX_QTY}.`, 'error');
      }
    });
  });


  /* ---------------------------------------------------------
     4. REMOVE MEDICINE
  --------------------------------------------------------- */
  const sectionTitle = document.querySelectorAll('.section-title')[1]; // "Medicines (n)"

  function updateMedicineCount() {
    const remaining = document.querySelectorAll('.med-table .table-row').length;
    sectionTitle.textContent = `Medicines (${remaining})`;
  }

  document.querySelectorAll('.action-cell').forEach(cell => {
    const checkbox = cell.querySelector('.checkbox');
    const label = cell.querySelector('.remove-text');

    cell.style.cursor = 'pointer';
    cell.addEventListener('click', () => {
      const row = cell.closest('.table-row');
      const medName = row.querySelector('.med-name').textContent;

      // Toggle a "marked for removal" visual state first
      const alreadyMarked = checkbox.dataset.marked === 'true';

      if (!alreadyMarked) {
        checkbox.style.background = '#1976D2';
        checkbox.style.borderColor = '#1976D2';
        checkbox.dataset.marked = 'true';
        row.style.opacity = '0.5';
        row.style.textDecoration = 'line-through';
        showToast(`${medName} marked for removal.`, 'info');
      } else {
        checkbox.style.background = '';
        checkbox.style.borderColor = '';
        checkbox.dataset.marked = 'false';
        row.style.opacity = '1';
        row.style.textDecoration = 'none';
      }
    });
  });


  /* ---------------------------------------------------------
   5. CANCEL / CONFIRM ORDER
--------------------------------------------------------- */

const cancelBtn = document.querySelector('.btn-cancel');
const confirmBtn = document.querySelector('.btn-confirm');

// Prevent multiple clicks
let orderProcessing = false;

cancelBtn.addEventListener('click', () => {

    if (orderProcessing) return;

    const remainingRows = document.querySelectorAll('.med-table .table-row');

    if (remainingRows.length === 0) {
        showToast('There are no medicines to cancel.', 'info');
        return;
    }

    const confirmCancel = window.confirm(
        'Are you sure you want to cancel this order?'
    );

    if (!confirmCancel) return;

    orderProcessing = true;

    cancelBtn.disabled = true;
    confirmBtn.disabled = true;

    showToast('Order cancelled.', 'error');

    setTimeout(() => {
        window.location.href = 'pharmacy.html';
    }, 800);

});


confirmBtn.addEventListener('click', () => {

    if (orderProcessing) return;

    const rows = document.querySelectorAll('.med-table .table-row');

    // No medicines available
    if (rows.length === 0) {
        showToast('There are no medicines in the order.', 'error');
        return;
    }

    let remainingCount = 0;

    rows.forEach(row => {

        const checkbox = row.querySelector('.checkbox');

        if (checkbox.dataset.marked !== "true") {
            remainingCount++;
        }

    });

    // All medicines removed
    if (remainingCount === 0) {
        showToast(
            'Please keep at least one medicine before confirming your order.',
            'error'
        );
        return;
    }

    const proceed = window.confirm(
        `Confirm order with ${remainingCount} medicine${remainingCount > 1 ? 's' : ''}?`
    );

    if (!proceed) return;

    orderProcessing = true;

    // Remove only marked medicines
    rows.forEach(row => {

        const checkbox = row.querySelector('.checkbox');

        if (checkbox.dataset.marked === "true") {
            row.remove();
        }

    });

    updateMedicineCount();

    confirmBtn.disabled = true;
    cancelBtn.disabled = true;

    confirmBtn.innerHTML = "Processing...";

    showToast(
        `Order confirmed successfully (${remainingCount} medicine${remainingCount > 1 ? 's' : ''}).`,
        'success'
    );

    setTimeout(() => {

        window.location.href = 'delivery_tracking.html';

    }, 1200);

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
    'Need Help?': 'support_center.html'
  };
  document.querySelectorAll('.sidebar-right .side-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.side-card-title').textContent.trim();
      const route = sideRoutes[title];
      if (route) window.location.href = route;
    });
  });

});