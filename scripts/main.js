/* Digitale Verk - Main JS */
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initFadeIn();
  initPricingScroll();
  initPackageLinks();
  initBookingCalendar();
  initAjaxForms();
  initSupportModal();
  initActiveNav();
});

/* Header scroll */
function initHeader() {
  var header = document.querySelector('header');
  if (!header) return;
  function check() { header.classList.toggle('scrolled', window.scrollY > 40); }
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
    btn.classList.remove('open'); menu.classList.remove('open');
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

/* Pricing scroll */
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

/* Active nav */
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

/* Package links - pre-select package in booking form */
function initPackageLinks() {
  document.querySelectorAll('[data-package]').forEach(function (link) {
    link.addEventListener('click', function () {
      var pkg = link.getAttribute('data-package');
      var select = document.getElementById('f-pakke');
      if (select && pkg) {
        // Find matching option
        for (var i = 0; i < select.options.length; i++) {
          if (select.options[i].value === pkg) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    });
  });
}

/* ============================================================
   BOOKING CALENDAR
   ============================================================ */
var MONTHS = ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'];
var WDAYS = ['Man','Tir','Ons','Tor','Fre','Lor','Son'];
var TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];

// Demo booked slots
var demoBooked = {};
(function () {
  var now = new Date();
  for (var i = 1; i <= 45; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    var key = dk(d);
    var n = Math.floor(Math.random() * 7);
    if (n === 0) continue;
    var shuffled = TIMES.slice().sort(function () { return Math.random() - 0.5; });
    demoBooked[key] = shuffled.slice(0, n);
  }
})();

function dk(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function niceDate(d) {
  return d.getDate() + '. ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function initBookingCalendar() {
  var container = document.getElementById('booking-calendar');
  if (!container) return;

  var state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    selDate: null,
    selTime: null
  };

  function render() {
    var year = state.year, month = state.month;
    var first = new Date(year, month, 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var startDay = first.getDay() - 1;
    if (startDay < 0) startDay = 6;
    var today = new Date(); today.setHours(0, 0, 0, 0);

    var h = '<div class="cal-header"><span>' + MONTHS[month] + ' ' + year + '</span>';
    h += '<div class="cal-nav"><button type="button" class="cal-prev">&lsaquo;</button><button type="button" class="cal-next">&rsaquo;</button></div></div>';
    h += '<div class="cal-weekdays">';
    WDAYS.forEach(function (d) { h += '<div class="cal-weekday">' + d + '</div>'; });
    h += '</div><div class="cal-days">';

    for (var i = 0; i < startDay; i++) h += '<div class="cal-day empty"></div>';

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var key = dk(date);
      var isPast = date < today;
      var isWeekend = date.getDay() === 0 || date.getDay() === 6;
      var booked = demoBooked[key] || [];
      var freeCount = TIMES.filter(function (t) { return booked.indexOf(t) === -1; }).length;
      var fullyBooked = !isWeekend && !isPast && freeCount === 0;

      var cls = 'cal-day';
      if (isPast) cls += ' past';
      else if (isWeekend || fullyBooked) cls += ' unavailable';
      else cls += ' available';
      if (state.selDate && dk(state.selDate) === key) cls += ' selected';

      var canClick = !isPast && !isWeekend && !fullyBooked;
      h += '<div class="' + cls + '"' + (canClick ? ' data-d="' + key + '"' : '') + '>' + d + '</div>';
    }
    h += '</div>';
    h += '<div class="cal-legend"><span><span class="legend-dot green"></span> Ledig</span><span><span class="legend-dot gray"></span> Ikke ledig</span><span><span class="legend-dot white"></span> Helg/forbi</span></div>';

    // Time slots if date selected
    if (state.selDate) {
      var selKey = dk(state.selDate);
      var bookedTimes = demoBooked[selKey] || [];
      h += '<div style="margin-top:14px;font-size:13px;color:#aaa;">Tider for ' + niceDate(state.selDate) + ':</div>';
      h += '<div class="time-slots">';
      TIMES.forEach(function (t) {
        var isTaken = bookedTimes.indexOf(t) !== -1;
        if (isTaken) {
          h += '<div class="time-slot taken">' + t + '</div>';
        } else {
          var picked = state.selTime === t ? ' picked' : '';
          h += '<div class="time-slot free' + picked + '" data-t="' + t + '">' + t + '</div>';
        }
      });
      h += '</div>';
    }

    container.innerHTML = h;

    // Events
    var prevBtn = container.querySelector('.cal-prev');
    var nextBtn = container.querySelector('.cal-next');
    if (prevBtn) prevBtn.addEventListener('click', function () {
      var now = new Date();
      if (state.year === now.getFullYear() && state.month === now.getMonth()) return;
      state.month--;
      if (state.month < 0) { state.month = 11; state.year--; }
      render();
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      state.month++;
      if (state.month > 11) { state.month = 0; state.year++; }
      render();
    });

    container.querySelectorAll('.cal-day[data-d]').forEach(function (el) {
      el.addEventListener('click', function () {
        var parts = el.getAttribute('data-d').split('-');
        state.selDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        state.selTime = null;
        render();
      });
    });

    container.querySelectorAll('.time-slot.free').forEach(function (el) {
      el.addEventListener('click', function () {
        state.selTime = el.getAttribute('data-t');
        // Update hidden fields
        document.getElementById('hidden-dato').value = niceDate(state.selDate);
        document.getElementById('hidden-tid').value = state.selTime;
        render();
      });
    });
  }

  render();
}

/* ============================================================
   AJAX FORM SUBMISSIONS
   ============================================================ */
function initAjaxForms() {
  document.querySelectorAll('form[action*="formsubmit.co"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = 'Sender...';
      btn.disabled = true;

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      // Autoresponse email to user
      if (data.epost) {
        data._autoresponse = 'Hei ' + (data.navn || '') + '!\n\nTakk for din henvendelse til Digitale Verk.\n\n' +
          (data.pakke ? 'Pakke: ' + data.pakke + '\n' : '') +
          (data.dato ? 'Dato: ' + data.dato + '\n' : '') +
          (data.tidspunkt ? 'Tidspunkt: ' + data.tidspunkt + '\n' : '') +
          '\nVi tar kontakt snart for a bekrefte.\n\nMed vennlig hilsen,\nDigitale Verk\nkontakt@digitaleverk.no';
      }

      var ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      fetch(ajaxUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.success) {
          showMsg(form, 'ok', 'Sendt! Du vil motta en bekreftelse pa e-post. Vi tar kontakt snart.');
          form.reset();
        } else {
          showMsg(form, 'err', 'Noe gikk galt. Prov igjen eller send e-post til kontakt@digitaleverk.no.');
        }
        btn.textContent = origText; btn.disabled = false;
      })
      .catch(function () {
        showMsg(form, 'err', 'Kunne ikke sende. Prov igjen eller send e-post til kontakt@digitaleverk.no.');
        btn.textContent = origText; btn.disabled = false;
      });
    });
  });
}

function showMsg(form, type, text) {
  var old = form.querySelector('.form-msg');
  if (old) old.remove();
  var el = document.createElement('div');
  el.className = 'form-msg ' + type;
  el.textContent = text;
  form.appendChild(el);
  setTimeout(function () { if (el.parentNode) el.remove(); }, 10000);
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
      if (planInput) planInput.value = btn.getAttribute('data-support');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', function () {
    overlay.classList.remove('open'); document.body.style.overflow = '';
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  });
}
