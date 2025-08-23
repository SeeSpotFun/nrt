// ===== Versioning (app.js) =====
const APP_JS_VERSION = "v.002";
function injectAppJsVersion() {
  const el = document.getElementById("version-appjs");
  if (el) el.textContent = `js: ${APP_JS_VERSION}`;
}

// Compute and display "Last update" date in footer (newest of page/script load)
function updateFooterLastUpdated() {
  const footerEl = document.getElementById("last-updated");
  if (!footerEl) return;

  let htmlTime = null;
  let jsTime = null;

  try {
    if (performance && performance.getEntriesByType) {
      const resources = performance.getEntriesByType("resource");
      const nav = performance.getEntriesByType("navigation")?.[0];
      if (nav) htmlTime = new Date(performance.timeOrigin + nav.responseEnd);
      const jsEntry = resources?.find((r) => (r.name || "").endsWith("app.js"));
      if (jsEntry)
        jsTime = new Date(performance.timeOrigin + jsEntry.responseEnd);
    }
  } catch (e) {}

  if (!htmlTime) htmlTime = new Date(document.lastModified || Date.now());
  if (!jsTime) jsTime = new Date();

  const latest = jsTime.getTime() > htmlTime.getTime() ? jsTime : htmlTime;
  const y = latest.getFullYear();
  const m = String(latest.getMonth() + 1).padStart(2, "0");
  const d = String(latest.getDate()).padStart(2, "0");
  footerEl.textContent = `Last update: ${y}.${m}.${d}`;
}
// ===== End Versioning =====

// ===== New: Intake conversion (Amount + Unit -> cigarettes/day) =====
const CIGS_PER_PACK = 20;
const PACKS_PER_CARTON = 10;
const CIGS_PER_CARTON = CIGS_PER_PACK * PACKS_PER_CARTON; // 200

function convertToCigsPerDay(amountRaw, unit) {
  const CIGS_PER_PACK = 20;
  const PACKS_PER_CARTON = 10;
  const CIGS_PER_CARTON = CIGS_PER_PACK * PACKS_PER_CARTON; // 200

  const amount = Number(amountRaw);
  if (!isFinite(amount) || amount < 0) return null;

  switch (unit) {
    case "cigs_per_day":
      return amount;
    case "packs_per_day":
      return amount * CIGS_PER_PACK;
    case "cartons_per_1_week":
      return (amount * CIGS_PER_CARTON) / 7;
    case "cartons_per_2_weeks":
      return (amount * CIGS_PER_CARTON) / 14;
    case "cartons_per_3_weeks":
      return (amount * CIGS_PER_CARTON) / 21;
    case "cartons_per_4_weeks":
      return (amount * CIGS_PER_CARTON) / 28;
    case "cartons_per_custom": {
      const customAmtEl = document.getElementById("custom-period-amount");
      const customUnitEl = document.getElementById("custom-period-unit");
      if (!customAmtEl || !customUnitEl) return null;

      const periodAmt = Number(customAmtEl.value);
      const periodUnit = customUnitEl.value; // 'days' | 'weeks' | 'months'
      if (!isFinite(periodAmt) || periodAmt <= 0) return null;

      const daysPer =
        periodUnit === "days" ? 1 : periodUnit === "weeks" ? 7 : 30;
      const periodDays = periodAmt * daysPer;
      if (periodDays <= 0) return null;

      return (amount * CIGS_PER_CARTON) / periodDays;
    }
    default:
      return null;
  }
}

