/* Digitale Verk - Main JS */

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initFadeIn();
  initActiveNav();
  initShowcaseSlider();
  initFormReplyTo();
});


/* Header scroll */
function initHeader() {
  var header = document.querySelector('header');
  if (!header) return;

  function check() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', check, { passive: true });
  check();
}

/* Mobile menu */
function initMobileMenu() {
  var btn = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  var overlay = document.querySelector('.mobile-overlay');

  if (!btn || !menu || !overlay) return;

  function openMenu() {
    btn.classList.add('open');
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  btn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}

/* Fade in on scroll */
function initFadeIn() {
  var elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

/* Active nav link on scroll */
function initActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a, .mobile-menu a');

  if (!sections.length || !links.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var id = entry.target.getAttribute('id');

      links.forEach(function (link) {
        var href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + id);
      });
    });
  }, {
    threshold: 0.35,
    rootMargin: '-100px 0px -45% 0px'
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/* Showcase slider */
function initShowcaseSlider() {
  var box = document.querySelector('.showcase-box');
  if (!box) return;

  var slides = box.querySelectorAll('.showcase-slide');
  var tabs = box.querySelectorAll('.showcase-tab');
  var prev = box.querySelector('.showcase-arrow.prev');
  var next = box.querySelector('.showcase-arrow.next');
  var counter = box.querySelector('.showcase-counter');
  var titleEl = box.querySelector('.showcase-title');
  var textEl = box.querySelector('.showcase-text');

  var titles = [
    'Feriesystem for bedre oversikt i bedriften',
    'Ansattoversikt med saldo og planlagt ferie',
    'Ferieplan som gjør bemanning enklere',
    'Ferieforespørsler med godkjenning og status',
    'Innstillinger og administrasjon for ledelse',
    'Min side for ansatte'
  ];

  var texts = [
    'Et enkelt og ryddig system der ledelse og ansatte får oversikt over ferie, forespørsler, saldo og planlegging. Løsningen gjør det lettere å redusere manuelt arbeid og få bedre kontroll på bemanning.',
    'Se ansatte, avdelinger, feriedager igjen og planlagt ferie i én tydelig visning. Perfekt for ledere som trenger rask oversikt.',
    'Kalenderbasert visning som gjør det lettere å planlegge ferie, oppdage konflikter tidlig og sikre god bemanning.',
    'Håndter ferieønsker, godkjenninger og endringer på en ryddig måte uten manuell oppfølging i e-post og Excel.',
    'Administrer regler, roller, brukere og systemoppsett i et tydelig adminpanel tilpasset bedriftens behov.',
    'Gi ansatte en egen side der de kan se feriedager, status på forespørsler og kommende fravær uten å måtte spørre leder.'
  ];

  var index = 0;

  function render(i) {
    slides.forEach(function (slide, idx) {
      slide.classList.toggle('active', idx === i);
    });

    tabs.forEach(function (tab, idx) {
      tab.classList.toggle('active', idx === i);
    });

    if (counter) counter.textContent = (i + 1) + ' / ' + slides.length;
    if (titleEl) titleEl.textContent = titles[i];
    if (textEl) textEl.textContent = texts[i];
  }

  if (prev) {
    function goPrev(e) {
      if (e) e.preventDefault();
      index = (index - 1 + slides.length) % slides.length;
      render(index);
    }

    prev.addEventListener('click', goPrev);
    prev.addEventListener('touchstart', goPrev, { passive: false });
  }

  if (next) {
    function goNext(e) {
      if (e) e.preventDefault();
      index = (index + 1) % slides.length;
      render(index);
    }

    next.addEventListener('click', goNext);
    next.addEventListener('touchstart', goNext, { passive: false });
  }

  tabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      index = idx;
      render(index);
    });
  });

  render(index);
}
