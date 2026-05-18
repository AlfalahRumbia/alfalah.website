document.addEventListener("DOMContentLoaded", () => {
  // Hamburger and menu interaction
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (hamburger && navMenu && navOverlay) {
    function openMenu() {
      hamburger.classList.add('active');
      navMenu.classList.add('open');
      navOverlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      navOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Scrolling navbar state
  const navbar = document.getElementById('mainNav');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
  }
});
