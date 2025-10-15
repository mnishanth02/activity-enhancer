/**
 * Content script for activity enhancement
 *
 * Dual-page support: Handles both details page (data extraction + navigation)
 * and edit page (preview + insert/discard) for supported platforms.
 */

import { findAdapter } from "@/lib/adapters";
import type { SiteAdapter } from "@/lib/adapters/types";
import {
	handleDetailsPage,
	handleEditPage,
	setupNavigationWatcher,
} from "@/lib/inject";
import { isDomainEnabled } from "@/lib/storage";

// WXT will automatically configure this as a content script based on file location
export default defineContentScript({
	// Match supported domains
	matches: ["*://www.strava.com/*", "*://connect.garmin.com/*"],

	// Run at document_end to ensure DOM is ready
	runAt: "document_end",

	async main() {
		// Initialize enhancement
		await initialize();

		// Setup navigation watcher for SPA changes
		setupNavigationWatcher(() => {
			initialize();
		});
	},
});

/**
 * Initialize the enhancement system with page type detection
 */
async function initialize(): Promise<void> {
	// Find matching adapter
	const adapter = findAdapter(window.location);

	if (!adapter) {
		return;
	}

	// Check if domain is enabled
	const enabled = await isDomainEnabled(window.location.host);
	if (!enabled) {
		return;
	}

	// Use adapter's DOM ready hook if available
	if (adapter.onDomReady) {
		adapter.onDomReady(() => {
			initializePage(adapter);
		});
	} else {
		// Default: initialize immediately
		initializePage(adapter);
	}
}

/**
 * Initialize page based on detected page type
 * @param adapter - The site adapter to use
 */
async function initializePage(adapter: SiteAdapter): Promise<void> {
	const pageType = adapter.detectPageType(window.location);

	switch (pageType) {
		case "details":
			// Details page: inject AI Enhance button
			await handleDetailsPage(adapter);
			break;
		case "edit":
			// Edit page: show enhancement preview if available
			await handleEditPage(adapter);
			break;
		default:
			// Unknown page type, do nothing
			break;
	}
}
