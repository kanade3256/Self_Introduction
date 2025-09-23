(() => {
  // JSが読み込まれたことを示すクラスを追加
  document.documentElement.classList.add('js-loaded');
  
  const root = document.documentElement;
  const metaTheme = document.getElementById('meta-theme-color');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const themeBtn = document.getElementById('theme-toggle');
  const langBtn = document.getElementById('lang-toggle');
  const yearEl = document.getElementById('year');

  // 簡易 i18n 定義（必要に応じて拡張）
  const i18n = {
    ja: {
      'nav.about': '自己紹介',
      'nav.projects': '制作物',
      'nav.experience': '経歴',
      'nav.skills': 'スキル',
      'nav.timeline': 'タイムライン',
      'nav.resume': '履歴書',
      'nav.contact': '連絡',
      'breadcrumb.home': 'ホーム',
      'index.hero.eyebrow': 'Serverless × Data / 実装から運用まで',
      'index.hero.title': '現場に届く“運用される”プロダクトを作る',
      'index.hero.subtitle': 'Serverless × Data を軸に、業務現場と研究の双方で成果を出す実装・改善サイクルを回しています。',
      'index.hero.cta.resume': '履歴書を見る',
      'index.hero.cta.github': 'GitHub',
      'index.hero.cta.contact': 'お問い合わせ',
      'index.about.eyebrow': '価値提供の軸',
      'index.about.title': '自己紹介',
      'index.about.lead': 'データとクラウドを武器に、課題解決から運用改善、リサーチまで横断的に取り組んでいます。',
      'index.projects.eyebrow': 'Selected Work',
      'index.projects.title': '注目プロジェクト',
      'index.projects.lead': '実務・研究・個人開発から厳選した3プロジェクトと研究ハイライト。',
      'index.experience.eyebrow': 'Timeline',
      'index.experience.title': '歩み',
      'index.experience.lead': '密な出来事を整理し、成果と学習の文脈が一目でわかるタイムライン。',
      'index.experience.cta': 'タイムラインを詳しく見る',
      'index.skills.eyebrow': 'Skill Radar',
      'index.skills.title': 'スキル',
      'index.skills.lead': '密度を抑えた3レイヤー構成で、日々の実装・協働・学習のフォーカスを整理しています。',
      'index.contact.eyebrow': 'Get in touch',
      'index.contact.title': 'お問い合わせ',
      'contact.cta.title': 'お気軽にお問い合わせください',
      'contact.cta.body': 'お仕事のご相談、技術的な質問、コラボレーションなど、どんなことでもお気軽にご連絡ください。',
      'timeline.title': 'タイムライン・実績',
      'timeline.summary': '学習・開発・研究・受賞・登壇などの歩みを時系列で紹介します。継続的な成長と挑戦の軌跡をご覧ください。',
      'timeline.ongoing.title': '継続的な取り組み'
    },
    en: {
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.experience': 'Experience',
      'nav.skills': 'Skills',
      'nav.timeline': 'Timeline',
      'nav.resume': 'Resume',
      'nav.contact': 'Contact',
      'breadcrumb.home': 'Home',
      'index.hero.eyebrow': 'Serverless × Data / Operational Impact',
      'index.hero.title': 'Building products that stay in operation',
      'index.hero.subtitle': 'Delivering measurable outcomes across data platforms and serverless operations with an iterate-and-improve cycle.',
      'index.hero.cta.resume': 'View Resume',
      'index.hero.cta.github': 'GitHub',
      'index.hero.cta.contact': 'Contact',
      'index.about.eyebrow': 'Who I build for',
      'index.about.title': 'About',
      'index.about.lead': 'I connect data, cloud, and research to solve problems end to end—from discovery to sustainable operations.',
      'index.projects.eyebrow': 'Selected Work',
      'index.projects.title': 'Featured Projects',
      'index.projects.lead': 'Three flagship engagements plus a research highlight with KPIs front and center.',
      'index.experience.eyebrow': 'Timeline',
      'index.experience.title': 'Journey',
      'index.experience.lead': 'A readable track of milestones, impact, and learning moments.',
      'index.experience.cta': 'View full timeline',
      'index.skills.eyebrow': 'Skill Radar',
      'index.skills.title': 'Skills',
      'index.skills.lead': 'Three layers that clarify daily delivery, weekly collaboration, and ongoing learning.',
      'index.contact.eyebrow': 'Get in touch',
      'index.contact.title': 'Contact',
      'contact.cta.title': 'Get In Touch',
      'contact.cta.body': 'Feel free to reach out for work opportunities, technical questions, or collaboration.',
      'timeline.title': 'Timeline & Achievements',
      'timeline.summary': 'A chronological journey of learning, delivery, research, awards, and talks.',
      'timeline.ongoing.title': 'Ongoing Initiatives'
    }
  };

  const applyTranslations = (lang) => {
    // 書字言語属性を更新
    document.documentElement.lang = lang;
    
    // data-i18n要素のテキストを置換
    document.querySelectorAll('[data-i18n]')
      .forEach(el => {
        const key = el.getAttribute('data-i18n');
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

  // 言語制御の初期化
  const savedLang = localStorage.getItem('language') || 'ja';
  root.setAttribute('data-lang', savedLang);
  applyTranslations(savedLang);

  // 言語切り替え
  langBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-lang') || 'ja';
    const next = current === 'ja' ? 'en' : 'ja';
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
  siteNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // 現在位置に応じたナビ有効化（内部リンクのみ）
  const navLinks = Array.from(document.querySelectorAll('header .site-nav a[href^="#"]'));
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

  // シンプルな出現アニメーション
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            entry.target.setAttribute('data-revealed', 'true');
            // 一度表示されたら監視を停止
            observer.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      // 各要素に遅延を設定して監視開始
      revealEls.forEach((el, i) => {
        observer.observe(el);
        // 時差をつけるためのdelay設定
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
  
  // カスタムダイアログ機能
  const CustomDialog = {
    create() {
      const overlay = document.createElement('div');
      overlay.className = 'custom-dialog-overlay';
      overlay.innerHTML = `
        <div class="custom-dialog">
          <div class="custom-dialog-header">
            <div class="custom-dialog-icon">
              <span class="icon-content"></span>
            </div>
            <h3 class="custom-dialog-title"></h3>
          </div>
          <div class="custom-dialog-content">
            <p class="custom-dialog-message"></p>
          </div>
          <div class="custom-dialog-actions">
            <button class="custom-dialog-btn primary" data-action="close">OK</button>
          </div>
        </div>
      `;
      
      // クリックイベント
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.dataset.action === 'close') {
          this.hide(overlay);
        }
      });
      
      return overlay;
    },
    
    show(type, title, message, options = {}) {
      const dialog = this.create();
      const icon = dialog.querySelector('.custom-dialog-icon');
      const iconContent = dialog.querySelector('.icon-content');
      const titleEl = dialog.querySelector('.custom-dialog-title');
      const messageEl = dialog.querySelector('.custom-dialog-message');
      
      // アイコンとタイトルを設定
      icon.className = `custom-dialog-icon ${type}`;
      switch (type) {
        case 'success':
          iconContent.innerHTML = '✓';
          break;
        case 'error':
          iconContent.innerHTML = '✕';
          break;
        case 'loading':
          iconContent.innerHTML = '<div class="loading-spinner"></div>';
          break;
        default:
          iconContent.innerHTML = 'i';
      }
      
      titleEl.textContent = title;
      messageEl.textContent = message;
      
      // アクションボタンをカスタマイズ
      if (options.actions) {
        const actionsEl = dialog.querySelector('.custom-dialog-actions');
        actionsEl.innerHTML = '';
        options.actions.forEach(action => {
          const btn = document.createElement('button');
          btn.className = `custom-dialog-btn ${action.type || 'secondary'}`;
          btn.textContent = action.text;
          btn.addEventListener('click', () => {
            if (action.handler) action.handler();
            this.hide(dialog);
          });
          actionsEl.appendChild(btn);
        });
      }
      
      document.body.appendChild(dialog);
      
      // アニメーション開始
      requestAnimationFrame(() => {
        dialog.classList.add('show');
      });
      
      return dialog;
    },
    
    hide(dialog) {
      dialog.classList.remove('show');
      setTimeout(() => {
        if (dialog.parentNode) {
          document.body.removeChild(dialog);
        }
      }, 300);
    },
    
    success(title, message) {
      return this.show('success', title, message);
    },
    
    error(title, message) {
      return this.show('error', title, message);
    },
    
    loading(title, message) {
      return this.show('loading', title, message);
    }
  };

  // 問い合わせフォーム処理
  const contactForm = document.querySelector('.message-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      
      // フォームデータを取得
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company') || '個人',
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
      };
      
      // ローディングダイアログを表示
      const loadingDialog = CustomDialog.loading(
        '送信中', 
        'お問い合わせを送信しています...'
      );
      
      try {
        // 送信中の表示
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
        
        // Lambda Function URLに送信
        const LAMBDA_FUNCTION_URL = 'https://62flbecxayglut7qkfrqfisohi0wtoes.lambda-url.ap-northeast-1.on.aws/';
        
        console.log('Sending data:', data);
        
        const response = await fetch(LAMBDA_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        const responseText = await response.text();
        console.log('Response body:', responseText);
        let result;
        if (responseText) {
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            console.warn('Failed to parse JSON response:', parseError, responseText);
            result = {
              ok: false,
              error: responseText || ('HTTP ' + response.status + ' ' + (response.statusText || ''))
            };
          }
        } else {
          result = { ok: response.ok };
        }
        console.log('Response data:', result);
        
        // ローディングダイアログを閉じる
        CustomDialog.hide(loadingDialog);
        
        if (response.ok && result.ok) {
          // 成功
          CustomDialog.success(
            '送信完了',
            result.message || 'お問い合わせを受け付けました。ありがとうございます！'
          );
          contactForm.reset();
        } else {
          // エラー
          const errorMessage = result.error || `送信に失敗しました (${response.status})`;
          CustomDialog.error('送信失敗', errorMessage);
          console.error('Server error:', result);
        }
        
      } catch (error) {
        console.error('Contact form error:', error);
        
        // ローディングダイアログを閉じる
        CustomDialog.hide(loadingDialog);
        
        // ネットワークエラーかその他のエラーかを判定
        const errorMessage = error.name === 'TypeError' && error.message.includes('fetch')
          ? 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
          : `予期しないエラーが発生しました: ${error.message}`;
          
        CustomDialog.error('送信エラー', errorMessage);
      } finally {
        // ボタンを元に戻す
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // プロジェクト横スライダー機能
  const projectsSlider = document.getElementById('projects-slider');
  if (projectsSlider) {
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    const indicators = document.getElementById('projects-indicators');
    const slides = track?.querySelectorAll('.projects-horizontal-slide');
    
    if (track && slides && slides.length > 0) {
      let currentSlide = 0;
      const totalSlides = slides.length;

      // スライダー状態を更新
      const updateSlider = () => {
        // トラックの位置を更新
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // インジケータを更新
        if (indicators) {
          indicators.querySelectorAll('.projects-horizontal-slider__indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
          });
        }
        
        // ナビゲーションボタンの状態を更新
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
      };

      // 前のスライドに移動
      const goToPrevSlide = () => {
        if (currentSlide > 0) {
          currentSlide--;
          updateSlider();
        }
      };

      // 次のスライドに移動
      const goToNextSlide = () => {
        if (currentSlide < totalSlides - 1) {
          currentSlide++;
          updateSlider();
        }
      };

      // 特定のスライドに移動
      const goToSlide = (slideIndex) => {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
          currentSlide = slideIndex;
          updateSlider();
        }
      };

      // イベントリスナーを設定
      prevBtn?.addEventListener('click', goToPrevSlide);
      nextBtn?.addEventListener('click', goToNextSlide);

      // インジケータクリック
      indicators?.addEventListener('click', (e) => {
        const indicator = e.target.closest('.projects-horizontal-slider__indicator');
        if (indicator) {
          const slideIndex = parseInt(indicator.dataset.slide);
          goToSlide(slideIndex);
        }
      });

      // キーボードナビゲーション
      projectsSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrevSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNextSlide();
        }
      });

      // タッチ/スワイプサポート
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      let startTime = 0;

      const handleTouchStart = (e) => {
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        currentX = startX;
        isDragging = true;
        startTime = Date.now();
        track.style.transition = 'none';
      };

      const handleTouchMove = (e) => {
        if (!isDragging) return;
        
        currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;
        const currentTransform = -currentSlide * 100;
        const newTransform = currentTransform + (deltaX / track.offsetWidth) * 100;
        
        track.style.transform = `translateX(${newTransform}%)`;
      };

      const handleTouchEnd = () => {
        if (!isDragging) return;
        
        isDragging = false;
        track.style.transition = 'transform 240ms ease';
        
        const deltaX = currentX - startX;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / deltaTime;
        
        // スワイプ判定（距離または速度）
        const threshold = track.offsetWidth * 0.2; // 20%の距離
        const velocityThreshold = 0.5; // px/ms
        
        if (Math.abs(deltaX) > threshold || velocity > velocityThreshold) {
          if (deltaX > 0) {
            goToPrevSlide();
          } else {
            goToNextSlide();
          }
        } else {
          updateSlider(); // 元の位置に戻す
        }
      };

      // タッチイベント
      track.addEventListener('touchstart', handleTouchStart, { passive: true });
      track.addEventListener('touchmove', handleTouchMove, { passive: true });
      track.addEventListener('touchend', handleTouchEnd);

      // マウスイベント（デスクトップでのドラッグ）
      track.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleTouchStart(e);
      });
      
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          e.preventDefault();
          handleTouchMove(e);
        }
      });
      
      document.addEventListener('mouseup', () => {
        if (isDragging) {
          handleTouchEnd();
        }
      });

      // 初期状態を設定
      updateSlider();

      // スライダーをフォーカス可能にする
      projectsSlider.setAttribute('tabindex', '0');
    }
  }

})();
