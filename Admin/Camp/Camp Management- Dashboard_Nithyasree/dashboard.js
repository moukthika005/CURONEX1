/* Dashboard-specific behaviour */
document.addEventListener('DOMContentLoaded', () => {
  // Animate stat numbers counting up on load
  document.querySelectorAll('.stat-value').forEach(el => {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current;
    }, 20);
  });
});
