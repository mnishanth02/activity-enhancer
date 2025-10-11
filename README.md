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

## ⚙️ Configuration

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

Build Production:

```bash
pnpm build
```

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

## 🗺️ Roadmap (Short Term)

1. MVP DOM injection + single model enhancement (current scope)
2. Basic error & retry UX
3. Model selector + persist choice
4. Add two more platforms beyond initial four
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
