/**
 * Vortex informatika d.o.o. — Main Script
 * Navigation, scroll effects, cookie consent, contact form
 */

(function () {
  'use strict';

  /* ==========================================================================
     Cookie Consent
     ========================================================================== */

  var COOKIE_STORAGE_KEY = 'vortex_cookie_consent';

  /**
   * Load saved cookie preferences from localStorage.
   * @returns {Object|null}
   */
  function loadCookieConsent() {
    try {
      var raw = localStorage.getItem(COOKIE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Save cookie preferences to localStorage.
   * @param {Object} consent
   */
  function saveCookieConsent(consent) {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      /* localStorage unavailable */
    }
  }

  /**
   * Initialize analytics tools after user consent.
   * Add Google Analytics or other tracking here.
   * This function is ONLY called when analytics consent is granted.
   */
  function initAnalytics() {
    /* PLACEHOLDER: Insert analytics initialization here.
       Example:
       var script = document.createElement('script');
       script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
       script.async = true;
       document.head.appendChild(script);
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_MEASUREMENT_ID');
    */
    console.info('[Vortex] Analitički kolačići aktivirani — spremno za integraciju analitike.');
  }

  /**
   * Initialize marketing tools after user consent.
   * Add marketing pixels or tags here.
   */
  function initMarketing() {
    /* PLACEHOLDER: Insert marketing pixel initialization here. */
    console.info('[Vortex] Marketinški kolačići aktivirani — spremno za integraciju marketing alata.');
  }

  /**
   * Apply consent choices and load permitted scripts.
   * @param {Object} consent
   */
  function applyConsent(consent) {
    if (consent.analytics) {
      initAnalytics();
    }
    if (consent.marketing) {
      initMarketing();
    }
  }

  function initCookieConsent() {
    var banner = document.getElementById('cookie-banner');
    var overlay = document.getElementById('cookie-modal-overlay');
    var modal = document.getElementById('cookie-modal');
    var acceptAllBtn = document.getElementById('cookie-accept-all');
    var rejectAllBtn = document.getElementById('cookie-reject-all');
    var openSettingsBtn = document.getElementById('cookie-open-settings');
    var closeModalBtn = document.getElementById('cookie-modal-close');
    var saveBtn = document.getElementById('cookie-save');
    var analyticsToggle = document.getElementById('cookie-analytics');
    var marketingToggle = document.getElementById('cookie-marketing');
    var footerSettingsLink = document.getElementById('footer-cookie-settings');

    if (!overlay || !modal) return;

    var saved = loadCookieConsent();

    if (saved) {
      applyConsent(saved);
    } else if (banner) {
      banner.hidden = false;
    }

    function hideBanner() {
      if (banner) banner.hidden = true;
    }

    function openModal() {
      if (saved && analyticsToggle && marketingToggle) {
        analyticsToggle.checked = !!saved.analytics;
        marketingToggle.checked = !!saved.marketing;
      }
      overlay.classList.add('is-open');
      overlay.hidden = false;
      if (banner) banner.hidden = true;
      if (closeModalBtn) closeModalBtn.focus();
      document.body.classList.add('cookie-modal-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.hidden = true;
      document.body.classList.remove('cookie-modal-open');
      document.body.style.overflow = '';
      if (!saved && banner) banner.hidden = false;
    }

    function setConsent(analytics, marketing) {
      var consent = {
        necessary: true,
        analytics: analytics,
        marketing: marketing,
        timestamp: new Date().toISOString()
      };
      saveCookieConsent(consent);
      saved = consent;
      applyConsent(consent);
      hideBanner();
      closeModal();
    }

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function () {
        setConsent(true, true);
      });
    }

    if (rejectAllBtn) {
      rejectAllBtn.addEventListener('click', function () {
        setConsent(false, false);
      });
    }

    if (openSettingsBtn) {
      openSettingsBtn.addEventListener('click', openModal);
    }

    if (footerSettingsLink) {
      footerSettingsLink.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        setConsent(
          analyticsToggle ? analyticsToggle.checked : false,
          marketingToggle ? marketingToggle.checked : false
        );
      });
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeModal();
      }
    });

    if (modal) {
      modal.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeModal();
      }
    });

    /* Trap focus within modal */
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !overlay.classList.contains('is-open')) return;

      var focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ==========================================================================
     Mobile Navigation
     ========================================================================== */

  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');

    if (!hamburger || !nav) return;

    function closeNav() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Otvori navigaciju');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openNav() {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Zatvori navigaciju');
      nav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    hamburger.addEventListener('click', function () {
      if (nav.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
      }
    });
  }

  /* ==========================================================================
     Smooth Scroll & Active Nav
     ========================================================================== */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
      });
    });
  }

  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ==========================================================================
     Scroll Reveal Animations
     ========================================================================== */

  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     Sticky Header & Back to Top
     ========================================================================== */

  function initScrollUI() {
    var header = document.getElementById('site-header');
    var backToTop = document.getElementById('back-to-top');
    var scrollThreshold = 400;

    function onScroll() {
      var scrollY = window.scrollY;

      if (header) {
        header.classList.toggle('scrolled', scrollY > 20);
      }

      if (backToTop) {
        var show = scrollY > scrollThreshold;
        backToTop.hidden = !show;
        backToTop.classList.toggle('visible', show);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     Contact Form (Frontend Only)
     ========================================================================== */

  function initContactForm() {
    var form = document.getElementById('contact-form');
    var feedback = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#contact-name');
      var email = form.querySelector('#contact-email');
      var message = form.querySelector('#contact-message');
      var privacy = form.querySelector('#contact-privacy');

      feedback.classList.remove('error');
      feedback.textContent = '';

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        feedback.classList.add('error');
        feedback.textContent = 'Molimo ispunite sva obavezna polja.';
        return;
      }

      if (!privacy.checked) {
        feedback.classList.add('error');
        feedback.textContent = 'Potrebna je suglasnost s politikom privatnosti.';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        feedback.classList.add('error');
        feedback.textContent = 'Unesite ispravnu e-mail adresu.';
        return;
      }

      feedback.textContent = 'Poruka je pripremljena. Za produkcijsko slanje potrebno je povezati backend ili mail servis.';
      form.reset();
    });
  }

  /* ==========================================================================
     Initialize
     ========================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    initCookieConsent();
    initMobileNav();
    initSmoothScroll();
    initActiveNav();
    initScrollReveal();
    initScrollUI();
    initContactForm();
  });
})();
