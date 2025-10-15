/**
 * Type definitions for site adapters
 *
 * Each adapter implements site-specific DOM selectors and field operations
 * for activity enhancement on different fitness platforms
 */

/**
 * Page type detection for dual-page support
 */
export type PageType = "details" | "edit" | "unknown";

export interface SiteAdapter {
	/** Unique identifier for the adapter */
	id: string;

	/** Display name for the adapter */
	name: string;

	/**
	 * Check if this adapter matches the current location
	 * @param location - The window.location object
	 * @returns true if this adapter should be used for the current page
	 */
	match(location: Location): boolean;

	/**
	 * Detect the type of page (details, edit, or unknown)
	 * @param location - The window.location object
	 * @returns The page type
	 */
	detectPageType(location: Location): PageType;

	/**
	 * Locate the root element where the enhance button should be anchored
	 * @param doc - The document object
	 * @returns The anchor element or null if not found
	 */
	locateTitleRoot(doc: Document): HTMLElement | null;

	/**
	 * Get the current activity title from the page
	 * @param doc - The document object
	 * @returns The current title or null if not found
	 */
	getTitle(doc: Document): string | null;

	/**
	 * Set the activity title on the page
	 * @param doc - The document object
	 * @param value - The new title value
	 */
	setTitle(doc: Document, value: string): void;

	/**
	 * Get the current activity description from the page
	 * @param doc - The document object
	 * @returns The current description or null if not found
	 */
	getDescription(doc: Document): string | null;

	/**
	 * Set the activity description on the page
	 * @param doc - The document object
	 * @param value - The new description value
	 */
	setDescription(doc: Document, value: string): void;

	/**
	 * Optional method to extract activity stats (distance, time, elevation, sport, date)
	 * @param doc - The document object
	 * @returns Partial activity data with stats, or undefined if not available
	 */
	getStats?(
		doc: Document,
	): Partial<
		Pick<ActivityData, "distance" | "time" | "sport" | "elevationGain" | "date">
	>;

	/**
	 * Extract comprehensive data from details page (15+ fields)
	 * @param doc - The document object
	 * @returns Extended activity data with all available fields
	 */
	extractDetailsPageData?(doc: Document): ExtendedActivityData;

	/**
	 * Locate the edit button on details page
	 * @param doc - The document object
	 * @returns The edit button element or null if not found
	 */
	locateEditButton?(doc: Document): HTMLElement | null;

	/**
	 * Locate the title input field on edit page
	 * @param doc - The document object
	 * @returns The title input element or null if not found
	 */
	locateTitleField?(doc: Document): HTMLInputElement | null;

	/**
	 * Locate the description textarea/field on edit page
	 * @param doc - The document object
	 * @returns The description element or null if not found
	 */
	locateDescriptionField?(
		doc: Document,
	): HTMLTextAreaElement | HTMLElement | null;

	/**
	 * Optional callback when DOM is ready (site-specific readiness hook)
	 * @param cb - Callback to invoke when DOM is ready
	 */
	onDomReady?(cb: () => void): void;

	/**
	 * Optional filter for MutationObserver to refine which nodes to process
	 * @param node - The mutated node
	 * @returns true if this node should be processed
	 */
	mutationFilter?(node: Node): boolean;
}

/**
 * Activity data structure
 */
export interface ActivityData {
	/** Activity title */
	title: string;
	/** Activity description */
	description: string;
	/** Activity distance (e.g., "20.01 km", "5.5 mi") */
	distance?: string;
	/** Activity time/duration (e.g., "2h 6m", "45m 30s") */
	time?: string;
	/** Activity type/sport (e.g., "Run", "Ride", "Swim") */
	sport?: string;
	/** Elevation gain (e.g., "102 m", "335 ft") */
	elevationGain?: string;
	/** Activity date (e.g., "Oct 12, 2025") */
	date?: string;
}

/**
 * Extended activity data with comprehensive fields from details page (15+ fields)
 */
export interface ExtendedActivityData extends ActivityData {
	/** Athlete name */
	athleteName?: string;
	/** Activity type (e.g., "Run", "Ride") */
	activityType?: string;
	/** Workout type (e.g., "Race", "Long Run") */
	workoutType?: string;
	/** Time display format (human-readable) */
	timeDisplay?: string;
	/** Time in ISO format */
	timeISO?: string;
	/** Location of activity */
	location?: string;
	/** Moving time (excludes pauses) */
	movingTime?: string;
	/** Elapsed time (includes pauses) */
	elapsedTime?: string;
	/** Calories burned */
	calories?: string;
	/** Average pace */
	averagePace?: string;
	/** Average heart rate */
	averageHeartRate?: string;
	/** Average cadence */
	averageCadence?: string;
	/** Temperature during activity */
	temperature?: string;
	/** Humidity level */
	humidity?: string;
	/** Wind conditions */
	wind?: string;
}

/**
 * Enhanced activity response from LLM
 */
export interface EnhancedActivity {
	/** Enhanced title (optional - fallback to original if missing) */
	title?: string;
	/** Enhanced description (optional - fallback to original if missing) */
	description?: string;
}
