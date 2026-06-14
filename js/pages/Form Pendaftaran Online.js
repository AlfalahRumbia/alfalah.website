const observerFade = new IntersectionObserver(e => {
        e.forEach(x => {
            if (x.isIntersecting) {
                x.target.classList.add('show');
                observerFade.unobserve(x.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.fade-up').forEach(el => observerFade.observe(el));

    const gframe = document.getElementById('gform-iframe');
    gframe.addEventListener('load', function () {
      this.style.height = '900px';

      let lastHeight = 900;
      const observer = setInterval(() => {
        try {
          const newHeight = this.contentWindow.document.body.scrollHeight;
          if (newHeight && newHeight !== lastHeight) {
            this.style.height = newHeight + 'px';
            lastHeight = newHeight;
          }
        } catch (e) {
          clearInterval(observer);
        }
      }, 500);
    });