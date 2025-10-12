---
goal: Popup Mission Control UI (Status/Settings/Account) with form validation and URL/query state
version: 1.0
date_created: 2025-10-11
last_updated: 2025-10-11
owner: activity-enhancer
tags: [feature, popup, ui, forms, validation, architecture]
---

# Introduction

Implement a tabbed "Activity Enhancer" popup (Status / Settings / Account) for the MV3 extension using React + TypeScript. Provide: per‑site enable toggle, usage stats, monetization CTA, configurable settings (tone, hashtags), gated PRO controls, advanced BYOK (Bring Your Own Key) section with react-hook-form + zod validation, URL/query (ephemeral) state encoding via a lightweight abstraction inspired by `nuqs` patterns (note: `nuqs` is Next.js oriented; we will replicate minimal query param sync logic suitable for an extension popup). Persist durable user preferences (API key, tone, flags) with `chrome.storage.sync`; keep transient UI state (active tab, advanced section open) in URL and/or component state. Plan emphasizes simplicity, idempotency, and future extensibility (streaming, additional providers).

## 1. Requirements & Constraints

- **REQ-001**: Provide three tabs: Status (default), Settings, Account.
- **REQ-002**: Header with logo, name, tagline appears above tabs consistently.
- **REQ-003**: Status tab: show current domain, enable/disable toggle (per-domain), monthly enhancement count, CTA (Unlock Pro) or Pro status message.
- **REQ-004**: Settings tab: default tone dropdown (Analytical, Humorous, Inspirational), hashtag generation checkbox.
- **REQ-005**: Settings tab shows PRO-gated options (weather context, custom prompts button) visibly but disabled for free users with PRO badge.
- **REQ-006**: Advanced (BYOK) collapsible: provider select, optional endpoint, API key, Save & Test Connection buttons.
- **REQ-007**: Account tab: different views for free vs pro (feature list + pricing options OR subscription status & management/logout actions).
- **REQ-008**: Form handling uses `react-hook-form` + `zod` resolver for validation, including secrets and optional fields.
- **REQ-009**: Durable settings stored using WXT's `storage.defineItem` API with `sync:` prefix for cross-device synchronization (e.g., `sync:ae.settings`, `sync:ae.domainPrefs`).
- **REQ-010**: Per-domain enable toggle persists mapping of domain -> boolean.
- **REQ-011**: Validation: tone must be one of enum; endpoint must be valid URL if present; apiKey non-empty when BYOK provider chosen.
- **REQ-012**: Provide minimal abstraction for URL/query state (active tab, advanced open) analogous to `nuqs` pattern; degrade gracefully if URL search params unsupported.
- **REQ-013**: Implementation stays under existing architectural conventions (pure utilities in `lib/`, React components in popup tree, no global state libs).
- **REQ-014**: All UI accessible (aria labels), keyboard navigable, and responsive within typical popup width (e.g., 360–420px).
- **SEC-001**: Do not log API keys; store secrets only in browser sync storage (encrypted at rest) and never expose in query params.
- **SEC-002**: Mask API key field; provide explicit reveal only if later required (not in initial scope).
- **CON-001**: No backend; must rely on client storage and runtime detection.
- **CON-002**: Popup is isolated; cannot rely on Next.js routing; avoid server-only packages.
- **CON-003**: Minimize bundle size; avoid unnecessary polyfills.
- **GUD-001**: Use idempotent components; predictable side-effects.
- **GUD-002**: Follow existing style utilities and component patterns in `src/components/ui/*` where applicable (reuse `switch`, `select`, `button`, `accordion/collapsible`).
- **PAT-001**: Centralize storage get/set logic using WXT's `storage.defineItem` with schema validation before hydrate.
- **PAT-002**: Use zod schemas as single source of truth for settings shape.
- **PAT-003**: Distinguish transient vs persistent state explicitly.
- **PAT-004**: All storage keys must use area prefix (`sync:`, `local:`, `session:`) as per WXT requirements.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Foundation setup (schemas, storage, query state abstraction, base layout & tabs).

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add dependencies: `react-hook-form`, `@hookform/resolvers`, `zod` | ✅ | 2025-10-11 |
| TASK-002 | Create `src/lib/settings-schema.ts` with zod schemas: ToneEnum, SettingsSchema, AdvancedSchema, DomainPrefsSchema | ✅ | 2025-10-11 |
| TASK-003 | Create `src/lib/storage.ts` utility using WXT's `storage.defineItem`: typed load/save with schema parsing, keys: `sync:ae.settings`, `sync:ae.domainPrefs`, `sync:ae.account` | ✅ | 2025-10-11 |
| TASK-004 | Implement lightweight query param state util `src/lib/query-state.ts` (get/set search params, subscribe via `popstate`) | ✅ | 2025-10-11 |
| TASK-005 | Update `src/entrypoints/popup/main.tsx` to render root `<PopupApp />` with header + tabs scaffolding | ✅ | 2025-10-11 |
| TASK-006 | Create `src/entrypoints/popup/components/Tabs.tsx` simple controlled tabs (or reuse existing if present) | ✅ | 2025-10-11 |
| TASK-007 | Derive active tab from query param `tab` using query-state util; default `status` | ✅ | 2025-10-11 |
| TASK-008 | Implement domain detection messaging via `browser.tabs.query` (fallback: `location.host` if same origin) | ✅ | 2025-10-11 |
| TASK-009 | Implement domain prefs structure in storage util (map domain -> enabled boolean) | ✅ | 2025-10-11 |


