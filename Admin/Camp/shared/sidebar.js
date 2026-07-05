/* ==========================================================================
   SHARED SIDEBAR + HEADER BEHAVIOUR
   Include this on every page AFTER the shared header/sidebar markup.
   ========================================================================== */

(function () {
  const hamburger   = document.getElementById('hamburgerBtn');
  const sidebar      = document.getElementById('appSidebar');
  const overlay      = document.getElementById('sidebarOverlay');
  const profileBtn    = document.getElementById('profileBtn');
  const profileMenu   = document.getElementById('profileDropdown');

  // Mobile sidebar toggle (desktop sidebar is always visible, per the Curonex reference)
  function toggleSidebar() {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  }
  if (hamburger) hamburger.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  // Profile dropdown
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => profileMenu.classList.remove('open'));
  }

  // Mark active nav link based on data-page attribute set on <body>
  const currentPage = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
    }
  });
})();
