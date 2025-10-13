/**
 * Type definitions for site adapters
 *
 * Each adapter implements site-specific DOM selectors and field operations
 * for activity enhancement on different fitness platforms
 */

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
 * Enhanced activity response from LLM
 */
export interface EnhancedActivity {
	/** Enhanced title (optional - fallback to original if missing) */
	title?: string;
	/** Enhanced description (optional - fallback to original if missing) */
	description?: string;
}
