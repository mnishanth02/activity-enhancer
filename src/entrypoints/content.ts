/**
 * Content script for activity enhancement
 *
 * Injects enhancement button into supported activity edit pages
 * (Strava, Garmin) and handles the enhancement flow.
 */

import { findAdapter } from "@/lib/adapters";
import { ensureInjected, setupNavigationWatcher } from "@/lib/inject";
import { isDomainEnabled } from "@/lib/storage";

// WXT will automatically configure this as a content script based on file location
export default defineContentScript({
	// Match supported domains
	matches: ["*://www.strava.com/*", "*://connect.garmin.com/*"],

	// Run at document_end to ensure DOM is ready
	runAt: "document_end",

	async main() {
		if (import.meta.env.DEV) {
			console.log("🚀 Activity Enhancer content script loaded");
		}

		// Initialize enhancement
		await initialize();

		// Setup navigation watcher for SPA changes
		setupNavigationWatcher(() => {
			initialize();
		});
	},
});

/**
 * Initialize the enhancement system
 */
async function initialize(): Promise<void> {
	// Find matching adapter
	const adapter = findAdapter(window.location);

	if (!adapter) {
		if (import.meta.env.DEV) {
			console.log("ℹ️ No adapter found for:", window.location.href);
		}
		return;
	}

	// Check if domain is enabled
	const enabled = await isDomainEnabled(window.location.host);
	if (!enabled) {
		if (import.meta.env.DEV) {
			console.log("⏸️ Enhancement disabled for:", window.location.host);
		}
		return;
	}

	if (import.meta.env.DEV) {
		console.log("✅ Adapter matched:", adapter.name);
	}

	// Use adapter's DOM ready hook if available
	if (adapter.onDomReady) {
		adapter.onDomReady(() => {
			ensureInjected(adapter);
		});
	} else {
		// Default: inject immediately
		ensureInjected(adapter);
	}
}
