/* ============================================
   Digitale Verk - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCarousels();
  initBookingForm();
  initActiveNav();
});

/* --- Sticky Header --- */
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.classList.toggle('open', !isOpen);
    mobileMenu.classList.toggle('open', !isOpen);
    if (overlay) overlay.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- Scroll Fade-In Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --- Pricing Carousels --- */
function initCarousels() {
  const carousels = document.querySelectorAll('.pricing-carousel');

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const slides = carousel.querySelectorAll('.carousel-slide');
    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    // Update dots on manual scroll
    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = track.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        current = Math.round(scrollLeft / slideWidth);
        updateDots();
      }, 80);
    }, { passive: true });

    // Touch/swipe support
    let startX = 0;
    let startScroll = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startScroll = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });

    updateDots();
  });
}

/* --- Booking Form --- */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const msgEl = form.querySelector('.form-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Basic validation
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const company = form.querySelector('[name="company"]');

    if (!name.value.trim() || !email.value.trim() || !company.value.trim()) {
      showMessage(msgEl, 'error', 'Vennligst fyll ut alle obligatoriske felt.');
      return;
    }

    if (!isValidEmail(email.value)) {
      showMessage(msgEl, 'error', 'Vennligst oppgi en gyldig e-postadresse.');
      return;
    }

    // Submit
    submitBtn.textContent = 'Sender...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        showMessage(msgEl, 'success', 'Takk for henvendelsen! Vi tar kontakt snart.');
        form.reset();
      } else {
        showMessage(msgEl, 'error', 'Noe gikk galt. Vennligst send en e-post til kontakt@digitaleverk.no.');
      }
    } catch {
      showMessage(msgEl, 'error', 'Noe gikk galt. Vennligst send en e-post til kontakt@digitaleverk.no.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showMessage(el, type, text) {
  if (!el) return;
  el.className = 'form-message ' + type;
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 8000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --- Active Nav on Scroll --- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}
