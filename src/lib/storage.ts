import { storage } from "wxt/utils/storage";
import {
	type Account,
	AccountSchema,
	AdvancedSchema,
	type AdvancedSettings,
	DEFAULT_ACCOUNT,
	DEFAULT_ADVANCED,
	DEFAULT_METRICS,
	DEFAULT_SETTINGS,
	type DomainPrefs,
	DomainPrefsSchema,
	type Metrics,
	MetricsSchema,
	type Settings,
	SettingsSchema,
} from "./settings-schema";

/**
 * Define storage items using WXT's storage API
 * Format: 'area:key' where area is local, sync, session, or managed
 * Using sync storage for cross-device synchronization
 */
const settingsStorage = storage.defineItem<Settings>("sync:ae.settings", {
	fallback: DEFAULT_SETTINGS,
});

const advancedStorage = storage.defineItem<AdvancedSettings>(
	"sync:ae.advanced",
	{
		fallback: DEFAULT_ADVANCED,
	},
);

const domainPrefsStorage = storage.defineItem<DomainPrefs>(
	"sync:ae.domainPrefs",
	{
		fallback: {},
	},
);

const accountStorage = storage.defineItem<Account>("sync:ae.account", {
	fallback: DEFAULT_ACCOUNT,
});

const metricsStorage = storage.defineItem<Metrics>("sync:ae.metrics", {
	fallback: DEFAULT_METRICS,
});

/**
 * Check if error is due to extension context invalidation
 */
function isExtensionContextInvalidated(error: unknown): boolean {
	return (
		error instanceof Error &&
		(error.message.includes("Extension context invalidated") ||
			error.message.includes("context invalidated"))
	);
}

/**
 * Get settings from storage with schema validation
 */
export async function getSettings(): Promise<Settings> {
	try {
		const data = await settingsStorage.getValue();
		if (!data) return DEFAULT_SETTINGS;

		const parsed = SettingsSchema.safeParse(data);
		return parsed.success ? parsed.data : DEFAULT_SETTINGS;
	} catch (error) {
		if (isExtensionContextInvalidated(error)) {
			// Show user-friendly message for extension context errors
			if (typeof window !== "undefined") {
				setTimeout(() => {
					alert(
						"Extension was updated. Please reload this page to continue using AI Enhancement features.",
					);
				}, 1000);
			}
		}
		return DEFAULT_SETTINGS;
	}
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: Settings): Promise<void> {
	try {
		const validated = SettingsSchema.parse(settings);
		await settingsStorage.setValue(validated);
	} catch (error) {
		console.error("Failed to save settings:", error);
		throw error;
	}
}

/**
 * Get advanced settings from storage
 */
export async function getAdvancedSettings(): Promise<AdvancedSettings> {
	try {
		const data = await advancedStorage.getValue();
		if (!data) return DEFAULT_ADVANCED;

		const parsed = AdvancedSchema.safeParse(data);
		return parsed.success ? parsed.data : DEFAULT_ADVANCED;
	} catch {
		return DEFAULT_ADVANCED;
	}
}

/**
 * Save advanced settings to storage
 */
export async function saveAdvancedSettings(
	settings: AdvancedSettings,
): Promise<void> {
	try {
		const validated = AdvancedSchema.parse(settings);
		await advancedStorage.setValue(validated);
	} catch (error) {
		console.error("Failed to save advanced settings:", error);
		throw error;
	}
}

/**
 * Get domain preferences from storage
 */
export async function getDomainPrefs(): Promise<DomainPrefs> {
	try {
		const data = await domainPrefsStorage.getValue();
		if (!data) return {};

		const parsed = DomainPrefsSchema.safeParse(data);
		return parsed.success ? parsed.data : {};
	} catch {
		return {};
	}
}

/**
 * Set preference for a specific domain
 */
export async function setDomainPref(
	domain: string,
	enabled: boolean,
): Promise<void> {
	try {
		const prefs = await getDomainPrefs();
		prefs[domain] = enabled;
		await domainPrefsStorage.setValue(prefs);
	} catch (error) {
		console.error("Failed to save domain preference:", error);
		throw error;
	}
}

/**
 * Get account information from storage
 */
export async function getAccount(): Promise<Account> {
	try {
		const data = await accountStorage.getValue();
		if (!data) return DEFAULT_ACCOUNT;

		const parsed = AccountSchema.safeParse(data);
		return parsed.success ? parsed.data : DEFAULT_ACCOUNT;
	} catch {
		return DEFAULT_ACCOUNT;
	}
}

/**
 * Save account information to storage
 */
export async function saveAccount(account: Account): Promise<void> {
	try {
		const validated = AccountSchema.parse(account);
		await accountStorage.setValue(validated);
	} catch (error) {
		console.error("Failed to save account:", error);
		throw error;
	}
}

/**
 * Get metrics from storage
 */
export async function getMetrics(): Promise<Metrics> {
	try {
		const data = await metricsStorage.getValue();
		if (!data) return DEFAULT_METRICS;

		const parsed = MetricsSchema.safeParse(data);
		return parsed.success ? parsed.data : DEFAULT_METRICS;
	} catch {
		return DEFAULT_METRICS;
	}
}

/**
 * Save metrics to storage
 */
export async function saveMetrics(metrics: Metrics): Promise<void> {
	try {
		const validated = MetricsSchema.parse(metrics);
		await metricsStorage.setValue(validated);
	} catch (error) {
		console.error("Failed to save metrics:", error);
		throw error;
	}
}

/**
 * Check if enhancement is enabled for a specific domain
 * @param domain - The domain to check (e.g., "www.strava.com")
 * @returns true if enabled or not set (default), false if explicitly disabled
 */
export async function isDomainEnabled(domain: string): Promise<boolean> {
	try {
		const prefs = await getDomainPrefs();
		// Default to enabled if not explicitly set
		return prefs[domain] !== false;
	} catch {
		// Default to enabled on error
		return true;
	}
}