function setupIntakeConverter() {
  const amountEl = document.getElementById("intake-amount");
  const unitEl = document.getElementById("intake-unit");
  const derivedEl = document.getElementById("derived-cigs-per-day");

  const customWrap = document.getElementById("custom-period");
  const customAmtEl = document.getElementById("custom-period-amount");
  const customUnitEl = document.getElementById("custom-period-unit");

  if (!amountEl || !unitEl || !derivedEl) return;

  function updateResultsFromIntake() {
    setTimeout(updateResultsFromIntake, 0);

    const unit = unitEl.value;
    const amt = amountEl.value;

    if (customWrap)
      customWrap.style.display =
        unit === "cartons_per_custom" ? "flex" : "none";

    const result = convertToCigsPerDay(amt, unit);
    if (result === null || result <= 0) {
      derivedEl.textContent = "—";
      const resultDiv = document.getElementById("dosing-result");
      if (resultDiv) resultDiv.classList.add("hidden");
      return;
    }

    const clamped = Math.max(1, Math.min(200, Math.round(result)));
    derivedEl.textContent = String(clamped);

    // Use existing display flow
    calculateDosing();
  }

  amountEl.addEventListener("input", updateResultsFromIntake);
  unitEl.addEventListener("change", updateResultsFromIntake);
  if (customAmtEl)
    customAmtEl.addEventListener("input", updateResultsFromIntake);
  if (customUnitEl)
    customUnitEl.addEventListener("change", updateResultsFromIntake);

  updateResultsFromIntake();
  setTimeout(updateResultsFromIntake, 0);
}

// ===== End New: Intake conversion =====

// NRT Dosing Data
const dosingData = [
  {
    cigarettes: 10,
    nicotine_need: 15,
    patches: "1 x 21mg",
    short_acting: "2-4mg gum/lozenge every 1-2 hours as needed",
  },
  {
    cigarettes: 20,
    nicotine_need: 30,
    patches: "1 x 21mg",
    short_acting: "2-4mg gum/lozenge every 1-2 hours as needed",
  },
  {
    cigarettes: 30,
    nicotine_need: 45,
    patches: "1-2 x 21mg",
    short_acting: "4mg gum/lozenge every 1-2 hours as needed",
  },
  {
    cigarettes: 40,
    nicotine_need: 60,
    patches: "1-2 x 21mg",
    short_acting: "4mg gum/lozenge every 1-2 hours as needed",
  },
  {
    cigarettes: 50,
    nicotine_need: 75,
    patches: "2-3 x 21mg",
    short_acting: "4mg gum/lozenge every 1 hour as needed",
  },
  {
    cigarettes: 60,
    nicotine_need: 90,
    patches: "2-3 x 21mg",
    short_acting: "4mg gum/lozenge every 1 hour as needed",
  },
  {
    cigarettes: 70,
    nicotine_need: 105,
    patches: "3-4 x 21mg",
    short_acting: "4mg gum/lozenge every 1 hour as needed",
  },
  {
    cigarettes: 80,
    nicotine_need: 120,
    patches: "3-4 x 21mg",
    short_acting: "4mg gum/lozenge every 1 hour as needed",
  },
  {
    cigarettes: 90,
    nicotine_need: 135,
    patches: "3-4 x 21mg",
    short_acting: "4mg gum/lozenge every 1 hour as needed",
  },
  {
    cigarettes: 100,
    nicotine_need: 150,
    patches: "3-4 x 21mg",
    short_acting: "4mg gum/lozenge every 1 hour as needed",
  },
];

const heavySmokerData = [
  {
    level: "3.0 packs/day (60 cigs)",
    nicotine_need: 90,
    patches: "3 x 21mg patches",
    total_nicotine: 63,
    support: "4mg every hour as needed",
    supervision: "Recommended",
  },
  {
    level: "3.5 packs/day (70 cigs)",
    nicotine_need: 105,
    patches: "3-4 x 21mg patches",
    total_nicotine: "63-84",
    support: "4mg every hour as needed",
    supervision: "Strongly Recommended",
  },
  {
    level: "4.0 packs/day (80 cigs)",
    nicotine_need: 120,
    patches: "4 x 21mg patches",
    total_nicotine: 84,
    support: "4mg every 30-60 min as needed",
    supervision: "Required",
  },
  {
    level: "4.5 packs/day (90 cigs)",
    nicotine_need: 135,
    patches: "4-5 x 21mg patches",
    total_nicotine: "84-105",
    support: "4mg every 30-60 min as needed",
    supervision: "Required",
  },
  {
    level: "5.0 packs/day (100 cigs)",
    nicotine_need: 150,
    patches: "5 x 21mg patches",
    total_nicotine: 105,
    support: "4mg every 30-60 min as needed",
    supervision: "Required",
  },
];

