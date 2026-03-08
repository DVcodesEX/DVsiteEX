/* ============================================
   Digitale Verk - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initPricingScroll();
  initBookingWizard();
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

/* --- Pricing Horizontal Scroll --- */
function initPricingScroll() {
  const wrapper = document.querySelector('.pricing-scroll-wrapper');
  if (!wrapper) return;

  const scroll = wrapper.querySelector('.pricing-scroll');
  const leftBtn = wrapper.querySelector('.pricing-arrow.left');
  const rightBtn = wrapper.querySelector('.pricing-arrow.right');
  if (!scroll) return;

  const scrollAmount = 320;

  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      scroll.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      scroll.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
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

/* ============================================
   BOOKING WIZARD - Calendar System
   ============================================ */

function initBookingWizard() {
  const container = document.querySelector('.booking-form-card');
  if (!container) return;

  const state = {
    step: 1,
    name: '',
    phone: '',
    email: '',
    description: '',
    selectedDate: null,
    selectedTime: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
  };

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00'
  ];

  // Simulated booked slots (in production this comes from a backend API)
  // Format: { 'YYYY-MM-DD': ['09:00', '11:00', ...] }
  const bookedSlots = generateDemoBookedSlots();

  const dayNames = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'];
  const monthNames = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  function generateDemoBookedSlots() {
    const slots = {};
    const now = new Date();
    // Generate some random booked slots for the next 30 days
    for (let i = 1; i <= 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const day = d.getDay();
      // Skip weekends
      if (day === 0 || day === 6) continue;
      const key = formatDateKey(d);
      const numBooked = Math.floor(Math.random() * 6);
      const booked = [];
      const shuffled = [...availableTimes].sort(() => Math.random() - 0.5);
      for (let j = 0; j < numBooked; j++) {
        booked.push(shuffled[j]);
      }
      if (booked.length > 0) {
        slots[key] = booked;
      }
    }
    return slots;
  }

  function formatDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function formatDateNorwegian(d) {
    return d.getDate() + '. ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
  }

  function isWeekend(d) {
    const day = d.getDay();
    return day === 0 || day === 6;
  }

  function isPast(d) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const check = new Date(d);
    check.setHours(0, 0, 0, 0);
    return check <= today;
  }

  function getBookedForDate(dateKey) {
    return bookedSlots[dateKey] || [];
  }

  function getAvailableForDate(dateKey) {
    const booked = getBookedForDate(dateKey);
    return availableTimes.filter(t => !booked.includes(t));
  }

  function isFullyBooked(dateKey) {
    return getAvailableForDate(dateKey).length === 0;
  }

  // Render functions
  function render() {
    const stepsHtml = renderSteps();
    let contentHtml = '';

    if (state.step === 1) {
      contentHtml = renderStep1();
    } else if (state.step === 2) {
      contentHtml = renderStep2();
    } else if (state.step === 3) {
      contentHtml = renderStep3();
    }

    container.innerHTML = '<h3>Book gratis mote</h3>' + stepsHtml + contentHtml;
    attachEventListeners();
  }

  function renderSteps() {
    let html = '<div class="booking-steps">';
    for (let i = 1; i <= 3; i++) {
      let cls = 'booking-step-dot';
      if (i === state.step) cls += ' active';
      else if (i < state.step) cls += ' done';
      html += '<div class="' + cls + '"></div>';
    }
    html += '</div>';

    const labels = ['1. Dine opplysninger', '2. Velg dag og tidspunkt', '3. Bekreftelse'];
    html += '<div class="booking-step-label">' + labels[state.step - 1] + '</div>';
    return html;
  }

  function renderStep1() {
    return '<div class="booking-step active">' +
      '<div class="form-group">' +
        '<label for="b-name">Navn *</label>' +
        '<input type="text" id="b-name" value="' + escHtml(state.name) + '" placeholder="Ditt fulle navn">' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="b-email">E-post *</label>' +
        '<input type="email" id="b-email" value="' + escHtml(state.email) + '" placeholder="din@epost.no">' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="b-phone">Telefon *</label>' +
        '<input type="tel" id="b-phone" value="' + escHtml(state.phone) + '" placeholder="+47 000 00 000">' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="b-desc">Kort beskrivelse av onske/tema <span class="optional">(valgfritt)</span></label>' +
        '<textarea id="b-desc" placeholder="Fortell oss litt om hva du trenger...">' + escHtml(state.description) + '</textarea>' +
      '</div>' +
      '<div class="step-nav">' +
        '<button class="btn btn-primary" id="step1-next">Velg tidspunkt &rarr;</button>' +
      '</div>' +
      '<div class="form-message" id="step1-error"></div>' +
    '</div>';
  }

  function renderStep2() {
    const calendarHtml = renderCalendar();
    let timeSlotsHtml = '';

    if (state.selectedDate) {
      timeSlotsHtml = renderTimeSlots();
    }

    return '<div class="booking-step active">' +
      calendarHtml +
      timeSlotsHtml +
      '<div class="calendar-legend">' +
        '<span><span class="legend-dot green"></span> Ledig</span>' +
        '<span><span class="legend-dot red"></span> Opptatt</span>' +
      '</div>' +
      '<div class="step-nav">' +
        '<button class="btn btn-secondary" id="step2-back">&larr; Tilbake</button>' +
        '<button class="btn btn-primary" id="step2-next" ' + (!state.selectedTime ? 'disabled style="opacity:0.5;cursor:not-allowed"' : '') + '>Bekreft &rarr;</button>' +
      '</div>' +
      '<div class="form-message" id="step2-error"></div>' +
    '</div>';
  }

  function renderCalendar() {
    const year = state.currentYear;
    const month = state.currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday = 0 in our system
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    let html = '<div class="calendar-container">';
    html += '<div class="calendar-header">';
    html += '<h4>' + monthNames[month] + ' ' + year + '</h4>';
    html += '<div class="calendar-nav">';
    html += '<button id="cal-prev">&lsaquo;</button>';
    html += '<button id="cal-next">&rsaquo;</button>';
    html += '</div></div>';

    html += '<div class="calendar-weekdays">';
    dayNames.forEach(d => {
      html += '<div class="calendar-weekday">' + d + '</div>';
    });
    html += '</div>';

    html += '<div class="calendar-days">';

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateKey = formatDateKey(date);
      let cls = 'calendar-day';

      const isToday = date.getTime() === today.getTime();
      const isPastDay = date < today;
      const weekend = isWeekend(date);
      const fullyBooked = !weekend && !isPastDay && isFullyBooked(dateKey);
      const hasSlots = !weekend && !isPastDay && !fullyBooked;

      if (isToday) cls += ' today';
      if (isPastDay) cls += ' past';
      if (weekend) cls += ' disabled';
      if (hasSlots) cls += ' has-slots';
      if (fullyBooked) cls += ' fully-booked';

      if (state.selectedDate) {
        const selKey = formatDateKey(state.selectedDate);
        if (selKey === dateKey) cls += ' selected';
      }

      const clickable = !isPastDay && !weekend && !fullyBooked;
      html += '<div class="' + cls + '" ' + (clickable ? 'data-date="' + dateKey + '"' : '') + '>' + d + '</div>';
    }

    html += '</div></div>';
    return html;
  }

  function renderTimeSlots() {
    const dateKey = formatDateKey(state.selectedDate);
    const booked = getBookedForDate(dateKey);

    let html = '<div class="time-slots-container">';
    html += '<div class="time-slots-label">Tilgjengelige tider for ' + formatDateNorwegian(state.selectedDate) + ':</div>';
    html += '<div class="time-slots-grid">';

    availableTimes.forEach(time => {
      const isBooked = booked.includes(time);
      const isSelected = state.selectedTime === time;

      if (isBooked) {
        html += '<div class="time-slot booked">' + time + '</div>';
      } else {
        html += '<div class="time-slot available' + (isSelected ? ' selected' : '') + '" data-time="' + time + '">' + time + '</div>';
      }
    });

    html += '</div></div>';
    return html;
  }

  function renderStep3() {
    const dateStr = state.selectedDate ? formatDateNorwegian(state.selectedDate) : '';

    return '<div class="booking-step active">' +
      '<div class="booking-summary">' +
        '<div class="booking-summary-row"><span class="label">Navn</span><span class="value">' + escHtml(state.name) + '</span></div>' +
        '<div class="booking-summary-row"><span class="label">E-post</span><span class="value">' + escHtml(state.email) + '</span></div>' +
        '<div class="booking-summary-row"><span class="label">Telefon</span><span class="value">' + escHtml(state.phone) + '</span></div>' +
        (state.description ? '<div class="booking-summary-row"><span class="label">Beskrivelse</span><span class="value">' + escHtml(state.description) + '</span></div>' : '') +
        '<div class="booking-summary-row"><span class="label">Dato</span><span class="value">' + dateStr + '</span></div>' +
        '<div class="booking-summary-row"><span class="label">Tidspunkt</span><span class="value">' + (state.selectedTime || '') + '</span></div>' +
      '</div>' +
      '<div class="step-nav">' +
        '<button class="btn btn-secondary" id="step3-back">&larr; Endre</button>' +
        '<button class="btn btn-primary" id="step3-confirm">Bekreft booking</button>' +
      '</div>' +
      '<div class="form-message" id="step3-msg"></div>' +
    '</div>';
  }

  function attachEventListeners() {
    // Step 1
    const step1Next = document.getElementById('step1-next');
    if (step1Next) {
      step1Next.addEventListener('click', () => {
        const name = document.getElementById('b-name').value.trim();
        const email = document.getElementById('b-email').value.trim();
        const phone = document.getElementById('b-phone').value.trim();
        const desc = document.getElementById('b-desc').value.trim();

        if (!name || !email || !phone) {
          showStepError('step1-error', 'Vennligst fyll ut navn, e-post og telefon.');
          return;
        }
        if (!isValidEmail(email)) {
          showStepError('step1-error', 'Vennligst oppgi en gyldig e-postadresse.');
          return;
        }

        state.name = name;
        state.email = email;
        state.phone = phone;
        state.description = desc;
        state.step = 2;
        render();
      });
    }

    // Step 2 - calendar navigation
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    if (calPrev) {
      calPrev.addEventListener('click', () => {
        const now = new Date();
        if (state.currentYear === now.getFullYear() && state.currentMonth === now.getMonth()) return;
        state.currentMonth--;
        if (state.currentMonth < 0) {
          state.currentMonth = 11;
          state.currentYear--;
        }
        render();
      });
    }
    if (calNext) {
      calNext.addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
          state.currentMonth = 0;
          state.currentYear++;
        }
        render();
      });
    }

    // Step 2 - day selection
    document.querySelectorAll('.calendar-day[data-date]').forEach(el => {
      el.addEventListener('click', () => {
        const parts = el.dataset.date.split('-');
        state.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        state.selectedTime = null;
        render();
      });
    });

    // Step 2 - time selection
    document.querySelectorAll('.time-slot.available').forEach(el => {
      el.addEventListener('click', () => {
        state.selectedTime = el.dataset.time;
        render();
      });
    });

    // Step 2 navigation
    const step2Back = document.getElementById('step2-back');
    const step2Next = document.getElementById('step2-next');
    if (step2Back) {
      step2Back.addEventListener('click', () => {
        state.step = 1;
        render();
      });
    }
    if (step2Next && state.selectedTime) {
      step2Next.addEventListener('click', () => {
        if (!state.selectedDate || !state.selectedTime) {
          showStepError('step2-error', 'Vennligst velg en dag og et tidspunkt.');
          return;
        }
        state.step = 3;
        render();
      });
    }

    // Step 3
    const step3Back = document.getElementById('step3-back');
    const step3Confirm = document.getElementById('step3-confirm');
    if (step3Back) {
      step3Back.addEventListener('click', () => {
        state.step = 2;
        render();
      });
    }
    if (step3Confirm) {
      step3Confirm.addEventListener('click', () => {
        submitBooking();
      });
    }
  }

  async function submitBooking() {
    const btn = document.getElementById('step3-confirm');
    const msgEl = document.getElementById('step3-msg');
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = 'Sender...';
    btn.disabled = true;

    const dateStr = state.selectedDate ? formatDateNorwegian(state.selectedDate) : '';
    const dateKey = state.selectedDate ? formatDateKey(state.selectedDate) : '';

    // Build mailto fallback and also try Formspree
    const bookingData = {
      name: state.name,
      email: state.email,
      phone: state.phone,
      description: state.description || 'Ikke oppgitt',
      date: dateStr,
      date_key: dateKey,
      time: state.selectedTime,
      _subject: 'Ny booking: ' + state.name + ' - ' + dateStr + ' kl. ' + state.selectedTime,
    };

    // Try sending via mailto as reliable fallback
    const mailBody = encodeURIComponent(
      'Ny booking fra digitaleverk.no\n\n' +
      'Navn: ' + state.name + '\n' +
      'E-post: ' + state.email + '\n' +
      'Telefon: ' + state.phone + '\n' +
      'Beskrivelse: ' + (state.description || 'Ikke oppgitt') + '\n' +
      'Dato: ' + dateStr + '\n' +
      'Tidspunkt: ' + state.selectedTime + '\n'
    );

    const mailSubject = encodeURIComponent('Ny booking: ' + state.name + ' - ' + dateStr + ' kl. ' + state.selectedTime);

    // Create a hidden form and submit to Formspree
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://formspree.io/f/placeholder'; // Replace with real Formspree endpoint
      form.style.display = 'none';

      Object.keys(bookingData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = bookingData[key];
        form.appendChild(input);
      });

      // Add _replyto for Formspree
      const replyTo = document.createElement('input');
      replyTo.type = 'hidden';
      replyTo.name = '_replyto';
      replyTo.value = state.email;
      form.appendChild(replyTo);

      document.body.appendChild(form);

      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      document.body.removeChild(form);

      if (response.ok) {
        // Mark time as booked locally
        const dk = formatDateKey(state.selectedDate);
        if (!bookedSlots[dk]) bookedSlots[dk] = [];
        bookedSlots[dk].push(state.selectedTime);

        showStepMessage(msgEl, 'success', 'Booking bekreftet! Vi sender en bekreftelse til ' + state.email + '.');
        btn.textContent = 'Booket!';
        btn.disabled = true;
        return;
      }
    } catch {
      // Formspree failed, fallback to mailto
    }

    // Fallback: open mailto
    window.location.href = 'mailto:kontakt@digitaleverk.no?subject=' + mailSubject + '&body=' + mailBody;
    showStepMessage(msgEl, 'success', 'E-postklienten din apnes med booking-detaljene. Send e-posten for a fullore bookingen.');
    btn.textContent = originalText;
    btn.disabled = false;
  }

  function showStepError(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'form-message error';
    el.textContent = text;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }

  function showStepMessage(el, type, text) {
    if (!el) return;
    el.className = 'form-message ' + type;
    el.textContent = text;
    el.style.display = 'block';
  }

  // Start
  render();
}

/* --- Utilities --- */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
