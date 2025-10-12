# Copilot Project Instructions

Purpose: Enable AI assistants to quickly contribute to the AI Activity Enhancer (MV3 Chrome extension) without re-discovering core architecture or conventions.

## 1. Architecture Snapshot
- Tech: WXT (browser extension tooling) + React (popup UI) + Vercel AI SDK (LLM calls). TypeScript-first.
- Entry points:
  - `src/entrypoints/content.ts`: DOM integration, site detection, MutationObserver, button + inline enhancement UI logic.
  - `src/entrypoints/background.ts`: Reserved for messaging, future caching/rate limiting.
  - `src/entrypoints/popup/`: React UI with tabbed interface (Status, Settings, Account tabs).
    - `main.tsx`: Root app with lazy-loaded tabs, query param routing, domain detection.
    - `components/`: StatusTab (toggle + metrics), SettingsTab (forms + BYOK), AccountTab (free/pro views), LoadingSkeletons (shared loading states).
    - `hooks/`: useCurrentDomain (detects active tab domain for per-site toggles).
  - `src/lib/`: Shared utilities
    - `storage.ts`: WXT storage helpers with zod validation
    - `settings-schema.ts`: Single source of truth for all settings schemas (zod v3)
    - `query-state.ts`: URL query param state management utility
    - `metrics.ts`: Enhancement count tracking with monthly auto-reset
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
- **Storage**: Use WXT's `storage.defineItem` API with area prefixes (`sync:`, `local:`, `session:`). Import from `wxt/utils/storage`. All keys must have area prefix (e.g., `sync:ae.settings`).
- **Validation**: All storage schemas use zod v3 compatibility layer via `import { z } from "zod/v3"` (required for @hookform/resolvers compatibility). Use `z.string().url()` and `z.string().email()` instead of `z.url()` and `z.email()`.
- **Query State**: Transient UI state (e.g., active tab, collapsible open state) persists in URL query params via `useQueryParam` hook from `@/lib/query-state`. Pattern: `const [value, setValue] = useQueryParam("key", "defaultValue")`. Never persist UI state in storage—use query params.
- **Forms**: Use react-hook-form + zodResolver for all form validation. Register inputs with `{...register("fieldName")}` or controlled components with `setValue`. Always handle errors with toast notifications.
- **Loading States**: Use specialized skeleton components from `LoadingSkeletons.tsx` instead of generic spinners. Match skeleton structure to actual content (forms → SettingsLoadingSkeleton, features → AccountLoadingSkeleton).
- **Error Handling**: All async storage operations must have try/catch with toast error messages. Provide fallback defaults on load failures. Include descriptive error messages with retry guidance.
- **Accessibility**: All interactive elements need descriptive ARIA labels. Use semantic HTML (`<header>`, `<main>`, `<nav>`). Decorative elements get `aria-hidden="true"`. Form inputs must be associated with `<Label>` using `htmlFor`.
- Minimal state: ephemeral in content script; persist user config via sync storage with zod validation.
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

## 8. Popup UI Patterns (Established in Phase 1-5)
- **Tab Structure**: Three lazy-loaded tabs (Status, Settings, Account) with Suspense boundaries and specific skeletons.
- **Query State**: Tab selection (`?tab=status`) and collapsible state (`?adv=1`) use query params, not storage.
- **Forms**: react-hook-form with zodResolver (zod v3 import). Two-form pattern in Settings (general + advanced).
- **Storage Operations**: Always wrap in try/catch with toast notifications. Provide fallbacks on errors.
- **Loading UX**: Use skeleton components (TabLoadingSkeleton, SettingsLoadingSkeleton, AccountLoadingSkeleton) not Spinner.
- **Toast Feedback**: Success/error toasts for all user actions (save, toggle, test). Include descriptions for errors.
- **Accessibility**: All buttons/inputs have aria-labels. Forms use Label with htmlFor. Decorative icons get aria-hidden.
- **PRO Gating**: Disabled state + PRO badge for premium features. Account tab shows pricing or subscription details.

## 9. Future-Friendly Hooks
- Prepare for: streaming responses, adapter registry, caching last N enhancements, redaction pre-pass.
- Write new utilities as pure functions in `src/` (e.g., `utils/` folder if adding) for testability.

## 10. Non-Goals (Avoid Adding Prematurely)
- Full analytics, complex state management libs, heavy theming, unrelated platform support.

## 11. Pull Request Guidance (Implicit)
- Show before/after DOM behavior (GIF or description) for UI changes.
- Note any prompt contract changes explicitly.

Use this file as ground truth for architectural intent—update it if you introduce a new pattern.