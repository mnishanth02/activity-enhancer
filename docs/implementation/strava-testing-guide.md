# Strava Integration - Testing Guide

## Quick Start

### 1. Build the Extension

```bash
cd /Users/nishanth/youtube-pre/activity-enhancer
pnpm build
```

### 2. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder: `/Users/nishanth/youtube-pre/activity-enhancer/.output/chrome-mv3/`

### 3. Test on Strava

1. Go to [www.strava.com](https://www.strava.com) and log in
2. Navigate to any activity
3. Click "Edit" or go directly to `/activities/<activity_id>/edit`

## What to Look For

### Visual Verification

✅ **Button Appearance**
- The "✨ AI Enhance" button should appear in the header
- Located after the "Edit Activity" title, before the "Save" button
- Orange border (#fc5200), white background
- Font matches Strava's style

✅ **Button Interactions**
- Hover: Background turns orange, text turns white
- Click: Changes to "⏳ Enhancing..."
- After enhancement: Preview panel appears

### Functional Testing

#### Test Case 1: Basic Enhancement

**Steps:**
1. Open activity edit page with existing title
2. Click "✨ AI Enhance" button
3. Wait for preview panel

**Expected Results:**
- Button shows loading state ("⏳ Enhancing...")
- Preview panel appears with enhanced title/description
- "Accept" and "Cancel" buttons are visible

**Mock Response** (current implementation):
```json
{
  "title": "Enhanced: [original title]",
  "description": "This activity was enhanced by AI. Original: [original description]"
}
```

#### Test Case 2: Data Extraction

**Open Browser Console** (F12) and look for logs:

```javascript
// Expected in console (dev mode):
{
  title: "Morning Run",
  description: "",
  sport: "Run",
  distance: "20.01 km",
  time: "2h 6m",
  elevationGain: "102 m"
}
```

**Verification:**
- ✅ Title extracted correctly
- ✅ Description extracted (may be empty)
- ✅ Stats extracted from right sidebar table
- ✅ Sport type extracted from page title

#### Test Case 3: Field Updates

**Steps:**
1. Complete enhancement (click "Accept")
2. Verify title field shows enhanced text
3. Verify description field shows enhanced text
4. Click native "Save" button
5. Reload page

**Expected Results:**
- ✅ Title input reflects changes immediately
- ✅ Description textarea/contenteditable reflects changes
- ✅ Changes persist after save and reload

#### Test Case 4: Error Handling

**Steps to Simulate Error:**
1. Open browser DevTools Network tab
2. Set "Offline" mode
3. Click "✨ AI Enhance"

**Expected Results:**
- ✅ Button shows error state: "⚠️ Retry"
- ✅ Error message displayed to user
- ✅ Clicking "Retry" attempts enhancement again

### DOM Inspection

Use Chrome DevTools to verify selectors:

```javascript
// Title field
document.querySelector('#activity_name')
// Should return: <input id="activity_name" name="activity[name]" value="...">

// Description React component
document.querySelector('div.description[data-react-class="ActivityDescriptionEdit"]')
// Should return: <div class="form-control mb-md description" ...>

// Stats table
document.querySelector('table.table')
// Should return table with rows for Date, Distance, Time, Elevation Gain

// Button anchor
document.querySelector('div.header div.media.media-middle')
// Should return: <div class="media media-middle">...</div>
```

## Troubleshooting

### Button Not Appearing

**Possible causes:**
1. Extension not loaded correctly
2. Wrong Strava page (must be activity edit page)
3. DOM structure changed

**Debug steps:**
```javascript
// Open console and run:
console.log(window.location.pathname);
// Should match: /activities/123456789/edit

// Check if content script loaded:
document.querySelector('[data-ae-enhance-btn]');
// Should return null or the button element
```

### Stats Not Extracting

**Check the stats table exists:**
```javascript
const table = document.querySelector('table.table');
const rows = table.querySelectorAll('tr');
console.log(Array.from(rows).map(row => {
  const cells = row.querySelectorAll('td');
  return {
    label: cells[0]?.textContent,
    value: cells[1]?.textContent
  };
}));
```

**Expected output:**
```javascript
[
  { label: "Date", value: "Oct 12, 2025" },
  { label: "Distance", value: "20.01 km" },
  { label: "Time", value: "2h 6m" },
  { label: "Elevation Gain", value: "102 m" }
]
```

### Description Not Updating

**The description field is a React component. Check:**
```javascript
// Find the container
const descContainer = document.querySelector('div.description[data-react-class="ActivityDescriptionEdit"]');

// Look for textarea
const textarea = descContainer.querySelector('textarea');
console.log('Textarea:', textarea);

// Look for contenteditable
const contentEditable = descContainer.querySelector('[contenteditable="true"]');
console.log('ContentEditable:', contentEditable);
```

**If neither exists**, Strava may have updated their React component structure. Check the DOM manually and update selectors in `src/lib/adapters/strava.ts`.

## Console Logs (Dev Mode)

When running in development mode, you should see:

```
✨ Enhance button injected successfully
[Activity collected]: { title: "...", description: "...", sport: "Run", ... }
[Prompt sent to LLM]: You are an assistant that rewrites...
[Enhancement received]: { title: "...", description: "..." }
```

## Next Steps After Testing

### If Everything Works ✅

1. Document any observations
2. Proceed with real LLM integration (replace mock in `src/lib/llm.ts`)
3. Test with actual API calls
4. Add user settings for API keys

### If Issues Found ⚠️

1. Note which test case failed
2. Check browser console for errors
3. Inspect DOM to verify selector accuracy
4. Update selectors in `src/lib/adapters/strava.ts`
5. Rebuild and retest

## Performance Notes

- **Build time**: ~5.5 seconds
- **Content script size**: 85.72 kB (acceptable for Chrome extension)
- **Injection speed**: < 100ms after page load
- **Enhancement time**: 1 second (mock), will depend on API in production

## Browser Compatibility

Tested on:
- Chrome 120+ (recommended)
- Edge 120+ (Chromium-based, should work)

Not tested:
- Firefox (requires manifest v2 or v3 adjustments)
- Safari (requires conversion)

---

**Ready to test!** Load the extension and navigate to a Strava activity edit page.
