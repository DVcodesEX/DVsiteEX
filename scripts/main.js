/* Digitale Verk - Main JS */
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initFadeIn();
  initPricingScroll();
  initBookingDropdowns();
  initSupportModal();
  initActiveNav();
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
  if (!btn || !menu) return;

  function toggle() {
    var open = menu.classList.contains('open');
    btn.classList.toggle('open', !open);
    menu.classList.toggle('open', !open);
    if (overlay) overlay.classList.toggle('open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  }
  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
}

/* Fade in */
function initFadeIn() {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function (el) { obs.observe(el); });
}

/* Pricing horizontal scroll */
function initPricingScroll() {
  var wrap = document.querySelector('.pricing-scroll-wrap');
  if (!wrap) return;
  var scroll = wrap.querySelector('.pricing-scroll');
  var left = wrap.querySelector('.pricing-arrow.left');
  var right = wrap.querySelector('.pricing-arrow.right');
  if (!scroll) return;
  if (left) left.addEventListener('click', function () { scroll.scrollBy({ left: -300, behavior: 'smooth' }); });
  if (right) right.addEventListener('click', function () { scroll.scrollBy({ left: 300, behavior: 'smooth' }); });
}

/* Active nav on scroll */
function initActiveNav() {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(function (s) { obs.observe(s); });
}

/* ============================================================
   BOOKING DROPDOWNS IN PRICING CARDS
   ============================================================ */

var MONTHS = ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'];
var DAYS = ['Man','Tir','Ons','Tor','Fre','Lor','Son'];
var TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];

// Demo booked slots
var demoBooked = buildDemoBooked();

function buildDemoBooked() {
  var slots = {};
  var now = new Date();
  for (var i = 1; i <= 45; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    var key = dateKey(d);
    var n = Math.floor(Math.random() * 7);
    if (n === 0) continue;
    var shuffled = TIMES.slice().sort(function () { return Math.random() - 0.5; });
    slots[key] = shuffled.slice(0, n);
  }
  return slots;
}

function dateKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function niceDate(d) {
  return d.getDate() + '. ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function initBookingDropdowns() {
  document.querySelectorAll('.pricing-card').forEach(function (card) {
    var toggleBtn = card.querySelector('.booking-toggle');
    var dropdown = card.querySelector('.booking-dropdown');
    if (!toggleBtn || !dropdown) return;

    var packageName = card.querySelector('h3') ? card.querySelector('h3').textContent : '';

    var state = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      selDate: null,
      selTime: null
    };

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = dropdown.classList.contains('open');
      // Close all other dropdowns
      document.querySelectorAll('.booking-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      if (!isOpen) {
        dropdown.classList.add('open');
        renderCalendar(dropdown, state, packageName);
      }
    });
  });
}

function renderCalendar(dropdown, state, packageName) {
  var calDiv = dropdown.querySelector('.cal-area');
  if (!calDiv) return;

  var year = state.year;
  var month = state.month;
  var first = new Date(year, month, 1);
  var last = new Date(year, month + 1, 0);
  var daysInMonth = last.getDate();
  var startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var html = '<div class="cal-header"><span>' + MONTHS[month] + ' ' + year + '</span>';
  html += '<div class="cal-nav"><button class="cal-prev">&lsaquo;</button><button class="cal-next">&rsaquo;</button></div></div>';
  html += '<div class="cal-weekdays">';
  DAYS.forEach(function (d) { html += '<div class="cal-weekday">' + d + '</div>'; });
  html += '</div><div class="cal-days">';

  for (var i = 0; i < startDay; i++) html += '<div class="cal-day empty"></div>';

  for (var d = 1; d <= daysInMonth; d++) {
    var date = new Date(year, month, d);
    var key = dateKey(date);
    var isPast = date < today;
    var isWeekend = date.getDay() === 0 || date.getDay() === 6;
    var booked = demoBooked[key] || [];
    var freeCount = TIMES.filter(function (t) { return booked.indexOf(t) === -1; }).length;
    var fullyBooked = !isWeekend && !isPast && freeCount === 0;

    var cls = 'cal-day';
    if (isPast) cls += ' past';
    else if (isWeekend) cls += ' unavailable';
    else if (fullyBooked) cls += ' unavailable';
    else cls += ' available';

    if (state.selDate && dateKey(state.selDate) === key) cls += ' selected';

    var canClick = !isPast && !isWeekend && !fullyBooked;
    html += '<div class="' + cls + '"' + (canClick ? ' data-date="' + key + '"' : '') + '>' + d + '</div>';
  }

  html += '</div>';
  html += '<div class="cal-legend"><span><span class="legend-dot green"></span> Ledig</span><span><span class="legend-dot gray"></span> Ikke ledig</span><span><span class="legend-dot white"></span> Helg/forbi</span></div>';

  // Time slots
  if (state.selDate) {
    var dk = dateKey(state.selDate);
    var bookedTimes = demoBooked[dk] || [];
    html += '<div style="margin-top:12px;font-size:12px;color:#999;">Tider for ' + niceDate(state.selDate) + ':</div>';
    html += '<div class="time-slots">';
    TIMES.forEach(function (t) {
      var isTaken = bookedTimes.indexOf(t) !== -1;
      if (isTaken) {
        html += '<div class="time-slot taken">' + t + '</div>';
      } else {
        var picked = state.selTime === t ? ' picked' : '';
        html += '<div class="time-slot free' + picked + '" data-time="' + t + '">' + t + '</div>';
      }
    });
    html += '</div>';
  }

  calDiv.innerHTML = html;

  // Event listeners
  calDiv.querySelector('.cal-prev').addEventListener('click', function () {
    var now = new Date();
    if (state.year === now.getFullYear() && state.month === now.getMonth()) return;
    state.month--;
    if (state.month < 0) { state.month = 11; state.year--; }
    renderCalendar(dropdown, state, packageName);
  });

  calDiv.querySelector('.cal-next').addEventListener('click', function () {
    state.month++;
    if (state.month > 11) { state.month = 0; state.year++; }
    renderCalendar(dropdown, state, packageName);
  });

  calDiv.querySelectorAll('.cal-day[data-date]').forEach(function (el) {
    el.addEventListener('click', function () {
      var parts = el.dataset.date.split('-');
      state.selDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      state.selTime = null;
      renderCalendar(dropdown, state, packageName);
    });
  });

  calDiv.querySelectorAll('.time-slot.free').forEach(function (el) {
    el.addEventListener('click', function () {
      state.selTime = el.dataset.time;
      renderCalendar(dropdown, state, packageName);
      // Update hidden fields
      var form = dropdown.querySelector('form');
      if (form) {
        var dateInput = form.querySelector('[name="dato"]');
        var timeInput = form.querySelector('[name="tidspunkt"]');
        if (dateInput) dateInput.value = niceDate(state.selDate);
        if (timeInput) timeInput.value = state.selTime;
      }
    });
  });
}

/* ============================================================
   SUPPORT MODAL
   ============================================================ */
function initSupportModal() {
  var overlay = document.getElementById('support-overlay');
  if (!overlay) return;
  var closeBtn = overlay.querySelector('.support-close');
  var planInput = overlay.querySelector('[name="plan"]');

  document.querySelectorAll('[data-support]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (planInput) planInput.value = btn.dataset.support;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
