// ─── KONFIGURASI ────────────────────────────────────────────────
    const start  = new Date('2026-05-10T00:00:00Z');
    const target = new Date('2026-05-19T04:00:00Z');
    // ────────────────────────────────────────────────────────────────

    const stepThresholds = [25, 50, 75, 100];

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown(now) {
      const diff = target - now;
      if (diff <= 0) {
        ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id =>
          document.getElementById(id).textContent = '00');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-days').textContent  = pad(d);
      document.getElementById('cd-hours').textContent = pad(h);
      document.getElementById('cd-mins').textContent  = pad(m);
      document.getElementById('cd-secs').textContent  = pad(s);
    }

    function updateProgress(now) {
      const total   = target - start;
      const elapsed = now - start;
      const pct     = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

      // Update progress bar
      document.getElementById('progressPct').textContent  = pct + '%';
      document.getElementById('progressFill').style.width = pct + '%';

      // Update steps berdasarkan threshold
      for (let i = 1; i <= 4; i++) {
        const item = document.getElementById('step-' + i);
        const icon = document.getElementById('step-icon-' + i);
        const prevDone = i === 1 ? true : pct >= stepThresholds[i - 2];
        const thisDone = pct >= stepThresholds[i - 1];

        item.className = 'step-item';
        if (thisDone) {
          item.classList.add('done');
          icon.textContent = '✓';
        } else if (prevDone) {
          item.classList.add('active');
          icon.textContent = '';
        } else {
          icon.textContent = '';
        }
      }
    }

    function updateClock(now) {
      document.getElementById('utcTime').textContent = now.toUTCString().replace(' GMT', ' UTC');
      document.getElementById('isoTime').textContent = now.toISOString();
    }

    function tick() {
      const now = new Date();
      updateCountdown(now);
      updateProgress(now);
      updateClock(now);
    }

    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const tgl  = target.getUTCDate();
    const bln  = bulan[target.getUTCMonth()];
    const thn  = target.getUTCFullYear();
    const jam  = pad(target.getUTCHours());
    const mnt  = pad(target.getUTCMinutes());
    document.getElementById('estimasiSelesai').textContent = `${tgl} ${bln} ${thn}, ${jam}:${mnt} UTC`;

    tick();
    setInterval(tick, 1000);