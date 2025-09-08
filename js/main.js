(() => {
  const root = document.documentElement;
  const metaTheme = document.getElementById('meta-theme-color');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const themeBtn = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

  // 年の自動更新
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // テーマ制御
  const getSystemTheme = () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const savedTheme = localStorage.getItem('theme');
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0b1220' : '#0ea5e9');
    if (themeBtn) themeBtn.setAttribute('aria-label', `テーマを${theme === 'dark' ? 'ライト' : 'ダーク'}に切り替え`);
  };
  applyTheme(savedTheme || getSystemTheme());
  themeBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // モバイルナビ
  navToggle?.addEventListener('click', () => {
    const isOpen = siteNav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
  siteNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // 現在位置に応じたナビ有効化
  const navLinks = Array.from(document.querySelectorAll('header .site-nav a'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          const link = navLinks.find((l) => l.getAttribute('href') === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    );
    sections.forEach((s) => observer.observe(s));
  }
})();

