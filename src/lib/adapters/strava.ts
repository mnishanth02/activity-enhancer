/**
 * Strava activity edit page adapter
 *
 * This adapter provides DOM selectors and field operations for Strava's
 * activity edit/detail pages where users can modify titles and descriptions.
 *
 * NOTE: Selectors may need adjustment based on actual Strava DOM structure.
 * Test and update selectors as needed when running on live pages.
 */

import type { SiteAdapter } from "./types";

export const stravaAdapter: SiteAdapter = {
	id: "strava",
	name: "Strava",

	match(location: Location): boolean {
		// Match www.strava.com on activity edit pages
		// Typical patterns: /activities/<id>/edit or /activities/<id>
		return (
			location.host === "www.strava.com" &&
			/^\/activities\/\d+(\/edit)?$/.test(location.pathname)
		);
	},

	locateTitleRoot(doc: Document): HTMLElement | null {
		// Strava's "Edit Activity" header is in: div.header > div.container > div.media.media-middle
		// We want to inject the button in this header area
		const headerContainer = doc.querySelector<HTMLElement>(
			"div.header div.media.media-middle",
		);
		if (headerContainer) {
			return headerContainer;
		}

		// Fallback: Form container
		const formContainer = doc.querySelector<HTMLElement>(
			"form#edit-activity, form.edit_activity",
		);
		return formContainer;
	},

	getTitle(doc: Document): string | null {
		// Strava uses: <input id="activity_name" name="activity[name]" value="..." />
		const titleInput = doc.querySelector<HTMLInputElement>(
			'#activity_name, input[name="activity[name]"]',
		);

		return titleInput?.value?.trim() || null;
	},

	setTitle(doc: Document, value: string): void {
		// Strava uses: <input id="activity_name" name="activity[name]" />
		const titleInput = doc.querySelector<HTMLInputElement>(
			'#activity_name, input[name="activity[name]"]',
		);

		if (titleInput) {
			titleInput.value = value;
			// Trigger change events to ensure Strava's JS picks up the change
			titleInput.dispatchEvent(new Event("input", { bubbles: true }));
			titleInput.dispatchEvent(new Event("change", { bubbles: true }));
		}
	},

	getDescription(doc: Document): string | null {
		// Strava uses a React component for description: ActivityDescriptionEdit
		// The component renders into: div.description[data-react-class="ActivityDescriptionEdit"]
		// It creates a contenteditable div or textarea inside

		// Try to find the actual input element within the React component
		const descContainer = doc.querySelector<HTMLElement>(
			'div.description[data-react-class="ActivityDescriptionEdit"]',
		);

		if (descContainer) {
			// Look for textarea or contenteditable within the React component
			const textarea =
				descContainer.querySelector<HTMLTextAreaElement>("textarea");
			if (textarea) {
				return textarea.value?.trim() || null;
			}

			const contentEditable = descContainer.querySelector<HTMLElement>(
				'[contenteditable="true"]',
			);
			if (contentEditable) {
				return contentEditable.textContent?.trim() || null;
			}
		}

		// Fallback: Try direct textarea selector
		const directTextarea = doc.querySelector<HTMLTextAreaElement>(
			'textarea[name="activity[description]"], #activity_description',
		);
		return directTextarea?.value?.trim() || null;
	},

	setDescription(doc: Document, value: string): void {
		// Strava uses a React component for description
		const descContainer = doc.querySelector<HTMLElement>(
			'div.description[data-react-class="ActivityDescriptionEdit"]',
		);

		if (descContainer) {
			// Try to find textarea within React component
			const textarea =
				descContainer.querySelector<HTMLTextAreaElement>("textarea");
			if (textarea) {
				textarea.value = value;
				textarea.dispatchEvent(new Event("input", { bubbles: true }));
				textarea.dispatchEvent(new Event("change", { bubbles: true }));
				return;
			}

			// Try contenteditable div
			const contentEditable = descContainer.querySelector<HTMLElement>(
				'[contenteditable="true"]',
			);
			if (contentEditable) {
				contentEditable.textContent = value;
				contentEditable.dispatchEvent(new Event("input", { bubbles: true }));
				contentEditable.dispatchEvent(new Event("change", { bubbles: true }));
				return;
			}
		}

		// Fallback: Try direct textarea
		const directTextarea = doc.querySelector<HTMLTextAreaElement>(
			'textarea[name="activity[description]"], #activity_description',
		);
		if (directTextarea) {
			directTextarea.value = value;
			directTextarea.dispatchEvent(new Event("input", { bubbles: true }));
			directTextarea.dispatchEvent(new Event("change", { bubbles: true }));
		}
	},

	getStats(doc: Document): Partial<{
		distance?: string;
		time?: string;
		sport?: string;
		elevationGain?: string;
	}> {
		const stats: Partial<{
			distance?: string;
			time?: string;
			sport?: string;
			elevationGain?: string;
		}> = {};

		// Stats are in a table.table with rows: Date, Distance, Time, Elevation Gain
		const table = doc.querySelector("table.table");
		if (!table) return stats;

		// Find rows by matching the first <td> text content
		const rows = table.querySelectorAll("tr");

		for (const row of rows) {
			const cells = row.querySelectorAll("td");
			if (cells.length < 2) continue;

			const label = cells[0]?.textContent?.trim().toLowerCase();
			const valueCell = cells[1];

			if (!label || !valueCell) continue;

			// Extract the value (including the <abbr> unit tags)
			const value = valueCell.textContent?.trim();

			if (label === "distance") {
				stats.distance = value;
			} else if (label === "time") {
				stats.time = value;
			} else if (label === "elevation gain") {
				stats.elevationGain = value;
			}
		}

		// Try to get sport/activity type from the page title or metadata
		// Title format: "Morning Run | Run | Strava"
		const pageTitle = doc.title;
		const titleParts = pageTitle.split("|").map((s) => s.trim());
		if (titleParts.length >= 2) {
			stats.sport = titleParts[1]; // Second part is typically the sport type
		}

		return stats;
	},

	onDomReady(cb: () => void): void {
		// Strava is a SPA, so wait for elements to be rendered
		if (document.readyState === "complete") {
			setTimeout(cb, 100); // Small delay to ensure React has rendered
		} else {
			window.addEventListener("load", () => {
				setTimeout(cb, 100);
			});
		}
	},

	mutationFilter(node: Node): boolean {
		// Only process element nodes
		if (node.nodeType !== Node.ELEMENT_NODE) {
			return false;
		}

		const element = node as Element;

		// Look for form elements or main content containers
		return (
			element.tagName === "FORM" ||
			element.tagName === "MAIN" ||
			element.classList?.contains("activity") ||
			element.classList?.contains("edit") ||
			element.querySelector?.('input[name="title"]') !== null
		);
	},
};
