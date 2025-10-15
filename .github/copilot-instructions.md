# Copilot Project Instructions

Purpose: Enable AI assistants to quickly contribute to the AI Activity Enhancer (MV3 Chrome extension) without re-discovering core architecture or conventions.

## 1. Architecture Snapshot
- **Tech Stack**: WXT (browser extension framework) + React 18 (popup UI) + Vercel AI SDK (LLM integration). TypeScript-first with strict validation.
- **Entry Points**:
  - `src/entrypoints/content.ts`: **Dual-page orchestrator** for details→edit workflow. Detects page type, delegates to `handleDetailsPage` or `handleEditPage` from `inject.ts`.
  - `src/entrypoints/background.ts`: Lifecycle management (currently minimal, reserved for future caching/rate limiting).
  - `src/entrypoints/popup/`: React UI with lazy-loaded tabs (Status, Settings, Account). Uses Suspense + specialized skeletons.
- **Key Libraries** (`src/lib/`):
  - **Adapter Pattern** (`adapters/`): Site-specific DOM logic. Each adapter implements `SiteAdapter` interface (see `types.ts`). Registry in `index.ts` with `findAdapter(location)`.
  - `inject.ts`: Core injection logic for both page types. Handles button creation, preview panels, LLM calls, navigation watching.
  - `session.ts`: Cross-page state via `storage.session` (MV3). 10-min expiry. Stores `PendingEnhancement` with 15+ extracted fields.
  - `storage.ts`: WXT storage wrapper with zod validation. All keys use area prefixes (`sync:`, `local:`, `session:`).
  - `llm.ts`: LLM invocation (currently mock, ready for real API integration). Returns `EnhancementResult { title, description, success, error? }`.
  - `ui/components.ts`: Vanilla JS DOM builders for buttons, panels, toasts (injected into content scripts, not React).

## 2. Dual-Page Workflow (Production Architecture)
**Details Page** (e.g., `/activities/123`):
1. Inject "✨ AI Enhance" button next to activity header (`handleDetailsPage`).
2. On click: Extract 15+ fields via `adapter.extractDetailsPageData()` (title, description, distance, time, elevation, sport, calories, heart rate, cadence, power, etc.).
3. Save to session storage (`savePendingEnhancement`) with activityId from URL.
4. Trigger async LLM call (`triggerEnhancementAPI`).
5. Programmatically click edit button (`adapter.locateEditButton()`) → navigate to edit page.

**Edit Page** (e.g., `/activities/123/edit`):
1. Load pending enhancement from session (`getPendingEnhancement`).
2. Poll for enhanced data (max 30s timeout) or show "Enhancing..." state.
3. Display preview panel with Insert/Discard/Reset options (`createEnhancementPreviewPanel`).
4. Insert: Populate form fields via `adapter.setTitle()` / `adapter.setDescription()`.
5. Discard: Clear session, hide panel.
6. Reset: Restore original values from session.

**Why Dual-Page**: Details page has full context (stats, graphs, maps) that edit page lacks. This enables richer LLM prompts.

## 3. Adapter Pattern (Critical for Site Support)
**All site-specific logic lives in adapters** (`src/lib/adapters/`). Never hardcode selectors in `content.ts` or `inject.ts`.

**Adding a New Site** (e.g., Garmin, Wahoo):
1. Create `src/lib/adapters/yoursite.ts` implementing `SiteAdapter` interface:
   - `match(location)`: Regex/logic to detect site (e.g., `location.host === "connect.garmin.com"`).
   - `detectPageType(location)`: Return `"details" | "edit" | "unknown"` based on URL pattern.
   - `locateTitleRoot(doc)`: Find anchor element for button injection.
   - `getTitle/setTitle`, `getDescription/setDescription`: Read/write form fields.
   - `extractDetailsPageData(doc)`: Extract 15+ fields (title, description, distance, time, elevation, sport, calories, HR, cadence, power, pace, temperature, location, date, privacy). Return `ExtendedActivityData`.
   - `locateEditButton(doc)`: Find edit button on details page for programmatic click.
   - `locateTitleField(doc)`: Find title input on edit page (for focus management).
   - **Optional**: `onDomReady(callback)`: For SPA sites with delayed rendering (e.g., Strava uses React, DOM not ready on `document_end`). Callback is invoked when DOM is stable.
