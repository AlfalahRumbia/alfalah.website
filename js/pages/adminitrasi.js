function switchTab(name, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    btn.classList.add('active');

    // Sync active state to navbar links
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    const activeMenuLink = document.getElementById('menu-' + name);
    if (activeMenuLink) {
      activeMenuLink.classList.add('active');
    }
  }

  // Navbar interactions
  

  // Sync menu links with tab switches
  const putraMenu = document.getElementById('menu-putra');
  const putriMenu = document.getElementById('menu-putri');

  if (putraMenu) {
    putraMenu.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('putra', document.querySelector('.tab-btn[onclick*="putra"]'));
    });
  }

  if (putriMenu) {
    putriMenu.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('putri', document.querySelector('.tab-btn[onclick*="putri"]'));
    });
  }

  // Initial sync on load
  const activeBtn = document.querySelector('.tab-btn.active');
  if (activeBtn) {
    const activeName = activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
    const activeMenuLink = document.getElementById('menu-' + activeName);
    if (activeMenuLink) {
      activeMenuLink.classList.add('active');
    }
  }