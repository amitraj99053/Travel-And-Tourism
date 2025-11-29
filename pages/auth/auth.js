// Page-only behavior for standalone auth pages
document.addEventListener('DOMContentLoaded', () => {
  // Tabs for page login/signup
  const switchTab = (btnId, showFormId, hideBtnId, hideFormId) => {
    const btn = document.getElementById(btnId);
    const showForm = document.getElementById(showFormId);
    const hideBtn = document.getElementById(hideBtnId);
    const hideForm = document.getElementById(hideFormId);
    if (!btn || !showForm) return;
    btn.addEventListener('click', () => {
      btn.classList.add('active');
      if (hideBtn) hideBtn.classList.remove('active');
      showForm.classList.remove('hidden');
      if (hideForm) hideForm.classList.add('hidden');
    });
  };

  // login page
  switchTab('tab-traveler-page','form-traveler-page','tab-mechanic-page','form-mechanic-page');
  switchTab('tab-mechanic-page','form-mechanic-page','tab-traveler-page','form-traveler-page');

  // signup page
  switchTab('tab-traveler-sign','signup-traveler','tab-mechanic-sign','signup-mechanic');
  switchTab('tab-mechanic-sign','signup-mechanic','tab-traveler-sign','signup-traveler');

  // Basic submit handlers (demo)
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('This is a demo flow. Replace with real API integration.');
    });
  });
});
