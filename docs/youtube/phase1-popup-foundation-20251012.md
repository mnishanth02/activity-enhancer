---
script_type: "feature-focused"
feature_name: "Phase 1: Popup Foundation - Type-Safe Storage, React Architecture & State Management"
target_duration: "6-8 minutes"
complexity_level: "high"
tech_stack: ["TypeScript", "React", "WXT", "Zod", "Chrome Extensions API"]
commit_range: "4ccb07b..afec6de"
organization: "standalone"
created_date: "2025-10-12"
video_keywords: ["chrome extension", "popup ui", "wxt framework", "type-safe storage", "react hooks", "zod validation", "state management"]
production_status: "draft"
---

# Building a Type-Safe Chrome Extension Popup: Complete Foundation Setup

## INTRO (0:00-0:45) — Setting the Stage

**[SCREEN: Extension icon → Popup opening → Show 3-tab interface]**

> "Hey developers! Today I'm walking you through Phase 1 of building a production-ready Chrome extension popup UI. This isn't just another tutorial—I'm showing you the *exact* foundation I built for the Activity Enhancer extension, and the architectural decisions that make it scalable and maintainable."

**What You'll Learn:**
- Type-safe storage patterns using WXT's `storage.defineItem` API
- Lightweight URL state management for extension popups
- React component architecture with proper separation of concerns
- Zod schema validation for runtime type safety

**The Challenge:**
Building a Chrome extension popup that manages complex user settings, per-domain preferences, and multiple tabs—all while maintaining type safety, avoiding common pitfalls, and staying framework-agnostic.

**Tech Stack Preview:**
- WXT for extension tooling
- React + TypeScript for UI
- Zod for runtime validation
- Custom query state management (nuqs-inspired, popup-optimized)

**[SHOW: Final file structure overview]**

---

## PART 1: ARCHITECTURAL FOUNDATIONS (0:45-2:00)

**[SCREEN: Project structure in VSCode]**

### The Foundation Strategy

> "Before writing any UI code, I established three core infrastructure layers. This is critical—get these right, and everything else flows naturally."

**Layer 1: Schema Definitions** (`src/lib/settings-schema.ts`)
**Layer 2: Type-Safe Storage** (`src/lib/storage.ts`)
**Layer 3: URL State Management** (`src/lib/query-state.ts`)

**Why This Order Matters:**

**[SHOW: src/lib/settings-schema.ts]**

```typescript
// Commit: f6c8195 - Schema-first approach
export const ToneEnum = z.enum(['analytical', 'humorous', 'inspirational']);
export const ProviderEnum = z.enum(['openai', 'anthropic', 'custom']);

export const SettingsSchema = z.object({
  tone: ToneEnum.default('analytical'),
  generateHashtags: z.boolean().default(false),
  weatherContext: z.boolean().default(false),
  customPrompt: z.string().optional(),
});
```

> "I'm using Zod schemas as the *single source of truth*. These aren't just TypeScript types—they provide runtime validation, default values, and automatic TypeScript inference. One definition, multiple benefits."

**[HIGHLIGHT: `.default()` calls and `z.infer<>` pattern]**

**Key Insight:** 
By defining schemas first, TypeScript automatically infers types, storage utilities know how to validate data, and React components get perfect autocomplete—all from one source.

---

## PART 2: WXT STORAGE API DEEP DIVE (2:00-3:30)

**[SCREEN: src/lib/storage.ts]**

> "Here's where it gets interesting. Chrome's storage API is async, untyped, and easy to mess up. WXT's `storage.defineItem` solves this elegantly."

### Traditional Approach (What We're Avoiding):

```typescript
// ❌ Old way - error-prone, no type safety
const data = await chrome.storage.sync.get('settings');
const settings = data.settings || DEFAULT_SETTINGS; // Hope it's valid!
```

### WXT Storage Pattern:

**[SHOW: Storage definition]**

```typescript
// ✅ New way - declarative, type-safe, with fallbacks
import { storage } from 'wxt/utils/storage';

const settingsStorage = storage.defineItem<Settings>('sync:ae.settings', {
  fallback: DEFAULT_SETTINGS,
});

// Usage is beautiful:
export async function getSettings(): Promise<Settings> {
  const settings = await settingsStorage.getValue();
  return SettingsSchema.parse(settings); // Runtime validation!
}
```

