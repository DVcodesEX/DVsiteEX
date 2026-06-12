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

document.addEventListener("DOMContentLoaded", function () {
  initSystemSlider();
});

function initSystemSlider() {
  const title = document.getElementById("systemTitle");
  const text = document.getElementById("systemText");
  const preview = document.getElementById("systemPreview");
  const dots = document.getElementById("systemDots");

  if (!title || !text || !preview || !dots) return;

  const slides = [
    {
      title: "Ferieoversikt",
      text: "Oversikt over ferieønsker, status og godkjenning.",
      items: [["Godkjent", "8"], ["Venter", "3"], ["Avslått", "1"]]
    },
    {
      title: "Bookingsystem",
      text: "Hold oversikt over avtaler, tidspunkt og kunder.",
      items: [["I dag", "5"], ["Denne uken", "18"], ["Ledige tider", "7"]]
    },
    {
      title: "Fakturaoversikt",
      text: "Se utkast, sendte fakturaer og betalinger.",
      items: [["Sendt", "12"], ["Utkast", "4"], ["Betalt", "9"]]
    },
    {
      title: "Forespørsler",
      text: "Samle kundehenvendelser og følg status.",
      items: [["Nye", "6"], ["Pågår", "4"], ["Ferdig", "11"]]
    },
    {
      title: "Oppgavestyring",
      text: "Fordel oppgaver, ansvar og frister internt.",
      items: [["Åpne", "14"], ["Haster", "2"], ["Fullført", "23"]]
    },
    {
      title: "Ansattportal",
      text: "Gi ansatte tilgang til informasjon og egne saker.",
      items: [["Ansatte", "24"], ["Dokumenter", "38"], ["Varsler", "5"]]
    }
  ];

  let index = 0;

  function render() {
    const slide = slides[index];

    title.textContent = slide.title;
    text.textContent = slide.text;

    preview.innerHTML = slide.items.map(item => `
      <div class="system-row">
        <span>${item[0]}</span>
        <strong>${item[1]}</strong>
      </div>
    `).join("");

    dots.innerHTML = slides.map((_, i) => `
      <button class="${i === index ? "active" : ""}" aria-label="Vis eksempel ${i + 1}"></button>
    `).join("");

    dots.querySelectorAll("button").forEach((button, i) => {
      button.addEventListener("click", () => {
        index = i;
        render();
      });
    });
  }

  render();

  setInterval(() => {
    index = (index + 1) % slides.length;
    render();
  }, 3500);
}
