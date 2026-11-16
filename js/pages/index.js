/* ==========================================================
   index.js — Tampilan awal (Beranda)  · v8
   ========================================================== */

/* ---------- Menandai menu navbar yang aktif (jika ada link #anchor) ---------- */
const sections = document.querySelectorAll('section[id], header[id]');
const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

if (menuLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        menuLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-70px 0px -30% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ---------- Animasi muncul saat scroll (hanya desktop dengan mouse) ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileDevice = window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches;

if (!isMobileDevice && !reduceMotion) {
  const animTargets = document.querySelectorAll(
    'section > .section-title, .program-card, .visi-misi-box, .kegiatan-card-item, ' +
    '.fasilitas-item, .registration-card, .admin-showcase-box, .maps-container'
  );

  // Setelah animasi selesai, lepas class animasi supaya efek hover bawaan kartu
  // (transition bayangan, dll.) kembali bekerja normal.
  const finish = (el) => el.classList.remove('scroll-animate', 'visible');

  const scrollAnimObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');
      scrollAnimObserver.unobserve(el);
      let done = false;
      const end = () => { if (!done) { done = true; finish(el); } };
      el.addEventListener('transitionend', (ev) => { if (ev.propertyName === 'transform') end(); }, { once: true });
      setTimeout(end, 800);
    });
  }, { threshold: 0.05, rootMargin: '40px 0px 0px 0px' });

  animTargets.forEach(el => {
    el.classList.add('scroll-animate');
    scrollAnimObserver.observe(el);
  });
}

/* ---------- Scroll halus untuk link #anchor ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1 && href.startsWith('#')) {
      e.preventDefault();
      try {
        const target = document.querySelector(href);
        if (target) {
          const offset = window.innerWidth <= 900 ? 64 : 126;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      } catch (err) {
        // Selector tidak valid — abaikan
      }
    }
  });
});

/* ---------- Lightbox galeri (kegiatan & fasilitas) ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightPrev = document.getElementById('lightPrev');
const lightNext = document.getElementById('lightNext');

const galleryImgs = Array.from(document.querySelectorAll(
  '.kegiatan-card-img img, .kegiatan-harian-img-wrapper img, .fasilitas-item img'
));
let currentIndex = 0;
let lastFocused = null;

function showImage(idx) {
  currentIndex = (idx + galleryImgs.length) % galleryImgs.length;
  const img = galleryImgs[currentIndex];
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.alt;
}

function openLightbox(idx) {
  lastFocused = document.activeElement;
  showImage(idx);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

if (lightbox && galleryImgs.length) {
  galleryImgs.forEach((img, i) => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => openLightbox(i));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightPrev.addEventListener('click', () => showImage(currentIndex - 1));
  lightNext.addEventListener('click', () => showImage(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}