**[HIGHLIGHT: Key advantages]**

**Critical Points:**

1. **Storage Area Prefixes**: `sync:`, `local:`, `session:`
   - `sync:` → Cross-device synchronization (user settings)
   - `local:` → Device-specific data
   - `session:` → Tab-session only

2. **Automatic Fallbacks**: If storage is empty or corrupted, fallback provides safe defaults

3. **Zod Validation Layer**: Every read passes through schema validation
   ```typescript
   // If data is malformed, Zod catches it before it breaks UI
   return SettingsSchema.parse(settings);
   ```

**[DEMO: Show VSCode autocomplete with inferred types]**

### Domain Preferences Pattern:

**[SHOW: src/lib/storage.ts - getDomainPrefs function]**

```typescript
// Per-domain enable/disable mapping
export async function setDomainPref(domain: string, enabled: boolean) {
  const prefs = await getDomainPrefs();
  prefs[domain] = enabled;
  await domainPrefsStorage.setValue(prefs);
}
```

> "This pattern lets users enable the extension on strava.com but disable it on nike.com—granular control stored efficiently as a key-value map."

**[SHOW: Storage keys in Chrome DevTools]**
- `sync:ae.settings`
- `sync:ae.domainPrefs`
- `sync:ae.account`
- `sync:ae.metrics`

---

## PART 3: QUERY STATE MANAGEMENT (3:30-4:30)

**[SCREEN: src/lib/query-state.ts]**

> "Extension popups are isolated environments—no Next.js router, no traditional SPA routing. But we still need URL state for tab persistence and deep linking."

### The Problem:

```typescript
// User selects "Settings" tab → closes popup → reopens
// Tab should still be "Settings", not default back to "Status"
```

### The Solution: Lightweight Query Param Abstraction

**[SHOW: query-state.ts implementation]**

```typescript
export function useQueryParam<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    return (getQueryParam(key) as T) || defaultValue;
  });

  const updateValue = useCallback((newValue: T) => {
    setQueryParam(key, newValue);
    setValue(newValue);
  }, [key]);

  return [value, updateValue];
}
```

**Why Not Use `nuqs`?**
- `nuqs` is optimized for Next.js app router
- Extension popups need simpler, framework-agnostic solution
- Our version: ~50 lines vs. full library dependency

**[DEMO: Show URL updating as tabs change]**

```
popup.html?tab=status    → Status tab active
popup.html?tab=settings  → Settings tab active
popup.html?tab=account   → Account tab active
```

**Advanced Feature: `popstate` Listener**

```typescript
useEffect(() => {
  const unsubscribe = subscribeToQueryParams(() => {
    setValue((getQueryParam(key) as T) || defaultValue);
  });
  return unsubscribe;
}, [key, defaultValue]);
```

> "This enables browser back/forward buttons to work correctly in the popup—a nice UX touch that most extensions miss."

---

## PART 4: REACT COMPONENT ARCHITECTURE (4:30-5:45)

**[SCREEN: src/entrypoints/popup/ directory structure]**

### Component Hierarchy:

```
PopupApp (main.tsx)
├── Header.tsx
└── TabsNavigation.tsx
    ├── StatusTab.tsx
    ├── SettingsTab.tsx
    └── AccountTab.tsx
```

**[SHOW: src/entrypoints/popup/main.tsx]**

### Main App Component:

```typescript
function PopupApp() {
  const { domain, loading, error } = useCurrentDomain();
  const [activeTab, setActiveTab] = useQueryParam('tab', 'status');

  return (
    <div className="w-[380px] min-h-[500px]">
      <Header />
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab}>
        <StatusTab domain={domain} loading={loading} />
        <SettingsTab />
        <AccountTab />
      </TabsNavigation>
    </div>
  );
}
```

**[HIGHLIGHT: Custom hooks and prop drilling]**

### Custom Hook: `useCurrentDomain`

**[SHOW: src/entrypoints/popup/hooks/useCurrentDomain.ts]**

