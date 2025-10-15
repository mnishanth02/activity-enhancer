# Strava Implementation - Complete Functionality Reference

**Purpose**: Comprehensive implementation guide for Strava dual-page workflow
**Audience**: Future developers implementing Garmin, Wahoo, or other fitness platform integrations
**Status**: ✅ Production Ready
**Last Updated**: October 15, 2025
**Version**: 2.0 (Dual-Page Workflow)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Workflow Diagrams](#workflow-diagrams)
4. [Implementation Details](#implementation-details)
5. [DOM Structure & Selectors](#dom-structure--selectors)
6. [State Management](#state-management)
7. [UI Components](#ui-components)
8. [Error Handling](#error-handling)
9. [Testing Guidelines](#testing-guidelines)
10. [Migration Checklist](#migration-checklist)

---

## 🎯 Executive Summary

### What We Built

A **dual-page workflow** for AI-enhanced activity editing on Strava:

- **Page 1 (Details)**: User views activity → Clicks "AI Enhance" → Data extracted
- **Navigation**: Automatic redirect to edit page
- **Page 2 (Edit)**: Enhanced content shown as preview → User inserts or discards

### Why This Approach

**Previous Approach (Edit Page Only)**:
- Limited context (only title + description visible on edit page)
- Manual navigation required
- Poor UX for data extraction

**New Approach (Details → Edit)**:
- ✅ Rich context (15+ fields extracted from details page)
- ✅ Seamless navigation (automatic)
- ✅ Preview-before-apply UX (safer)
- ✅ Better prompts (comprehensive data → better AI output)

### Key Metrics

| Metric | Value |
|--------|-------|
| **Files Modified** | 8 files |
| **New Functions** | 17 functions |
| **LOC Added** | ~800 lines |
| **Data Fields Extracted** | 15+ fields |
| **Session Storage Expiry** | 10 minutes |
| **LLM Timeout** | 30 seconds |
| **Build Size** | 692 kB |

---

## 🏗️ Architecture Overview

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    DUAL-PAGE WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   DETAILS PAGE       │         │    EDIT PAGE         │
│   (Read Mode)        │─────────▶│   (Write Mode)       │
└──────────────────────┘         └──────────────────────┘
         │                                  │
         │ 1. Extract Data                 │ 4. Show Preview
         │ 2. Save Session                 │ 5. Insert/Discard
         │ 3. Trigger LLM                  │ 6. Reset Option
         │                                  │
         ▼                                  ▼
┌─────────────────────────────────────────────────────────────┐
│              SESSION STORAGE (10-min expiry)                 │
│  • Activity ID                                              │
│  • 15+ Extracted Fields                                     │
│  • Original Title/Description                               │
│  • Enhanced Title/Description (LLM response)                │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── lib/
│   ├── adapters/
│   │   ├── types.ts          # Interfaces for all adapters
│   │   ├── strava.ts         # Strava-specific implementation ⭐
│   │   ├── garmin.ts         # Garmin placeholder
│   │   └── index.ts          # Adapter registry
│   │
│   ├── session.ts            # Cross-page state management ⭐
│   ├── inject.ts             # Dual-page injection logic ⭐
│   ├── ui/
│   │   └── components.ts     # UI builders (buttons, panels) ⭐
│   ├── prompt.ts             # Enhanced prompt builder
│   ├── llm.ts                # LLM API calls
│   └── storage.ts            # Settings storage
│
└── entrypoints/
    ├── content.ts            # Content script entry (router) ⭐
    ├── background.ts         # Background script (session access)
    └── popup/                # Extension popup UI
```

**⭐ = Core files for dual-page workflow**

---

## 🔄 Workflow Diagrams

### End-to-End User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1. DETAILS PAGE (https://www.strava.com/activities/[id])
   │
   ├─▶ User views activity details (full stats visible)
   │
   ├─▶ Extension injects "AI Enhance ✨" button next to title
   │
   ├─▶ User clicks "AI Enhance ✨"
   │   │
   │   ├─▶ Button shows loading state (spinner)
   │   │
   │   ├─▶ Extract 15+ fields via XPath selectors
   │   │   - Title, Description
   │   │   - Distance, Moving Time, Elevation
   │   │   - Average Pace, Heart Rate, Cadence
   │   │   - Temperature, Humidity, Wind
   │   │   - Location, Date, Activity Type
   │   │
   │   ├─▶ Save to session storage (PendingEnhancement)
   │   │
   │   ├─▶ Trigger LLM API call (async, non-blocking)
   │   │   - Build enhanced prompt with all fields
   │   │   - Call OpenAI/Anthropic/Gemini
   │   │   - Save response to session storage
   │   │
   │   └─▶ Navigate to edit page (programmatic click)
   │
   ▼

2. NAVIGATION (Automatic)
   │
   ├─▶ Strava navigates to: https://www.strava.com/activities/[id]/edit
   │
   ├─▶ Content script detects page type: "edit"
   │
   ├─▶ Check session storage for PendingEnhancement
   │
   ├─▶ Wait for LLM response (polling, max 30s)
   │
   ▼

3. EDIT PAGE (https://www.strava.com/activities/[id]/edit)
   │
   ├─▶ Enhanced data ready → Show preview panels
   │   │
   │   ├─▶ Title Preview Panel (above title input)
   │   │   ┌───────────────────────────────────────┐
   │   │   │ ✨ AI Title     [Insert] [Discard]   │
   │   │   │ ┌───────────────────────────────────┐ │
   │   │   │ │ Enhanced title text here...       │ │
   │   │   │ └───────────────────────────────────┘ │
   │   │   └───────────────────────────────────────┘
   │   │
   │   └─▶ Description Preview Panel (above textarea)
   │       ┌───────────────────────────────────────┐
   │       │ ✨ AI Description [Insert] [Discard] │
   │       │ ┌───────────────────────────────────┐ │
   │       │ │ Enhanced description here...      │ │
   │       │ └───────────────────────────────────┘ │
   │       └───────────────────────────────────────┘
   │
   ├─▶ USER CHOICES:
   │   │
   │   ├─▶ [Insert] → Apply enhanced text to field
   │   │   - Copy to actual input/textarea
   │   │   - Show "Reset" button (restore original)
   │   │   - Toast: "Title applied ✓"
   │   │   - Keep preview visible (for reference)
   │   │
   │   ├─▶ [Discard] → Remove preview panel
   │   │   - Clear session storage
   │   │   - Toast: "Title discarded"
   │   │   - No changes to actual field
   │   │
   │   └─▶ [Reset] → Restore original values (if applied)
   │       - Retrieve from session storage
   │       - Update actual fields
   │       - Clear session storage
   │       - Toast: "Reset to original"
   │
   ▼

4. SAVE & COMPLETE
   │
   ├─▶ User edits further if needed
   │
   └─▶ User clicks "Save" (Strava's native button)
       - Activity updated on Strava servers
       - Session storage auto-cleared on page close
```

### Technical State Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

DETAILS PAGE:
   │
   ├─▶ handleDetailsPage()
   │   └─▶ Inject button
   │
   ├─▶ handleDetailsPageEnhance() [on button click]
   │   │
   │   ├─▶ adapter.extractDetailsPageData(doc)
   │   │   └─▶ Returns: ExtendedActivityData (15+ fields)
   │   │
   │   ├─▶ savePendingEnhancement({
   │   │     activityId: "12345",
   │   │     extractedData: { ... },
   │   │     originalTitle: "Morning Run",
   │   │     originalDescription: "Great run!",
   │   │     timestamp: Date.now()
   │   │   })
   │   │   └─▶ Saved to: session:ae.pendingEnhancement
   │   │
   │   ├─▶ triggerEnhancementAPI(extractedData)
   │   │   │
   │   │   ├─▶ buildEnhancedPrompt({ activity, settings })
   │   │   │   └─▶ Constructs prompt with all 15+ fields
   │   │   │
   │   │   ├─▶ enhanceActivity(prompt, settings)
   │   │   │   └─▶ Calls LLM API (OpenAI/Anthropic/Gemini)
   │   │   │
   │   │   ├─▶ parseEnhancedActivity(response)
   │   │   │   └─▶ Returns: { title, description }
   │   │   │
   │   │   └─▶ updatePendingEnhancement({
   │   │         enhancedTitle: "...",
   │   │         enhancedDescription: "..."
   │   │       })
   │   │       └─▶ Updates session storage
   │   │
   │   └─▶ adapter.locateEditButton(doc).click()
   │       └─▶ Navigate to edit page
   │
   ▼

EDIT PAGE:
   │
   ├─▶ handleEditPage()
   │   │
   │   ├─▶ getPendingEnhancement()
   │   │   └─▶ Returns: PendingEnhancement | null
   │   │
   │   ├─▶ waitForEnhancedData(pending, 30000ms)
   │   │   └─▶ Polls session storage every 500ms until:
   │   │       - enhancedTitle & enhancedDescription exist
   │   │       - OR 30s timeout (throw error)
   │   │
   │   └─▶ showEnhancementPreview(adapter, pending)
   │       │
   │       ├─▶ createEnhancementPreviewPanel("title", ...)
   │       ├─▶ createEnhancementPreviewPanel("description", ...)
   │       ├─▶ createResetButton(...)
   │       │
   │       └─▶ Inject panels after labels, before inputs
   │
   ▼

USER INTERACTION:
   │
   ├─▶ [Insert Button Click]
   │   └─▶ applyEnhancement(field, pending, adapter)
   │       ├─▶ adapter.setTitle(doc, enhancedTitle)
   │       ├─▶ Show reset button (display: block)
   │       └─▶ showToast("Title applied", "success")
   │
   ├─▶ [Discard Button Click]
   │   └─▶ discardEnhancement(field)
   │       ├─▶ Remove preview panel
   │       ├─▶ clearPendingEnhancement()
   │       └─▶ showToast("Discarded", "info")
   │
   └─▶ [Reset Button Click]
       └─▶ createResetButton callback
           ├─▶ adapter.setTitle(doc, originalTitle)
           ├─▶ adapter.setDescription(doc, originalDescription)
           ├─▶ clearPendingEnhancement()
           └─▶ Remove all preview UI
```

---

## 🔧 Implementation Details

### 1. Adapter Pattern (`src/lib/adapters/types.ts`)

**Core Interfaces:**

```typescript
/**
 * Page type detection
 */
export type PageType = "details" | "edit" | "unknown";

/**
 * Extended activity data with 15+ fields
 */
export interface ExtendedActivityData extends ActivityData {
  // Core fields
  title: string;
  description: string;

  // Athlete & Activity
  athleteName?: string;
  activityType?: string;
  workoutType?: string;
  sport?: string;

  // Time & Location
  timeDisplay?: string;
  timeISO?: string;
  date?: string;
  location?: string;

  // Performance Metrics
  distance?: string;
  movingTime?: string;
  elapsedTime?: string;
  elevationGain?: string;
  calories?: string;

  // Averages
  averagePace?: string;
  averageHeartRate?: string;
  averageCadence?: string;

  // Environmental (optional, respects user settings)
  temperature?: string;
  humidity?: string;
  wind?: string;
}

/**
 * Site adapter interface
 */
export interface SiteAdapter {
  // ... existing methods (getTitle, setTitle, etc.)

  /**
   * Detect page type from URL
   */
  detectPageType(location: Location): PageType;

  /**
   * Extract comprehensive data from details page
   */
  extractDetailsPageData(doc: Document): ExtendedActivityData;

  /**
   * Locate edit button on details page
   */
  locateEditButton(doc: Document): HTMLElement | null;

  /**
   * Locate title field on edit page
   */
  locateTitleField(doc: Document): HTMLInputElement | null;

  /**
   * Locate description field on edit page
   */
  locateDescriptionField(doc: Document): HTMLTextAreaElement | HTMLElement | null;
}
```

### 2. Session Storage (`src/lib/session.ts`)

**Purpose**: Cross-page state management with automatic expiry

**Schema:**

```typescript
export interface PendingEnhancement {
  activityId: string;              // "12345678"
  extractedData: ExtendedActivityData;
  originalTitle: string;           // For reset functionality
  originalDescription: string;
  enhancedTitle?: string;          // LLM response (populated async)
  enhancedDescription?: string;
  timestamp: number;               // For 10-minute expiry
}
```

**Storage Key**: `"session:ae.pendingEnhancement"`

**API:**

```typescript
// Save pending enhancement
await savePendingEnhancement(data: PendingEnhancement): Promise<void>

// Get pending enhancement (returns null if expired)
await getPendingEnhancement(): Promise<PendingEnhancement | null>

// Update with partial data (e.g., add LLM response)
await updatePendingEnhancement(updates: Partial<PendingEnhancement>): Promise<void>

// Clear all pending data
await clearPendingEnhancement(): Promise<void>
```

**Important Notes:**

1. **Session storage** (not local/sync):
   - Auto-cleared when browser tab closes
   - Not synced across devices
   - Perfect for temporary cross-page state

2. **10-minute expiry**:
   - Prevents stale data lingering
   - Checked automatically in `getPendingEnhancement()`
   - Cleared if expired

3. **Access Level** (MV3 Security):
   - Requires `browser.storage.session.setAccessLevel()` in background script
   - Set to `"TRUSTED_AND_UNTRUSTED_CONTEXTS"` (allows content scripts)
   - See: `docs/implementation/session-storage-fix.md`

### 3. Strava Adapter (`src/lib/adapters/strava.ts`)

#### 3.1 Page Type Detection

```typescript
detectPageType(location: Location): PageType {
  if (location.host !== "www.strava.com") return "unknown";

  const path = location.pathname;

  // /activities/[id]/edit
  if (/^\/activities\/\d+\/edit$/.test(path)) return "edit";

  // /activities/[id]
  if (/^\/activities\/\d+$/.test(path)) return "details";

  return "unknown";
}
```

**Regex Patterns:**
- Details: `/^\/activities\/\d+$/`
- Edit: `/^\/activities\/\d+\/edit$/`

#### 3.2 Details Page Data Extraction

**Method**: XPath selectors for precision

```typescript
extractDetailsPageData(doc: Document): ExtendedActivityData {
  // Helper to safely extract text by XPath
  const getByXPath = (xpath: string): string => {
    const result = doc.evaluate(
      xpath,
      doc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    const node = result.singleNodeValue;
    return node?.textContent?.trim() || "";
  };

  // Extract athlete name, activity type, workout type
  const headerText = getByXPath('//*[@id="heading"]/header/h2/span');
  const parts = headerText.split("-").map((s) => s.trim());
  const athleteName = parts[0] || "";
  const activityType = parts[1] || "";
  const workoutType = parts[2] || "";

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
    elevationGain: getByXPath('//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[2]/strong'),
    elapsedTime: getByXPath('//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong'),
    calories: getByXPath('//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong'),
    averagePace: getByXPath('//*[@id="heading"]/div/div/div[2]/ul/li[3]/strong'),
    averageHeartRate: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[3]'),
    averageCadence: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[4]'),
    temperature: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[5]'),
    humidity: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[6]'),
    wind: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[7]'),
  };
}
```

**Key Points:**

1. **XPath vs CSS Selectors**:
   - XPath chosen for complex nested structures
   - More precise targeting in Strava's React DOM
   - Easier to maintain for deep hierarchies

2. **Graceful Degradation**:
   - All fields return empty string `""` if not found
   - No errors thrown on missing elements
   - Prompt builder handles empty fields

3. **Data Parsing**:
   - Athlete info: Split by `-` delimiter
   - All text: Trimmed whitespace
   - Units preserved (e.g., "5.2 mi", "45:30")

#### 3.3 Edit Button Location

```typescript
locateEditButton(doc: Document): HTMLElement | null {
  // XPath: /html/body/div[1]/div[3]/nav/div/a
  const result = doc.evaluate(
    "/html/body/div[1]/div[3]/nav/div/a",
    doc,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  );
  return result.singleNodeValue as HTMLElement | null;
}
```

**Navigation Trigger:**
```typescript
const editButton = adapter.locateEditButton(document);
if (editButton) {
  editButton.click(); // Programmatic navigation
}
```

#### 3.4 Field Locators (Edit Page)

**Title Field:**

```typescript
locateTitleField(doc: Document): HTMLInputElement | null {
  return doc.getElementById("activity_name") as HTMLInputElement | null;
}
```

**Description Field:**

```typescript
locateDescriptionField(doc: Document): HTMLTextAreaElement | HTMLElement | null {
  const container = doc.getElementById("edit-activity");
  if (!container) return null;

  const textarea = container.querySelector<HTMLTextAreaElement>(
    "div > div > div:first-child > div:first-child > div:first-child > div > div > div > textarea",
  );

  return textarea;
}
```

**Why Complex Selector?**
- Strava uses React component: `ActivityDescriptionEdit`
- Textarea nested deep in component tree
- CSS selector more maintainable than full XPath

---

## 🗺️ DOM Structure & Selectors

### Strava Details Page Structure

```html
<div id="heading">
  <header>
    <h2>
      <span>Nishanth - Run - Morning Run</span> <!-- Athlete - Type - Workout -->
    </h2>
    <!-- AI Enhance button injected here ✨ -->
  </header>

  <div>
    <div>
      <div>
        <div>
          <div>
            <h1>Morning Run</h1> <!-- Title -->

            <div>
              <div>
                <div>
                  <p>Great run today!</p> <!-- Description -->
                </div>
              </div>
            </div>

            <div>
              <div>
                <div>
                  <div>
                    <p>This morning</p> <!-- Time Display -->
                  </div>
                </div>
              </div>
            </div>

            <time datetime="2025-10-15T06:30:00Z">...</time> <!-- ISO Time -->
            <span>Boston, MA</span> <!-- Location -->
          </div>
        </div>

        <div>
          <ul>
            <li><strong>5.2 mi</strong></li> <!-- Distance -->
            <li><strong>45:30</strong></li> <!-- Moving Time -->
            <li><strong>8:45 /mi</strong></li> <!-- Average Pace -->
          </ul>

          <div>
            <div>
              <div>
                <strong>423 ft</strong> <!-- Elevation Gain -->
              </div>
              <div>
                <strong>47:15</strong> <!-- Elapsed Time -->
              </div>
              <div>
                <strong>380 cal</strong> <!-- Calories -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="chart-controls">
  <table>
    <tbody>
      <tr>
        <td>...</td>
        <td>...</td>
        <td>150 bpm</td> <!-- Average Heart Rate -->
        <td>180 spm</td> <!-- Average Cadence -->
        <td>68°F</td> <!-- Temperature -->
        <td>65%</td> <!-- Humidity -->
        <td>5 mph NE</td> <!-- Wind -->
      </tr>
    </tbody>
  </table>
</div>
```

### Strava Edit Page Structure

```html
<div class="form-group">
  <label for="activity_name">Title</label>

  <!-- Enhancement Preview Panel injected here ✨ -->

  <input
    id="activity_name"
    name="activity[name]"
    value="Morning Run"
    class="form-control"
  />

  <label for="activity_description">Description</label>

  <!-- Enhancement Preview Panel injected here ✨ -->

  <div
    class="form-control description"
    data-react-class="ActivityDescriptionEdit"
  >
    <div>
      <div>
        <div>
          <textarea>Great run today!</textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- Reset Button appended here (initially hidden) ✨ -->
</div>
```

### XPath Reference Table

| Field | XPath | Type | Example Value |
|-------|-------|------|---------------|
| **Athlete + Type + Workout** | `//*[@id="heading"]/header/h2/span` | string | "Nishanth - Run - Morning Run" |
| **Title** | `//*[@id="heading"]/div/div/div[1]/div/div/h1` | string | "Morning Run" |
| **Description** | `//*[@id="heading"]/div/div/div[1]/div/div/div[1]/div/div/p` | string | "Great run today!" |
| **Time Display** | `//*[@id="heading"]/div/div/div[1]/div/div/div[2]/div/div[1]/div/div/p` | string | "This morning" |
| **Time ISO** | `//*[@id="heading"]/div/div/div[1]/div/div/time` | datetime | "2025-10-15T06:30:00Z" |
| **Location** | `//*[@id="heading"]/div/div/div[1]/div/div/span` | string | "Boston, MA" |
| **Distance** | `//*[@id="heading"]/div/div/div[2]/ul/li[1]/strong` | string | "5.2 mi" |
| **Moving Time** | `//*[@id="heading"]/div/div/div[2]/ul/li[2]/strong` | string | "45:30" |
| **Average Pace** | `//*[@id="heading"]/div/div/div[2]/ul/li[3]/strong` | string | "8:45 /mi" |
| **Elevation Gain** | `//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[2]/strong` | string | "423 ft" |
| **Elapsed Time** | `//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong` | string | "47:15" |
| **Calories** | `//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong` | string | "380 cal" |
| **Avg Heart Rate** | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[3]` | string | "150 bpm" |
| **Avg Cadence** | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[4]` | string | "180 spm" |
| **Temperature** | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[5]` | string | "68°F" |
| **Humidity** | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[6]` | string | "65%" |
| **Wind** | `//*[@id="chart-controls"]/table/tbody/tr[2]/td[7]` | string | "5 mph NE" |

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

#### Details Page

- [ ] **Button Injection**
  - Navigate to activity details page
  - Verify "AI Enhance ✨" button appears next to title
  - Check button styling matches Strava design
  - Confirm no duplicate buttons on SPA navigation

- [ ] **Data Extraction**
  - Click "AI Enhance ✨"
  - Verify button shows loading state (spinner)
  - Check browser console for extracted data
  - Confirm all 15+ fields extracted (empty strings for missing)

- [ ] **Navigation**
  - Verify automatic redirect to edit page
  - Check URL changes to `/activities/[id]/edit`
  - Confirm session storage contains PendingEnhancement

#### Edit Page

- [ ] **Preview Display**
  - Verify two preview panels appear (title + description)
  - Check panels positioned after labels, before inputs
  - Confirm enhanced text visible in panels
  - Verify buttons (Insert/Discard) functional

- [ ] **Insert Action**
  - Click "Insert" on title preview
  - Verify enhanced title copied to actual input field
  - Check "Reset" button appears
  - Confirm toast notification: "Title applied ✓"

- [ ] **Discard Action**
  - Click "Discard" on description preview
  - Verify preview panel removed
  - Confirm session storage cleared
  - Check toast notification: "Description discarded"

- [ ] **Reset Action**
  - Apply at least one enhancement
  - Click "Reset to Original"
  - Verify original values restored in fields
  - Confirm all preview panels removed
  - Check toast notification: "Reset to original"

#### Edge Cases

- [ ] **Missing Fields**
  - Test on activities with minimal data (no heart rate, no weather)
  - Verify graceful degradation (empty strings)
  - Confirm prompt still builds correctly

- [ ] **LLM Timeout**
  - Simulate slow LLM response (>30s)
  - Verify timeout error handled
  - Check edit page doesn't show preview if timeout

- [ ] **Session Expiry**
  - Save pending enhancement
  - Wait 11 minutes
  - Verify getPendingEnhancement() returns null
  - Confirm edit page doesn't show preview

- [ ] **Concurrent Enhancements**
  - Click "AI Enhance ✨" multiple times rapidly
  - Verify debouncing prevents duplicate calls
  - Check only one enhancement processed

---

## 🚨 Error Handling

### Error Types & Recovery

| Error Type | Location | Recovery Strategy |
|------------|----------|-------------------|
| **Adapter Missing** | content.ts | Show console warning, no button injection |
| **Extract Failure** | Details page | Show error panel with retry button |
| **Session Storage Error** | Any page | Fallback to local storage (not implemented) |
| **LLM API Error** | Background | Store error in session, show on edit page |
| **LLM Timeout** | Edit page | Show warning, allow manual entry |
| **Field Not Found** | Edit page | Console warning, skip preview |
| **Navigation Failure** | Details page | Show error panel, reset button state |

---

## 📦 Migration Checklist for New Providers

### For Implementing Garmin/Wahoo/Other Platforms

#### 1. Create Adapter

```typescript
// src/lib/adapters/garmin.ts
export const garminAdapter: SiteAdapter = {
  id: "garmin",
  name: "Garmin Connect",

  match(location: Location): boolean {
    return location.host === "connect.garmin.com" &&
           /^\/modern\/activity\/\d+/.test(location.pathname);
  },

  detectPageType(location: Location): PageType {
    // Implement Garmin-specific URL patterns
    // Details: /modern/activity/[id]
    // Edit: /modern/activity/[id]/edit (or similar)
  },

  extractDetailsPageData(doc: Document): ExtendedActivityData {
    // Map Garmin DOM to ExtendedActivityData
    // Use XPath or CSS selectors
    // Handle Garmin's specific field names/units
  },

  locateEditButton(doc: Document): HTMLElement | null {
    // Find Garmin's "Edit" button
  },

  locateTitleField(doc: Document): HTMLInputElement | null {
    // Find Garmin's title input field
  },

  locateDescriptionField(doc: Document): HTMLTextAreaElement | null {
    // Find Garmin's description textarea
  },

  // ... implement all required methods
};
```

#### 2. Register Adapter

```typescript
// src/lib/adapters/index.ts
import { garminAdapter } from "./garmin";

const adapters: SiteAdapter[] = [
  stravaAdapter,
  garminAdapter, // Add new adapter
];
```

#### 3. Update Content Script Matches

```typescript
// src/entrypoints/content.ts
export default defineContentScript({
  matches: [
    "*://www.strava.com/*",
    "*://connect.garmin.com/*", // Add new match pattern
  ],
  // ...
});
```

#### 4. Test All Workflows

- [ ] Details page button injection
- [ ] Data extraction (15+ fields)
- [ ] Session storage persistence
- [ ] LLM API call
- [ ] Navigation to edit page
- [ ] Preview panels display
- [ ] Insert/Discard/Reset functionality

---

## 📚 Additional Resources

### Related Documentation

- **Session Storage Fix**: `docs/implementation/session-storage-fix.md`
- **Phase 4 Summary**: `docs/implementation/phase4-implementation-summary.md`
- **Phase 7 UI Improvements**: `docs/implementation/phase7-ui-improvements.md`
- **Implementation Plan**: `docs/implementation/strava-imple-v2.md`
- **Copilot Instructions**: `.github/copilot-instructions.md`

### External References

- **WXT Storage API**: https://wxt.dev/storage.html
- **Chrome Storage API**: https://developer.chrome.com/docs/extensions/reference/api/storage
- **XPath Tutorial**: https://www.w3schools.com/xml/xpath_intro.asp
- **Strava API Docs**: https://developers.strava.com/docs/reference/

---

## ✅ Implementation Status

### Completed Features

- ✅ Dual-page workflow (details → edit)
- ✅ Session storage state management
- ✅ 15+ field extraction from details page
- ✅ XPath-based DOM targeting
- ✅ Async LLM API calls during navigation
- ✅ Preview-before-apply UI
- ✅ Insert/Discard/Reset actions
- ✅ Subtle, compact UI design (Phase 7)
- ✅ Error handling with retry
- ✅ Toast notifications
- ✅ Debouncing & concurrency protection
- ✅ Session expiry (10 minutes)
- ✅ LLM timeout (30 seconds)
- ✅ Production build successful

### Future Enhancements

- ⏳ Garmin Connect adapter
- ⏳ Wahoo adapter
- ⏳ Streaming LLM responses (real-time preview)
- ⏳ Diff view (old vs new side-by-side)
- ⏳ Batch enhancement (multiple activities)
- ⏳ Offline mode (fallback prompts)
- ⏳ Automated testing suite
- ⏳ Performance metrics dashboard

---

**Document Version**: 2.0
**Last Updated**: October 15, 2025
**Maintained By**: GitHub Copilot
**Status**: ✅ Production Ready
