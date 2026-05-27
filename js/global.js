// Smart back navigation: go back if there's history, otherwise go to index.html
function smartBack() {
  if (document.referrer && document.referrer !== '') {
    history.back();
  } else {
    // Detect if we're in /pages/ subfolder or at root
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
      window.location.href = '../index.html';
    } else {
      window.location.href = 'index.html';
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Global fade-up animation using IntersectionObserver
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
});