2. Register in `src/lib/adapters/index.ts`: Add to `siteAdapters` array.
3. Update `wxt.config.ts` manifest `matches` array with site's URL pattern.

**Example** (see `strava.ts`):
```typescript
export const stravaAdapter: SiteAdapter = {
  id: "strava",
  name: "Strava",
  match: (loc) => loc.host === "www.strava.com" && /^\/activities\/\d+(\/edit)?$/.test(loc.pathname),
  detectPageType: (loc) => loc.pathname.includes("/edit") ? "edit" : "details",
  onDomReady: (cb) => { /* Wait for React render */ },
  // ... 10+ more methods
};
```

**Idempotency**: Always check for existing elements before injecting (e.g., `document.querySelector('[data-ae-enhance-btn]')`). Use `DOM_ATTRIBUTES` constants from `constants.ts`.

## 4. Storage & State Management
- **WXT Storage API**: Use `storage.defineItem<T>("area:key", { fallback })` pattern. Areas: `sync:` (cross-device), `local:` (device-only), `session:` (tab-scoped, MV3).
- **Zod v3 Compatibility**: All schemas use `import { z } from "zod/v3"` (required for @hookform/resolvers). Use `z.string().url()` NOT `z.url()`, `z.string().email()` NOT `z.email()`.
- **Session Storage** (`session.ts`): Cross-page state for dual-page workflow. `PendingEnhancement` expires after 10 min. Contains: activityId, extractedData (15+ fields), original title/description, enhanced title/description (after LLM).
- **Query State** (`query-state.ts`): Transient UI state (tab selection `?tab=status`, collapsible state `?adv=1`) uses URL params, NEVER storage. Hook: `const [value, setValue] = useQueryParam("key", "default")`.
- **Never store**: UI state, temporary flags, loading states. These go in query params or React state.

## 5. Popup UI Patterns (React)
- **Tabs**: Lazy-loaded with `React.lazy()`. Wrap in `<Suspense fallback={<TabLoadingSkeleton />}>`. Three tabs: Status (per-site toggle + metrics), Settings (forms for tone/hashtags/BYOK), Account (free/PRO).
- **Forms**: react-hook-form + zodResolver. Two-form pattern in Settings (general + advanced). Register inputs: `{...register("fieldName")}`. Controlled components: `setValue("field", value)`. Always toast on success/error.
- **Loading States**: Use specialized skeletons (`SettingsLoadingSkeleton`, `AccountLoadingSkeleton`) NOT `<Spinner>`. Match skeleton structure to actual content.
- **Error Handling**: Wrap all async storage ops in try/catch with toast. Provide fallback defaults on failures. Descriptive errors with retry guidance.
- **Accessibility**: All buttons/inputs need `aria-label`. Forms use `<Label htmlFor="...">`. Decorative icons: `aria-hidden="true"`.
- **PRO Gating**: Disabled state + PRO badge for premium features (weather context, custom prompts). Check `account.pro` flag.

## 6. LLM Integration & Prompts
- **Current State**: Mock implementation in `llm.ts`. Returns `EnhancementResult { title, description, success, error? }` after 1s delay.
- **Future**: Real API calls via Vercel AI SDK. User provides API key (BYOK) or uses default provider. Settings: `provider` (openai/anthropic/gemini/custom), `endpoint`, `apiKey`.
- **Prompt Contract** (see `prompt.ts`):
  - Inputs: Extracted data (15+ fields), user settings (tone, hashtags).
  - Outputs: JSON `{ title: string, description: string }`. Title <= 60 chars, Description <= 280 chars.
  - Sanitization: Strip excessive whitespace, trim fields. Future: redact personal names/locations.
- **Prompt Builder**: `buildEnhancedPrompt(data, settings)` constructs final prompt. Omit missing fields (no `null` placeholders). Parser: `parseEnhancedActivity(llmResponse)` validates output.

