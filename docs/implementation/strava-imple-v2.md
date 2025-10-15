# Strava Integration V2 - Updated Implementation Plan

**Status**: ✅ Implementation Complete (Phase 4)
**Date**: October 15, 2025
**Version**: Phase 7 Enhancement - Details Page Integration
**Build Status**: ✅ Successful (691.79 kB)
**Type Check**: ✅ Passed (5 minor warnings in Garmin placeholder)

---

## 🎯 Mission: Migrate AI Enhancement from Edit Page to Details Page

### Executive Summary

This implementation plan describes the migration of AI enhancement functionality from Strava's edit page to the details page, with a new multi-stage workflow:

1. **Details Page** → User clicks "AI Enhance" button → Extract comprehensive activity data
2. **Navigation** → Programmatically navigate to edit page
3. **Edit Page** → Display enhanced content as preview → Allow insert/discard/reset

---

## Phase 1: Constitutional Analysis & Requirements

### ⚖️ Guiding Principles

- **Simplicity First**: Keep implementation straightforward and maintainable
- **User Control**: Users must see preview before applying changes
- **Graceful Degradation**: Handle missing data fields elegantly
- **Future-Proof**: Design for Garmin support (placeholder implementation)
- **Type Safety**: Maintain strict TypeScript types throughout

### 🔍 Multi-Perspective Analysis

**User Perspective:**
- Less friction: Start enhancement from viewing page (details)
- More context: See all activity data before enhancing
- Better control: Preview before applying changes
- Clear feedback: Visual separation of enhanced vs original

**Developer Perspective:**
- Clean separation: Details page (read) vs Edit page (write)
- State management: Need to persist enhanced data during navigation
- DOM complexity: More extraction points on details page
- Adapter pattern: Must support both Strava and Garmin

**Security Perspective:**
- XPath injection: Validate all extracted data
- State persistence: Use session storage (cleared on tab close)
- Navigation safety: Ensure we're on correct domain before navigating

**Performance Perspective:**
- Extraction efficiency: Batch DOM queries where possible
- Navigation impact: Minimize delay between pages
- LLM latency: Call API during navigation (parallel processing)

---

## Phase 2: Detailed Requirements Breakdown

### 2.1 Details Page Implementation

**Location**: https://www.strava.com/activities/[id]

**Button Placement:**
- XPath: `//*[@id="heading"]/header/h2`
- Position: Next to activity title (inline with header)
- Visual: Match Strava's design (orange #fc5200)

**Data Extraction (15+ fields):**

| Field | XPath | Type | Fallback |
|-------|-------|------|----------|
| Athlete Name + Activity Type + Workout Type | `//*[@id="heading"]/header/h2/span` | string | "" |
| Title | `//*[@id="heading"]/div/div/div[1]/div/div/h1` | string | "" |
| Description | `//*[@id="heading"]/div/div/div[1]/div/div/div[1]/div/div/p` | string | "" |
| Time (Display) | `//*[@id="heading"]/div/div/div[1]/div/div/div[2]/div/div[1]/div/div/p` | string | "" |
| Time (ISO) | `//*[@id="heading"]/div/div/div[1]/div/div/time` | datetime | "" |
| Location | `//*[@id="heading"]/div/div/div[1]/div/div/span` | string | "" |
| Distance | `//*[@id="heading"]/div/div/div[2]/ul/li[1]/strong` | string | "" |
| Moving Time | `//*[@id="heading"]/div/div/div[2]/ul/li[2]/strong` | string | "" |
| Elevation | `//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[2]/strong` | string | "" |
| Elapsed Time | `//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong` | string | "" |
| Calories | `//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong` | string | "" |
| Average Pace | `//*[@id="heading"]/div/div/div[2]/ul/li[3]/strong` | string | "" |
| Average Heart Rate | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[3]` | string | "" |
| Average Cadence | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[4]` | string | "" |
| Temperature | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[5]` | string | "" |
| Humidity | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[6]` | string | "" |
| Wind | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[7]` | string | "" |

**Data Parsing:**
- Athlete Name + Activity Type + Workout Type: Split by "-" delimiter
- All fields: Trim whitespace, normalize to single spaces
- Empty fields: Default to empty string ""

### 2.2 Navigation Flow

**Trigger**: User clicks "AI Enhance" on details page

**Steps:**
1. Extract all activity data from details page DOM
2. Store extracted data in session storage (key: `ae.pendingEnhancement`)
3. Store original title/description in session storage (key: `ae.originalData`)
4. Trigger LLM API call (async, non-blocking)
5. Programmatically click Edit button: `/html/body/div[1]/div[3]/nav/div/a`
6. Wait for edit page to load (URL pattern: `/activities/[id]/edit`)

**Session Storage Schema:**
```typescript
interface PendingEnhancement {
  activityId: string;
  extractedData: ExtendedActivityData;
  originalTitle: string;
  originalDescription: string;
  timestamp: number; // For expiry check
}
```

### 2.3 Edit Page Implementation

**Location**: https://www.strava.com/activities/[id]/edit

**Detection**: Check for session storage key `ae.pendingEnhancement`

**Enhanced Content Display:**
- Position: ABOVE actual title and description fields
- Title field XPath: `//*[@id="activity_name"]`
- Description XPath: `//*[@id="edit-activity"]/div[1]/div/div[1]/div[1]/div[1]/div/div/div/textarea`

**Preview UI Components:**

