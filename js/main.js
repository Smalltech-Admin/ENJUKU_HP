/* ============================================
   株式会社炎熟 - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.getAttribute('data-page');

  // --- Loading Screen ---
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 600);
    });
    // Fallback: hide after 3 seconds
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 3000);
  }

  // --- Navigation Scroll Effect ---
  const header = document.querySelector('.nav-header');
  const scrollThreshold = 50;

  function updateNav() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Sub pages: always show scrolled header (no hero) ---
  if (currentPage !== 'home') {
    header.classList.add('scrolled');
  }

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll Animation (IntersectionObserver) ---
  const fadeElements = document.querySelectorAll('.fade-up');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // --- Smooth Scroll for same-page anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // If target doesn't exist on this page, let browser navigate normally
    });
  });

  // --- Scroll to Top Button ---
  const scrollTopBtn = document.querySelector('.scroll-top');

  function updateScrollTopBtn() {
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateScrollTopBtn, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Counter Animation ---
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * countTo);
          target.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // --- Active Section Highlight (home page only) ---
  if (currentPage === 'home') {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function highlightNav() {
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = '#F97316';
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
  }
});
