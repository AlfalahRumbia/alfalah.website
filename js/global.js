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
