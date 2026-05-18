const sections = document.querySelectorAll('section[id]');
        const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        sections.forEach(s => {
            new IntersectionObserver(entries => {
                entries.forEach(e => { if (e.isIntersecting) menuLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); });
            }, { threshold: 0.4, rootMargin: '-70px 0px -30% 0px' }).observe(s);
        });


        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const t = document.querySelector(this.getAttribute('href'));
                if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
            });
        });