# Black Friday Beacon

[![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/robiyal/black-friday-deal-finder-01-entry/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/robiyal/black-friday-deal-finder-01-entry/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A Black Friday deal finder: 85 real Black Friday and Cyber Monday deals,
found and checked on 28 November 2026, each with its store, sale price, usual
price, discount, store link and check time — plus search and filters by
category, store and discount, sorting, a "really a deal" verdict on every
deal, and a phone layout.

Entry for the [Black Friday deal finder bounty](https://make.fun/bounty/black-friday-deal-finder-01)
on [make.fun](https://make.fun).

## How it works

- `app/` is the site as plain static files: `index.html`, `style.css`,
  `main.js` (boot and wiring), `render.js` (deal cards and the deal page),
  `filters.js` (search, filter and sort) and `deals.js` (the 85 checked
  deals). No build step, no network requests, no external assets.
- `main.ts` copies `app/` and `screenshots/` to `/output` and writes
  `/output/dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`.
- `node serve.ts` serves `app/` locally on http://localhost:8080.

## The deals

Every deal was checked on 28 November 2026 in a deals roundup that names the
store, or in the store's own Black Friday release. Each card shows where the
price was read and when. Verdicts: **NEW LOW** (lowest price the source has
tracked), **STRONG** (a deep, real cut), **ROUTINE** (a modest or typical
sale). Prices move during Black Friday week — re-check at the store before
buying.

## License

MIT — see [LICENSE](LICENSE).