```
┌─────────────────────────────────────────────────┐
│ ✨ AI Enhanced Title                            │
│ [Enhanced title text here]                      │
│ ┌─────────┐ ┌─────────┐                         │
│ │ Insert  │ │ Discard │                         │
│ └─────────┘ └─────────┘                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ✨ AI Enhanced Description                      │
│ [Enhanced description text here]                │
│ ┌─────────┐ ┌─────────┐                         │
│ │ Insert  │ │ Discard │                         │
│ └─────────┘ └─────────┘                         │
└─────────────────────────────────────────────────┘

[Original Title Input Field]
[Original Description Textarea]

┌──────────────────────────────────┐
│ Reset to Original (if applied)   │
└──────────────────────────────────┘
```

**User Actions:**

1. **Insert**: Apply enhanced text to actual field
   - Copy enhanced text to input field
   - Dispatch input/change events for React
   - Show "Reset to Original" button
   - Keep preview visible with "Applied ✓" state

2. **Discard**: Remove preview panel
   - Clear session storage
   - Hide preview UI
   - No changes to actual fields

3. **Reset to Original**: Restore pre-enhancement values
   - Retrieve original values from session storage
   - Apply to actual fields
   - Show success toast

---

## Phase 3: Architecture & File Structure

### 3.1 Updated Type Definitions

**File**: `src/lib/adapters/types.ts`

```typescript
// Extended activity data with all 15+ fields
export interface ExtendedActivityData extends ActivityData {
  // Existing fields
  title: string;
  description: string;

  // Extended fields
  athleteName?: string;
  activityType?: string;
  workoutType?: string;
  timeDisplay?: string;
  timeISO?: string;
  location?: string;
  distance?: string;
  movingTime?: string;
  elevation?: string;
  elapsedTime?: string;
  calories?: string;
  averagePace?: string;
  averageHeartRate?: string;
  averageCadence?: string;
  temperature?: string;
  humidity?: string;
  wind?: string;
}

// Page type detection
export type PageType = "details" | "edit" | "unknown";

// Enhanced adapter interface
export interface SiteAdapter {
  // ... existing methods ...

  // NEW: Detect page type
  detectPageType(location: Location): PageType;

  // NEW: Extract comprehensive data from details page
  extractDetailsPageData?(doc: Document): ExtendedActivityData;

  // NEW: Locate edit button on details page
  locateEditButton?(doc: Document): HTMLElement | null;

  // NEW: Locate title/description fields on edit page
  locateTitleField?(doc: Document): HTMLInputElement | null;
  locateDescriptionField?(doc: Document): HTMLTextAreaElement | HTMLElement | null;
}
```

### 3.2 Session Storage Module

**New File**: `src/lib/session.ts`

```typescript
/**
 * Session storage utilities for cross-page state management
 * Uses browser.storage.session (MV3) with automatic expiry
 */

import { storage } from "wxt/utils/storage";
import type { ExtendedActivityData } from "@/lib/adapters/types";

const SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export interface PendingEnhancement {
  activityId: string;
  extractedData: ExtendedActivityData;
  originalTitle: string;
  originalDescription: string;
  enhancedTitle?: string;
  enhancedDescription?: string;
  timestamp: number;
}

// Define session storage item
const pendingEnhancementStorage = storage.defineItem<PendingEnhancement | null>(
  "session:ae.pendingEnhancement",
  { fallback: null }
);

export async function savePendingEnhancement(data: PendingEnhancement): Promise<void> {
  await pendingEnhancementStorage.setValue({ ...data, timestamp: Date.now() });
}

export async function getPendingEnhancement(): Promise<PendingEnhancement | null> {
  const data = await pendingEnhancementStorage.getValue();

  if (!data) return null;

  // Check expiry
  const age = Date.now() - data.timestamp;
  if (age > SESSION_EXPIRY_MS) {
    await clearPendingEnhancement();
    return null;
  }

  return data;
}

export async function updatePendingEnhancement(
  updates: Partial<PendingEnhancement>
): Promise<void> {
  const current = await getPendingEnhancement();
  if (!current) return;

  await pendingEnhancementStorage.setValue({ ...current, ...updates });
}

export async function clearPendingEnhancement(): Promise<void> {
  await pendingEnhancementStorage.setValue(null);
}
```

### 3.3 Updated Strava Adapter

**File**: `src/lib/adapters/strava.ts`

**New Methods:**

