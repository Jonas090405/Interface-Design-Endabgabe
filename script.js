const stages = [
  {
    title: "Stage 1: Laptop-Bestellung",
    content: `
      <div class="stage stage-1">
        <div class="shop-header">
          <h3>WorstBuy – Der ultimativ unübersichtliche Techshop</h3>
          <div class="shop-search">
            <input type="text" placeholder="Suchbegriff eingeben..." id="search-field">
            <button id="search-btn">🔍</button>
          </div>
        </div>

        <div class="shop-container">
          <div class="filters">
            <h4>Filter</h4>
            <label><input type="checkbox" class="filter" data-filter="cheap"> Preis &lt; 300€</label><br>
            <label><input type="checkbox" class="filter" data-filter="expensive"> Preis &gt; 5000€</label><br>
            <label><input type="checkbox" class="filter" data-filter="gaming"> Gaming</label><br>
            <label><input type="checkbox" class="filter" data-filter="office"> Nicht Gaming</label><br>
            <label><input type="checkbox" class="filter" data-filter="red"> Rot</label><br>
            <label><input type="checkbox" class="filter" data-filter="black"> Schwarz</label><br>
            <label><input type="checkbox" class="filter" data-filter="soldout"> Zeige nur ausverkaufte Produkte</label>
          </div>

          <div class="shop-main">
            <div class="category-nav">
              <button class="category-btn">Computer</button>
              <button class="category-btn">Gamerzeug</button>
              <button class="category-btn">Notebooks</button>
              <button class="category-btn">Laptopzubehör</button>
              <button class="category-btn">Performance-Dinge</button>
            </div>

            <div class="product-grid" id="product-grid">
              <!-- Produkte werden dynamisch geladen -->
            </div>
          </div>
        </div>
      </div>
    `,
    validate: () => {
      return checkoutCompleted ? "" : "Du musst erst den Laptop erfolgreich bestellen!";
    }
  },

  {
    title: "Stage 2: Text eingeben",
    content: `<input id="word" type="text" placeholder="Gib das Wort 'Apfel' ein">`,
    validate: () => {
      const val = document.getElementById("word").value.trim();
      return val === "Apfel" ? "" : "Bitte genau 'Apfel' eingeben!";
    }
  }
];

// --- Produktdaten mit festen Bildern ---
const products = [
  { id: 1, name: "OfficeBook 100", price: 250, category: "office", color: "black", soldout: false, img: "img/officebook100.jpg" },
  { id: 2, name: "StudentPro Basic", price: 499, category: "office", color: "red", soldout: false, img: "img/studentpro.jpg" },
  { id: 3, name: "Gamersdream 5000 Xtreme Ultra Performance", price: 5999, category: "gaming", color: "black", soldout: false, img: "img/gamersdream5000.jpg" },
  { id: 4, name: "CasualBook Mini", price: 199, category: "office", color: "black", soldout: true, img: "img/casualbookmini.jpg" },
  { id: 5, name: "OverheatPro RGB", price: 5999, category: "gaming", color: "red", soldout: false, img: "img/overheatpro.jpg" },
  { id: 6, name: "LagMachine 200", price: 699, category: "gaming", color: "black", soldout: false, img: "img/lagmachine200.jpg" },
  { id: 7, name: "OfficeBook Deluxe", price: 799, category: "office", color: "black", soldout: true, img: "img/officebookdeluxe.jpg" },
  { id: 8, name: "SuperMegaLaptop 9000", price: 8999, category: "gaming", color: "red", soldout: false, img: "img/supermegalaptop9000.jpg" }
];

let checkoutCompleted = false;

// --- Startscreen Logik ---
const readyBtn = document.getElementById("ready-btn");
const clickWord = document.getElementById("click-word");

let ready = false;
clickWord.classList.add("active-link");
readyBtn.textContent = "Nicht bereit";
readyBtn.classList.add("notready");

