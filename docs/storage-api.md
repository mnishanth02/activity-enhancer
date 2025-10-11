# Storage API Documentation

## Overview

The Activity Enhancer uses WXT's `storage.defineItem` API for type-safe, cross-device synchronized storage. All storage operations are validated with Zod schemas and provide sensible fallback defaults.

## Storage Areas

WXT requires all storage keys to be prefixed with a storage area:

- `sync:` - Synchronized across devices (Chrome sync, Firefox sync)
- `local:` - Local to the device only
- `session:` - Session-scoped (cleared when browser closes)
- `managed:` - Managed by enterprise policies (read-only)

**Activity Enhancer uses `sync:` for all user preferences** to enable cross-device synchronization.

## Storage Items

### Settings (`sync:ae.settings`)

General user preferences.

```typescript
interface Settings {
  tone: 'analytical' | 'humorous' | 'inspirational';
  generateHashtags: boolean;
  includeWeather: boolean; // Pro feature
}
```

**Usage:**
```typescript
import { getSettings, saveSettings } from '@/lib/storage';

const settings = await getSettings();
await saveSettings({
  tone: 'humorous',
  generateHashtags: true,
  includeWeather: false,
});
```

### Advanced Settings (`sync:ae.advanced`)

BYOK (Bring Your Own Key) configuration.

```typescript
interface AdvancedSettings {
  provider?: 'openai' | 'anthropic' | 'gemini' | 'custom';
  endpoint?: string; // Optional custom endpoint
  apiKey?: string;   // User's API key (stored encrypted by browser)
}
```

**Usage:**
```typescript
import { getAdvancedSettings, saveAdvancedSettings } from '@/lib/storage';

const advanced = await getAdvancedSettings();
await saveAdvancedSettings({
  provider: 'openai',
  endpoint: '',
  apiKey: 'sk-...',
});
```

⚠️ **Security Note**: API keys are stored in browser sync storage, which is encrypted at rest by the browser but accessible to extension code. Always advise users to use limited-scope API keys.

### Domain Preferences (`sync:ae.domainPrefs`)

Per-domain enable/disable toggles.

```typescript
type DomainPrefs = Record<string, boolean>;
// Example: { 'strava.com': true, 'runkeeper.com': false }
```

**Usage:**
```typescript
import { getDomainPrefs, setDomainPref } from '@/lib/storage';

// Get all preferences
const prefs = await getDomainPrefs();

// Enable for a specific domain
await setDomainPref('strava.com', true);

// Disable for a specific domain
await setDomainPref('runkeeper.com', false);

// Check if enabled
const isEnabled = prefs['strava.com'] ?? true; // Default to true
```

### Account (`sync:ae.account`)

User account and subscription information.

```typescript
interface Account {
  pro: boolean;
  userName?: string;
  email?: string;
  planName?: string;
  nextBillingDate?: string;
}
```

**Usage:**
```typescript
import { getAccount, saveAccount } from '@/lib/storage';

const account = await getAccount();
if (account.pro) {
  // Show pro features
}

await saveAccount({
  pro: true,
  userName: 'John Doe',
  email: 'john@example.com',
  planName: 'Pro Annual',
  nextBillingDate: '2026-01-15',
});
```

### Metrics (`sync:ae.metrics`)

Usage tracking and analytics.

```typescript
interface Metrics {
  monthlyEnhancementCount: number;
  lastResetDate?: string; // Format: 'YYYY-MM'
}
```

**Usage:**
```typescript
import { incrementEnhancementCount, getEnhancementCount } from '@/lib/metrics';

// Increment count (auto-resets monthly)
await incrementEnhancementCount();

// Get current month's count
const count = await getEnhancementCount();
```

## Implementation Details

### Storage Definition

Each storage item is defined using `storage.defineItem`:

```typescript
import { storage } from 'wxt/utils/storage';

const settingsStorage = storage.defineItem<Settings>('sync:ae.settings', {
  fallback: DEFAULT_SETTINGS,
});
```

### Type Safety

All storage operations are type-safe:

```typescript
// ✅ TypeScript validates the type
await settingsStorage.setValue({
  tone: 'humorous',
  generateHashtags: true,
  includeWeather: false,
});

// ❌ TypeScript error - invalid tone
await settingsStorage.setValue({
  tone: 'silly', // Error: Type '"silly"' is not assignable to type 'Tone'
});
```

### Schema Validation

In addition to TypeScript types, all data is validated with Zod schemas:

```typescript
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const validated = SettingsSchema.parse(settings); // Zod validation
    await settingsStorage.setValue(validated);
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}
```

### Fallback Values

When a storage item doesn't exist or is corrupted, the fallback value is returned:

```typescript
const settingsStorage = storage.defineItem<Settings>('sync:ae.settings', {
  fallback: {
    tone: 'inspirational',
    generateHashtags: false,
    includeWeather: false,
  },
});

// First time - returns fallback
const settings = await settingsStorage.getValue();
// { tone: 'inspirational', generateHashtags: false, includeWeather: false }
```

## Best Practices

### 1. Always Use Helper Functions

Don't access storage items directly. Use the exported helper functions:

```typescript
// ❌ Don't do this
import { storage } from 'wxt/utils/storage';
const settings = await storage.getItem('sync:ae.settings');

// ✅ Do this
import { getSettings } from '@/lib/storage';
const settings = await getSettings();
```

### 2. Handle Errors Gracefully

Storage operations can fail. Always provide fallbacks:

```typescript
export async function getSettings(): Promise<Settings> {
  try {
    const data = await settingsStorage.getValue();
    if (!data) return DEFAULT_SETTINGS;

    const parsed = SettingsSchema.safeParse(data);
    return parsed.success ? parsed.data : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS; // Safe fallback
  }
}
```

### 3. Validate Before Saving

Always validate data with Zod before writing to storage:

```typescript
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    const validated = SettingsSchema.parse(settings); // ✅ Validate first
    await settingsStorage.setValue(validated);
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error; // Propagate validation errors
  }
}
```

### 4. Use Type Parameters

Specify types explicitly for better IDE support:

```typescript
const settings = await storage.getItem<Settings>('sync:ae.settings');
```

## Storage Limits

Chrome sync storage has the following limits:

- **Total storage**: 100 KB (102,400 bytes)
- **Items**: 512 max items
- **Item size**: 8 KB (8,192 bytes) per item
- **Write operations**: 120 per minute (2 per second sustained)

**Tips:**
- Keep settings minimal and focused
- Avoid storing large blobs or images
- Use local storage for large, device-specific data
- Debounce rapid writes to avoid quota errors

## Migration (Future)

WXT storage API supports versioning and migrations. When schemas change:

```typescript
const settingsStorage = storage.defineItem<Settings>('sync:ae.settings', {
  fallback: DEFAULT_SETTINGS,
  version: 2,
  migrations: {
    2: (oldData: SettingsV1): Settings => {
      // Transform v1 data to v2 format
      return {
        ...oldData,
        newField: 'default value',
      };
    },
  },
});
```

This is not currently implemented but planned for future use.

## References

- [WXT Storage Documentation](https://wxt.dev/storage.html)
- [WXT Storage API Reference](https://wxt.dev/api/reference/wxt/utils/storage/interfaces/wxtstorage)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
