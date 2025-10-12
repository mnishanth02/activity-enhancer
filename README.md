# AI Activity Enhancer (Chrome Extension)

An AI‑powered browser extension that enhances your fitness activity titles and descriptions directly on popular activity platforms (Garmin, Strava, Fitbit, Nike Run Club, and more) using Large Language Models via the Vercel AI SDK. Built with WXT + React for a modern, fast developer workflow.

---

## 🚀 What It Does (MVP Scope)

When you visit a supported activity site, the extension:

1. Detects individual activity entries in the page DOM.
2. Injects an "Enhance" button next to each activity (e.g., a run, ride, workout).
3. On click, collects the current title plus (if available) description and lightweight contextual metadata (e.g., distance, time, sport type if present in the DOM).
4. Sends a prompt to a selected LLM model (via Vercel AI SDK) requesting:
   - A punchier, engaging, contextually relevant Title (concise)
   - An improved Description (motivational and clear, respecting original intent)
5. Renders the AI result inline with options (Accept / Cancel) and a fallback to original text.

No unrelated functionality—laser‑focused on augmenting activity storytelling.

---

## ✅ Initial Feature Set (This Iteration)

- Site detection for: Garmin, Strava, Fitbit, Nike (extensible list)
- DOM observer to handle client‑side navigation / infinite scroll
- Button injection with idempotency (avoid duplicates)
- Popup UI (React) to select model & configure settings
- LLM call using Vercel AI SDK (stream or standard response – TBD, default non‑stream first)
- Inline rendering of enhanced title + description
- Graceful error state (retry, show original)

---

## 🏗️ Architecture Overview

| Layer | Responsibility |
|-------|----------------|
| `src/entrypoints/content.ts` | Observes DOM, matches supported site patterns, injects buttons, gathers activity data, triggers enhancement request, updates UI inline. |
| `src/entrypoints/background.ts` | Lifecycle, permissions, message routing (if needed), potential future caching or rate limiting. |
| `src/entrypoints/popup/` | React UI for: model selection, API key input (if not using backend proxy), feature toggles. |
| Vercel AI SDK | Handles LLM interaction (model abstraction, streaming support). |

Communication Pattern: (MVP) content script may call the AI endpoint directly (with key stored securely if possible) or relay via background script. If future backend proxy is added, only minimal activity context is sent.

State Handling: Lightweight in‑memory per tab; no persistent storage yet beyond optional saved model choice (via `chrome.storage.sync`).

---

## 🔐 Data & Privacy Principles

- Only the minimum necessary text (title, description, optional visible stats) is sent to the model.
- No raw private profile data is intentionally collected.
- User must supply their own AI API key (not bundled).
- Future: redact personal names / locations before sending.

---

## 🎯 Quick Start Guide

### First Time Setup

1. **Install the Extension**
   - Load the extension in Chrome (see Development section below)
   - Click the extension icon in your toolbar to open the popup

2. **Configure Your Settings**
   - Navigate to the **Settings** tab
   - Choose your preferred enhancement tone (inspirational, motivational, casual, etc.)
   - Enable/disable hashtag generation
   - (Optional) Configure BYOK in Advanced Settings if you have your own API key

3. **Enable for Your Sites**
   - Visit a supported activity site (Strava, Garmin, etc.)
   - Click the extension icon
   - Toggle "Enable for this site" in the **Status** tab

4. **Start Enhancing**
   - Look for the "Enhance" button next to activities
   - Click to generate AI-powered improvements
   - Review and accept or cancel the suggestions

### Managing Your Account

**Free Tier**: 50 enhancements per month (auto-resets on the 1st)

**Upgrade to PRO** for:
- Unlimited enhancements
- Weather context integration
- Custom prompt templates
- Priority support

Click the **Account** tab to view pricing and upgrade options.

---

## ⚙️ Configuration

The extension provides a comprehensive popup interface for managing settings, monitoring usage, and accessing PRO features.

### Popup Interface Overview

The popup includes three main tabs accessible via the extension icon:

#### 1. **Status Tab**
- **Per-Site Toggle**: Enable/disable enhancement for the current domain
- **Usage Metrics**: View monthly enhancement count and PRO status
- **Quick Actions**: One-click access to upgrade or manage settings

