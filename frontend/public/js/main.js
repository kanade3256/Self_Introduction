(() => {
  'use strict';
  
  // パフォーマンス最適化: DOM要素の事前取得と最適化されたセレクタ
  const elements = {
    root: document.documentElement,
    metaTheme: document.getElementById('meta-theme-color'),
    navToggle: document.querySelector('.nav-toggle'),
    siteNav: document.getElementById('site-nav'),
    langBtn: document.getElementById('lang-toggle'),
    yearEl: document.getElementById('year')
  };
  
  // JSロード完了のマーク
  elements.root.classList.add('js-loaded');
  
  // ライトモード設定（最適化）
  elements.root.setAttribute('data-theme', 'light');
  if (elements.metaTheme) elements.metaTheme.setAttribute('content', '#0ea5e9');

  // 年の自動更新（最適化）
  if (elements.yearEl) elements.yearEl.textContent = new Date().getFullYear().toString();

  // 簡易 i18n 定義（コンパクト版 - 使用中のキーのみ）
  const i18n = {
    ja: {
      'nav.about': '自己紹介',
      'nav.projects': '制作物', 
      'nav.experience': '経歴',
      'nav.contact': '連絡',
      'index.hero.title': '現場に届く"運用される"プロダクトを作る',
      'index.about.title': '自己紹介',
      'index.projects.title': '注目プロジェクト',
      'index.contact.title': 'お問い合わせ'
    },
    en: {
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.experience': 'Experience', 
      'nav.contact': 'Contact',
      'index.hero.title': 'Building products that stay in operation',
      'index.about.title': 'About',
      'index.projects.title': 'Featured Projects',
      'index.contact.title': 'Contact'
    }
  };

  // 軽量化された言語切り替え機能
  const applyTranslations = (lang) => {
    document.documentElement.lang = lang;
    
    // 必要最小限のi18n適用（パフォーマンス重視）
    const i18nElements = document.querySelectorAll('[data-i18n]');
    if (i18nElements.length > 0) {
      i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) {
          el.textContent = i18n[lang][key];
        }
      });
    }
    
    // 言語ボタンのテキストを更新
    if (elements.langBtn) {
      elements.langBtn.textContent = lang === 'ja' ? '🌐 EN' : '🌐 JP';
      elements.langBtn.setAttribute('aria-label', lang === 'ja' ? 'Switch to English' : '日本語に切り替え');
    }
  };

  // 年の自動更新（最適化）
  if (elements.yearEl) elements.yearEl.textContent = new Date().getFullYear().toString();

  // 言語制御の初期化（最適化）
  const savedLang = localStorage.getItem('language') || 'ja';
  document.documentElement.setAttribute('data-lang', savedLang);
  applyTranslations(savedLang);

  // 言語切り替え（要素キャッシュ活用）
  elements.langBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-lang') || 'ja';
    const next = current === 'ja' ? 'en' : 'ja';
    localStorage.setItem('language', next);
    document.documentElement.setAttribute('data-lang', next);
    document.documentElement.lang = next;
    applyTranslations(next);
  });

  // モバイルナビ（要素キャッシュ活用）
  elements.navToggle?.addEventListener('click', () => {
    const isOpen = elements.siteNav?.classList.toggle('open');
    elements.navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
  
  // ナビリンククリック時にメニューを閉じる（イベント委譲で効率化）
  elements.siteNav?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      elements.siteNav.classList.remove('open');
      elements.navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

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
        
        // タイムアウト付きのfetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒でタイムアウト
        
        const response = await fetch(LAMBDA_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId);
        });
        
        console.log('Response status:', response.status);
        
        let result = {};
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            result = await response.json();
          } catch (parseError) {
            console.warn('Failed to parse JSON response:', parseError);
            result = { ok: false, error: 'Invalid JSON response' };
          }
        } else {
          const responseText = await response.text();
          result = {
            ok: response.ok,
            message: responseText || (response.ok ? '送信完了' : 'エラーが発生しました')
          };
        }
        
        console.log('Response data:', result);
        
        // ローディングダイアログを閉じる
        CustomDialog.hide(loadingDialog);
        
        if (response.ok && (result.ok !== false)) {
          // 成功
          CustomDialog.success(
            '送信完了',
            result.message || 'お問い合わせを受け付けました。ありがとうございます！'
          );
          contactForm.reset();
        } else {
          // エラー
          const errorMessage = result.error || result.message || `送信に失敗しました (${response.status})`;
          CustomDialog.error('送信失敗', errorMessage);
          console.error('Server error:', result);
        }
        
      } catch (error) {
        console.error('Contact form error:', error);
        
        // ローディングダイアログを閉じる
        CustomDialog.hide(loadingDialog);
        
        // エラーメッセージを判定
        let errorMessage = '予期しないエラーが発生しました';
        
        if (error.name === 'AbortError') {
          errorMessage = 'リクエストがタイムアウトしました。もう一度お試しください。';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
        } else {
          errorMessage = `エラー: ${error.message}`;
        }
          
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

  // ===== Phase4: Scroll-Depth Effects (rAF + CSS variables) =====
  (function(){
    if (document.documentElement.dataset.depth === 'off') return;

    const layer = document.querySelector('.depth-layer');
    const light = layer?.querySelector('.depth-layer__light');

    if (!layer || !light) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    function update() {
      ticking = false;

      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max)); // 0→1

      // カーブは"浅くゆっくり → 深く急に"の非線形で自然に
      const ease = (t) => 1 - Math.pow(1 - t, 1.8); // 好みで調整

      const t = ease(p);

      // 目安の範囲（必要なら微調整）
      const brightness = 1 - 0.45 * t;   // 1 → ~0.55
      const saturate   = 1 - 0.25 * t;   // 1 → ~0.75
      const blurPx     = 2 * t;          // 0 → 2px
      const lightB     = 1 - 0.4 * t;    // 1 → ~0.6

      // reduced motion の場合はJS更新を穏やかに
      if (prefersReduced) {
        layer.style.setProperty('--depth-brightness', String(Math.max(0.8, brightness)));
        layer.style.setProperty('--depth-saturate',   String(Math.max(0.85, saturate)));
        layer.style.setProperty('--depth-blur',       `${Math.min(1.2, blurPx)}px`);
        light.style.setProperty('--light-brightness', String(Math.max(0.75, lightB)));
      } else {
        layer.style.setProperty('--depth-brightness', String(brightness));
        layer.style.setProperty('--depth-saturate',   String(saturate));
        layer.style.setProperty('--depth-blur',       `${blurPx}px`);
        light.style.setProperty('--light-brightness', String(lightB));
      }
    }

    function onScroll(){
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    // 初期適用 & 監視
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  })();

  // ===== 動的泡エフェクト (リアルタイム生成) =====
  (function() {
    const foamContainer = document.getElementById('foam-container');
    if (!foamContainer) return;

    let foams = [];
    let clientWidth = document.documentElement.clientWidth;
    let clientHeight = document.documentElement.clientHeight;
    let documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    let isRunning = true;
    let animationId = null;

    // リサイズ対応
    window.addEventListener('resize', () => {
      clientWidth = document.documentElement.clientWidth;
      clientHeight = document.documentElement.clientHeight;
      documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
    });

    // パフォーマンス調整（reduced-motion対応）
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const foamInterval = prefersReduced ? 200 : 100; 
    const maxFoams = prefersReduced ? 20 : 40;

    // 泡の生成（最適化版）
    function createFoam() {
      if (foams.length >= maxFoams) return;

      const positionX = Math.floor(Math.random() * (clientWidth - 80)) + 40;
      const size = Math.floor(Math.random() * 20) + 8;
      const opacity = Math.random() * 0.6 + 0.3;

      const foam = document.createElement('div');
      foam.className = 'dynamic-bubble motion-okay';
      
      // CSS設定を効率化
      Object.assign(foam.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${positionX}px`,
        top: `${clientHeight}px`,
        opacity: opacity,
        position: 'fixed'
      });
      
      foam.style.setProperty('--size', `${size}px`);

      // クリックイベント（一度だけ実行される最適化）
      foam.addEventListener('click', handleBubbleClick, { once: true });

      foamContainer.appendChild(foam);
      foams.push({
        el: foam,
        startX: positionX,
        currentX: positionX,
        currentY: clientHeight,
        size: size,
        speed: Math.random() * 2 + 1.5,
        drift: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: Math.random() * 400 + 300,
        popped: false
      });
    }

    // バブルクリックハンドラ（最適化版）
    function handleBubbleClick(event) {
      const bubble = event.target;
      const foamIndex = foams.findIndex(foam => foam.el === bubble);
      
      if (foamIndex === -1 || foams[foamIndex].popped) return;

      // ポップアニメーション開始
      bubble.classList.add('popping');
      foams[foamIndex].popped = true;

      // アニメーション終了後に削除（最適化）
      bubble.addEventListener('animationend', () => {
        bubble.remove();
        foams.splice(foamIndex, 1);
      }, { once: true });

      // ポップエフェクト
      createPopEffect(event.clientX, event.clientY);
    }

    // ポップエフェクト（パフォーマンス最適化版）
    function createPopEffect(x, y) {
      const fragment = document.createDocumentFragment(); // DOM操作を一度にまとめる
      
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        
        // スタイル設定を効率化
        Object.assign(particle.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          width: '4px',
          height: '4px',
          background: 'rgba(135,206,235,0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: '1000'
        });

        fragment.appendChild(particle);

        // パーティクルアニメーション（最適化）
        const angle = (i / 6) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;

        particle.animate([
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          { transform: `translate(${endX-x-2}px, ${endY-y-2}px) scale(0)`, opacity: 0 }
        ], {
          duration: 400,
          easing: 'ease-out',
          fill: 'forwards'
        }).addEventListener('finish', () => particle.remove());
      }
      
      document.body.appendChild(fragment);
    }

    // 泡の動きを更新
    function updateFoams() {
      if (!isRunning) return;

      foams.forEach((foam, index) => {
        // ポップ済みの泡はスキップ
        if (foam.popped) return;

        foam.life++;
        
        // 確実に上昇させる（top座標系で上に向かって減少）
        foam.currentY -= foam.speed;
        
        // 左右の揺れを追加
        foam.currentX = foam.startX + Math.sin(foam.life * 0.02) * foam.drift * 20;
        
        // 境界チェック（画面外に出ないように）
        foam.currentX = Math.max(20, Math.min(clientWidth - 20, foam.currentX));

        // 位置を更新（topベースで座標設定）
        foam.el.style.left = `${foam.currentX}px`;
        foam.el.style.top = `${foam.currentY}px`;
        
        // サイズの変化（上昇につれて少し大きくなる）
        const scaleRatio = 1 + (foam.life * 0.001);
        foam.el.style.transform = `scale(${scaleRatio})`;
        
        // 透明度の変化（ライフサイクル）
        const lifeRatio = foam.life / foam.maxLife;
        let alpha = 1;
        if (lifeRatio > 0.7) {
          alpha = 1 - (lifeRatio - 0.7) * 3.33; // フェードアウト
        }
        foam.el.style.opacity = (parseFloat(foam.el.style.opacity) * alpha).toString();

        // 削除条件：
        // 1. 画面上部を超えた場合（top座標が-100より小さい）
        // 2. ライフサイクルが尽きた場合
        // 3. 透明度が極端に低くなった場合
        if (foam.currentY < -100 || 
            foam.life > foam.maxLife || 
            parseFloat(foam.el.style.opacity) < 0.1) {
          foam.el.remove();
          foams.splice(index, 1);
        }
      });

      animationId = requestAnimationFrame(updateFoams);
    }

    // ページの可視性変更時の制御
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
      } else {
        isRunning = true;
        updateFoams();
      }
    });

    // 初期化
    updateFoams();
    const foamGenerator = setInterval(createFoam, foamInterval);

    // クリーンアップ（ページアンロード時）
    window.addEventListener('beforeunload', () => {
      isRunning = false;
      clearInterval(foamGenerator);
      if (animationId) cancelAnimationFrame(animationId);
      foams = [];
    });

  })();

  // ===== 水中エフェクト: 海藻生成 =====
  (function() {
    const seaweedContainer = document.getElementById('seaweed-container');
    if (!seaweedContainer) return;

    const seaweedCount = 12; // 海藻の数
    const seaweedTypes = ['short', 'medium', 'tall', 'very-tall'];
    const seaweedWidths = ['thin', '', 'thick']; // thin, normal, thick

    // 海藻を生成
    for (let i = 0; i < seaweedCount; i++) {
      const seaweed = document.createElement('div');
      const position = (i / seaweedCount) * 100 + Math.random() * 5; // 均等配置 + ランダムオフセット
      const height = seaweedTypes[Math.floor(Math.random() * seaweedTypes.length)];
      const width = seaweedWidths[Math.floor(Math.random() * seaweedWidths.length)];
      const swayDuration = 3 + Math.random() * 4; // 3-7秒
      const swayDelay = Math.random() * 2; // 0-2秒の遅延
      const swayAngle = 5 + Math.random() * 10; // 5-15度の揺れ

      seaweed.className = `seaweed seaweed--${height} ${width ? `seaweed--${width}` : ''}`;
      seaweed.style.cssText = `
        left: ${position}%;
        --sway-duration: ${swayDuration}s;
        --sway-delay: ${swayDelay}s;
        --sway-angle: ${swayAngle}deg;
      `;

      seaweedContainer.appendChild(seaweed);
    }
  })();

  // ===== 水中エフェクト: 魚影生成 =====
  (function() {
    const fishContainer = document.getElementById('fish-container');
    if (!fishContainer) return;

    let fishAnimationId = null;
    const activeFish = [];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 魚影生成の間隔（秒）
    const fishInterval = prefersReduced ? 15000 : 8000; // 15秒 or 8秒

    function createFish() {
      if (activeFish.length >= 3) return; // 最大3匹まで

      const fish = document.createElement('div');
      const isLarge = Math.random() < 0.3; // 30%の確率で大きな魚
      const direction = Math.random() < 0.5 ? 1 : -1; // 左右どちらから来るか
      const yPosition = 20 + Math.random() * 60; // 画面の20-80%の高さ
      const speed = 1 + Math.random() * 2; // 1-3px/frame
      const opacity = 0.1 + Math.random() * 0.1; // 0.1-0.2

      fish.className = `fish-shadow ${isLarge ? 'fish-shadow--large' : ''}`;
      fish.style.cssText = `
        top: ${yPosition}%;
        ${direction === 1 ? 'left: -100px' : 'right: -100px'};
        opacity: 0;
        transform: ${direction === -1 ? 'scaleX(-1)' : 'scaleX(1)'};
      `;

      fishContainer.appendChild(fish);
      
      const fishData = {
        element: fish,
        direction: direction,
        speed: speed,
        life: 0,
        maxOpacity: opacity
      };
      
      activeFish.push(fishData);

      // フェードイン
      setTimeout(() => {
        fish.style.opacity = fishData.maxOpacity.toString();
        fish.style.transition = 'opacity 1s ease-in';
      }, 100);
    }

    function updateFish() {
      const screenWidth = window.innerWidth;
      
      activeFish.forEach((fishData, index) => {
        fishData.life++;
        const fish = fishData.element;
        
        // 位置を更新
        if (fishData.direction === 1) {
          // 左から右へ
          const newX = -100 + (fishData.life * fishData.speed);
          fish.style.left = `${newX}px`;
          
          // 画面外に出たら削除
          if (newX > screenWidth + 100) {
            fish.remove();
            activeFish.splice(index, 1);
          }
        } else {
          // 右から左へ
          const newX = screenWidth + 100 - (fishData.life * fishData.speed);
          fish.style.right = `${screenWidth - newX}px`;
          
          // 画面外に出たら削除
          if (newX < -100) {
            fish.remove();
            activeFish.splice(index, 1);
          }
        }

        // 中間点でフェードアウト開始
        const progress = fishData.life * fishData.speed / (screenWidth + 200);
        if (progress > 0.7) {
          const fadeOpacity = fishData.maxOpacity * (1 - (progress - 0.7) * 3.33);
          fish.style.opacity = Math.max(0, fadeOpacity).toString();
        }
      });
      
      fishAnimationId = requestAnimationFrame(updateFish);
    }

    // ページの可視性変更時の制御
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (fishAnimationId) cancelAnimationFrame(fishAnimationId);
      } else {
        updateFish();
      }
    });

    // 初期化
    updateFish();
    const fishGenerator = setInterval(createFish, fishInterval);

    // クリーンアップ
    window.addEventListener('beforeunload', () => {
      clearInterval(fishGenerator);
      if (fishAnimationId) cancelAnimationFrame(fishAnimationId);
      activeFish.length = 0;
    });

  })();

})();