### Implementation Phase 2

- GOAL-002: Status tab functional (toggle, stats, CTA / Pro state injection stub).

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Create `StatusTab.tsx` with props: domain, domainEnabled, onToggle | ✅ | 2025-10-12 |
| TASK-011 | Wire toggle to update domain prefs in storage, optimistic UI, handle errors gracefully | ✅ | 2025-10-12 |
| TASK-012 | Add enhancement count retrieval (from `chrome.storage.sync` key `ae.metrics`) with default 0 | ✅ | 2025-10-12 |
| TASK-013 | Add CTA button that sets `tab=account` when clicked if not pro | ✅ | 2025-10-12 |
| TASK-014 | Show Pro badge message if pro status (placeholder logic reading `ae.account.pro=true`) | ✅ | 2025-10-12 |

### Implementation Phase 3

- GOAL-003: Settings tab forms (general + pro-gated UI + disabled states + advanced collapsible).

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Create `SettingsTab.tsx` containing `react-hook-form` usage with zod resolver | ✅ | 2025-10-12 |
| TASK-016 | Build form fields: tone select, hashtags checkbox (persist on submit) | ✅ | 2025-10-12 |
| TASK-017 | Render pro gated controls disabled when `!pro`: weather checkbox, custom prompts button (disabled) with PRO badge component | ✅ | 2025-10-12 |
| TASK-018 | Implement collapsible advanced section using existing `collapsible` / `accordion` component for BYOK | ✅ | 2025-10-12 |
| TASK-019 | Add BYOK provider select, endpoint text input, apiKey password input with validation, Save & Test buttons | ✅ | 2025-10-12 |
| TASK-020 | Provide `Test Connection` stub: basic fetch to endpoint if provided; show toast success/fail | ✅ | 2025-10-12 |
| TASK-021 | Persist advanced settings separately to avoid saving partial invalid state (validate before write) | ✅ | 2025-10-12 |
| TASK-022 | Sync advanced section open state to query param `adv=1` (transient) | ✅ | 2025-10-12 |

### Implementation Phase 4

- GOAL-004: Account tab (free vs pro rendering + pricing action placeholders).

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-023 | Create `AccountTab.tsx` with conditional view based on `account.pro` flag | ✅ | 2025-10-12 |
| TASK-024 | Implement free view: feature list items, pricing buttons, sign-in link triggers sign-in flow stub | ✅ | 2025-10-12 |
| TASK-025 | Implement pro view: show user name, plan, next billing date, manage subscription & logout stubs | ✅ | 2025-10-12 |
| TASK-026 | Add placeholder integration points (events) for future Stripe/customer portal launch | ✅ | 2025-10-12 |

### Implementation Phase 5

- GOAL-005: Cross-cutting polish (accessibility, error handling, loading states, metrics increment helper).

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-027 | Introduce shared `LoadingState` + skeletons for settings hydration | ✅ | 2025-10-12 |
| TASK-028 | Add ARIA labels to interactive controls (toggle, selects, buttons) | ✅ | 2025-10-12 |
| TASK-029 | Implement toast notifications (reuse `sonner` component) for save/test results | ✅ | 2025-10-12 |
| TASK-030 | Add util to increment enhancement count externally (hook for content script) `incrementEnhancementCount()` | ✅ | 2025-10-12 |
| TASK-031 | Defensive try/catch around storage operations with fallback defaults | ✅ | 2025-10-12 |

### Implementation Phase 6