#### 2. **Settings Tab**
General Settings:
- **Default Tone**: Choose enhancement style (inspirational, motivational, casual, professional, humorous)
- **Generate Hashtags**: Automatically add relevant hashtags to enhancements
- **Include Weather Context** (PRO): Add weather information to activity descriptions
- **Custom Prompts** (PRO): Create and save your own enhancement templates

Advanced Settings (Bring Your Own Key):
- **Provider Selection**: Choose from OpenAI, Anthropic, or Google AI
- **Custom Endpoint**: Optionally specify a custom API endpoint
- **API Key**: Securely store your API key (synced across devices)
- **Test Connection**: Validate your API configuration

#### 3. **Account Tab**
Free User View:
- Feature comparison list
- Pricing plans (Monthly: $9/month, Annual: $81/year with 25% savings)
- Sign-in option for existing accounts

Pro User View:
- Subscription details and billing information
- Manage subscription (Stripe Customer Portal integration)
- Logout functionality

### Storage & Sync

All settings are stored using Chrome's `storage.sync` API and synchronized across your devices:

| Setting | Storage Key | Type | Default |
|---------|-------------|------|---------|
| General Settings | `sync:ae.settings` | Object | `{ tone: "inspirational", generateHashtags: false, includeWeather: false }` |
| Advanced Settings | `sync:ae.advanced` | Object | `{ provider: undefined, endpoint: "", apiKey: "" }` |
| Site Preferences | `sync:ae.site-prefs` | Record | `{}` (per-domain enable/disable) |
| Account Info | `sync:ae.account` | Object | `{ pro: false }` |
| Monthly Metrics | `local:ae.metrics` | Object | Auto-reset monthly |

### Query State Management

The popup uses URL query parameters for transient UI state (not persisted):
- `?tab=status|settings|account` - Active tab selection
- `?adv=1` - Advanced settings section expanded state

This pattern ensures clean URLs on refresh while maintaining navigation context during the session.

### PRO Features

Unlock unlimited enhancements and premium features:
- **Unlimited Enhancements**: No monthly limits
- **Weather Context Integration**: Automatically include weather data
- **Custom Prompt Templates**: Create personalized enhancement styles
- **Bring Your Own Key (BYOK)**: Use your own AI provider API keys
- **Priority Support**: Faster response times

Monthly limits for free tier: 50 enhancements (auto-reset on 1st of each month).

---

## ⚙️ Legacy Configuration

For advanced users or development purposes:

| Setting | Where | Notes |
|---------|-------|-------|
| AI API Key | Popup (stored via `chrome.storage.sync`) | Required for enhancement. Not transmitted elsewhere except model call. |
| Model | Popup selector | Defaults to a sensible general model (e.g. `gpt-4o-mini` / alternative). |
| Enabled Sites | Hardcoded list initially | Later: make user‑editable. |

Environment Variables (if using build‑time or proxy patterns):

```bash
VERCEL_AI_API_KEY=your_key_here
```

---

## 🧪 Enhancement Prompt Shape (Conceptual)

Input Template (example):

```text
You are an assistant that rewrites fitness activity metadata.
Original Title: "Morning Run"
Original Description: "5k easy with light drizzle."
Stats (if available): distance=5.02km, duration=00:28:11, elevation_gain=42m
Task: Provide a short improved title (<= 60 chars) and a motivational, concise description (<= 280 chars) preserving factual accuracy.
Return JSON with keys: title, description.
```
The content script parses returned JSON and updates the UI.

---

## 🛠️ Local Development

Prerequisites:

- Node.js (LTS)
- pnpm

Install & Run Dev:

```bash
pnpm install
pnpm dev
```

WXT dev mode will output an extension directory (e.g. `.output/chrome-mv3`) and often auto‑launch a Chrome instance (depending on config). If not:

1. Open Chrome → Extensions → Enable Developer Mode
2. Load Unpacked → select the generated build folder.

### Development Commands

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Type checking (no emit)
pnpm compile

