(() => {
  // JSが読み込まれたことを示すクラスを追加
  document.documentElement.classList.add('js-loaded');

  const root = document.documentElement;
  const metaTheme = document.getElementById('meta-theme-color') as HTMLMetaElement | null;
  const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement | null;
  const siteNav = document.getElementById('site-nav') as HTMLElement | null;
  const themeBtn = document.getElementById('theme-toggle') as HTMLButtonElement | null;
  const langBtn = document.getElementById('lang-toggle') as HTMLButtonElement | null;
  const yearEl = document.getElementById('year');

  // 簡易 i18n 定義
  type Dict = Record<string, string>;
  const i18n: Record<'ja' | 'en', Dict> = {
    ja: {
      'nav.about': '自己紹介',
      'nav.skills': 'スキル',
      'nav.projects': '制作物',
      'nav.experience': '経歴',
      'nav.timeline': 'タイムライン',
      'nav.resume': '履歴書',
      'nav.contact': '連絡',
      'breadcrumb.home': 'ホーム',
      'index.hero.hello': 'こんにちは、',
      'index.hero.i_am_prefix': '私は ',
      'index.hero.i_am_suffix': ' です',
      'index.hero.lead': 'データサイエンス × クラウドDX × フルスタック開発を通じて、課題解決とユーザー価値創出に取り組んでいます。',
      'index.actions.view_projects': '制作物を見る',
      'index.actions.learn_more': '詳しく知る',
      'index.actions.contact': '問い合わせ',
      'index.achievements.research.title': '研究実績',
      'index.achievements.research.desc': '歩行データの時系列クラスタリング研究',
      'index.achievements.business.title': '実務系DX',
      'index.achievements.business.desc': 'Komeda Portal - バイトシフトDXシステム',
      'index.achievements.personal.title': '個人開発',
      'index.achievements.personal.desc': '研究室メモ共有アプリ',
      'index.about.title': '自己紹介',
      'index.skills.title': 'スキル',
      'index.projects.title': '制作物',
      'index.experience.title': '職務経歴',
      'index.contact.title': '連絡先',
      'contact.cta.title': 'お気軽にお問い合わせください',
      'contact.cta.body': 'お仕事のご相談、技術的な質問、コラボレーションなど、どんなことでもお気軽にご連絡ください。',
      'timeline.title': 'タイムライン・実績',
      'timeline.summary': '学習・開発・研究・受賞・登壇などの歩みを時系列で紹介します。継続的な成長と挑戦の軌跡をご覧ください。',
      'timeline.stat.projects': 'プロジェクト',
      'timeline.stat.intern': 'インターン',
      'timeline.stat.talks': '技術発表',
      'timeline.stat.awards': '受賞・認定',
      'timeline.ongoing.title': '継続的な取り組み',
      'ongoing.learning.title': '技術学習・キャッチアップ',
      'ongoing.learning.desc': '最新技術トレンドの学習、新しいフレームワーク・ライブラリの習得、技術記事の執筆・共有',
      'ongoing.project.title': '個人プロジェクト開発',
      'ongoing.project.desc': '課題解決型の個人開発、OSS貢献、実験的なプロトタイプ開発、技術検証',
      'ongoing.community.title': 'コミュニティ活動',
      'ongoing.community.desc': '技術勉強会参加、知見共有、メンタリング、技術コミュニティでの交流'
    },
    en: {
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.experience': 'Experience',
      'nav.timeline': 'Timeline',
      'nav.resume': 'Resume',
      'nav.contact': 'Contact',
      'breadcrumb.home': 'Home',
      'index.hero.hello': 'Hello,',
      'index.hero.i_am_prefix': "I'm ",
      'index.hero.i_am_suffix': '',
      'index.hero.lead': 'Driving problem-solving and user value through Data Science × Cloud DX × Full-Stack development.',
      'index.actions.view_projects': 'View Projects',
      'index.actions.learn_more': 'Learn More',
      'index.actions.contact': 'Contact',
      'index.achievements.research.title': 'Research',
      'index.achievements.research.desc': 'Gait time-series clustering research',
      'index.achievements.business.title': 'Business DX',
      'index.achievements.business.desc': 'Komeda Portal — Shift DX system',
      'index.achievements.personal.title': 'Personal Dev',
      'index.achievements.personal.desc': 'Lab memo sharing app',
      'index.about.title': 'About',
      'index.skills.title': 'Skills',
      'index.projects.title': 'Projects',
      'index.experience.title': 'Experience',
      'index.contact.title': 'Contact',
      'contact.cta.title': 'Get In Touch',
      'contact.cta.body': 'Feel free to reach out for work opportunities, technical questions, or collaboration.',
      'timeline.title': 'Timeline & Achievements',
      'timeline.summary': 'A chronological journey of learning, development, research, awards, and talks. Explore a continuous track of growth and challenges.',
      'timeline.stat.projects': 'Projects',
      'timeline.stat.intern': 'Internships',
      'timeline.stat.talks': 'Tech Talks',
      'timeline.stat.awards': 'Awards & Certifications',
      'timeline.ongoing.title': 'Ongoing Work',
      'ongoing.learning.title': 'Learning & Catch-up',
      'ongoing.learning.desc': 'Learning latest tech trends, adopting new frameworks/libraries, writing and sharing articles',
      'ongoing.project.title': 'Personal Projects',
      'ongoing.project.desc': 'Problem-solving side projects, OSS contributions, prototypes, and technical validations',
      'ongoing.community.title': 'Community',
      'ongoing.community.desc': 'Meetups, knowledge sharing, mentoring, and community engagement'
    }
  };

  const applyTranslations = (lang: 'ja' | 'en') => {
    // 書字言語属性を更新
    document.documentElement.lang = lang;

    // data-i18n要素のテキストを置換
    document.querySelectorAll<HTMLElement>('[data-i18n]')
      .forEach(el => {
        const key = el.getAttribute('data-i18n') || '';
        const translation = i18n[lang] && i18n[lang][key];
        if (translation) {
          el.textContent = translation;
        }
      });

    // 言語ボタンのテキストを更新
    if (langBtn) {
      langBtn.textContent = lang === 'ja' ? '🌐 EN' : '🌐 JP';
      langBtn.setAttribute('aria-label', lang === 'ja' ? 'Switch to English' : '日本語に切り替え');
    }
  };

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

  // 言語制御の初期化
  const savedLang = (typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null) as 'ja' | 'en' | null;
  const initialLang: 'ja' | 'en' = savedLang || 'ja';
  root.setAttribute('data-lang', initialLang);
  applyTranslations(initialLang);

  // 言語切り替え
  langBtn?.addEventListener('click', () => {
    const current = (root.getAttribute('data-lang') as 'ja' | 'en') || 'ja';
    const next: 'ja' | 'en' = current === 'ja' ? 'en' : 'ja';
    localStorage.setItem('language', next);
    root.setAttribute('data-lang', next);
    document.documentElement.lang = next;
    applyTranslations(next);
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

  // 現在位置に応じたナビ有効化（内部アンカーのみ）
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('header .site-nav a[href^="#"]'));
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
          if ((entry as IntersectionObserverEntry).isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // シンプルな出現アニメーション
  const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if ((entry as IntersectionObserverEntry).isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('in');
            target.setAttribute('data-revealed', 'true');
            observer.unobserve(target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      // 各要素に遅延を設定して監視開始
      revealEls.forEach((el, i) => {
        observer.observe(el);
        el.style.transitionDelay = `${i * 100}ms`;
      });
    } else {
      // IntersectionObserverが使えない場合はすぐに表示
      revealEls.forEach((el) => {
        el.classList.add('in');
        el.setAttribute('data-revealed', 'true');
      });
    }
  }

  // サイト共通設定の読込（名前など）
  type SiteConfig = { name?: string };
  const applyName = (name: string) => {
    document.title = `${name} | ポートフォリオ`;
    const brand = document.querySelector<HTMLElement>('.brand');
    if (brand) brand.textContent = name;
    const display = document.getElementById('display-name');
    if (display) display.textContent = name;
    const footer = document.getElementById('footer-name');
    if (footer) footer.textContent = name;
  };
  fetch('site.config.json')
    .then((r) => (r.ok ? (r.json() as Promise<SiteConfig>) : Promise.resolve<SiteConfig>({})))
    .then((cfg: SiteConfig) => { if (cfg?.name) applyName(cfg.name); })
    .catch(() => { /* noop */ });
})();
