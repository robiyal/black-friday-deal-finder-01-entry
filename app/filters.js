// Filtering, searching and sorting for the deal list. One job: take the full
// deal list plus the controls' state and return the deals to show, in order.

export const SORTS = {
  discount: { label: "Biggest discount", run: (a, b) => off(b) - off(a) || a.price - b.price },
  priceLow: { label: "Lowest price", run: (a, b) => a.price - b.price || off(b) - off(a) },
  priceHigh: { label: "Highest price", run: (a, b) => b.price - a.price || off(b) - off(a) },
  savings: { label: "Most dollars saved", run: (a, b) => saved(b) - saved(a) || off(b) - off(a) },
};

export function off(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function saved(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function verdictRank(deal) {
  return { "NEW LOW": 0, STRONG: 1, ROUTINE: 2 }[deal.verdict] ?? 3;
}

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  const minOff = state.minOff;
  let out = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All stores" && d.store !== state.store) return false;
    if (minOff > 0 && off(d) < minOff) return false;
    if (state.onlyNewLow && d.verdict !== "NEW LOW") return false;
    if (q !== "") {
      const hay = `${d.title} ${d.store} ${d.category} ${d.verdict}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const sort = SORTS[state.sort] ?? SORTS.discount;
  return [...out].sort(sort.run);
}

export function countByCategory(deals) {
  const counts = { All: deals.length };
  for (const d of deals) counts[d.category] = (counts[d.category] ?? 0) + 1;
  return counts;
}

export function summaryStats(deals) {
  if (deals.length === 0) return { count: 0, avgOff: 0, bestOff: 0, totalSaved: 0, newLows: 0 };
  const offs = deals.map(off);
  return {
    count: deals.length,
    avgOff: Math.round(offs.reduce((a, b) => a + b, 0) / offs.length),
    bestOff: Math.max(...offs),
    totalSaved: Math.round(deals.reduce((a, d) => a + saved(d), 0)),
    newLows: deals.filter((d) => d.verdict === "NEW LOW").length,
  };
}
