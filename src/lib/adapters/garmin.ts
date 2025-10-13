/**
 * Garmin Connect activity edit page adapter
 * 
 * This adapter provides DOM selectors and field operations for Garmin Connect's
 * activity edit/detail pages where users can modify titles and descriptions.
 * 
 * NOTE: Selectors may need adjustment based on actual Garmin DOM structure.
 * Test and update selectors as needed when running on live pages.
 */

import type { SiteAdapter } from "./types";

export const garminAdapter: SiteAdapter = {
	id: "garmin",
	name: "Garmin Connect",

	match(location: Location): boolean {
		// Match connect.garmin.com on activity pages
		// Typical patterns: /modern/activity/<id>
		return (
			location.host === "connect.garmin.com" &&
			/^\/modern\/activity\/\d+/.test(location.pathname)
		);
	},

	locateTitleRoot(doc: Document): HTMLElement | null {
		// Look for the title/description container
		// Garmin typically has an activity details section

		// Try 1: Activity details container
		const detailsContainer = doc.querySelector<HTMLElement>(
			'[class*="activity-details"], [class*="activityDetails"]',
		);
		if (detailsContainer) {
			return detailsContainer;
		}

		// Try 2: Title input parent
		const titleInput = doc.querySelector<HTMLElement>(
			'input[class*="title"], [class*="activityName"] input',
		);
		if (titleInput?.parentElement) {
			return titleInput.parentElement;
		}

		// Try 3: Main content area
		const mainContent = doc.querySelector<HTMLElement>(
			'main, [role="main"], .main-content, #main',
		);
		return mainContent;
	},

	getTitle(doc: Document): string | null {
		// Try multiple selector patterns for the title field
		const titleInput = doc.querySelector<HTMLInputElement>(
			'input[class*="activityName"], input[class*="activity-name"], input[class*="title"]',
		);

		if (titleInput) {
			return titleInput.value || null;
		}

		// Fallback: look for h1/h2 with activity name
		const heading = doc.querySelector<HTMLElement>(
			'h1[class*="activity"], h2[class*="activity"], .activity-name',
		);
		return heading?.textContent?.trim() || null;
	},

	setTitle(doc: Document, value: string): void {
		const titleInput = doc.querySelector<HTMLInputElement>(
			'input[class*="activityName"], input[class*="activity-name"], input[class*="title"]',
		);

		if (titleInput) {
			titleInput.value = value;
			// Trigger change events for Garmin's framework
			titleInput.dispatchEvent(new Event("input", { bubbles: true }));
			titleInput.dispatchEvent(new Event("change", { bubbles: true }));
			titleInput.dispatchEvent(new Event("blur", { bubbles: true }));
		}
	},

	getDescription(doc: Document): string | null {
		// Try multiple selector patterns for description
		const descInput = doc.querySelector<HTMLTextAreaElement>(
			'textarea[class*="description"], textarea[class*="notes"], [class*="activityDescription"] textarea',
		);

		return descInput?.value?.trim() || null;
	},

	setDescription(doc: Document, value: string): void {
		const descInput = doc.querySelector<HTMLTextAreaElement>(
			'textarea[class*="description"], textarea[class*="notes"], [class*="activityDescription"] textarea',
		);

		if (descInput) {
			descInput.value = value;
			// Trigger change events
			descInput.dispatchEvent(new Event("input", { bubbles: true }));
			descInput.dispatchEvent(new Event("change", { bubbles: true }));
			descInput.dispatchEvent(new Event("blur", { bubbles: true }));
		}
	},

	onDomReady(cb: () => void): void {
		// Garmin Connect is a SPA with React/Angular, wait for rendering
		if (document.readyState === "complete") {
			setTimeout(cb, 200); // Slightly longer delay for Garmin's heavier app
		} else {
			window.addEventListener("load", () => {
				setTimeout(cb, 200);
			});
		}
	},

	mutationFilter(node: Node): boolean {
		// Only process element nodes
		if (node.nodeType !== Node.ELEMENT_NODE) {
			return false;
		}

		const element = node as Element;

		// Look for activity-related containers
		return (
			element.tagName === "MAIN" ||
			element.classList?.toString().includes("activity") ||
			element.classList?.toString().includes("details") ||
			element.querySelector?.(
				'input[class*="activityName"], textarea[class*="description"]',
			) !== null
		);
	},
};