```typescript
export function useCurrentDomain() {
  const [domain, setDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        const url = tabs[0]?.url;
        if (url) setDomain(new URL(url).hostname);
      })
      .finally(() => setLoading(false));
  }, []);

  return { domain, loading, error };
}
```

> "This hook encapsulates the Chrome tabs API call, handles loading states, and provides a clean interface. The popup always knows which domain it's operating on."

**[DEMO: Show popup detecting different domains - strava.com, nike.com, etc.]**

### Placeholder Components (Phase 1 Scope):

**StatusTab.tsx:**
```typescript
export function StatusTab({ domain, loading }: StatusTabProps) {
  if (loading) return <Skeleton />;
  
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">
        Current site: <strong>{domain || 'Unknown'}</strong>
      </p>
      {/* Phase 2: Toggle, stats, CTA */}
    </div>
  );
}
```

> "Phase 1 is about *foundation*. These are intentionally simple placeholders. Phase 2 will add the toggle, enhancement counter, and Pro CTA—but the infrastructure is ready."

---

## PART 5: METRICS & UTILITY HELPERS (5:45-6:30)

**[SCREEN: src/lib/metrics.ts]**

### Enhancement Counter with Auto-Reset:

```typescript
export async function incrementEnhancementCount(): Promise<number> {
  const metrics = await getMetrics();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

  // Auto-reset if new month
  if (metrics.lastResetMonth !== currentMonth) {
    metrics.enhancementCount = 0;
    metrics.lastResetMonth = currentMonth;
  }

  metrics.enhancementCount += 1;
  await saveMetrics(metrics);
  return metrics.enhancementCount;
}
```

**Why This Matters:**
- Free tier: 50 enhancements/month
- Counter automatically resets monthly
- No cron jobs, no backend—pure client logic

**[SHOW: Usage in content script]**

```typescript
// In content.ts - after successful AI enhancement
await incrementEnhancementCount();
const count = await getEnhancementCount();
if (count >= 50) showUpgradePrompt();
```

---

## PART 6: TESTING & VALIDATION (6:30-7:15)

**[SCREEN: Terminal running tests]**

### What's Validated:

**Schema Tests:**
```typescript
// ✅ Valid tone
expect(() => ToneEnum.parse('analytical')).not.toThrow();

// ❌ Invalid tone
expect(() => ToneEnum.parse('sarcastic')).toThrow();
```

**Storage Round-Trip:**
```typescript
const testSettings = { tone: 'humorous', generateHashtags: true };
await saveSettings(testSettings);
const loaded = await getSettings();
expect(loaded).toEqual(testSettings);
```

**Query State:**
```typescript
setQueryParam('tab', 'settings');
expect(window.location.search).toContain('tab=settings');
expect(getQueryParam('tab')).toBe('settings');
```

**Build Validation:**

**[SHOW: Terminal output]**

```bash
$ pnpm compile
✓ TypeScript compilation successful - 0 errors

$ pnpm check  
✓ Biome formatting check passed - 83 files
```

> "Zero TypeScript errors across 83 files. That's the power of schema-first development with proper type inference."

---

## PART 7: ARCHITECTURAL INSIGHTS (7:15-7:45)

**[SCREEN: Architecture diagram overlay]**

### Key Decisions & Trade-offs:

**1. Why WXT Storage API over Raw Chrome API?**
- Type safety with generics
- Declarative fallbacks
- Storage area prefixes prevent key collisions
- Future migration support built-in

**2. Why Separate Schemas from Storage?**
- Schemas are pure logic—testable without mocking storage
- Can be shared with content scripts, background worker
- Single source of truth for data shape

**3. Why Custom Query State vs. Library?**
- `nuqs` is 15kb + Next.js dependency
- Our solution: <2kb, zero dependencies
- Popup-specific optimizations (popstate handling)

**4. Why Placeholder Components?**
- Validates infrastructure before building features
- Easier to debug storage/state issues
- Incremental development prevents scope creep

---

## OUTRO (7:45-8:00)

**[SCREEN: Phase 1 checklist overlay]**

### What We Accomplished:

