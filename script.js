const stages = [
  {
    title: "Stage 1: Zahlen-Addition",
    content: `<input id="num1" type="number" placeholder="5"> + <input id="num2" type="number" placeholder="3">
              <input id="answer1" type="number" placeholder="Ergebnis">`,
    validate: () => {
      const num1El = document.getElementById("num1");
      const num2El = document.getElementById("num2");
      const ansEl = document.getElementById("answer1");

      const n1Val = num1El.value.trim();
      const n2Val = num2El.value.trim();
      const ansVal = ansEl.value.trim();

      if (n1Val === "" || n2Val === "" || ansVal === "") {
        return "Bitte alle Felder ausfüllen!";
      }

      const n1 = +n1Val;
      const n2 = +n2Val;
      const ans = +ansVal;

      if (isNaN(n1) || isNaN(n2) || isNaN(ans)) {
        return "Ungültige Zahleneingabe!";
      }

      return (n1 + n2 === ans) ? "" : "Bitte die richtige Summe eintragen!";
    }
  },
  {
    title: "Stage 2: Text eingeben",
    content: `<input id="word" type="text" placeholder="Gib das Wort 'Apfel' ein">`,
    validate: () => {
      const val = document.getElementById("word").value.trim();
      return val === "Apfel" ? "" : "Bitte genau 'Apfel' eingeben!";
    }
  },
  {
    title: "Stage 3: Check-Box",
    content: `<label><input id="cb" type="checkbox"> Ich stimme zu</label>`,
    validate: () => {
      const cb = document.getElementById("cb");
      return cb.checked ? "" : "Haken setzen!";
    }
  },
  {
    title: "Stage 4: Auswahl",
    content: `<select id="sel"><option value="">Wähle...</option><option>rot</option><option>blau</option></select>`,
    validate: () => {
      const sel = document.getElementById("sel");
      return sel.value ? "" : "Bitte eine Farbe auswählen!";
    }
  },
  {
    title: "Stage 5: Code-Eingabe",
    content: `<input id="code" type="text" placeholder="Geheimcode: 1234">`,
    validate: () => {
      const val = document.getElementById("code").value.trim();
      return val === "1234" ? "" : "Falscher Code!";
    }
  }
];

// --- Startscreen Logik ---
const readyBtn = document.getElementById("ready-btn");
const clickWord = document.getElementById("click-word");

let ready = true;

// Anfangszustand: "Bereit" – keine Hervorhebung, aber klickbar
clickWord.classList.remove("active-link");
clickWord.style.cursor = "default";

readyBtn.onclick = () => {
  ready = !ready;
  if (ready) {
    // Bereit: NICHT hervorgehoben, aber klickbar
    readyBtn.textContent = "Bereit";
    readyBtn.classList.add("ready");
    readyBtn.classList.remove("notready");
    clickWord.classList.remove("active-link");
    clickWord.style.cursor = "default";
  } else {
    // Nicht bereit: Sieht klickbar aus, funktioniert aber nicht
    readyBtn.textContent = "Nicht bereit";
    readyBtn.classList.add("notready");
    readyBtn.classList.remove("ready");
    clickWord.classList.add("active-link");
    clickWord.style.cursor = "pointer";
  }
};

clickWord.onclick = () => {
  if (ready) {
    showScreen("stages");
    startStage(0);
  }
};

// --- Spiel Logik ---
let currentStage = 0;
let totalScore = 0;
let startTime = 0;
let timerInterval = null;

function showScreen(id) {
  ["start-screen", "stages", "end-screen"].forEach(s => {
    document.getElementById(s).style.display = "none";
  });
  document.getElementById(id).style.display = "flex";
}

function startStage(idx) {
  currentStage = idx;
  const st = stages[idx];
  document.getElementById("stage-title").textContent = st.title;
  document.getElementById("stage-content").innerHTML = st.content;
  document.getElementById("error-msg").textContent = '';
  document.getElementById("timer").textContent = "0.00";
  startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    document.getElementById("timer").textContent = ((Date.now() - startTime) / 1000).toFixed(2);
  }, 20);
}

document.getElementById("submit-btn").onclick = () => {
  const error = stages[currentStage].validate();
  if (error) {
    document.getElementById("error-msg").textContent = error;
  } else {
    clearInterval(timerInterval);
    const time = (Date.now() - startTime) / 1000;
    const score = Math.max(0, 100 - time * 10);
    totalScore += Math.round(score);
    if (currentStage < stages.length - 1) startStage(++currentStage);
    else {
      document.getElementById("score").textContent = totalScore;
      showScreen("end-screen");
    }
  }
};

document.getElementById("restart-btn").onclick = () => {
  totalScore = 0;
  currentStage = 0;
  clearInterval(timerInterval);
  showScreen("start-screen");

  ready = true;
  clickWord.classList.remove("active-link");
  clickWord.style.cursor = "default";
  readyBtn.textContent = "Bereit";
  readyBtn.classList.add("ready");
  readyBtn.classList.remove("notready");
};

showScreen("start-screen");