readyBtn.onclick = () => {
  ready = !ready;
  if (ready) {
    readyBtn.textContent = "Bereit";
    readyBtn.classList.add("ready");
    readyBtn.classList.remove("notready");
    clickWord.classList.remove("active-link");
  } else {
    readyBtn.textContent = "Nicht bereit";
    readyBtn.classList.remove("ready");
    readyBtn.classList.add("notready");
    clickWord.classList.add("active-link");
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
  ["start-screen", "stages", "end-screen", "checkout-screen"].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = "none";
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

  if (idx === 0) initWorstShop();
}

// --- WORSTBUY SHOP LOGIK ---
function initWorstShop() {
  const grid = document.getElementById("product-grid");
  const searchField = document.getElementById("search-field");
  const searchBtn = document.getElementById("search-btn");
  const filters = document.querySelectorAll(".filter");

  function renderProducts(filterFn = () => true) {
    grid.innerHTML = "";
    products.filter(filterFn).forEach(p => {
      const div = document.createElement("div");
      div.className = "product-card";
      if (p.name.includes("Gamersdream")) div.classList.add("highlight-product");

      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" onerror="this.src='https://picsum.photos/160/100?random=${p.id}'">
        <p>${p.name}</p>
        <p style="color:#B20CE9;">${p.price}€</p>
        ${p.soldout ? "<small style='color:#f55;'>Ausverkauft</small><br>" : ""}
        <button class="buy-btn">Jetzt bestellen</button>
      `;

      div.querySelector(".buy-btn").onclick = () => {
        if (p.name.includes("Gamersdream")) {
          showScreen("checkout-screen");
          setupCheckout();
        } else {
          document.getElementById("error-msg").textContent =
            "Fehler: Dieses Produkt ist aktuell nicht lieferbar.";
        }
      };

      grid.appendChild(div);
    });
  }

  renderProducts();

  filters.forEach(cb => {
    cb.addEventListener("change", () => {
      const active = Array.from(filters).filter(f => f.checked).map(f => f.dataset.filter);
      renderProducts(p => {
        return (
          (active.includes("cheap") ? p.price < 300 : true) &&
          (active.includes("expensive") ? p.price > 5000 : true) &&
          (active.includes("gaming") ? p.category === "gaming" : true) &&
          (active.includes("office") ? p.category === "office" : true) &&
          (active.includes("red") ? p.color === "red" : true) &&
          (active.includes("black") ? p.color === "black" : true) &&
          (active.includes("soldout") ? p.soldout : true)
        );
      });
    });
  });

  searchBtn.onclick = () => {
    const term = searchField.value.trim().toLowerCase();
    if (!term) {
      document.getElementById("error-msg").textContent = "Bitte gib etwas ein (oder auch nicht).";
      return;
    }
    if (Math.random() > 0.4) {
      renderProducts(p => p.name.toLowerCase().includes(term));
    } else {
      renderProducts(() => Math.random() > 0.5);
      document.getElementById("error-msg").textContent = "Deine Suche lieferte unklare Ergebnisse.";
    }
  };
}

function setupCheckout() {
  // Inhalt für den Checkout-Screen erzeugen
  const checkoutHTML = `
    <div id="checkout-inner" class="stage">
      <h2 style="color:#B20CE9;">Bezahlvorgang (Beta-Version)</h2>
      <p style="color:#b6b6b6;">Bitte gib deine Daten in <i>richtiger</i> Reihenfolge ein:</p>

      <div class="checkout-form">
        <input type="text" id="country" placeholder="Land"><br>
        <input type="text" id="email" placeholder="E-Mail (optional, aber Pflicht)"><br>
        <input type="text" id="name" placeholder="Name (Nachname zuerst!)"><br>
        <button id="buy-final-btn" class="worst-btn ready" style="width:260px; height:70px; margin-top:30px;">Bestellen</button>
      </div>
    </div>
  `;

  // Inhalt in den vorhandenen Screen schreiben
  const checkoutScreen = document.getElementById("checkout-screen");
  checkoutScreen.innerHTML = checkoutHTML;
  checkoutScreen.style.display = "flex";
  checkoutScreen.style.flexDirection = "column";
  checkoutScreen.style.alignItems = "center";
  checkoutScreen.style.justifyContent = "center";
  checkoutScreen.style.minHeight = "100vh";
  checkoutScreen.style.background = "#0d0d0d";

  // Wenn "Bestellen" geklickt wird
  document.getElementById("buy-final-btn").onclick = () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const country = document.getElementById("country").value.trim();

    if (!name || !email || !country || !email.includes("@")) {
      const msg = document.createElement("div");
      msg.textContent = "Fehlerhafte Eingaben! Bitte probiere es erneut.";
      msg.style.color = "#B20CE9";
      msg.style.marginTop = "10px";
      msg.style.fontWeight = "bold";
      checkoutScreen.appendChild(msg);
      return;
    }

    // Erfolgreich abgeschlossen
    checkoutCompleted = true;
    showScreen("stages");
    document.getElementById("error-msg").textContent = "Laptop erfolgreich bestellt!";
  };
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
  checkoutCompleted = false;
  clearInterval(timerInterval);
  showScreen("start-screen");
  ready = false;
  readyBtn.textContent = "Nicht bereit";
  readyBtn.classList.add("notready");
};

showScreen("start-screen");