✅ **Type-safe storage layer** with zod validation  
✅ **WXT Storage API integration** with sync support  
✅ **Custom query state management** for tab persistence  
✅ **React component architecture** with proper separation  
✅ **Domain detection** via Chrome tabs API  
✅ **Metrics tracking** with auto-reset logic  
✅ **Complete testing** infrastructure  

**Lines of Code:** 10,754 additions  
**Files Created:** 83  
**Zero TypeScript Errors:** ✅

### Coming in Phase 2:

- Status tab: Domain toggle + enhancement counter UI
- Pro CTA and subscription status display
- Integration with actual AI enhancement flow

**[SHOW: Phase 2 preview mockup]**

> "This foundation makes everything else possible. Solid architecture upfront means rapid feature development later. If you're building Chrome extensions with React, this pattern will save you weeks of refactoring."

**Resources:**
- GitHub Repo: [Link in description]
- WXT Documentation: https://wxt.dev
- Zod Documentation: https://zod.dev
- Chrome Storage API: https://developer.chrome.com/docs/extensions/reference/storage

**Questions?**
Drop them in the comments! I read every one and often create follow-up videos based on your questions.

**See you in Phase 2!** 🚀

---

## SCREEN RECORDING CHECKLIST

### Must-Record Scenes:

- [ ] **Opening hook**: Extension icon → popup opening → 3-tab interface tour (15 seconds)
- [ ] **File structure walkthrough**: VSCode explorer showing `src/lib/` and `src/entrypoints/popup/`
- [ ] **Schema definitions**: Show `settings-schema.ts` with autocomplete demos
- [ ] **Storage patterns**: Split screen - code vs Chrome DevTools storage inspector
- [ ] **Query state demo**: URL changing as tabs switch, back button working
- [ ] **useCurrentDomain hook**: Live debugging with different websites
- [ ] **Component hierarchy**: Collapsible tree view in VSCode
- [ ] **Metrics counter**: Console logging increment calls
- [ ] **Terminal validation**: `pnpm compile` and `pnpm check` success output
- [ ] **Closing montage**: Fast-paced recap of all files created

### B-ROLL FOOTAGE (15-20 clips):

