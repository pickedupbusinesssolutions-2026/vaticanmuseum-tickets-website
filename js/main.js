/**
 * RomeTickets - Main JavaScript
 * Handles: Nav toggle, FAQ accordion, Sticky bar, Scroll-to-top, Newsletter, Animations
 */

(function () {
  'use strict';

  /* =====================================================
     MOBILE NAV TOGGLE
  ===================================================== */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll when mobile nav is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* =====================================================
     FAQ ACCORDION
  ===================================================== */
  window.toggleFaq = function (btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    const icon = btn.querySelector('.faq-icon');

    // Close all other open FAQs
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle current
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
  };

  /* =====================================================
     SCROLL-TO-TOP BUTTON
  ===================================================== */
  const scrollTopBtn = document.getElementById('scrollTop');
  const stickyBook = document.querySelector('.sticky-book');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Show scroll-to-top after 400px
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', scrollY > 400);
    }

    // Show sticky booking bar after 600px (on attraction/ticket pages)
    if (stickyBook) {
      stickyBook.classList.toggle('visible', scrollY > 600);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* =====================================================
     NEWSLETTER FORM
  ===================================================== */
  window.handleNewsletter = function (e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email');
    const btn = e.target.querySelector('button');

    if (!email || !email.value) return;

    // Simulate submission
    btn.textContent = '✓ You\'re in!';
    btn.style.background = '#27ae60';
    btn.style.color = 'white';
    btn.disabled = true;
    email.value = '';

    setTimeout(() => {
      btn.textContent = 'Get Free Tips';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 4000);
  };

  /* =====================================================
     INTERSECTION OBSERVER - SCROLL ANIMATIONS
  ===================================================== */
  const observeElements = () => {
    const animStyle = document.createElement('style');
    animStyle.textContent = `
      .anim-item {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .anim-item.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(animStyle);

    const targets = document.querySelectorAll(
      '.ticket-card, .guide-card, .know-item, .attraction-card, .stat-item, .review-chip'
    );

    targets.forEach(el => el.classList.add('anim-item'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger the animation with delay
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, (i % 3) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  };

  /* =====================================================
     ACTIVE NAV LINK HIGHLIGHTING
  ===================================================== */
  const highlightActiveNav = () => {
    const path = window.location.pathname;
    document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && path.includes(href) && href !== '/') {
        link.style.color = 'var(--color-red)';
      }
    });
  };

  /* =====================================================
     SMOOTH ANCHOR SCROLLING
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =====================================================
     TICKET CARD AFFILIATE LINK TRACKING
  ===================================================== */
  const trackAffiliateClick = (btn) => {
    const card = btn.closest('[id]');
    const id = card ? card.id : 'unknown';
    // In production: send to analytics (GA4, etc.)
    console.log(`[Affiliate Click] → ${id}`);
  };

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => trackAffiliateClick(btn));
  });

  /* =====================================================
     STATS COUNTER ANIMATION
  ===================================================== */
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
      const em = counter.querySelector('em');
      const suffix = em ? em.textContent : '';

      // Extract the main number text excluding any suffix in <em>
      const textNode = Array.from(counter.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      const text = textNode ? textNode.textContent.trim() : (counter.textContent || '').replace(suffix, '').trim();
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;

      const prefix = text.replace(/[0-9.]+.*/, '');
      const isDecimal = text.includes('.');

      let start = 0;
      const duration = 1500;
      const step = num / (duration / 16);

      const update = () => {
        start = Math.min(start + step, num);
        const display = isDecimal ? start.toFixed(1) : Math.floor(start);
        counter.innerHTML = `${prefix}${display}<em>${suffix}</em>`;
        if (start < num) requestAnimationFrame(update);
      };

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { update(); obs.disconnect(); }
      }, { threshold: 0.5 });
      obs.observe(counter);
    });
  };

  /* =====================================================
     REVIEWS SCROLL AUTO-PLAY
  ===================================================== */
  const autoScrollReviews = () => {
    const scrollEl = document.querySelector('.reviews-scroll');
    if (!scrollEl) return;

    let isPaused = false;
    scrollEl.addEventListener('mouseenter', () => isPaused = true);
    scrollEl.addEventListener('mouseleave', () => isPaused = false);
    scrollEl.addEventListener('touchstart', () => isPaused = true, { passive: true });

    setInterval(() => {
      if (isPaused) return;
      if (scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth - 10) {
        scrollEl.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollEl.scrollBy({ left: 280, behavior: 'smooth' });
      }
    }, 3000);
  };

  /* =====================================================
     HEADER SHADOW ON SCROLL
  ===================================================== */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,0.10)'
        : '0 2px 12px rgba(0,0,0,0.06)';
    }, { passive: true });
  }

  /* =====================================================
     DESKTOP NAV DROPDOWN CONTROLLER (Hover-Intent & Anti-Stuck)
  ===================================================== */
  const initNavDropdowns = () => {
    const navItems = document.querySelectorAll('.main-nav .nav-item, .site-nav .nav-item');
    if (!navItems.length) return;

    let activeItem = null;
    let openTimer = null;
    let closeTimer = null;

    const closeAll = () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      navItems.forEach(item => {
        item.classList.remove('is-open');
        item.classList.add('menu-force-closed');
      });
      activeItem = null;
      // Re-enable normal hover state after a short delay
      setTimeout(() => {
        navItems.forEach(item => item.classList.remove('menu-force-closed'));
      }, 80);
    };

    const openDropdown = (item) => {
      clearTimeout(closeTimer);
      if (activeItem && activeItem !== item) {
        activeItem.classList.remove('is-open');
        activeItem.classList.add('menu-force-closed');
      }
      activeItem = item;
      item.classList.remove('menu-force-closed');
      item.classList.add('is-open');
    };

    const scheduleOpen = (item) => {
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      // 120ms hover intent: ignores accidental cursor crossing
      openTimer = setTimeout(() => {
        openDropdown(item);
      }, 120);
    };

    const scheduleClose = (item) => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      // 180ms grace exit window
      closeTimer = setTimeout(() => {
        if (activeItem === item) {
          item.classList.remove('is-open');
          activeItem = null;
        }
      }, 180);
    };

    navItems.forEach(item => {
      const dropdown = item.querySelector('.dropdown');
      if (!dropdown) return;

      item.addEventListener('mouseenter', () => scheduleOpen(item));
      item.addEventListener('mouseleave', () => scheduleClose(item));

      // Close when clicking a link inside dropdown
      dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeAll());
      });
    });

    // Close immediately on page scroll so sticky headers never cover reading area
    window.addEventListener('scroll', () => {
      if (activeItem) closeAll();
    }, { passive: true });

    // Close immediately when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav')) {
        closeAll();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });
  };

  /* =====================================================
     TICKET FILTER TABS
  ===================================================== */
  const initTicketFilters = () => {
    const filterBars = document.querySelectorAll('.ticket-filters-bar');
    if (!filterBars.length) return;

    filterBars.forEach(bar => {
      const buttons = bar.querySelectorAll('.t-filter');
      const section = bar.closest('section') || document;
      const grid = section.querySelector('#ticketsGrid') || section.querySelector('.cards-grid-3');
      if (!grid) return;

      const cards = grid.querySelectorAll('.listing-card, .ticket-card');

      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.getAttribute('data-filter');

          cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.classList.remove('hidden');
              card.style.display = 'flex';
              card.style.animation = 'fadeIn 0.35s ease';
            } else {
              card.classList.add('hidden');
              card.style.display = 'none';
            }
          });
        });
      });
    });
  };

  /* =====================================================
     EXTERNAL LINKS (OPEN IN NEW TAB ONLY)
  ===================================================== */
  const initExternalLinks = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      // Check if link is external (starts with http/https)
      if (/^https?:\/\//i.test(href)) {
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin) {
            // External link: ensure it opens in a new tab without leaving current site
            link.setAttribute('target', '_blank');
            const currentRel = link.getAttribute('rel') || '';
            if (!currentRel.includes('noopener')) {
              link.setAttribute('rel', currentRel ? `${currentRel} noopener` : 'noopener');
            }
          }
        } catch (err) {}
      }
    }, { capture: true });
  };

  /* =====================================================
     INIT
  ===================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initExternalLinks();
    initNavDropdowns();
    initTicketFilters();
    observeElements();
    highlightActiveNav();
    animateCounters();
    autoScrollReviews();
  });

})();
