# Enhanced Console Logging - Testing Guide

## What's New

I've added enhanced console logging to help you debug and verify the data extraction. When you click the "✨ AI Enhance" button, you'll now see a nicely formatted console output showing all extracted data.

## Console Output Format

When you click the enhance button, look for this in the browser console:

```
🏃 Activity Data Extracted
📋 Title: Morning Run
📝 Description: (none)
🏃‍♂️ Sport: Run
📏 Distance: 20.01 km
⏱️ Time: 2h 6m
📈 Elevation Gain: 102 m
📅 Date: Oct 12, 2025
🗂️ Full Object: {title: "Morning Run", description: "", sport: "Run", distance: "20.01 km", ...}
```

## How to Test

### 1. Load the Extension
```bash
# Build is already complete, just load it:
# Go to chrome://extensions/
# Load the .output/chrome-mv3/ folder
```

### 2. Open Strava Activity Edit Page
1. Go to www.strava.com and log in
2. Navigate to any activity
3. Click "Edit" or go to `/activities/<activity_id>/edit`

### 3. Open Browser Console
- Press `F12` or right-click → "Inspect"
- Go to the "Console" tab
- Make sure console level is set to "All" or "Info"

### 4. Click AI Enhance Button
- Look for the "✨ AI Enhance" button in the page header
- Click it
- Watch the console for the grouped output

## What Each Field Represents

| Icon | Field | Source | Example |
|------|-------|---------|---------|
| 📋 | Title | `input#activity_name` | "Morning Run" |
| 📝 | Description | React component `ActivityDescriptionEdit` | "(none)" or actual text |
| 🏃‍♂️ | Sport | Page title (2nd segment) | "Run", "Ride", "Swim" |
| 📏 | Distance | Stats table row | "20.01 km", "5.5 mi" |
| ⏱️ | Time | Stats table row | "2h 6m", "45m 30s" |
| 📈 | Elevation Gain | Stats table row | "102 m", "335 ft" |
| 📅 | Date | Stats table row | "Oct 12, 2025" |

## Expected vs. Actual Output

### If Everything Works ✅
```
🏃 Activity Data Extracted
📋 Title: Morning Run
📝 Description:
🏃‍♂️ Sport: Run
📏 Distance: 20.01 km
⏱️ Time: 2h 6m
📈 Elevation Gain: 102 m
📅 Date: Oct 12, 2025
🗂️ Full Object: {title: "Morning Run", description: "", sport: "Run", distance: "20.01 km", time: "2h 6m", elevationGain: "102 m", date: "Oct 12, 2025"}
```

### If Some Fields Are Missing ⚠️
```
🏃 Activity Data Extracted
📋 Title: Morning Run
📝 Description: (none)
🏃‍♂️ Sport: (not available)
📏 Distance: (not available)
⏱️ Time: (not available)
📈 Elevation Gain: (not available)
📅 Date: (not available)
🗂️ Full Object: {title: "Morning Run", description: ""}
```

This indicates the selectors need adjustment or the DOM structure has changed.

## Troubleshooting

### No Console Output
- Check if the extension loaded correctly
- Verify you're on a Strava activity edit page (`/activities/.../edit`)
- Make sure console filter isn't hiding info logs

### Missing Stats
If you see "(not available)" for stats:

1. **Check the stats table exists:**
   ```javascript
   // Run in console:
   document.querySelector('table.table')
   ```

2. **Inspect table structure:**
   ```javascript
   const table = document.querySelector('table.table');
   const rows = Array.from(table.querySelectorAll('tr'));
   rows.forEach((row, i) => {
     const cells = row.querySelectorAll('td');
     console.log(`Row ${i}:`, cells[0]?.textContent, '→', cells[1]?.textContent);
   });
   ```

### Missing Sport Type
If sport shows "(not available)":
```javascript
// Check page title format:
console.log('Page title:', document.title);
// Expected: "Morning Run | Run | Strava"
```

## Additional Debug Information

The console also shows:
- Settings object (user preferences)
- LLM prompt being sent
- Full enhancement response

This helps debug the entire enhancement pipeline from data extraction to LLM response.

## Next Steps

Once you verify the data extraction is working correctly:
1. The extracted data gets included in the LLM prompt
2. You can proceed with real LLM API integration
3. The enhanced logging will help debug any issues

---

**Ready to test!** Load the extension, open a Strava activity edit page, open the console, and click "✨ AI Enhance".