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
      text: "Ferieønsker, godkjenning og fravær samlet på ett sted.",
      html: `
        <div class="status-row"><span>Godkjent</span><strong>8</strong></div>
        <div class="status-row"><span>Venter</span><strong>3</strong></div>
        <div class="status-row"><span>Avslått</span><strong>1</strong></div>
      `
    },
    {
      title: "Bookingsystem",
      text: "Kalender med avtaler, tidspunkt og kunder.",
      html: `
        <div class="calendar-mini">
          <div class="calendar-head"><strong>Uke 24</strong><span>Juni</span></div>
          <div class="calendar-days">
            <span>Man</span><span>Tir</span><span>Ons</span><span>Tor</span><span>Fre</span>
          </div>
          <div class="calendar-slots">
            <div></div><div class="booking">09:00<br>Kunde A</div><div></div><div class="booking">12:30<br>Befaring</div><div></div>
            <div class="booking">14:00<br>Service</div><div></div><div class="booking">15:15<br>Møte</div><div></div><div class="booking">10:00<br>Ny avtale</div>
          </div>
        </div>
      `
    },
    {
      title: "Fakturasystem",
      text: "Lag fakturaer og hold oversikt over status.",
      html: `
        <div class="invoice-ui">
          <button type="button">+ Ny faktura</button>
          <div class="invoice-line"><span>#1042 · Kunde AS</span><strong>Sendt</strong></div>
          <div class="invoice-line"><span>#1043 · Nordbygg</span><strong>Utkast</strong></div>
          <div class="invoice-summary"><span>Betalt denne måneden</span><strong>38 400 kr</strong></div>
        </div>
      `
    },
    {
      title: "Stemplingssystem",
      text: "Registrering av arbeidstid, pauser og vakter.",
      html: `
        <div class="stamp-card"><span>Inn i dag</span><strong class="stamp-time">07:58</strong></div>
        <div class="stamp-card"><span>Pause</span><strong>30 min</strong></div>
        <div class="stamp-card"><span>Timer denne uken</span><strong>32,5</strong></div>
      `
    },
    {
      title: "Forespørsler",
      text: "Kundehenvendelser med status, ansvar og oppfølging.",
      html: `
        <div class="ticket"><b>Ny forespørsel</b><span>Venter</span></div>
        <div class="ticket"><b>Tilbud sendt</b><span>Pågår</span></div>
        <div class="ticket"><b>Ferdig sak</b><span>Lukket</span></div>
      `
    },
    {
      title: "Ansattportal",
      text: "Egne sider for ansatte, oppgaver, dokumenter og opplæring.",
      html: `
        <div class="portal-header">
          <div><strong>Hei, Martin</strong><span>Din oversikt i dag</span></div>
          <small>Ansatt</small>
        </div>
        <div class="portal-grid">
          <div>Mine oppgaver <strong>4</strong></div>
          <div>E-læring <strong>2</strong></div>
          <div>Dokumenter <strong>12</strong></div>
          <div>Fravær <strong>1</strong></div>
        </div>
      `
    }
  ];

  let index = 0;

  function render() {
    const slide = slides[index];

    title.textContent = slide.title;
    text.textContent = slide.text;
    preview.innerHTML = slide.html;

    dots.innerHTML = slides.map((_, i) =>
      `<button class="${i === index ? "active" : ""}" aria-label="Vis eksempel ${i + 1}"></button>`
    ).join("");

    dots.querySelectorAll("button").forEach((button, i) => {
      button.addEventListener("click", function () {
        index = i;
        render();
      });
    });
  }

  render();

  setInterval(function () {
    index = (index + 1) % slides.length;
    render();
  }, 2400);
}