- GOAL-006: Validation, tests, and documentation.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-032 | Add lightweight test infra (if absent) using `vitest` + `@testing-library/react` |  |  |
| TASK-033 | Write tests: schema validation (tones, endpoint URL), storage round-trip, query-state util |  |  |
| TASK-034 | Add README snippet for popup usage & dev instructions | ✅ | 2025-10-12 |
| TASK-035 | Update `.github/copilot-instructions.md` if new pattern introduced (query state util) | ✅ | 2025-10-12 |

## 3. Alternatives

- **ALT-001**: Use `nuqs` directly. Rejected: library is specialized for Next.js route segment caching; adds unnecessary weight; not popup-optimized.
- **ALT-002**: Use global context store (Zustand). Rejected: overkill; simple form + storage sufficient.
- **ALT-003**: Persist advanced open state in storage. Rejected: ephemeral UI choice—prefer non-persistent query param.
- **ALT-004**: Combine general + advanced schemas. Rejected: separation simplifies partial save and validation boundaries.

## 4. Dependencies

- **DEP-001**: `react-hook-form` (form state management)
- **DEP-002**: `@hookform/resolvers` (zod integration)
- **DEP-003**: `zod` (runtime validation)
- **DEP-004**: `vitest`, `@testing-library/react`, `@testing-library/dom` (testing, Phase 6)
- **DEP-005**: Existing UI components under `src/components/ui/*` (reuse for consistency)

## 5. Files

- **FILE-001**: `src/lib/settings-schema.ts` – zod schemas & types.
- **FILE-002**: `src/lib/storage.ts` – typed storage helpers (getSettings, saveSettings, getDomainPrefs, setDomainPref, getAccount).
- **FILE-003**: `src/lib/query-state.ts` – minimal query param state abstraction.
- **FILE-004**: `src/entrypoints/popup/main.tsx` – root render & layout integration.
- **FILE-005**: `src/entrypoints/popup/components/Header.tsx` – logo + name + tagline.
- **FILE-006**: `src/entrypoints/popup/components/Tabs.tsx` – simple tabs control.
- **FILE-007**: `src/entrypoints/popup/components/StatusTab.tsx` – status UI.
- **FILE-008**: `src/entrypoints/popup/components/SettingsTab.tsx` – settings form & advanced section.
- **FILE-009**: `src/entrypoints/popup/components/AccountTab.tsx` – account UI.
- **FILE-010**: `src/lib/metrics.ts` – enhancement count increment/get helpers.
- **FILE-011**: `tests/settings-schema.test.ts` – schema validation tests.
- **FILE-012**: `tests/query-state.test.ts` – query param util tests.
- **FILE-013**: `tests/storage.test.ts` – storage round-trip tests (mock chrome.storage).

## 6. Testing

- **TEST-001**: Validate tone enum accepts only allowed values; rejects invalid string.
- **TEST-002**: Validate BYOK schema: missing apiKey when provider selected -> error.
- **TEST-003**: Storage round-trip: save & load settings equality (excluding secrets which remain).
- **TEST-004**: Query state util: setting tab updates URL; reading back yields correct value.
- **TEST-005**: Status toggle updates domain prefs map; persists after reload (simulation).
- **TEST-006**: Disabled PRO controls not interactable when `pro=false`.

## 7. Risks & Assumptions

- **RISK-001**: Chrome storage async timing may cause brief flicker before hydration. Mitigation: show skeleton/loading state.
- **RISK-002**: Storing secrets in `chrome.storage.sync` encrypted at rest by Chrome but still accessible to extension code—document user caution.
- **RISK-003**: Query param state may be lost on popup close (acceptable—intended ephemeral design).
- **RISK-004**: `chrome.tabs.query` may fail if popup not granted permission; fallback to `new URL(document.referrer||'')` or instruct user.
- **ASSUMPTION-001**: Pro status currently mocked; real billing integration deferred.
- **ASSUMPTION-002**: Popup width fixed; no horizontal scrolling required.
- **ASSUMPTION-003**: Existing UI component library provides accessible primitives.

## 8. Related Specifications / Further Reading

- `.github/copilot-instructions.md` (architecture ground truth)
- React Hook Form docs: [https://react-hook-form.com/](https://react-hook-form.com/)
- Zod docs: [https://zod.dev/](https://zod.dev/)
- Chrome storage API: [https://developer.chrome.com/docs/extensions/reference/storage/](https://developer.chrome.com/docs/extensions/reference/storage/)
- Inspiration (nuqs pattern): [https://github.com/47ng/nuqs](https://github.com/47ng/nuqs) (not directly used)