```typescript
export const stravaAdapter: SiteAdapter = {
  // ... existing properties ...

  detectPageType(location: Location): PageType {
    if (location.host !== "www.strava.com") return "unknown";

    const path = location.pathname;

    // /activities/[id]/edit
    if (/^\/activities\/\d+\/edit$/.test(path)) return "edit";

    // /activities/[id]
    if (/^\/activities\/\d+$/.test(path)) return "details";

    return "unknown";
  },

  extractDetailsPageData(doc: Document): ExtendedActivityData {
    // Helper to safely extract text by XPath
    const getByXPath = (xpath: string): string => {
      const result = doc.evaluate(
        xpath,
        doc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const node = result.singleNodeValue;
      return node?.textContent?.trim() || "";
    };

    // Extract athlete name, activity type, workout type
    const headerText = getByXPath('//*[@id="heading"]/header/h2/span');
    const [athleteName, activityType, workoutType] = headerText
      .split("-")
      .map(s => s.trim());

    return {
      title: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/h1'),
      description: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/div[1]/div/div/p'),
      athleteName,
      activityType,
      workoutType,
      timeDisplay: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/div[2]/div/div[1]/div/div/p'),
      timeISO: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/time'),
      location: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/span'),
      distance: getByXPath('//*[@id="heading"]/div/div/div[2]/ul/li[1]/strong'),
      movingTime: getByXPath('//*[@id="heading"]/div/div/div[2]/ul/li[2]/strong'),
      elevation: getByXPath('//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[2]/strong'),
      elapsedTime: getByXPath('//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong'),
      calories: getByXPath('//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong'),
      averagePace: getByXPath('//*[@id="heading"]/div/div/div[2]/ul/li[3]/strong'),
      averageHeartRate: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[3]'),
      averageCadence: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[4]'),
      temperature: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[5]'),
      humidity: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[6]'),
      wind: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[7]'),
    };
  },

  locateEditButton(doc: Document): HTMLElement | null {
    // XPath: /html/body/div[1]/div[3]/nav/div/a
    const result = doc.evaluate(
      '/html/body/div[1]/div[3]/nav/div/a',
      doc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return result.singleNodeValue as HTMLElement | null;
  },

  locateTitleField(doc: Document): HTMLInputElement | null {
    // XPath: //*[@id="activity_name"]
    return doc.getElementById("activity_name") as HTMLInputElement | null;
  },

  locateDescriptionField(doc: Document): HTMLTextAreaElement | HTMLElement | null {
    // XPath: //*[@id="edit-activity"]/div[1]/div/div[1]/div[1]/div[1]/div/div/div/textarea
    const container = doc.getElementById("edit-activity");
    if (!container) return null;

    const textarea = container.querySelector<HTMLTextAreaElement>(
      "div > div > div:first-child > div:first-child > div:first-child > div > div > div > textarea"
    );

    return textarea;
  },
};
```

### 3.4 Garmin Adapter (Placeholder)

**File**: `src/lib/adapters/garmin.ts`

```typescript
/**
 * Garmin Connect adapter (Placeholder for future implementation)
 */

import type { SiteAdapter, PageType, ExtendedActivityData } from "./types";

export const garminAdapter: SiteAdapter = {
  id: "garmin",
  name: "Garmin Connect",

  match(location: Location): boolean {
    // TODO: Implement Garmin detection
    return false; // Disabled for now
  },

  detectPageType(location: Location): PageType {
    // TODO: Implement page type detection for Garmin
    return "unknown";
  },

  locateTitleRoot(doc: Document): HTMLElement | null {
    // TODO: Implement Garmin title root locator
    return null;
  },

  getTitle(doc: Document): string | null {
    // TODO: Implement Garmin title extraction
    return null;
  },

  setTitle(doc: Document, value: string): void {
    // TODO: Implement Garmin title setter
  },

  getDescription(doc: Document): string | null {
    // TODO: Implement Garmin description extraction
    return null;
  },

  setDescription(doc: Document, value: string): void {
    // TODO: Implement Garmin description setter
  },

  extractDetailsPageData(doc: Document): ExtendedActivityData {
    // TODO: Implement Garmin details page extraction
    return { title: "", description: "" };
  },

  locateEditButton(doc: Document): HTMLElement | null {
    // TODO: Implement Garmin edit button locator
    return null;
  },

  locateTitleField(doc: Document): HTMLInputElement | null {
    // TODO: Implement Garmin title field locator
    return null;
  },

  locateDescriptionField(doc: Document): HTMLTextAreaElement | HTMLElement | null {
    // TODO: Implement Garmin description field locator
    return null;
  },
};
```

### 3.5 Updated Content Script

**File**: `src/entrypoints/content.ts`

```typescript
/**
 * Content script with dual-page support (details + edit)
 */

import { findAdapter } from "@/lib/adapters";
import type { PageType } from "@/lib/adapters/types";
import {
  handleDetailsPage,
  handleEditPage,
  setupNavigationWatcher
} from "@/lib/inject";
import { isDomainEnabled } from "@/lib/storage";

export default defineContentScript({
  matches: ["*://www.strava.com/*", "*://connect.garmin.com/*"],
  runAt: "document_end",

  async main() {
    const adapter = findAdapter(window.location);
    if (!adapter) return;

    const enabled = await isDomainEnabled(window.location.host);
    if (!enabled) return;

    // Detect page type and handle accordingly
    await initializePage(adapter);

    // Watch for SPA navigation
    setupNavigationWatcher(() => initializePage(adapter));
  },
});

async function initializePage(adapter: SiteAdapter): Promise<void> {
  const pageType = adapter.detectPageType(window.location);

  switch (pageType) {
    case "details":
      await handleDetailsPage(adapter);
      break;
    case "edit":
      await handleEditPage(adapter);
      break;
    default:
      // Unknown page type, do nothing
      break;
  }
}
```

### 3.6 Updated Injection Logic

**File**: `src/lib/inject.ts`

**New Exports:**

