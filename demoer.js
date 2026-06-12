document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".demo-tabs button");
  const content = document.getElementById("demoContent");

  if (!buttons.length || !content) return;

  const demoData = {
    ferie: {
      title: "Ferieregistrering",
      menu: ["Dashboard", "Ferie", "Ansatte", "Godkjenning"],
      stat1: "12",
      stat2: "3",
      label1: "Ferieønsker",
      label2: "Venter",
      mainTitle: "Ferieoversikt",
      action: "Send ferieønske",
      items: ["Emilie søker 24. juni", "Jonas søker 2. juli", "Martin søker 15. juli"]
    },
    booking: {
      title: "Bookingsystem",
      menu: ["Kalender", "Kunder", "Avtaler", "Rapport"],
      stat1: "8",
      stat2: "2",
      label1: "Bookinger",
      label2: "I dag",
      mainTitle: "Ukeskalender",
      action: "Ny booking",
      items: ["09:00 Befaring", "12:30 Service", "14:00 Kundemøte"]
    },
    faktura: {
      title: "Fakturasystem",
      menu: ["Oversikt", "Fakturaer", "Kunder", "Betaling"],
      stat1: "48k",
      stat2: "6",
      label1: "Utestående",
      label2: "Fakturaer",
      mainTitle: "Fakturaoversikt",
      action: "Lag faktura",
      items: ["#1042 ASKO Transport", "#1043 Solheim Elektro", "#1044 Nordbygg AS"]
    },
    stempling: {
      title: "Stemplingssystem",
      menu: ["I dag", "Timeliste", "Ansatte", "Rapport"],
      stat1: "7,5",
      stat2: "4",
      label1: "Timer i dag",
      label2: "På jobb",
      mainTitle: "Timeregistrering",
      action: "Stemple inn",
      items: ["08:00 Martin inn", "08:15 Emilie inn", "15:30 Jonas ut"]
    },
    oppgaver: {
      title: "Oppgavesystem",
      menu: ["Oppgaver", "Team", "Prosjekt", "Arkiv"],
      stat1: "14",
      stat2: "5",
      label1: "Oppgaver",
      label2: "Ferdig",
      mainTitle: "Aktive oppgaver",
      action: "Legg til oppgave",
      items: ["Send tilbud", "Klargjør rapport", "Følg opp kunde"]
    },
    foresporsler: {
      title: "Forespørselssystem",
      menu: ["Innboks", "Saker", "Kunder", "Status"],
      stat1: "9",
      stat2: "2",
      label1: "Nye saker",
      label2: "Haster",
      mainTitle: "Kundehenvendelser",
      action: "Opprett sak",
      items: ["Nettsideskjema", "Bookingfeil", "Ny kundeforespørsel"]
    }
  };

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderDemo(button.dataset.demo);
    });
  });

  renderDemo("ferie");

  function renderDemo(type) {
    const d = demoData[type];

    content.innerHTML = `
      <div class="pc-demo">
        <div class="pc-screen">
          <div class="pc-topbar">
            <div class="pc-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="pc-title">${d.title}</div>
            <div class="pc-user">DV</div>
          </div>

          <div class="pc-body">
            <aside class="pc-sidebar">
              <div class="pc-logo">DV</div>
              ${d.menu.map((m, i) => `<button class="${i === 0 ? "active" : ""}">${m}</button>`).join("")}
            </aside>

            <main class="pc-app">
              <div class="pc-app-header">
                <div>
                  <p class="eyebrow">Demo</p>
                  <h2>${d.mainTitle}</h2>
                </div>
                <button id="demoAction">${d.action}</button>
              </div>

              <div class="pc-stats">
                <div>
                  <strong>${d.stat1}</strong>
                  <span>${d.label1}</span>
                </div>
                <div>
                  <strong>${d.stat2}</strong>
                  <span>${d.label2}</span>
                </div>
              </div>

              <div class="pc-window">
                <div class="pc-window-head">
                  <span>Siste aktivitet</span>
                  <b>Live demo</b>
                </div>

                <div class="pc-list" id="pcList">
                  ${d.items.map(item => `
                    <div class="pc-row">
                      <span>${item}</span>
                      <b>Åpen</b>
                    </div>
                  `).join("")}
                </div>
              </div>
            </main>
          </div>
        </div>

        <div class="pc-stand"></div>
        <div class="pc-foot"></div>
      </div>
    `;

    document.getElementById("demoAction").addEventListener("click", function () {
      const newItem = getNewItem(type);

      document.getElementById("pcList").insertAdjacentHTML("afterbegin", `
        <div class="pc-row new">
          <span>${newItem}</span>
          <b>Ny</b>
        </div>
      `);
    });
  }

  function getNewItem(type) {
    const map = {
      ferie: "Nytt ferieønske registrert",
      booking: "Ny booking lagt inn",
      faktura: "Ny faktura opprettet",
      stempling: "Ny stempling registrert",
      oppgaver: "Ny oppgave lagt til",
      foresporsler: "Ny sak opprettet"
    };

    return map[type] || "Ny aktivitet";
  }
});
