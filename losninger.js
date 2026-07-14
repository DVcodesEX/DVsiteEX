document.addEventListener("DOMContentLoaded", () => {
  const buttons = [...document.querySelectorAll(".solution-switcher button")];
  const content = document.getElementById("solutionContent");
  const title = document.getElementById("solutionTitle");

  const titles = {
    service: "Serviceflyt",
    academy: "Kursportal",
    operations: "Bedriftsnav"
  };

  const state = {
    service: [
      { id: 1, customer: "Kunde 1", task: "Serviceoppdrag", owner: "Ansatt 1", status: "Planlagt" },
      { id: 2, customer: "Kunde 2", task: "Befaring", owner: "Ansatt 2", status: "Pågår" },
      { id: 3, customer: "Kunde 3", task: "Kontroll", owner: "Ansatt 3", status: "Ferdig" }
    ],
    courses: [
      { id: 1, title: "Sikkerhet og rutiner", progress: 75 },
      { id: 2, title: "Kundeservice", progress: 40 },
      { id: 3, title: "Intern opplæring", progress: 10 }
    ],
    activities: [
      "Ansatt 1 fullførte en oppgave",
      "Kunde 2 fikk oppdatert status",
      "Ny rapport ble generert"
    ]
  };

  let current = location.hash.replace("#", "") || "service";
  if (!Object.hasOwn(titles, current)) current = "service";

  buttons.forEach(button => {
    button.classList.toggle("active", button.dataset.solution === current);

    button.addEventListener("click", () => {
      current = button.dataset.solution;
      history.replaceState(null, "", `#${current}`);
      buttons.forEach(item => item.classList.toggle("active", item === button));
      render();
    });
  });

  function render() {
    title.textContent = titles[current];

    if (current === "service") renderService();
    if (current === "academy") renderAcademy();
    if (current === "operations") renderOperations();
  }

  function renderService() {
    content.innerHTML = `
      <section class="service-app">
        <div class="service-top">
          <div>
            <p class="kicker"><span></span> Oppdrag og service</p>
            <h2>Dagens drift</h2>
          </div>
          <button type="button" id="newJob">Nytt oppdrag</button>
        </div>

        <div class="service-layout">
          <aside class="service-sidebar">
            <button class="active">Oversikt</button>
            <button>Oppdrag</button>
            <button>Kunder</button>
            <button>Planlegging</button>
            <button>Dokumentasjon</button>
          </aside>

          <main class="service-main">
            <div class="service-stats">
              <article><span>Aktive oppdrag</span><strong>${state.service.filter(item => item.status !== "Ferdig").length}</strong></article>
              <article><span>Planlagt i dag</span><strong>6</strong></article>
              <article><span>Ferdig denne uken</span><strong>14</strong></article>
            </div>

            <div class="service-flow">
              <div><b>1. Forespørsel</b><span>Kunde registreres</span></div>
              <div><b>2. Planlegging</b><span>Oppdrag fordeles</span></div>
              <div><b>3. Utførelse</b><span>Bilder og notater</span></div>
              <div><b>4. Avslutning</b><span>Rapport og oppfølging</span></div>
            </div>

            <div class="data-panel">
              <div class="panel-head"><strong>Oppdrag</strong><span>${state.service.length} totalt</span></div>
              ${state.service.map(item => `
                <div class="data-row">
                  <strong>${item.customer} · ${item.task}</strong>
                  <small>${item.owner}</small>
                  <span class="status ${statusClass(item.status)}">${item.status}</span>
                  <div class="row-actions"><button data-next-job="${item.id}">Neste steg</button></div>
                </div>
              `).join("")}
            </div>
          </main>
        </div>
      </section>
    `;

    document.getElementById("newJob").addEventListener("click", () => {
      state.service.unshift({
        id: Date.now(),
        customer: `Kunde ${state.service.length + 1}`,
        task: "Nytt oppdrag",
        owner: "Ansatt 1",
        status: "Planlagt"
      });

      toast("Nytt oppdrag opprettet");
      renderService();
    });

    content.querySelectorAll("[data-next-job]").forEach(button => {
      button.addEventListener("click", () => {
        const job = state.service.find(item => item.id == button.dataset.nextJob);

        if (job) {
          job.status = job.status === "Planlagt" ? "Pågår" : job.status === "Pågår" ? "Ferdig" : "Planlagt";
        }

        toast("Oppdraget ble oppdatert");
        renderService();
      });
    });
  }

  function renderAcademy() {
    content.innerHTML = `
      <section class="academy-app">
        <div class="academy-hero">
          <div>
            <p class="kicker"><span></span> Kurs og opplæring</p>
            <h2>Kompetanseportal</h2>
            <p>Bygg kurs i moduler, test kunnskap og dokumenter hvem som har fullført.</p>
          </div>

          <div class="progress-card">
            <span>Samlet progresjon</span>
            <strong>68%</strong>
            <div class="progress-track"><i></i></div>
          </div>
        </div>

        <div class="course-grid">
          ${state.courses.map(course => `
            <article class="course-card">
              <span>Modul ${course.id}</span>
              <h3>${course.title}</h3>
              <p>${course.progress}% fullført</p>
              <button type="button" data-course="${course.id}">Åpne kurs</button>
            </article>
          `).join("")}
        </div>

        <div class="lesson-panel" id="lessonPanel">
          <h3>Kunnskapstest</h3>
          <p>Hva er riktig neste steg når et avvik oppdages?</p>
          <div class="quiz-options">
            <button type="button" data-answer="wrong">Ignorer og fortsett</button>
            <button type="button" data-answer="correct">Registrer avvik og varsle ansvarlig</button>
            <button type="button" data-answer="wrong">Vent til neste møte</button>
          </div>
        </div>
      </section>
    `;

    content.querySelectorAll("[data-course]").forEach(button => {
      button.addEventListener("click", () => {
        toast(`Kursmodul ${button.dataset.course} åpnet`);
      });
    });

    content.querySelectorAll("[data-answer]").forEach(button => {
      button.addEventListener("click", () => {
        content.querySelectorAll("[data-answer]").forEach(item => item.classList.remove("correct"));

        if (button.dataset.answer === "correct") {
          button.classList.add("correct");
          toast("Riktig svar");
        } else {
          toast("Prøv et annet svar");
        }
      });
    });
  }

  function renderOperations() {
    content.innerHTML = `
      <section class="operations-app">
        <div class="operations-head">
          <h2>Bedriftsnav</h2>
          <span>Alt viktig på ett sted</span>
        </div>

        <div class="operations-grid">
          <div class="operations-main">
            <article class="ops-card">
              <h3>Oversikt</h3>
              <div class="metric-grid">
                <div><span>Ansatte på jobb</span><strong>12</strong></div>
                <div><span>Åpne oppgaver</span><strong>18</strong></div>
                <div><span>Venter på behandling</span><strong>4</strong></div>
              </div>
            </article>

            <article class="ops-card">
              <h3>Moduler</h3>
              <div class="module-grid">
                <button type="button" data-module="Ansatte">Ansatte</button>
                <button type="button" data-module="Ferie">Ferie</button>
                <button type="button" data-module="Timer">Timer</button>
                <button type="button" data-module="Prosjekter">Prosjekter</button>
                <button type="button" data-module="Kunder">Kunder</button>
                <button type="button" data-module="Rapporter">Rapporter</button>
              </div>
            </article>
          </div>

          <aside class="operations-side">
            <article class="ops-card">
              <h3>Siste aktivitet</h3>
              <div class="activity-list">
                ${state.activities.map((item, index) => `
                  <div><span>${item}</span><small>${index + 1} t</small></div>
                `).join("")}
              </div>
            </article>

            <article class="ops-card">
              <h3>Opprett intern oppgave</h3>
              <form class="quick-form" id="quickForm">
                <input name="task" placeholder="Oppgave" required>
                <select name="owner">
                  <option>Ansatt 1</option>
                  <option>Ansatt 2</option>
                  <option>Ansatt 3</option>
                </select>
                <button type="submit">Opprett</button>
              </form>
            </article>
          </aside>
        </div>
      </section>
    `;

    content.querySelectorAll("[data-module]").forEach(button => {
      button.addEventListener("click", () => {
        toast(`${button.dataset.module}-modulen åpnet`);
      });
    });

    document.getElementById("quickForm").addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      state.activities.unshift(`${data.get("owner")} fikk oppgaven: ${data.get("task")}`);
      toast("Intern oppgave opprettet");
      renderOperations();
    });
  }

  function statusClass(status) {
    if (status === "Ferdig") return "green";
    if (status === "Pågår") return "orange";
    return "blue";
  }

  function toast(message) {
    document.querySelector(".toast")?.remove();

    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    document.body.appendChild(node);

    setTimeout(() => node.remove(), 2000);
  }

  render();
});