// Global function to calculate dosing (now driven by auto-derived value)
function calculateDosing() {
  console.log("calculateDosing (auto) called");

  // Read derived cigs/day from the auto converter
  const derivedEl = document.getElementById("derived-cigs-per-day");
  if (!derivedEl) {
    console.error("Derived cigarettes/day element not found");
    return;
  }

  const raw = (derivedEl.textContent || "").trim();
  const cigarettes = parseInt(raw, 10);

  console.log("Auto-derived cigarettes/day:", cigarettes);

  if (!cigarettes || cigarettes < 1) {
    // Hide results if invalid/empty
    const resultDiv = document.getElementById("dosing-result");
    if (resultDiv) resultDiv.classList.add("hidden");
    return;
  }

  // Find the closest dosing recommendation
  let recommendation = null;
  for (let i = 0; i < dosingData.length; i++) {
    if (cigarettes <= dosingData[i].cigarettes) {
      recommendation = dosingData[i];
      break;
    }
  }
  if (!recommendation) recommendation = dosingData[dosingData.length - 1];
  if (cigarettes < 10) recommendation = dosingData[0];

  console.log("Selected recommendation:", recommendation);
  displayDosingResults(recommendation, cigarettes);
}

// Display the dosing calculation results
function displayDosingResults(recommendation, cigarettes) {
  console.log("displayDosingResults called with:", recommendation, cigarettes);
  const resultDiv = document.getElementById("dosing-result");
  const nicotineNeed = document.getElementById("nicotine-need");
  const patchRec = document.getElementById("patch-rec");
  const shortActing = document.getElementById("short-acting");
  const supervisionNotice = document.getElementById("supervision-notice");

  if (!resultDiv || !nicotineNeed || !patchRec || !shortActing) {
    console.error("Could not find result elements");
    return;
  }

  const actualNicotineNeed = Math.round(cigarettes * 1.5); // Approximate 1.5mg per cigarette
  nicotineNeed.textContent = `${actualNicotineNeed} mg`;
  patchRec.textContent = recommendation.patches;
  shortActing.textContent = recommendation.short_acting;

  if (supervisionNotice) {
    supervisionNotice.style.display = cigarettes >= 60 ? "block" : "none";
  }

  resultDiv.classList.remove("hidden");
  // no auto-scroll
}

// Enhanced table scroll detection for fade indicators
function setupTableScrollIndicators() {
  const tableWrappers = document.querySelectorAll(".table-wrapper");
  tableWrappers.forEach((wrapper) => {
    const table = wrapper.querySelector("table");
    const fadeRight = wrapper.querySelector(".table-fade-right");
    if (!table || !fadeRight) return;

    function updateScrollIndicator() {
      const scrollLeft = wrapper.scrollLeft;
      const scrollWidth = wrapper.scrollWidth;
      const clientWidth = wrapper.clientWidth;
      const isScrolledToEnd = scrollLeft + clientWidth >= scrollWidth - 5;
      if (isScrolledToEnd) wrapper.classList.add("scrolled-to-end");
      else wrapper.classList.remove("scrolled-to-end");
    }

    updateScrollIndicator();
    wrapper.addEventListener("scroll", updateScrollIndicator);
    window.addEventListener("resize", updateScrollIndicator);

    let startX = 0;
    let scrollLeftStart = 0;
    wrapper.addEventListener("touchstart", (e) => {
      startX = e.touches[0].pageX;
      scrollLeftStart = wrapper.scrollLeft;
    });
    wrapper.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const x = e.touches.pageX;
      const walk = (x - startX) * 1.5;
      wrapper.scrollLeft = scrollLeftStart - walk;
    });
  });
}

// Enhanced mobile table experience
function enhanceMobileTableExperience() {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  if (isMobile || isTablet) {
    const tables = document.querySelectorAll(
      ".dosing-table, .heavy-smoker-table"
    );
    tables.forEach((table) => {
      const wrapper = table.closest(".table-wrapper");
      if (!wrapper) return;
      wrapper.style.position = "relative";
      setTimeout(() => {
        if (wrapper.scrollWidth > wrapper.clientWidth) {
          wrapper.scrollTo({ left: 50, behavior: "smooth" });
          setTimeout(() => {
            wrapper.scrollTo({ left: 0, behavior: "smooth" });
          }, 1500);
        }
      }, 1000);
    });
  }
}