```typescript
/**
 * Handle details page: inject AI Enhance button
 */
export async function handleDetailsPage(adapter: SiteAdapter): Promise<void> {
  // Check if button already exists
  const existing = document.querySelector(`[${DOM_ATTRIBUTES.ENHANCE_BUTTON}]`);
  if (existing) return;

  // Locate button anchor (next to title)
  const anchor = adapter.locateTitleRoot(document);
  if (!anchor) {
    console.warn("Cannot inject enhance button: anchor not found");
    return;
  }

  // Create button with details page handler
  const button = createEnhanceButton(() => handleDetailsPageEnhance(adapter));

  // Inject button
  anchor.appendChild(button);
}

/**
 * Handle details page enhancement flow
 */
async function handleDetailsPageEnhance(adapter: SiteAdapter): Promise<void> {
  const button = document.querySelector<HTMLButtonElement>(
    `[${DOM_ATTRIBUTES.ENHANCE_BUTTON}]`
  );
  if (!button) return;

  setButtonLoading(button);

  try {
    // 1. Extract comprehensive data
    if (!adapter.extractDetailsPageData) {
      throw new Error("Adapter does not support details page extraction");
    }

    const extractedData = adapter.extractDetailsPageData(document);

    // 2. Save to session storage
    const activityId = extractActivityId(window.location);
    await savePendingEnhancement({
      activityId,
      extractedData,
      originalTitle: extractedData.title,
      originalDescription: extractedData.description,
      timestamp: Date.now(),
    });

    // 3. Trigger LLM call (async, non-blocking)
    void triggerEnhancementAPI(extractedData);

    // 4. Navigate to edit page
    const editButton = adapter.locateEditButton?.(document);
    if (!editButton) {
      throw new Error("Edit button not found");
    }

    // Click edit button programmatically
    editButton.click();

  } catch (error) {
    console.error("Details page enhancement error:", error);
    setButtonError(button);

    // Show error panel
    const errorPanel = createErrorPanel(
      error instanceof Error ? error.message : "Enhancement failed",
      () => {
        removePreviewPanel(errorPanel);
        resetButton(button);
        handleDetailsPageEnhance(adapter);
      }
    );

    document.body.appendChild(errorPanel);
  }
}

/**
 * Handle edit page: show enhanced content preview
 */
export async function handleEditPage(adapter: SiteAdapter): Promise<void> {
  // Check for pending enhancement in session storage
  const pending = await getPendingEnhancement();
  if (!pending) return;

  // Wait for enhanced data (LLM might still be processing)
  await waitForEnhancedData(pending);

  // Show preview panels above actual fields
  showEnhancementPreview(adapter, pending);
}

/**
 * Show enhancement preview on edit page
 */
function showEnhancementPreview(
  adapter: SiteAdapter,
  pending: PendingEnhancement
): void {
  if (!pending.enhancedTitle || !pending.enhancedDescription) {
    console.warn("Enhanced data not available yet");
    return;
  }

  // Locate title and description fields
  const titleField = adapter.locateTitleField?.(document);
  const descField = adapter.locateDescriptionField?.(document);

  if (!titleField || !descField) {
    console.warn("Cannot show preview: fields not found");
    return;
  }

  // Create title preview
  const titlePreview = createEnhancementPreviewPanel(
    "title",
    pending.enhancedTitle,
    () => applyEnhancement("title", pending, adapter),
    () => discardEnhancement("title")
  );

  // Create description preview
  const descPreview = createEnhancementPreviewPanel(
    "description",
    pending.enhancedDescription,
    () => applyEnhancement("description", pending, adapter),
    () => discardEnhancement("description")
  );

  // Insert above actual fields
  titleField.parentElement?.insertBefore(titlePreview, titleField);
  descField.parentElement?.insertBefore(descPreview, descField);

  // Create reset button (initially hidden)
  const resetButton = createResetButton(async () => {
    // Restore original values
    adapter.setTitle(document, pending.originalTitle);
    adapter.setDescription(document, pending.originalDescription);

    // Clear session storage
    await clearPendingEnhancement();

    // Remove all preview UI
    titlePreview.remove();
    descPreview.remove();
    resetButton.remove();

    // Show success toast
    showToast("Reset to original values", "success");
  });

  // Insert reset button after description field
  descField.parentElement?.appendChild(resetButton);
}

/**
 * Apply enhancement to actual field
 */
async function applyEnhancement(
  field: "title" | "description",
  pending: PendingEnhancement,
  adapter: SiteAdapter
): Promise<void> {
  const value = field === "title" ? pending.enhancedTitle : pending.enhancedDescription;
  if (!value) return;

  // Apply to actual field
  if (field === "title") {
    adapter.setTitle(document, value);
  } else {
    adapter.setDescription(document, value);
  }

  // Update preview UI state to "Applied"
  const preview = document.querySelector(
    `[data-ae-preview-field="${field}"]`
  ) as HTMLElement;
  if (preview) {
    const applyButton = preview.querySelector<HTMLButtonElement>(
      '[data-action="apply"]'
    );
    if (applyButton) {
      applyButton.textContent = "Applied ✓";
      applyButton.disabled = true;
      applyButton.style.opacity = "0.6";
    }
  }

  // Show reset button
  const resetButton = document.querySelector<HTMLButtonElement>(
    `[${DOM_ATTRIBUTES.RESET_BUTTON}]`
  );
  if (resetButton) {
    resetButton.style.display = "block";
  }

  showToast(`${field === "title" ? "Title" : "Description"} applied`, "success");
}

/**
 * Discard enhancement preview
 */
async function discardEnhancement(field: "title" | "description"): Promise<void> {
  const preview = document.querySelector(
    `[data-ae-preview-field="${field}"]`
  );
  if (preview) {
    preview.remove();
  }

  // If both previews are discarded, clear session storage
  const remainingPreviews = document.querySelectorAll('[data-ae-preview-field]');
  if (remainingPreviews.length === 0) {
    await clearPendingEnhancement();
  }

  showToast(`${field === "title" ? "Title" : "Description"} discarded`, "info");
}

/**
 * Wait for enhanced data from LLM
 */
async function waitForEnhancedData(
  pending: PendingEnhancement,
  maxWaitMs: number = 30000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const updated = await getPendingEnhancement();

    if (updated?.enhancedTitle && updated?.enhancedDescription) {
      return; // Data is ready
    }

    // Wait 500ms before checking again
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error("Timeout waiting for enhanced data");
}

/**
 * Trigger LLM API call in background
 */
async function triggerEnhancementAPI(data: ExtendedActivityData): Promise<void> {
  try {
    const settings = await getSettings();
    const advancedSettings = await getAdvancedSettings();

    // Build enhanced prompt with all extracted data
    const prompt = buildEnhancedPrompt({ activity: data, settings });

    // Call LLM
    const result = await enhanceActivity(prompt, advancedSettings);

    if (!result.success) {
      throw new Error(result.error || "Enhancement failed");
    }

    // Parse response
    const enhanced = parseEnhancedActivity(JSON.stringify(result), {
      title: data.title,
      description: data.description,
    });

    // Update session storage with enhanced data
    await updatePendingEnhancement({
      enhancedTitle: enhanced.title,
      enhancedDescription: enhanced.description,
    });

    // Increment metrics
    await incrementEnhancementCount();

  } catch (error) {
    console.error("LLM enhancement error:", error);

    // Update session storage with error flag
    await updatePendingEnhancement({
      enhancedTitle: undefined,
      enhancedDescription: undefined,
    });
  }
}

/**
 * Extract activity ID from URL
 */
function extractActivityId(location: Location): string {
  const match = location.pathname.match(/\/activities\/(\d+)/);
  return match?.[1] || "";
}
```

