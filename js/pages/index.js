const sections = document.querySelectorAll('section[id], header[id]');
    const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

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

    // Dual-direction scroll animation logic (UGM Style - Staggered children reveal)
    const animTargets = document.querySelectorAll(
      'section > .section-title, section > p, .program-card, .visi-misi-box, .super-combo img, .kegiatan-card, table tbody tr, .grid-gallery img, .info-box-premium, .fasilitas-item, .contact-form, .maps-container'
    );
    let lastScrollY = window.scrollY;

    const scrollAnimObserver = new IntersectionObserver((entries) => {
      const isScrollingDown = window.scrollY > lastScrollY;
      
      entries.forEach(entry => {
        const target = entry.target;
        
        if (entry.isIntersecting) {
          const parent = target.parentElement;
          const siblings = Array.from(parent.querySelectorAll('.program-card, .visi-misi-box, .super-combo img, .kegiatan-card, table tbody tr, .grid-gallery img, .info-box-premium, .fasilitas-item'));
          
          if (siblings.length > 1 && siblings.includes(target)) {
            const index = siblings.indexOf(target);
            // Saat scroll ke bawah: indeks normal (0, 1, 2...)
            // Saat scroll ke atas: balikkan indeks agar yang teratas/pertama muncul duluan
            const delayIndex = isScrollingDown ? index : (siblings.length - 1 - index);
            target.style.transitionDelay = `${delayIndex * 0.1}s`;
          } else {
            target.style.transitionDelay = '0s';
          }
          
          target.classList.add('visible');
          target.classList.remove('exit-up', 'exit-down');
        } else {
          target.style.transitionDelay = '0s';
          target.classList.remove('visible');
          
          if (entry.boundingClientRect.top < 0) {
            // Elemen keluar melewati batas atas layar
            target.classList.add('exit-up');
            target.classList.remove('exit-down');
          } else {
            // Elemen keluar/belum masuk melewati batas bawah layar
            target.classList.add('exit-down');
            target.classList.remove('exit-up');
          }
        }
      });
      lastScrollY = window.scrollY;
    }, {
      threshold: 0.05,
      rootMargin: '-30px 0px -30px 0px'
    });

    animTargets.forEach(el => {
      el.classList.add('scroll-animate');
      scrollAnimObserver.observe(el);
    });

    // Update scroll position tracker
    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const targetPosition = target.offsetTop - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    


    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightPrev = document.getElementById('lightPrev');
    const lightNext = document.getElementById('lightNext');

    const galleryImgs = Array.from(document.querySelectorAll('.gallery img, .grid-gallery img, .super-combo img, .carousel-item img'));
    let currentIndex = 0;

    galleryImgs.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(i));
    });

    function openLightbox(idx) {
      currentIndex = idx;
      lightboxImg.src = galleryImgs[currentIndex].src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
      lightboxImg.src = galleryImgs[currentIndex].src;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryImgs.length;
      lightboxImg.src = galleryImgs[currentIndex].src;
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightPrev.addEventListener('click', showPrev);
    lightNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nama = document.getElementById('nama').value.trim();
        const pesan = document.getElementById('pesan').value.trim();

        if (!nama || !pesan) {
          alert('Mohon lengkapi semua field!');
          return;
        }

        const waMessage = encodeURIComponent(
          `Assalamualaikum,\n\nNama: ${nama}\nPesan: ${pesan}`
        );

        window.open(`https://wa.me/6285832155052?text=${waMessage}`, '_blank');

        contactForm.reset();
        alert('Terima kasih! Pesan Anda akan diteruskan ke WhatsApp.');
      });
    }
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-target'));
          let count = 0;
          const duration = 2000;
          const step = countTo / (duration / 16);

          const updateCount = () => {
            count += step;
            if (count < countTo) {
              target.innerText = Math.floor(count) + '+';
              requestAnimationFrame(updateCount);
            } else {
              target.innerText = countTo + '+';
            }
          };
          updateCount();
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));