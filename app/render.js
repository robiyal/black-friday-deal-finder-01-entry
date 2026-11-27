// HTML for the deal list and the single-deal page. Every value is escaped
// before it goes into the page, and every number is computed from the data,
// so the discount shown always matches the two prices.

import { off, saved } from "./filters.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const usd = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

const day = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

const VERDICT_CLASS = { "NEW LOW": "v-new", STRONG: "v-strong", ROUTINE: "v-routine" };

function verdictChip(deal) {
  return `<span class="verdict ${VERDICT_CLASS[deal.verdict] ?? "v-routine"}">${escape(deal.verdict)}</span>`;
}

function alsoAtLine(deal) {
  if (!deal.alsoAt || deal.alsoAt.length === 0) return "";
  const parts = deal.alsoAt
    .map((a) => `${escape(a.store)} ${usd(a.price)}`)
    .join(" · ");
  return `<p class="also">Also at: ${parts}</p>`;
}

export function dealCard(deal) {
  return `<article class="card">
  <div class="card-top"><span class="store">${escape(deal.store)}</span>${verdictChip(deal)}</div>
  <h3><a href="#/deal/${encodeURIComponent(deal.id)}">${escape(deal.title)}</a></h3>
  <p class="cat">${escape(deal.category)}</p>
  <p class="prices"><span class="sale">${usd(deal.price)}</span> <s>${usd(deal.was)}</s> <span class="pct">−${off(deal)}%</span></p>
  <p class="save">Save ${usd(saved(deal))}</p>
  <p class="meta">Checked ${day(deal.checked)} · ${escape(deal.source)}</p>
  <a class="buy" href="${escape(deal.url)}" target="_blank" rel="noopener">View at ${escape(deal.store)} ↗</a>
</article>`;
}

export function dealRows(deals) {
  if (deals.length === 0) {
    return `<p class="empty">No deal matches these filters. Clear the search or pick another category.</p>`;
  }
  return `<div class="grid">${deals.map(dealCard).join("")}</div>`;
}

export function dealPage(deal) {
  return `<article class="detail">
  <p class="crumbs"><a href="#/">← All deals</a> · ${escape(deal.category)}</p>
  <div class="card-top"><span class="store">${escape(deal.store)}</span>${verdictChip(deal)}</div>
  <h2>${escape(deal.title)}</h2>
  <p class="prices big"><span class="sale">${usd(deal.price)}</span> <s>${usd(deal.was)}</s> <span class="pct">−${off(deal)}%</span></p>
  <p class="save">You save ${usd(saved(deal))} (${off(deal)}% off the usual price).</p>
  <p class="evidence"><strong>Why it counts as ${escape(deal.verdict.toLowerCase())}:</strong> ${escape(deal.evidence)}</p>
  ${alsoAtLine(deal)}
  <p class="meta">Price checked ${day(deal.checked)} · Source: ${escape(deal.source)}</p>
  <p class="meta">Prices move during Black Friday week — re-check the price at the store before you buy.</p>
  <a class="buy big" href="${escape(deal.url)}" target="_blank" rel="noopener">View at ${escape(deal.store)} ↗</a>
</article>`;
}

export function missingPage() {
  return `<p class="empty">That deal is not on this board. <a href="#/">Back to all deals</a>.</p>`;
}