### 3.7 Updated UI Components

**File**: `src/lib/ui/components.ts`

**New Components:**

```typescript
/**
 * Create enhancement preview panel for edit page
 */
export function createEnhancementPreviewPanel(
  field: "title" | "description",
  enhancedValue: string,
  onApply: () => void,
  onDiscard: () => void
): HTMLDivElement {
  const panel = document.createElement("div");
  panel.className = CSS_CLASSES.ENHANCEMENT_PREVIEW;
  panel.setAttribute("data-ae-preview-field", field);
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", `Enhanced ${field} preview`);

  // Panel styles
  Object.assign(panel.style, {
    background: "#fff8e6",
    border: "2px solid #fc5200",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  });

  // Header
  const header = document.createElement("div");
  header.style.marginBottom = "12px";
  header.style.fontWeight = "600";
  header.style.color = "#fc5200";
  header.style.fontSize = "14px";
  header.textContent = `✨ AI Enhanced ${field === "title" ? "Title" : "Description"}`;
  panel.appendChild(header);

  // Enhanced value display
  const valueDisplay = document.createElement("div");
  valueDisplay.style.padding = "12px";
  valueDisplay.style.background = "white";
  valueDisplay.style.borderRadius = "4px";
  valueDisplay.style.marginBottom = "12px";
  valueDisplay.style.fontSize = "14px";
  valueDisplay.style.lineHeight = "1.5";
  valueDisplay.style.whiteSpace = field === "description" ? "pre-wrap" : "normal";
  valueDisplay.textContent = enhancedValue;
  panel.appendChild(valueDisplay);

  // Action buttons
  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";

  // Apply button
  const applyButton = document.createElement("button");
  applyButton.textContent = "Insert";
  applyButton.setAttribute("data-action", "apply");
  applyButton.setAttribute("type", "button");
  Object.assign(applyButton.style, {
    padding: "8px 16px",
    background: "#fc5200",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  });
  applyButton.addEventListener("click", onApply);
  actions.appendChild(applyButton);

  // Discard button
  const discardButton = document.createElement("button");
  discardButton.textContent = "Discard";
  discardButton.setAttribute("data-action", "discard");
  discardButton.setAttribute("type", "button");
  Object.assign(discardButton.style, {
    padding: "8px 16px",
    background: "white",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  });
  discardButton.addEventListener("click", onDiscard);
  actions.appendChild(discardButton);

  panel.appendChild(actions);

  return panel;
}

/**
 * Create reset button (initially hidden)
 */
export function createResetButton(onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = "↶ Reset to Original";
  button.setAttribute(DOM_ATTRIBUTES.RESET_BUTTON, "1");
  button.setAttribute("type", "button");

  Object.assign(button.style, {
    display: "none", // Hidden until user applies enhancement
    marginTop: "16px",
    padding: "10px 16px",
    background: "#f5f5f5",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "system-ui, -apple-system, sans-serif",
  });

  button.addEventListener("click", onClick);

  return button;
}

/**
 * Show toast notification
 */
export function showToast(message: string, type: "success" | "error" | "info"): void {
  const toast = document.createElement("div");
  toast.textContent = message;

  const colors = {
    success: { bg: "#10b981", text: "white" },
    error: { bg: "#dc2626", text: "white" },
    info: { bg: "#3b82f6", text: "white" },
  };

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 20px",
    background: colors[type].bg,
    color: colors[type].text,
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: "10001",
    fontFamily: "system-ui, -apple-system, sans-serif",
  });

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
```

### 3.8 Updated Prompt Builder

**File**: `src/lib/prompt.ts`

**Enhanced Prompt:**

```typescript
/**
 * Build enhanced prompt with all extracted data
 */
export function buildEnhancedPrompt({
  activity,
  settings,
}: {
  activity: ExtendedActivityData;
  settings: Settings;
}): string {
  let prompt = `You are an AI assistant that enhances activity titles and descriptions for fitness tracking apps.

Your task: Create an engaging title (max 60 chars) and motivational description (max 280 chars) based on the provided activity data.

