(() => {
  const root = document.documentElement;
  const metaTheme = document.getElementById('meta-theme-color') as HTMLMetaElement | null;
  const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement | null;
  const siteNav = document.getElementById('site-nav') as HTMLElement | null;
  const themeBtn = document.getElementById('theme-toggle') as HTMLButtonElement | null;
  const yearEl = document.getElementById('year');

  // 年の自動更新
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // テーマ制御
  const getSystemTheme = (): 'dark' | 'light' => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const savedTheme = (typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null) as 'dark' | 'light' | null;
  const applyTheme = (theme: 'dark' | 'light') => {
    root.setAttribute('data-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0b1220' : '#0ea5e9');
    if (themeBtn) themeBtn.setAttribute('aria-label', `テーマを${theme === 'dark' ? 'ライト' : 'ダーク'}に切り替え`);
  };
  applyTheme(savedTheme || getSystemTheme());
  themeBtn?.addEventListener('click', () => {
    const current = (root.getAttribute('data-theme') || getSystemTheme()) as 'dark' | 'light';
    const next: 'dark' | 'light' = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // モバイルナビ
  navToggle?.addEventListener('click', () => {
    const isOpen = siteNav?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
  siteNav?.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // 現在位置に応じたナビ有効化
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('header .site-nav a'));
  const sections = navLinks
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') || ''))
    .filter((el): el is HTMLElement => Boolean(el));
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${(entry.target as HTMLElement).id}`;
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

  // サイト共通設定の読込（名前など）
  type SiteConfig = { name?: string };
  const applyName = (name: string) => {
    // タイトル
    document.title = `${name} | ポートフォリオ`;
    // ヘッダーブランド（最初の .brand を対象）
    const brand = document.querySelector<HTMLElement>('.brand');
    if (brand) brand.textContent = name;
    // ヒーローの名前
    const display = document.getElementById('display-name');
    if (display) display.textContent = name;
    // フッターの名前
    const footer = document.getElementById('footer-name');
    if (footer) footer.textContent = name;
  };
  fetch('site.config.json')
    .then((r) => (r.ok ? r.json() as Promise<SiteConfig> : Promise.resolve({})))
    .then((cfg) => {
      if (cfg?.name) applyName(cfg.name);
    })
    .catch(() => {
      /* 失敗時はプレースホルダーを維持 */
    });
})();
