# Copilot Project Instructions

Purpose: Enable AI assistants to quickly contribute to the AI Activity Enhancer (MV3 Chrome extension) without re-discovering core architecture or conventions.

## 1. Architecture Snapshot
- Tech: WXT (browser extension tooling) + React (popup UI) + Vercel AI SDK (LLM calls). TypeScript-first.
- Entry points:
  - `src/entrypoints/content.ts`: DOM integration, site detection, MutationObserver, button + inline enhancement UI logic.
  - `src/entrypoints/background.ts`: Reserved for messaging, future caching/rate limiting.
  - `src/entrypoints/popup/`: React UI (model selector, API key, toggles).
- No backend yet; model calls likely originate from content (may later centralize via background or proxy).

## 2. Core Flow (Happy Path)
1. Detect supported site by `location.host`.
2. Observe DOM for activity items (infinite scroll / SPA navigation).
3. Inject an idempotent Enhance button (mark node with a data-attribute to avoid duplicates).
4. On click, gather: title, description (if present), lightweight stats (distance/time/type) from visible text.
5. Construct prompt → call model via Vercel AI SDK.
6. Expect JSON `{ title, description }`; update inline panel with Accept / Cancel.
7. Accept replaces original text nodes; Cancel restores.

## 3. Conventions & Patterns
- Keep selectors + per‑site logic isolated (prepare for future adapter registry). Prefer small pure functions.
- Idempotency: Always tag processed DOM nodes (e.g. `data-ai-enhanced="1"`). Before injecting, check tag.
- Avoid heavy re-query loops—MutationObserver should batch or filter new nodes only.
- Prompt contract: Title <= 60 chars, Description <= 280 chars, faithful & motivational.
- Minimal state: ephemeral in content script; persist only user config (API key, model) via `chrome.storage.sync`.
- Prefer graceful fallback: if AI fails, show original unchanged text and a retry affordance.

## 4. Error & Edge Handling
- Network/model error → inline message + Retry button; never silently swallow.
- Missing stats: still proceed—prompt should omit absent fields (do not send placeholders like `null`).
- Multiple rapid clicks: debounce or disable button while request in flight.
- JSON parse failure: show raw text for inspection + retry (LLM drift resilience).

## 5. LLM Integration Notes
- Centralize model invocation in a small utility (add if not present) to ease future streaming or proxy shift.
- Sanitize outgoing text (strip excessive whitespace, avoid leaking personal names once redaction lands).
- Keep prompt as a template string with clearly delineated sections.

## 6. Build & Dev Workflow
- Install: `pnpm install`
- Dev (watch): `pnpm dev` → outputs `.output/chrome-mv3/`
- Load in Chrome: Extensions → Developer Mode → Load Unpacked → select output folder.
- Production build: `pnpm build`
- Keep changes incremental; don't over-refactor generated `.output` artifacts (never edit build output).

## 7. Adding a New Site (Pattern)
1. Define a selector map (container + title + description + optional stats).
2. Extend site detection (host/pattern list).
3. Inject button using existing utility; ensure idempotent attribute.
4. Extract fields defensively (optional chaining, trim text).
5. Reuse shared enhance function.

## 8. Future-Friendly Hooks
- Prepare for: streaming responses, adapter registry, caching last N enhancements, redaction pre-pass.
- Write new utilities as pure functions in `src/` (e.g., `utils/` folder if adding) for testability.

## 9. Non-Goals (Avoid Adding Prematurely)
- Full analytics, complex state management libs, heavy theming, unrelated platform support.

## 10. Pull Request Guidance (Implicit)
- Show before/after DOM behavior (GIF or description) for UI changes.
- Note any prompt contract changes explicitly.

Use this file as ground truth for architectural intent—update it if you introduce a new pattern (keep under ~80 lines).