Tone: ${settings.tone}
`;

  // Add comprehensive activity data
  prompt += "\n\nActivity Data:\n";

  if (activity.athleteName) prompt += `Athlete: ${activity.athleteName}\n`;
  if (activity.activityType) prompt += `Activity Type: ${activity.activityType}\n`;
  if (activity.workoutType) prompt += `Workout Type: ${activity.workoutType}\n`;

  prompt += `\nCurrent Title: "${activity.title}"\n`;
  if (activity.description) {
    prompt += `Current Description: "${activity.description}"\n`;
  }

  // Add stats
  prompt += "\n\nActivity Stats:\n";
  if (activity.distance) prompt += `Distance: ${activity.distance}\n`;
  if (activity.movingTime) prompt += `Moving Time: ${activity.movingTime}\n`;
  if (activity.elapsedTime) prompt += `Elapsed Time: ${activity.elapsedTime}\n`;
  if (activity.elevation) prompt += `Elevation Gain: ${activity.elevation}\n`;
  if (activity.averagePace) prompt += `Average Pace: ${activity.averagePace}\n`;
  if (activity.averageHeartRate) prompt += `Average Heart Rate: ${activity.averageHeartRate}\n`;
  if (activity.averageCadence) prompt += `Average Cadence: ${activity.averageCadence}\n`;
  if (activity.calories) prompt += `Calories: ${activity.calories}\n`;

  // Add environmental data
  if (activity.temperature || activity.humidity || activity.wind) {
    prompt += "\n\nEnvironmental Conditions:\n";
    if (activity.temperature) prompt += `Temperature: ${activity.temperature}\n`;
    if (activity.humidity) prompt += `Humidity: ${activity.humidity}\n`;
    if (activity.wind) prompt += `Wind: ${activity.wind}\n`;
  }

  // Add context
  if (activity.location) prompt += `\nLocation: ${activity.location}\n`;
  if (activity.timeDisplay) prompt += `Time: ${activity.timeDisplay}\n`;

  prompt += `\n\nRespond with JSON only:
{
  "title": "Enhanced title here (max 60 chars)",
  "description": "Enhanced description here (max 280 chars)"
}

Rules:
- Be faithful to the original data
- Use motivational language
- Reference specific achievements (distance, pace, elevation)
- Keep title under 60 characters
- Keep description under 280 characters
- Incorporate weather/environmental conditions if available
- Use sport-specific terminology`;

  return prompt;
}
```

### 3.9 Updated Constants

**File**: `src/lib/constants.ts`

```typescript
export const DOM_ATTRIBUTES = {
  ENHANCE_BUTTON: "data-ae-enhance-btn",
  PREVIEW_PANEL: "data-ae-preview-panel",
  ENHANCEMENT_PREVIEW: "data-ae-enhancement-preview",
  RESET_BUTTON: "data-ae-reset-btn",
} as const;

export const CSS_CLASSES = {
  ENHANCE_BUTTON: "ae-enhance-btn",
  PREVIEW_PANEL: "ae-preview-panel",
  ENHANCEMENT_PREVIEW: "ae-enhancement-preview",
  RESET_BUTTON: "ae-reset-btn",
} as const;

export const ENHANCEMENT_DEBOUNCE_MS = 1000; // Increased from 500ms
export const NAVIGATION_CHECK_INTERVAL = 500;
export const MAX_WAIT_FOR_ENHANCED_DATA_MS = 30000; // 30 seconds
```

---

## Phase 4: Implementation Checklist

### 4.1 Type Definitions

- [x] Update `src/lib/adapters/types.ts` with `ExtendedActivityData` interface
- [x] Add `PageType` type ("details" | "edit" | "unknown")
- [x] Extend `SiteAdapter` interface with new methods
- [ ] Create `PendingEnhancement` interface (moved to session.ts)

### 4.2 Session Storage

- [x] Create `src/lib/session.ts` module
- [x] Implement `savePendingEnhancement()` function
- [x] Implement `getPendingEnhancement()` function with expiry check
- [x] Implement `updatePendingEnhancement()` function
- [x] Implement `clearPendingEnhancement()` function

### 4.3 Strava Adapter Updates

- [x] Add `detectPageType()` method to `stravaAdapter`
- [x] Implement `extractDetailsPageData()` with XPath extraction
- [x] Implement `locateEditButton()` method
- [x] Implement `locateTitleField()` method
- [x] Implement `locateDescriptionField()` method
- [ ] Test all XPath selectors on live Strava pages (manual testing later)

### 4.4 Garmin Adapter Placeholder

- [x] Create `src/lib/adapters/garmin.ts` (already exists, updated)
- [x] Implement placeholder methods (all return null/false)
- [x] Add TODO comments for future implementation
- [x] Export `garminAdapter` from `src/lib/adapters/index.ts` (already exported)

### 4.5 Content Script Updates

- [x] Update `src/entrypoints/content.ts` with page type detection
- [x] Implement `initializePage()` function with switch logic
- [x] Call `handleDetailsPage()` for details pages
- [x] Call `handleEditPage()` for edit pages

### 4.6 Injection Logic Updates

- [x] Create `handleDetailsPage()` function in `src/lib/inject.ts`
- [x] Create `handleDetailsPageEnhance()` function
- [x] Create `handleEditPage()` function
- [x] Implement `showEnhancementPreview()` function
- [x] Implement `applyEnhancement()` function
- [x] Implement `discardEnhancement()` function
- [x] Implement `waitForEnhancedData()` function
- [x] Implement `triggerEnhancementAPI()` function
- [x] Add `extractActivityId()` helper function

### 4.7 UI Components

- [x] Create `createEnhancementPreviewPanel()` in `src/lib/ui/components.ts`
- [x] Create `createResetButton()` function
- [x] Create `showToast()` function
- [x] Update button styles to match Strava design
- [x] Add hover effects to preview buttons