# Lint and format (Biome)
pnpm check
pnpm check --write  # Auto-fix issues
```

### Popup Development

The popup UI is built with React and uses lazy loading for performance:

- **Entry Point**: `src/entrypoints/popup/main.tsx`
- **Components**: `src/entrypoints/popup/components/`
  - `StatusTab.tsx` - Domain toggle, metrics display
  - `SettingsTab.tsx` - General settings + BYOK advanced section
  - `AccountTab.tsx` - Free/Pro views with pricing
  - `LoadingSkeletons.tsx` - Shared loading states
  - `Header.tsx`, `TabsNavigation.tsx` - Layout components
- **Utilities**: `src/lib/`
  - `storage.ts` - WXT storage helpers with validation
  - `settings-schema.ts` - Zod schemas (v3 compatibility)
  - `query-state.ts` - URL param state management
  - `metrics.ts` - Enhancement count tracking

**Key Patterns**:
- Forms use `react-hook-form` with `zodResolver`
- Zod schemas imported from `"zod/v3"` for @hookform/resolvers compatibility
- Transient UI state in query params (`?tab=status`, `?adv=1`)
- Persistent data in `chrome.storage.sync` with `sync:` prefix
- Toast notifications (Sonner) for all user actions
- Specialized skeletons for loading states (not generic spinners)

Build Production:

```bash
pnpm build
```

Build output typically ~600 kB total, with code-split chunks for each tab.

---

## 🔍 DOM Integration Strategy (High Level)

1. Site Match: Simple hostname pattern (`location.host`) plus optional path checks.
2. Activity Selector: Each site has a small adapter mapping (e.g., `data-site="strava"`) for query selectors.
3. MutationObserver: Watches for new activity nodes (virtual scrolling / SPA navigation).
4. Idempotent Injection: Marks processed nodes with a data attribute.
5. Enhancement Flow: Button → gather text → call AI → render inline panel with result.

---

## 🧩 Extensibility Points (Planned)

- Adapter registry for new platforms (config driven)
- Prompt tuning modes (fun / formal / minimal)
- Multi‑language support (detect via site locale)
- Streaming partial result UI
- Local caching of last N enhancements per session
- Optional backend proxy for advanced policies & analytics

---

## 🗺️ Roadmap

### ✅ Completed (Phase 1-5)
- [x] Popup UI with tabbed interface (Status, Settings, Account)
- [x] Per-site toggle with domain detection
- [x] Settings management with form validation
- [x] PRO feature gating and pricing display
- [x] Bring Your Own Key (BYOK) advanced settings
- [x] Monthly metrics tracking with auto-reset
- [x] Comprehensive accessibility (ARIA labels, semantic HTML)
- [x] Professional loading states (skeleton components)
- [x] Robust error handling with toast notifications

### 🚧 In Progress
- [ ] Content script implementation (DOM injection + enhancement logic)
- [ ] LLM integration (Vercel AI SDK)
- [ ] Site adapters for Strava, Garmin, Fitbit, Nike Run Club

### 📋 Next Up (Phase 6+)
- [ ] Test infrastructure (vitest + @testing-library/react)
- [ ] Component and utility tests
- [ ] Backend authentication (OAuth/Stripe integration)
- [ ] Streaming response UI
- [ ] Custom prompt templates
- [ ] Weather context integration
- [ ] Additional platform support

---
5. Streaming response refinement (optimistic partial display)

---

## 🧪 Testing Approach (Planned)

- Lightweight site adapter unit tests (selectors not regress)
- Mock LLM response shaping
- DOM injection idempotency test

---

## 🤝 Contributions (Internal Phase)

Initially closed; internal iteration until core flow is stable. Later: add CONTRIBUTING.md with adapter contribution guidelines.

---

## 📄 License

TBD – add a LICENSE file before public distribution.

---

## ⚠️ Disclaimer

This extension is unofficial and not affiliated with Garmin, Strava, Fitbit, Nike, or any other platform. Respect each platform's terms of service.

---

## Summary

The AI Activity Enhancer elevates raw workout logs into engaging narratives with minimal friction—just one click beside each activity.

---

© 2025 AI Activity Enhancer Project