// Smooth scrolling for nav links (if present)
function setupSmoothScrolling() {
  const links = document.querySelectorAll('.nav__link[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        // smooth scroll only once; do not fight user scroll
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => history.replaceState(null, "", " "), 0); // clear hash to prevent re-jumps
      }
    });
  });
}

// Input handler for calculator (Enter to calculate)
function setupCalculatorInputHandler() {
  const input = document.getElementById("cigarettes");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") calculateDosing();
  });
}

// Populate the main dosing table
function populateDosingTable() {
  const tableBody = document.getElementById("dosing-table-body");
  if (!tableBody) {
    console.error("Dosing table body not found");
    return;
  }
  tableBody.innerHTML = "";
  dosingData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="sticky-column">${item.cigarettes}</td>
      <td>${item.nicotine_need} mg</td>
      <td>${item.patches}</td>
      <td>${item.short_acting}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Populate the heavy smoker table
function populateHeavySmokerTable() {
  const tableBody = document.getElementById("heavy-smoker-table-body");
  if (!tableBody) {
    console.error("Heavy smoker table body not found");
    return;
  }
  tableBody.innerHTML = "";
  heavySmokerData.forEach((item) => {
    const row = document.createElement("tr");
    const supervisionClass = getSupervisionClass(item.supervision);
    row.innerHTML = `
      <td class="sticky-column"><strong>${item.level}</strong></td>
      <td>${item.nicotine_need} mg</td>
      <td>${item.patches}</td>
      <td>${item.total_nicotine} mg</td>
      <td>${item.support}</td>
      <td><span class="status ${supervisionClass}">${item.supervision}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

function getSupervisionClass(supervision) {
  switch (supervision.toLowerCase()) {
    case "recommended":
      return "status--info";
    case "strongly recommended":
      return "status--warning";
    case "required":
      return "status--error";
    default:
      return "status--info";
  }
}

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");
  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("nav__link--active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("nav__link--active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);

window.addEventListener("resize", function () {
  setTimeout(setupTableScrollIndicators, 100);
  setTimeout(enhanceMobileTableExperience, 200);
});

// Accessibility: keyboard scrolling for tables
function enhanceTableAccessibility() {
  const tables = document.querySelectorAll(
    ".dosing-table, .heavy-smoker-table"
  );
  tables.forEach((table) => {
    table.setAttribute("tabindex", "0");
    table.setAttribute("role", "table");
    table.setAttribute(
      "aria-label",
      "NRT dosing information - use arrow keys to navigate"
    );
    table.addEventListener("keydown", function (e) {
      const wrapper = table.closest(".table-wrapper");
      if (!wrapper) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          wrapper.scrollLeft -= 50;
          break;
        case "ArrowRight":
          e.preventDefault();
          wrapper.scrollLeft += 50;
          break;
        case "Home":
          e.preventDefault();
          wrapper.scrollLeft = 0;
          break;
        case "End":
          e.preventDefault();
          wrapper.scrollLeft = wrapper.scrollWidth;
          break;
      }
    });
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, initializing...");
  injectAppJsVersion();
  updateFooterLastUpdated();

  setupIntakeConverter(); // NEW
  populateDosingTable();
  populateHeavySmokerTable();
  setupSmoothScrolling();
  setupCalculatorInputHandler();
  setupTableScrollIndicators();
  enhanceMobileTableExperience();
  enhanceTableAccessibility();

  window.calculateDosing = calculateDosing;
  console.log("calculateDosing function attached to window");
});

// Export for tests/modules (optional)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateDosing,
    populateDosingTable,
    populateHeavySmokerTable,
    dosingData,
    heavySmokerData,
    setupTableScrollIndicators,
    enhanceMobileTableExperience,
    convertToCigsPerDay,
  };
}