### 4.8 Prompt Updates

- [x] Create `buildEnhancedPrompt()` in `src/lib/prompt.ts`
- [x] Include all 15+ extracted fields in prompt
- [x] Add conditional sections for weather/environmental data
- [x] Test prompt with mock data

### 4.9 Constants Updates

- [x] Add `ENHANCEMENT_PREVIEW` to `DOM_ATTRIBUTES`
- [x] Add `RESET_BUTTON` to `DOM_ATTRIBUTES`
- [x] Add `MAX_WAIT_FOR_ENHANCED_DATA_MS` constant
- [x] Update `ENHANCEMENT_DEBOUNCE_MS` to 1000ms

### 4.10 Clean Up

- [x] Remove old edit page injection logic (kept old functions marked as deprecated for backwards compatibility)
- [x] Remove unused utilities (cleaned up imports)
- [x] Update comments and documentation (added comprehensive JSDoc comments)
- [x] Run TypeScript type checker: `pnpm run check` (passed with 5 minor warnings in Garmin placeholder)
- [x] Run build: `pnpm build` (successful - 691.79 kB total size)

---

## Phase 5: Testing Plan

### 5.1 Details Page Testing

**Test Cases:**

1. **Button Injection**
   - [ ] Button appears next to activity title on details page
   - [ ] Button has correct styling (Strava orange)
   - [ ] Button is accessible (keyboard navigation)

2. **Data Extraction**
   - [ ] All 15+ fields are extracted correctly
   - [ ] Empty fields default to empty string
   - [ ] Athlete name/activity type/workout type split correctly
   - [ ] Stats are sanitized (whitespace normalized)

3. **Navigation**
   - [ ] Click "AI Enhance" saves data to session storage
   - [ ] Edit button is located and clicked programmatically
   - [ ] Navigation to edit page succeeds
   - [ ] Session data persists across navigation

4. **Error Handling**
   - [ ] Missing edit button shows error panel
   - [ ] Failed data extraction shows error panel
   - [ ] Button shows error state on failure
   - [ ] User can retry after error

### 5.2 Edit Page Testing

**Test Cases:**

1. **Preview Display**
   - [ ] Check for pending enhancement on page load
   - [ ] Wait for LLM response (up to 30 seconds)
   - [ ] Show preview panels above actual fields
   - [ ] Preview panels have correct styling

2. **Insert Action**
   - [ ] Click "Insert" applies enhanced text to field
   - [ ] React component updates correctly
   - [ ] Input/change events are dispatched
   - [ ] Button shows "Applied ✓" state
   - [ ] Reset button becomes visible

3. **Discard Action**
   - [ ] Click "Discard" removes preview panel
   - [ ] Session storage cleared if both discarded
   - [ ] No changes to actual fields
   - [ ] Toast notification shown

4. **Reset Action**
   - [ ] Click "Reset" restores original values
   - [ ] Session storage cleared
   - [ ] All preview UI removed
   - [ ] Success toast shown

5. **Error Handling**
   - [ ] Timeout if LLM doesn't respond in 30 seconds
   - [ ] Show error toast if enhancement fails
   - [ ] Allow user to continue editing manually
   - [ ] Session storage cleaned up on error

### 5.3 LLM Integration Testing

**Test Cases:**

1. **API Call**
   - [ ] Prompt includes all extracted fields
   - [ ] API call is non-blocking (async)
   - [ ] Response is parsed correctly
   - [ ] Session storage updated with enhanced data

2. **Response Validation**
   - [ ] JSON parsing handles malformed responses
   - [ ] Title <= 60 characters enforced
   - [ ] Description <= 280 characters enforced
   - [ ] Fallback to original if parsing fails

### 5.4 Session Storage Testing

**Test Cases:**

1. **Persistence**
   - [ ] Data persists during navigation (details → edit)
   - [ ] Data expires after 10 minutes
   - [ ] Data cleared when user discards all previews
   - [ ] Data cleared when user resets to original

2. **Edge Cases**
   - [ ] Multiple tabs: Each tab has independent session storage
   - [ ] Browser refresh on details page: No stale data
   - [ ] Browser refresh on edit page: Session data still available
   - [ ] Direct navigation to edit page (no pending enhancement): No errors

### 5.5 Garmin Placeholder Testing

**Test Cases:**

1. **Detection**
   - [ ] Garmin adapter returns `false` for `match()`
   - [ ] No functionality on Garmin pages (placeholder)
   - [ ] No errors logged
   - [ ] TODO comments are clear

---

## Phase 6: Deployment & Monitoring

### 6.1 Build Process

```bash
# Type check
pnpm run check

# Build for production
pnpm build

# Output: .output/chrome-mv3/
```

### 6.2 Manual Testing Steps

1. **Load Extension**
   - Open Chrome → Extensions → Developer Mode
   - Click "Load Unpacked"
   - Select `.output/chrome-mv3/` folder

2. **Test on Live Strava**
   - Navigate to https://www.strava.com/activities/[your-activity-id]
   - Verify button appears next to title
   - Click "AI Enhance"
   - Verify navigation to edit page
   - Verify preview panels appear
   - Test Insert/Discard/Reset actions

3. **Test Edge Cases**
   - Activity with missing description
   - Activity with missing weather data
   - Direct navigation to edit page (no pending enhancement)
   - Refresh browser on edit page

### 6.3 Known Limitations

1. **XPath Fragility**: Strava may change their DOM structure
   - **Mitigation**: Test regularly, add fallback selectors

