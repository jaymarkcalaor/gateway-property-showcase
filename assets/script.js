// Gateway — Luxury Edition interactive bits
document.addEventListener('DOMContentLoaded', () => {

  // Mobile menu toggle with morphing hamburger
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header: transparent over hero, solid on scroll, hide on scroll down
  const header = document.querySelector('.site-header');
  const heroEl = document.querySelector('.hero, .page-hero');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const setHeaderState = () => {
    if (!header) return;
    const scrollY = window.scrollY;
    const scrolled = scrollY > 32;
    header.classList.toggle('scrolled', scrolled);

    // Hide/show on scroll direction
    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScrollY = scrollY;

    if (heroEl) {
      const heroRect = heroEl.getBoundingClientRect();
      const overHero = heroRect.bottom > 80;
      header.classList.toggle('transparent', overHero);
    }
    ticking = false;
  };

  setHeaderState();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(setHeaderState);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', setHeaderState);

  // Parallax hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    let heroTicking = false;
    window.addEventListener('scroll', () => {
      if (!heroTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const rate = scrollY * 0.3;
          heroBg.style.transform = `translateY(${rate}px) scale(1.1)`;
          heroTicking = false;
        });
        heroTicking = true;
      }
    }, { passive: true });
    // Set initial scale for parallax
    heroBg.style.transform = 'scale(1.1)';
  }

  // Reveal on scroll with IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Stat counter animation
  const statNums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && statNums.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const startTime = performance.now();
          const isDecimal = target % 1 !== 0;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out expo
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = target * ease;

            if (isDecimal) {
              el.textContent = current.toFixed(1) + suffix;
            } else {
              el.textContent = Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));
  }

  // Demo form handling
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        form.reset();
        setTimeout(() => success.classList.remove('show'), 6000);
      } else {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const original = btn.textContent;
          btn.textContent = 'Sent \u00b7 we will be in touch';
          btn.disabled = true;
          form.reset();
          setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 4000);
        }
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Magnetic button effect (subtle)
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});
