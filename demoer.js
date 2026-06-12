document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".demo-tabs button");
  const content = document.getElementById("demoContent");

  if (!buttons.length || !content) return;

  let currentDemo = "ferie";
  let currentPage = "dashboard";

  const state = {
    ferie: {
      ansatte: ["Martin", "Emilie", "Jonas"],
      ferie: ["Emilie søker 24. juni", "Jonas søker 2. juli"],
      godkjenning: ["Martin søker 15. juli"]
    },
    booking: {
      kunder: ["Kunde AS", "Nordbygg AS"],
      bookinger: ["09:00 Befaring", "12:30 Service"]
    },
    faktura: {
      kunder: ["ASKO Transport", "Solheim Elektro"],
      fakturaer: ["#1042 · ASKO Transport · 18 900 kr", "#1043 · Solheim Elektro · 7 400 kr"]
    },
    stempling: {
      ansatte: ["Martin", "Emilie", "Jonas"],
      timer: ["Martin · 08:00 - 15:30", "Emilie · 08:15 - 16:00"]
    },
    oppgaver: {
      oppgaver: ["Send tilbud", "Klargjør rapport", "Følg opp kunde"],
      team: ["Martin", "Emilie", "Jonas"]
    },
    foresporsler: {
      saker: ["Nettsideskjema", "Bookingfeil", "Ny kundeforespørsel"],
      kunder: ["Byggmester AS", "Kunde AS"]
    }
  };

  const systems = {
    ferie: {
      title: "Ferieregistrering",
      pages: ["dashboard", "ferie", "ansatte", "godkjenning"]
    },
    booking: {
      title: "Bookingsystem",
      pages: ["dashboard", "bookinger", "kunder", "ny booking"]
    },
    faktura: {
      title: "Fakturasystem",
      pages: ["dashboard", "fakturaer", "kunder", "ny faktura"]
    },
    stempling: {
      title: "Stemplingssystem",
      pages: ["dashboard", "timeliste", "ansatte", "stemple"]
    },
    oppgaver: {
      title: "Oppgavesystem",
      pages: ["dashboard", "oppgaver", "team", "ny oppgave"]
    },
    foresporsler: {
      title: "Forespørselssystem",
      pages: ["dashboard", "saker", "kunder", "ny sak"]
    }
  };

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      currentDemo = button.dataset.demo;
      currentPage = "dashboard";
      renderShell();
    });
  });

  renderShell();

  function renderShell() {
    const system = systems[currentDemo];

    content.innerHTML = `
      <div class="pc-demo">
        <div class="pc-screen">
          <div class="pc-topbar">
            <div class="pc-dots"><span></span><span></span><span></span></div>
            <div class="pc-title">${system.title}</div>
            <div class="pc-user">DV</div>
          </div>

          <div class="pc-body">
            <aside class="pc-sidebar">
              <div class="pc-logo">DV</div>
              ${system.pages.map(page => `
                <button class="side-btn ${page === currentPage ? "active" : ""}" data-page="${page}">
                  ${capitalize(page)}
                </button>
              `).join("")}
            </aside>

            <main class="pc-app" id="pcApp"></main>
          </div>
        </div>

        <div class="pc-stand"></div>
        <div class="pc-foot"></div>
      </div>
    `;

    document.querySelectorAll(".side-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        currentPage = btn.dataset.page;
        renderShell();
      });
    });

    renderPage();
  }

  function renderPage() {
    const app = document.getElementById("pcApp");

    if (currentPage === "dashboard") {
      app.innerHTML = dashboardPage();
      return;
    }

    if (currentDemo === "ferie") renderFerie(app);
    if (currentDemo === "booking") renderBooking(app);
    if (currentDemo === "faktura") renderFaktura(app);
    if (currentDemo === "stempling") renderStempling(app);
    if (currentDemo === "oppgaver") renderOppgaver(app);
    if (currentDemo === "foresporsler") renderForesporsler(app);
  }

  function dashboardPage() {
    return `
      <div class="pc-app-header">
        <div>
          <p class="eyebrow">Dashboard</p>
          <h2>${systems[currentDemo].title}</h2>
        </div>
      </div>

      <div class="pc-stats">
        <div><strong>${randomNumber(8, 24)}</strong><span>Aktive elementer</span></div>
        <div><strong>${randomNumber(2, 9)}</strong><span>Nye i dag</span></div>
      </div>

      <div class="pc-window">
        <div class="pc-window-head"><span>Oversikt</span><b>Live demo</b></div>
        <div class="pc-list">
          ${systems[currentDemo].pages.slice(1).map(page => `
            <div class="pc-row">
              <span>${capitalize(page)}</span>
              <b>Åpne</b>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderFerie(app) {
    if (currentPage === "ferie") {
      app.innerHTML = listPage("Ferieønsker", state.ferie.ferie, "Nytt ferieønske", "Legg til ferie");
      setupAdd("ferie", "ferie", "Ferieønske fra ny ansatt");
    }

    if (currentPage === "ansatte") {
      app.innerHTML = listPage("Ansatte", state.ferie.ansatte, "Nytt navn", "Legg til ansatt");
      setupAdd("ferie", "ansatte", "Ny ansatt");
    }

    if (currentPage === "godkjenning") {
      app.innerHTML = listPage("Til godkjenning", state.ferie.godkjenning, "Ferieønske", "Send til godkjenning");
      setupAdd("ferie", "godkjenning", "Nytt ferieønske til godkjenning");
    }
  }

  function renderBooking(app) {
    if (currentPage === "bookinger") {
      app.innerHTML = listPage("Bookinger", state.booking.bookinger, "Ny booking", "Legg til booking");
      setupAdd("booking", "bookinger", "14:00 Ny avtale");
    }

    if (currentPage === "kunder") {
      app.innerHTML = listPage("Kunder", state.booking.kunder, "Kundenavn", "Legg til kunde");
      setupAdd("booking", "kunder", "Ny kunde");
    }

    if (currentPage === "ny booking") {
      app.innerHTML = formPage("Opprett booking", ["Kunde", "Dato", "Tidspunkt"], "Opprett booking");
      setupForm("booking", "bookinger", "Ny booking opprettet");
    }
  }

  function renderFaktura(app) {
    if (currentPage === "fakturaer") {
      app.innerHTML = listPage("Fakturaer", state.faktura.fakturaer, "Ny faktura", "Legg til faktura");
      setupAdd("faktura", "fakturaer", "#1044 · Ny kunde · 12 500 kr");
    }

    if (currentPage === "kunder") {
      app.innerHTML = listPage("Kunder", state.faktura.kunder, "Kundenavn", "Legg til kunde");
      setupAdd("faktura", "kunder", "Ny kunde");
    }

    if (currentPage === "ny faktura") {
      app.innerHTML = formPage("Opprett faktura", ["Kunde", "Beskrivelse", "Beløp"], "Opprett faktura");
      setupForm("faktura", "fakturaer", "#1045 · Ny faktura · opprettet");
    }
  }

  function renderStempling(app) {
    if (currentPage === "timeliste") {
      app.innerHTML = listPage("Timeliste", state.stempling.timer, "Ny timelinje", "Legg til tid");
      setupAdd("stempling", "timer", "Ny arbeidstid registrert");
    }

    if (currentPage === "ansatte") {
      app.innerHTML = listPage("Ansatte", state.stempling.ansatte, "Ansattnavn", "Legg til ansatt");
      setupAdd("stempling", "ansatte", "Ny ansatt");
    }

    if (currentPage === "stemple") {
      app.innerHTML = `
        <div class="pc-app-header">
          <div><p class="eyebrow">Stempling</p><h2>Stemple inn / ut</h2></div>
        </div>
        <div class="demo-actions">
          <button id="inn">Stemple inn</button>
          <button id="ut">Stemple ut</button>
        </div>
        <div class="pc-window">
          <div class="pc-window-head"><span>Registreringer</span><b>I dag</b></div>
          <div class="pc-list" id="itemList"></div>
        </div>
      `;

      document.getElementById("inn").onclick = () => addToList("Stemplet inn " + timeNow());
      document.getElementById("ut").onclick = () => addToList("Stemplet ut " + timeNow());
    }
  }

  function renderOppgaver(app) {
    if (currentPage === "oppgaver") {
      app.innerHTML = listPage("Oppgaver", state.oppgaver.oppgaver, "Ny oppgave", "Legg til oppgave");
      setupAdd("oppgaver", "oppgaver", "Ny oppgave");
    }

    if (currentPage === "team") {
      app.innerHTML = listPage("Team", state.oppgaver.team, "Navn", "Legg til person");
      setupAdd("oppgaver", "team", "Ny person");
    }

    if (currentPage === "ny oppgave") {
      app.innerHTML = formPage("Opprett oppgave", ["Oppgave", "Ansvarlig", "Frist"], "Opprett oppgave");
      setupForm("oppgaver", "oppgaver", "Ny oppgave opprettet");
    }
  }

  function renderForesporsler(app) {
    if (currentPage === "saker") {
      app.innerHTML = listPage("Saker", state.foresporsler.saker, "Ny sak", "Legg til sak");
      setupAdd("foresporsler", "saker", "Ny sak");
    }

    if (currentPage === "kunder") {
      app.innerHTML = listPage("Kunder", state.foresporsler.kunder, "Kundenavn", "Legg til kunde");
      setupAdd("foresporsler", "kunder", "Ny kunde");
    }

    if (currentPage === "ny sak") {
      app.innerHTML = formPage("Opprett sak", ["Hva gjelder saken?", "Kunde", "Ansvarlig"], "Opprett sak");
      setupForm("foresporsler", "saker", "Ny sak opprettet");
    }
  }

  function listPage(title, items, placeholder, buttonText) {
    return `
      <div class="pc-app-header">
        <div>
          <p class="eyebrow">Side</p>
          <h2>${title}</h2>
        </div>
      </div>

      <div class="demo-form pc-form">
        <input id="newInput" placeholder="${placeholder}">
        <button id="addBtn">${buttonText}</button>
      </div>

      <div class="pc-window">
        <div class="pc-window-head"><span>${title}</span><b>Demo</b></div>
        <div class="pc-list" id="itemList">
          ${items.map(item => row(item)).join("")}
        </div>
      </div>
    `;
  }

  function formPage(title, fields, buttonText) {
    return `
      <div class="pc-app-header">
        <div>
          <p class="eyebrow">Ny registrering</p>
          <h2>${title}</h2>
        </div>
      </div>

      <div class="pc-window">
        <div class="pc-list">
          <div class="demo-form pc-form big">
            ${fields.map(field => `<input class="formField" placeholder="${field}">`).join("")}
            <button id="formBtn">${buttonText}</button>
          </div>
        </div>
      </div>

      <div class="pc-window" style="margin-top:18px;">
        <div class="pc-window-head"><span>Opprettet</span><b>Status</b></div>
        <div class="pc-list" id="itemList"></div>
      </div>
    `;
  }

  function setupAdd(system, key, fallback) {
    const input = document.getElementById("newInput");
    const btn = document.getElementById("addBtn");

    btn.addEventListener("click", function () {
      const value = input.value.trim() || fallback;
      state[system][key].unshift(value);
      addToList(value);
      input.value = "";
    });
  }

  function setupForm(system, key, fallback) {
    const btn = document.getElementById("formBtn");

    btn.addEventListener("click", function () {
      const values = [...document.querySelectorAll(".formField")]
        .map(input => input.value.trim())
        .filter(Boolean);

      const value = values.length ? values.join(" · ") : fallback;

      state[system][key].unshift(value);
      addToList(value);
    });
  }

  function addToList(value) {
    document.getElementById("itemList").insertAdjacentHTML("afterbegin", row(value, true));
  }

  function row(text, isNew = false) {
    return `
      <div class="pc-row ${isNew ? "new" : ""}">
        <span>${escapeHtml(text)}</span>
        <b>${isNew ? "Ny" : "Åpen"}</b>
      </div>
    `;
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function timeNow() {
    return new Date().toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
