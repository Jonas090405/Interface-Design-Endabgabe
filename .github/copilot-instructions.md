## Purpose
This file gives immediate, actionable context for AI coding agents working on this small static minigame project so they can be productive without human hand-holding.

## Big picture
- Single-page static web app (no build system). UI in `Index.html`, styling in `style.css`, behavior and game logic in `script.js`.
- `script.js` contains the game's data + renderer-style functions: a `stages` array defines each stage (title, `content` HTML string, and `validate()`), a `products` array holds shop items, and functions like `startStage()`, `initWorstShop()`, and `setupCheckout()` manage UI flow.

## Key files & examples (what to edit for common tasks)
- `Index.html` — screen containers with IDs: `start-screen`, `stages`, `checkout-screen`, `end-screen`. The app mounts into `#app-container` and loads `script.js` at the end of the body.
- `script.js` — main logic. Concrete examples:
  - To add/change a level: edit the `stages` array (each element: `title`, `content` HTML string, `validate` function). Example: Stage 2 expects exact input `Apfel`.
  - To adjust shop items (names/prices/images): edit the `products` array (fields: `id`, `name`, `price`, `category`, `color`, `soldout`, `img`). The shop UI is rendered by `initWorstShop()` into `#product-grid`.
  - To modify checkout behavior: edit `setupCheckout()` and the `checkoutCompleted` global flag which the validator uses.
  - Timer/score usage: `startTime`, `timerInterval`, and `totalScore` are global; `submit-btn` triggers stage validation.
- `style.css` — global look & feel; primary color `#B20CE9` and heavy use of `.worst-btn` classes. Prefer to respect class names when changing visuals.

## Patterns & conventions
- No module bundler: code is loaded in global scope. Avoid introducing imports without adding build tooling.
- DOM-first pattern: script writes HTML strings into `innerHTML` for stages and checkout. When changing structure, update both `Index.html` (container IDs) and the corresponding `script.js` renderers.
- Small project-level globals: `currentStage`, `checkoutCompleted`, `totalScore`, etc. Refactors should track and preserve their usage across functions.

## How to run & debug locally
- No build step. Options:
  - Open `Index.html` directly in a browser (double-click) for quick tests.
  - Or run a local static server (recommended to avoid mixed-content / CORS for assets):
    - PowerShell friendly: `py -3 -m http.server 8000` or `python -m http.server 8000` then open `http://localhost:8000/`.
  - Use the browser DevTools Console to see runtime errors and to inspect DOM IDs listed above.

## Integration points / external deps
- No package.json or external dependencies. Images referenced in `products[].img` are expected under `img/` relative to repo root; `onerror` fallback uses `https://picsum.photos/...`.

## Common edit patterns & quick fixes
- If a stage's UI doesn't show: ensure the stage's `content` HTML string uses unique element IDs or selectors the `validate()` expects.
- If product images break: add corresponding files under `img/` or change `img` field to an absolute URL.
- If introducing new interactive controls, follow the existing pattern: render HTML into `stage-content`, then wire listeners right after (`startStage()` / `initWorstShop()`).

## Safety notes for refactors
- Because logic and data live together in `script.js`, avoid moving logic to new modules unless also adding a small README and a simple server/build plan. Large refactors should include tests or manual verification steps.

## What I couldn't infer (ask the human)
- Are image assets under `img/` required to be committed, or can URLs remain external?
- Any preferred browser target (mobile/desktop) beyond the current styles?

---
If you want changes (tone, more examples, or extra run/debug commands), tell me which sections to expand or clarify.