## 7. Build & Dev Workflow
- **Install**: `pnpm install` (pnpm required, not npm/yarn)
- **Dev (watch)**: `pnpm dev` → outputs to `.output/chrome-mv3/`. Hot reload enabled.
- **Load in Chrome**: Extensions → Developer Mode → Load Unpacked → select `.output/chrome-mv3/`
- **Production build**: `pnpm build` → minified, optimized for distribution
- **Firefox**: `pnpm dev:firefox` / `pnpm build:firefox`
- **Code quality**: `pnpm check` → Biome linter/formatter (auto-fix enabled)
- **NEVER edit**: `.output/` artifacts (auto-generated). All changes go in `src/`.
- **Debugging**: Use Chrome DevTools on extension popup (right-click → Inspect). Content script logs appear in page console.

## 8. Error & Edge Handling
- **Network/Model Errors**: Show inline error panel with Retry button. Never silently fail. Example: `createErrorPanel(message, onRetry, onCancel)` in `ui/components.ts`.
- **Missing Data**: Proceed anyway. Prompt builder omits absent fields (no `null` placeholders). Example: If HR data missing, prompt won't mention heart rate.
- **Debouncing**: 500ms debounce on enhance button (`ENHANCEMENT_DEBOUNCE_MS`). Disable button while request in flight.
- **JSON Parse Failures**: Show raw LLM response + Retry. Handle drift (e.g., extra markdown, comments).
- **Session Expiry**: 10-min timeout on `PendingEnhancement`. If expired on edit page, show "Session expired, please try again" with link back to details page.
- **Extension Context Invalidation**: Catch errors with `"Extension context invalidated"` message. Alert user: "Extension was updated. Please reload this page."
- **Idempotency**: Always check `data-ae-*` attributes before injecting. Example: `if (document.querySelector('[data-ae-enhance-btn]')) return;`

## 9. Constants & Magic Numbers
All constants live in `src/lib/constants.ts`. Never hardcode:
- DOM attributes: `DOM_ATTRIBUTES.ENHANCE_BUTTON`, `DOM_ATTRIBUTES.PREVIEW_PANEL`, etc.
- CSS classes: `CSS_CLASSES.ENHANCE_BUTTON`, `CSS_CLASSES.LOADING`, etc.
- Content limits: `CONTENT_LIMITS.TITLE_MAX` (60), `CONTENT_LIMITS.DESCRIPTION_MAX` (280)
- Timeouts: `ENHANCEMENT_DEBOUNCE_MS` (500), `MAX_WAIT_FOR_ENHANCED_DATA_MS` (30000)
- Domains: `SUPPORTED_DOMAINS.STRAVA`, `SUPPORTED_DOMAINS.GARMIN`

## 10. Navigation & SPA Handling
- **SPA Detection**: Sites like Strava use client-side routing. `setupNavigationWatcher()` in `inject.ts` polls every 500ms for URL changes (`NAVIGATION_CHECK_INTERVAL`).
- **Adapter Hook**: `onDomReady(callback)` for sites with delayed rendering (React/Vue). Example: Strava waits for heading element to appear before injecting.
- **Re-initialization**: On navigation, `initialize()` re-runs: finds adapter, detects page type, injects/previews accordingly. Existing elements are skipped via idempotency checks.

## 11. Testing & Validation
- **Manual Testing**: Load extension → visit Strava/Garmin → click AI Enhance → verify preview → insert → check form fields updated.
- **Selector Validation**: Always test on live site. DOM structures change without notice. Document selectors in adapter files with XPath/CSS comments.
- **Cross-Browser**: Test on Chrome (primary) + Firefox (`pnpm dev:firefox`). Edge/Opera use Chrome build.
- **Mock Mode**: LLM is mocked by default (`llm.ts` returns fake data after 1s). Toggle `import.meta.env.DEV` checks for dev logs.

## 12. Future-Friendly Hooks
- Prepare for: streaming responses, adapter registry, caching last N enhancements, redaction pre-pass.
- Write new utilities as pure functions in `src/` (e.g., `utils/` folder if adding) for testability.

## 13. Non-Goals (Avoid Adding Prematurely)
- Full analytics, complex state management libs, heavy theming, unrelated platform support.

## 14. Pull Request Guidance (Implicit)
- Show before/after DOM behavior (GIF or description) for UI changes.
- Note any prompt contract changes explicitly.

Use this file as ground truth for architectural intent—update it if you introduce a new pattern.