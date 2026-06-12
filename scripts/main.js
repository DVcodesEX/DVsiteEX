/* Digitale Verk - enkel main.js */

document.addEventListener('DOMContentLoaded', function () {
  initHeaderScroll();
  initSmoothLinks();
  initFormReplyTo();
});

function initHeaderScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function checkScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

function initSmoothLinks() {
  var links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

function initFormReplyTo() {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  var emailInput = form.querySelector('input[name="epost"]');
  if (!emailInput) return;

  form.addEventListener('submit', function () {
    var existing = form.querySelector('input[name="_replyto"]');

    if (!existing) {
      existing = document.createElement('input');
      existing.type = 'hidden';
      existing.name = '_replyto';
      form.appendChild(existing);
    }

    existing.value = emailInput.value;
  });
}
