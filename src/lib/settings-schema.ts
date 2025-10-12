import { z } from "zod/v3";

/**
 * Tone options for AI enhancements
 */
export const ToneEnum = z.enum(["analytical", "humorous", "inspirational"]);
export type Tone = z.infer<typeof ToneEnum>;

/**
 * Provider options for BYOK (Bring Your Own Key)
 */
export const ProviderEnum = z.enum(["openai", "anthropic", "gemini", "custom"]);
export type Provider = z.infer<typeof ProviderEnum>;

/**
 * General settings schema
 */
export const SettingsSchema = z.object({
	tone: ToneEnum.default("inspirational"),
	generateHashtags: z.boolean().default(false),
	// Pro features (gated in UI)
	includeWeather: z.boolean().default(false),
});
export type Settings = z.infer<typeof SettingsSchema>;

/**
 * Advanced BYOK settings schema
 */
export const AdvancedSchema = z.object({
	provider: ProviderEnum.optional(),
	endpoint: z.string().url().optional().or(z.literal("")),
	apiKey: z.string().optional(),
});
export type AdvancedSettings = z.infer<typeof AdvancedSchema>;

/**
 * Domain preferences schema (per-domain enable/disable)
 * Map of domain -> boolean
 */
export const DomainPrefsSchema = z.record(z.string(), z.boolean());
export type DomainPrefs = z.infer<typeof DomainPrefsSchema>;

/**
 * Account schema
 */
export const AccountSchema = z.object({
	pro: z.boolean().default(false),
	userName: z.string().optional(),
	email: z.string().email().optional(),
	planName: z.string().optional(),
	nextBillingDate: z.string().optional(),
});
export type Account = z.infer<typeof AccountSchema>;

/**
 * Metrics schema
 */
export const MetricsSchema = z.object({
	monthlyEnhancementCount: z.number().default(0),
	lastResetDate: z.string().optional(),
});
export type Metrics = z.infer<typeof MetricsSchema>;

/**
 * Default values
 */
export const DEFAULT_SETTINGS: Settings = {
	tone: "inspirational",
	generateHashtags: false,
	includeWeather: false,
};

export const DEFAULT_ADVANCED: AdvancedSettings = {
	provider: undefined,
	endpoint: "",
	apiKey: "",
};

export const DEFAULT_ACCOUNT: Account = {
	pro: false,
};

export const DEFAULT_METRICS: Metrics = {
	monthlyEnhancementCount: 0,
};
