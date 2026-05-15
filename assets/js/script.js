/* ============================================================
   EMBRACE — MAIN SCRIPT
   Sections:
   1. Nav scroll + hamburger
   2. Scroll reveal (IntersectionObserver)
   3. Counter animation
   4. Portfolio filter
   5. Testimonial carousel
   6. FAQ accordion
   ============================================================ */

/* ----------------------------------------------------------
   PORTFOLIO VIEW NOTIFICATIONS (ntfy.sh)
   Topic: courage-portfolio-ca7f2e
   Install ntfy app → subscribe to this topic for push alerts
   ---------------------------------------------------------- */
(function () {
  const TOPIC = 'courage-portfolio-ca7f2e';
  const page  = document.title.replace(' | Courage', '').trim() || 'Portfolio';
  fetch('https://ntfy.sh/' + TOPIC, {
    method : 'POST',
    body   : '👀 Someone just viewed: ' + page,
    headers: { Title: 'Portfolio View', Tags: 'eyes', Priority: 'default' }
  }).catch(() => {});
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAVIGATION — scroll state + hamburger
     ---------------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 16);
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     2. SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     3. COUNTER ANIMATION
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  if (counters.length) {
    const DURATION = 1800;

    function runCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ----------------------------------------------------------
     4. PORTFOLIO FILTER
     ---------------------------------------------------------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.p-card');

  if (filterBtns.length && portfolioCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.removeAttribute('aria-pressed');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;

        portfolioCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ----------------------------------------------------------
     5. TESTIMONIAL CAROUSEL
        Cycles the active (blue) card through the list
     ---------------------------------------------------------- */
  const testiTrack = document.getElementById('testiTrack');

  if (testiTrack) {
    const cards = Array.from(testiTrack.querySelectorAll('.testi-card'));
    let current = 0;

    function setActive(index) {
      cards.forEach((c, i) => {
        c.classList.toggle('testi-card--active', i === index);
      });
      current = index;
    }

    const btnPrev = document.getElementById('testiPrev');
    const btnNext = document.getElementById('testiNext');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        setActive((current - 1 + cards.length) % cards.length);
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        setActive((current + 1) % cards.length);
      });
    }
  }

  /* ----------------------------------------------------------
     7. BACK TO TOP
     ---------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     6. ACCORDION / FAQ
     ---------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel   = item.querySelector('.accordion-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      accordionItems.forEach(i => {
        i.classList.remove('is-open');
        const p = i.querySelector('.accordion-panel');
        const t = i.querySelector('.accordion-trigger');
        if (p) p.hidden = true;
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

});