- Extension loading in Chrome (chrome://extensions)
- Popup opening on different websites (Strava, Nike, generic site)
- Chrome DevTools → Application → Storage → sync storage
- TypeScript errors appearing and being fixed (screen recording)
- Git commit history showing feat: commits
- Biome formatter running and fixing files
- VSCode intellisense autocomplete for Settings type
- React DevTools showing component tree
- Browser back/forward buttons with query params
- Loading skeletons appearing in popup
- Terminal commands with success checkmarks
- Dark/light mode variants of popup (if applicable)
- File creation timestamps in Finder/Explorer
- Package.json showing dependencies
- Cursor/mouse emphasizing important code lines

### GRAPHICS NEEDED:

1. **Architecture Diagram** (0:45 - Part 1):
   ```
   ┌─────────────────────────────────┐
   │   React Components (UI)         │
   ├─────────────────────────────────┤
   │   Query State (URL)             │
   ├─────────────────────────────────┤
   │   Storage Layer (WXT API)       │
   ├─────────────────────────────────┤
   │   Zod Schemas (Validation)      │
   └─────────────────────────────────┘
   ```

2. **Storage Flow Diagram** (2:30 - Part 2):
   ```
   Component → getSettings() → storage.getValue() → Zod.parse() → Type-Safe Data
                                       ↓
                               Chrome sync storage
   ```

3. **Query Param State Machine** (3:45 - Part 3):
   ```
   User Click → setQueryParam → URL Update → popstate → React Re-render
   ```

4. **Component Tree Visual** (4:45 - Part 4):
   - Interactive tree with expand/collapse
   - Show props flowing down

5. **Metrics Auto-Reset Logic** (6:00 - Part 5):
   - Timeline showing month boundaries
   - Counter resetting visual

6. **Phase 1 Completion Checklist** (7:50 - Outro):
   - Animated checkmarks appearing
   - Stats overlay (83 files, 10k lines, 0 errors)

### EDITING MARKERS:

#### Pacing & Cuts:
- **[CUT]** Remove any pauses > 2 seconds
- **[SPEED 1.1x]** Code explanation sections (make slightly faster)
- **[SPEED 0.9x]** Complex concept explanations (give time to absorb)

#### Visual Emphasis:
- **[ZOOM]** Specific code lines when explaining (2-3 second zoom)
- **[HIGHLIGHT]** Important variable names, function signatures (yellow box)
- **[OVERLAY]** Commit hashes when referencing (top-right corner, 3 seconds)
- **[PIP]** Picture-in-picture for terminal output while narrating code

#### Code Highlighting:
- **[SYNTAX HIGHLIGHT]**: 
  - Function names: Blue
  - String literals: Green
  - Type annotations: Purple
  - Comments: Gray

#### Transitions:
- **[TRANSITION: Slide Left]** Between major parts (Part 1 → Part 2)
- **[TRANSITION: Fade]** Between code examples within same part
- **[TRANSITION: Zoom In]** From overview to specific implementation

#### Text Overlays:
- **[TEXT OVERLAY]**: Display key concepts (stay on screen 3-5 seconds)
  - "Type-Safe Storage"
  - "Runtime Validation"
  - "Declarative Fallbacks"
  - "Automatic Type Inference"

#### Code Annotations:
- **[ANNOTATE]**: Draw arrows/circles on screen for:
  - Type inference flow: `z.infer<typeof SettingsSchema>`
  - Storage prefix: `sync:ae.settings`
  - Default values: `.default('analytical')`

#### Sound Design:
- **[SFX: Click]** When demonstrating button clicks
- **[SFX: Success Chime]** When tests pass, compilation succeeds
- **[SFX: Keyboard Typing]** Very subtle background during code sections
- **[MUSIC: Upbeat Tech]** Background music at 15% volume, fade during code explanations

### POST-PRODUCTION POLISH:

#### Title Cards (Insert at Part Boundaries):
```
PART 1: ARCHITECTURAL FOUNDATIONS
00:45 - 02:00
```

#### Lower Thirds (Show During Key Moments):
- File name being discussed (bottom-left)
- Commit hash being referenced (bottom-right)
- Line count statistics (when relevant)

#### Callout Boxes (Overlay Key Points):
```
💡 Pro Tip: Always validate storage reads with Zod
⚠️  Common Mistake: Forgetting storage area prefix
✅ Best Practice: Schema-first development
```

#### End Screen Elements (Last 10 seconds):
- Subscribe button (animated)
- Next video suggestion: "Phase 2: Status Tab Implementation"
- Playlist: "Building Chrome Extensions"
- GitHub repository link card

---

## SCRIPT PRODUCTION METADATA

**Estimated Recording Time:** 2-3 hours (with multiple takes)  
**Estimated Editing Time:** 8-10 hours  
**Total Footage Needed:** ~45 minutes raw → cut to 7-8 minutes  

**Recording Setup:**
- Screen Resolution: 1920x1080 (scale UI to 125% for readability)
- Font Size: VSCode 16-18pt
- Terminal Font: 14-16pt
- Browser Zoom: 125%

**Microphone Setup:**
- Remove mouth clicks/pops in post
- Normalize audio to -3dB
- Add slight compression for consistency

**Thumbnail Concepts:**
1. Split screen: Code vs. Extension UI
2. "Phase 1 ✅" with file count overlay
3. WXT + React + Zod logos with "Type-Safe Storage"

**SEO Optimization:**
- Title: "Building a Chrome Extension Popup (Phase 1): Type-Safe Storage & React Architecture"
- Tags: chrome extension, wxt, react, typescript, zod, storage api, popup ui, extension development
- Description: Include timestamps for each major section

---

## REVISION NOTES

**Version:** 1.0 (Draft)  
**Last Updated:** 2025-10-12  
**Review Status:** Pending technical review  

**Feedback Integration:**
- [ ] Technical accuracy review by senior dev
- [ ] Pacing review (ensure 7-8 min target)
- [ ] Accessibility review (caption-friendly pacing)
- [ ] Beginner-friendliness check (jargon explanation)

**Future Improvements:**
- Add interactive code playground links
- Create companion blog post
- Prepare GitHub branch for Phase 1 checkpoint
