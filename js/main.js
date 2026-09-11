/**
 * 宵の宿 蒸 - MUSU HOTEL & RETREAT -
 * main.js
 * 文字の動き（SplitText）＆全体のスムーズアニメーション制御
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. 文字アニメーション (SplitText & Stagger)
  // ==========================================================================
  const splitTextElements = document.querySelectorAll('.js-split-text');

  splitTextElements.forEach(el => {
    // 既に分割されていないか確認
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = 'true';

    const rawText = el.textContent.trim();
    el.textContent = ''; // 一旦クリア

    let charCount = 0;
    Array.from(rawText).forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('split-char');
      
      // 句点（。）の特別演出
      if (char === '。') {
        span.classList.add('is-dot');
      }

      span.style.setProperty('--char-i', charCount);
      el.appendChild(span);
      charCount++;
    });
  });

  // ==========================================================================
  // 2. スクロール連動リビール（IntersectionObserver）
  // ==========================================================================
  const revealTargets = document.querySelectorAll(
    '.reveal-up, .photo-card, .card-feature, .price-table-wrapper, .form-box, .js-split-text, .text-card'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px', // 画面内に少し入ったら発火
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度表示されたら監視解除（スムーズな定着）
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealTargets.forEach(target => {
    revealObserver.observe(target);
  });

  // ファーストビューの要素は読み込み完了後に即時アニメーション
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title.js-split-text');
    if (heroTitle) {
      heroTitle.classList.add('is-visible');
    }
    const heroElements = document.querySelectorAll('.hero-section .reveal-up');
    heroElements.forEach(el => el.classList.add('is-visible'));
  }, 150);

  // ==========================================================================
  // 3. 写真カードの微細なスクロール視差（Parallax）
  // ==========================================================================
  const photoCards = document.querySelectorAll('.photo-card-img');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    photoCards.forEach(img => {
      const rect = img.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 画面内に見えている間だけ微細にY軸を動かす
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (rect.top - windowHeight / 2) * 0.04;
        img.style.transform = `scale(1.03) translateY(${offset}px)`;
      }
    });
  }, { passive: true });

  // ==========================================================================
  // 4. スクロールによるヘッダーのシャドウ
  // ==========================================================================
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 18px rgba(33, 24, 21, 0.08)';
      header.style.backgroundColor = 'rgba(246, 245, 243, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(246, 245, 243, 0.96)';
    }
  }, { passive: true });

  // ==========================================================================
  // 5. ご予約モーダル制御
  // ==========================================================================
  const reservationModal = document.getElementById('reservationModal');
  const openModalBtns = document.querySelectorAll('.js-open-reserve');
  const closeModalBtns = document.querySelectorAll('.js-close-modal');

  function openModal() {
    if (!reservationModal) return;
    reservationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!reservationModal) return;
    reservationModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan');
      if (planName) {
        const planSelect = document.getElementById('modal-plan');
        if (planSelect) planSelect.value = planName;
      }
      openModal();
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (reservationModal) {
    reservationModal.addEventListener('click', (e) => {
      if (e.target === reservationModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reservationModal && reservationModal.classList.contains('active')) {
      closeModal();
    }
  });

  // モーダル予約フォーム送信シミュレーション
  const modalForm = document.getElementById('modalReservationForm');
  const modalToast = document.getElementById('modalReservationToast');

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        modalForm.reset();

        if (modalToast) {
          modalToast.style.display = 'block';
          setTimeout(() => {
            closeModal();
            modalToast.style.display = 'none';
          }, 2200);
        } else {
          closeModal();
        }
      }, 650);
    });
  }

  // ==========================================================================
  // 6. お問い合わせフォーム送信シミュレーション
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const contactToast = document.getElementById('contactToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        contactForm.reset();

        if (contactToast) {
          contactToast.style.display = 'block';
          contactToast.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            contactToast.style.display = 'none';
          }, 6000);
        }
      }, 650);
    });
  }

  // ==========================================================================
  // 7. ページ内リンクのスムーズスクロール
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
