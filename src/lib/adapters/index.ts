/**
 * Site adapter registry
 *
 * Central registry of all supported site adapters for activity enhancement.
 * Add new adapters here as more platforms are supported.
 */

import { garminAdapter } from "./garmin";
import { stravaAdapter } from "./strava";
import type { SiteAdapter } from "./types";

/**
 * Array of all registered site adapters
 * Order matters: first match wins
 */
export const siteAdapters: SiteAdapter[] = [stravaAdapter, garminAdapter];

/**
 * Find the appropriate adapter for the current location
 * @param location - The window.location object
 * @returns The matching adapter or null if no match
 */
export function findAdapter(location: Location): SiteAdapter | null {
	return siteAdapters.find((adapter) => adapter.match(location)) || null;
}

/**
 * Check if the current location is supported by any adapter
 * @param location - The window.location object
 * @returns true if any adapter matches
 */
export function isSupportedSite(location: Location): boolean {
	return siteAdapters.some((adapter) => adapter.match(location));
}

// Export individual adapters for testing
export { stravaAdapter, garminAdapter };
