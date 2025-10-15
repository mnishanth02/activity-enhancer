/**
 * Shared constants for the Activity Enhancer extension
 * Centralized to avoid drift and maintain consistency across modules
 */

// DOM attribute flags for idempotency
export const DOM_ATTRIBUTES = {
	/** Marks an element as containing the enhancement button */
	ENHANCE_BUTTON: "data-ae-enhance-btn",
	/** Marks a container as processed to avoid reprocessing */
	PROCESSED: "data-ae-processed",
	/** Marks the preview panel container */
	PREVIEW_PANEL: "data-ae-preview",
	/** Marks the enhancement preview panel on edit page */
	ENHANCEMENT_PREVIEW: "data-ae-enhancement-preview",
	/** Marks the reset button on edit page */
	RESET_BUTTON: "data-ae-reset-btn",
} as const;

// CSS class names for injected elements
export const CSS_CLASSES = {
	/** Main enhancement button class */
	ENHANCE_BUTTON: "ae-enhance-btn",
	/** Preview panel container */
	PREVIEW_PANEL: "ae-preview-panel",
	/** Enhancement preview panel on edit page */
	ENHANCEMENT_PREVIEW: "ae-enhancement-preview",
	/** Loading state indicator */
	LOADING: "ae-loading",
	/** Error state indicator */
	ERROR: "ae-error",
} as const;

// Enhancement states
export const ENHANCEMENT_STATES = {
	IDLE: "idle",
	COLLECTING: "collecting",
	REQUESTING: "requesting",
	PREVIEW: "preview",
	ERROR: "error",
	APPLYING: "applying",
	DONE: "done",
} as const;

export type EnhancementState =
	(typeof ENHANCEMENT_STATES)[keyof typeof ENHANCEMENT_STATES];

// Supported domains
export const SUPPORTED_DOMAINS = {
	STRAVA: "www.strava.com",
	GARMIN: "connect.garmin.com",
} as const;

// Content length limits (as per prompt contract)
export const CONTENT_LIMITS = {
	TITLE_MAX: 60,
	DESCRIPTION_MAX: 280,
	HASHTAGS_MIN: 3,
	HASHTAGS_MAX: 5,
} as const;

// Navigation detection interval (ms)
export const NAVIGATION_CHECK_INTERVAL = 500;

// Debounce delay for enhancement button clicks (ms)
export const ENHANCEMENT_DEBOUNCE_MS = 500;

// Maximum wait time for enhanced data from LLM (ms)
export const MAX_WAIT_FOR_ENHANCED_DATA_MS = 30000;
