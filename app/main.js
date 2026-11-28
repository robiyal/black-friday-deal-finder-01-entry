// Boot and wiring: hash routes, the search box, the category chips, the store
// and discount filters, the sort picker, and the stats bar. The page renders
// from the data in deals.js alone; nothing is fetched from the network.
//
//   #/            the deal list, with search and filters
//   #/deal/<id>   one deal, with its verdict and evidence
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES } from "./deals.js";
import { SORTS, applyFilters, countByCategory, summaryStats } from "./filters.js";
import { dealPage, dealRows, missingPage } from "./render.js";

const app = document.getElementById("app");
const statsBar = document.getElementById("stats");
const countLine = document.getElementById("count");

const state = {
  query: "",
  category: "All",
  store: "All stores",
  minOff: 0,
  onlyNewLow: false,
  sort: "discount",
};

const counts = countByCategory(deals);
const stats = summaryStats(deals);

statsBar.innerHTML =
  `<span><strong>${stats.count}</strong> deals checked</span>` +
  `<span><strong>${stats.newLows}</strong> new lows</span>` +
  `<span><strong>${stats.avgOff}%</strong> average discount</span>` +
  `<span><strong>${stats.bestOff}%</strong> biggest cut</span>` +
  `<span><strong>$${stats.totalSaved.toLocaleString("en-US")}</strong> total savings</span>`;

function controlBar() {
  const chips = CATEGORIES.map(
    (c) =>
      `<button type="button" class="chip${state.category === c ? " on" : ""}" data-cat="${c}">${c} (${counts[c] ?? 0})</button>`,
  ).join("");
  const stores = STORES.map(
    (s) => `<option value="${s}"${state.store === s ? " selected" : ""}>${s}</option>`,
  ).join("");
  const sorts = Object.entries(SORTS)
    .map(([k, v]) => `<option value="${k}"${state.sort === k ? " selected" : ""}>${v.label}</option>`)
    .join("");
  return `<div class="controls">
  <input id="q" type="search" placeholder="Search deals, stores, categories…" value="${state.query.replace(/"/g, "&quot;")}" aria-label="Search deals">
  <div class="chips">${chips}</div>
  <div class="row">
    <label>Store <select id="store">${stores}</select></label>
    <label>Min. discount <select id="minoff">
      <option value="0"${state.minOff === 0 ? " selected" : ""}>Any</option>
      <option value="30"${state.minOff === 30 ? " selected" : ""}>30% or more</option>
      <option value="50"${state.minOff === 50 ? " selected" : ""}>50% or more</option>
    </select></label>
    <label>Sort by <select id="sort">${sorts}</select></label>
    <label class="check"><input id="newlow" type="checkbox"${state.onlyNewLow ? " checked" : ""}> New lows only</label>
  </div>
</div>`;
}

function renderList() {
  const shown = applyFilters(deals, state);
  countLine.textContent = `Showing ${shown.length} of ${deals.length} deals · sorted by ${SORTS[state.sort].label.toLowerCase()}`;
  app.innerHTML = controlBar() + dealRows(shown);
  const q = document.getElementById("q");
  q.addEventListener("input", () => {
    state.query = q.value;
    renderListKeepFocus();
  });
  app.querySelectorAll(".chip").forEach((b) =>
    b.addEventListener("click", () => {
      state.category = b.dataset.cat;
      renderList();
    }),
  );
  document.getElementById("store").addEventListener("change", (e) => {
    state.store = e.target.value;
    renderList();
  });
  document.getElementById("minoff").addEventListener("change", (e) => {
    state.minOff = Number(e.target.value);
    renderList();
  });
  document.getElementById("sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderList();
  });
  document.getElementById("newlow").addEventListener("change", (e) => {
    state.onlyNewLow = e.target.checked;
    renderList();
  });
}

function renderListKeepFocus() {
  const shown = applyFilters(deals, state);
  countLine.textContent = `Showing ${shown.length} of ${deals.length} deals · sorted by ${SORTS[state.sort].label.toLowerCase()}`;
  const grid = app.querySelector(".grid, .empty");
  const html = dealRows(shown);
  if (grid) grid.outerHTML = html;
  else app.insertAdjacentHTML("beforeend", html);
  const q = document.getElementById("q");
  q.focus();
  q.setSelectionRange(q.value.length, q.value.length);
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Deal not found"} | Black Friday Beacon`;
    app.innerHTML = found ? dealPage(found) : missingPage();
    countLine.textContent = found
      ? `${found.store} · checked 28 Nov 2026`
      : "";
  } else {
    document.title = "Black Friday Beacon — 85 real Black Friday deals, checked 28 Nov 2026";
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
