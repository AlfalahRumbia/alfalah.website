document.addEventListener("DOMContentLoaded", () => {
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
      document.documentElement.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      navOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    navOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu with a brief delay for external tabs or immediate for anchor links
        if (link.getAttribute('target') === '_blank') {
          setTimeout(closeMenu, 250);
        } else {
          closeMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close on screen resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Scrolling navbar state
  const navbar = document.getElementById('mainNav');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});
