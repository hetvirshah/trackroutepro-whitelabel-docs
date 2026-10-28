// Shared layout helpers — included on every page
(function() {
  // ─── Sidebar active link ───
  const links = document.querySelectorAll('.nav-link');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(l => {
    const href = l.getAttribute('href').split('/').pop();
    if (href === current) l.classList.add('active');
  });

  // ─── Mobile nav toggle ───
  const toggle = document.getElementById('nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // ─── Checklist persistence ───
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    const key = 'chk-' + location.pathname + '-' + cb.id;
    if (localStorage.getItem(key) === '1') { cb.checked = true; cb.closest('li').classList.add('checked'); }
    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked ? '1' : '0');
      cb.closest('li').classList.toggle('checked', cb.checked);
    });
  });

  // ─── Code block lang label ───
  document.querySelectorAll('pre[data-lang]').forEach(pre => { /* already handled via CSS attr() */ });

  // ─── Smooth scroll offset for fixed header ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ─── Animate cards on scroll ───
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.doc-card, .info-card, .feature-chip').forEach(el => {
      el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.2s, box-shadow 0.2s';
      obs.observe(el);
    });
  }
})();