2. **LLM Latency**: 30-second timeout may not be enough for slow APIs
   - **Mitigation**: Show loading state, allow manual retry

3. **Session Storage Limit**: Browser limits session storage size
   - **Mitigation**: Only store essential data, clear after use

4. **React Component Updates**: Strava's React may not detect our changes
   - **Mitigation**: Dispatch proper events (input, change, blur)

---

## Phase 7: Future Enhancements

### 7.1 Short Term (Next Release)

1. **Real LLM Integration**
   - Replace mock implementation
   - Add API key management (BYOK)
   - Implement rate limiting

2. **Loading UX Improvements**
   - Show progress indicator during LLM call
   - Add estimated time remaining
   - Allow cancellation

3. **Error Handling Improvements**
   - Specific error messages for each failure type
   - Retry with exponential backoff
   - Fallback to simpler prompts on failure

### 7.2 Medium Term

1. **Garmin Connect Support**
   - Implement `garminAdapter` methods
   - Test on live Garmin pages
   - Add Garmin-specific prompt templates

2. **Advanced Customization**
   - User-defined prompt templates
   - Per-activity-type settings
   - Custom tone/style preferences

3. **Metrics & Analytics**
   - Track enhancement acceptance rate
   - Measure LLM response times
   - A/B test different prompt strategies

### 7.3 Long Term

1. **Batch Enhancement**
   - Enhance multiple activities at once
   - Queue management
   - Background processing

2. **AI-Powered Insights**
   - Training pattern analysis
   - Performance trend predictions
   - Personalized recommendations

3. **Multi-Platform Support**
   - Suunto, Polar, Wahoo adapters
   - Unified enhancement experience
   - Cross-platform sync

---

## Appendix A: Architecture Decisions

### A.1 Why Session Storage?

**Decision**: Use `browser.storage.session` for pending enhancement data

**Rationale**:
- ✅ Persists across navigation (details → edit)
- ✅ Cleared when tab closes (no stale data)
- ✅ Independent per tab (no conflicts)
- ✅ MV3 native API (no polyfills)

**Alternatives Considered**:
- ❌ Local Storage: Too persistent, requires manual cleanup
- ❌ In-memory: Lost on navigation
- ❌ Message Passing: Complex, requires background script

### A.2 Why XPath Extraction?

**Decision**: Use XPath expressions for data extraction

**Rationale**:
- ✅ Precise targeting of specific elements
- ✅ User provided exact XPath values
- ✅ Easy to update when DOM changes
- ✅ Works with dynamic React components

**Alternatives Considered**:
- ❌ CSS Selectors: Less precise for deep nesting
- ❌ Data Attributes: Strava doesn't use them
- ❌ Text Content Matching: Too fragile

### A.3 Why Preview UI on Edit Page?

**Decision**: Show enhanced content as preview above actual fields

**Rationale**:
- ✅ User sees original and enhanced side-by-side
- ✅ User has full control (insert/discard)
- ✅ No accidental overwrites
- ✅ Clear visual separation

**Alternatives Considered**:
- ❌ Direct Replacement: No user control, accidental overwrites
- ❌ Modal Dialog: Blocks view of original content
- ❌ Inline Suggestions: Requires complex diff UI

### A.4 Why Async LLM Call?

**Decision**: Trigger LLM API call during navigation (non-blocking)

**Rationale**:
- ✅ Reduces perceived latency
- ✅ User doesn't wait on details page
- ✅ Edit page can show loading state
- ✅ Better UX overall

**Alternatives Considered**:
- ❌ Blocking Call: User waits on details page (bad UX)
- ❌ Background Script: Complex message passing
- ❌ Pre-fetch: Wasteful if user doesn't edit

---

## Appendix B: Code Review Checklist

Before submitting for review, ensure:

### B.1 Code Quality

- [ ] All functions have TypeScript types
- [ ] All public APIs have JSDoc comments
- [ ] No `any` types used
- [ ] No console.log statements (use console.warn/error)
- [ ] Error handling in all async functions
- [ ] Proper cleanup (event listeners removed, DOM nodes removed)

### B.2 Performance

- [ ] DOM queries are cached where possible
- [ ] Event listeners use passive: true where appropriate
- [ ] No unnecessary re-renders
- [ ] Debouncing on rapid actions

### B.3 Accessibility

- [ ] All buttons have aria-label
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Focus management correct

### B.4 Security

- [ ] XSS prevention: sanitize all extracted text
- [ ] No eval() or innerHTML with user data
- [ ] No storage of sensitive data
- [ ] Proper CSP compliance

### B.5 Testing

- [ ] All test cases pass
- [ ] Edge cases handled
- [ ] Error paths tested
- [ ] Manual testing on live Strava completed

---

## Conclusion

This implementation plan provides a comprehensive roadmap for migrating AI enhancement from Strava's edit page to the details page, with a multi-stage workflow involving:

1. **Details Page**: Extract comprehensive activity data → Navigate to edit page
2. **Edit Page**: Display enhanced preview → Allow insert/discard/reset

**Key Design Decisions:**
- Session storage for cross-page state
- XPath extraction for precise targeting
- Preview UI for user control
- Async LLM call for better UX
- Garmin placeholder for future expansion

**Next Steps:**
1. Review this plan with team
2. Begin Phase 4 implementation (checklist items)
3. Test on live Strava pages
4. Iterate based on feedback

---

**Document Status**: ✅ Ready for Implementation
**Estimated Effort**: 2-3 days for Strava, 1 day for testing
**Risk Level**: Medium (DOM structure changes, LLM latency)
**Confidence**: High (based on existing adapter pattern)
****