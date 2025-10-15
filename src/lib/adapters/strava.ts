/**
 * Strava activity edit page adapter
 *
 * This adapter provides DOM selectors and field operations for Strava's
 * activity edit/detail pages where users can modify titles and descriptions.
 *
 * Strava DOM selectors are tested and verified for current site layout.
 * Test and update selectors as needed when running on live pages.
 */

import type { ExtendedActivityData, PageType, SiteAdapter } from "./types";

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
		// For details page: inject button next to activity header
		// XPath: //*[@id="heading"]/header/h2
		const detailsHeader = doc.querySelector<HTMLElement>("#heading header h2");
		if (detailsHeader) {
			return detailsHeader;
		}

		// For edit page: Strava's "Edit Activity" header is in: div.header > div.container > div.media.media-middle
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
		date?: string;
	}> {
		const stats: Partial<{
			distance?: string;
			time?: string;
			sport?: string;
			elevationGain?: string;
			date?: string;
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

			if (label === "date") {
				stats.date = value;
			} else if (label === "distance") {
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

	detectPageType(location: Location): PageType {
		if (location.host !== "www.strava.com") return "unknown";

		const path = location.pathname;

		// /activities/[id]/edit
		if (/^\/activities\/\d+\/edit$/.test(path)) return "edit";

		// /activities/[id]
		if (/^\/activities\/\d+$/.test(path)) return "details";

		return "unknown";
	},

	extractDetailsPageData(doc: Document): ExtendedActivityData {
		// Helper to safely extract text by XPath
		const getByXPath = (xpath: string): string => {
			const result = doc.evaluate(
				xpath,
				doc,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null,
			);
			const node = result.singleNodeValue;
			return node?.textContent?.trim() || "";
		};

		// Extract athlete name, activity type, workout type
		const headerText = getByXPath('//*[@id="heading"]/header/h2/span');
		const parts = headerText.split("-").map((s) => s.trim());
		const athleteName = parts[0] || "";
		const activityType = parts[1] || "";
		const workoutType = parts[2] || "";

		return {
			title: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/h1'),
			description: getByXPath(
				'//*[@id="heading"]/div/div/div[1]/div/div/div[1]/div/div/p',
			),
			athleteName,
			activityType,
			workoutType,
			timeDisplay: getByXPath(
				'//*[@id="heading"]/div/div/div[1]/div/div/div[2]/div/div[1]/div/div/p',
			),
			timeISO: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/time'),
			location: getByXPath('//*[@id="heading"]/div/div/div[1]/div/div/span'),
			distance: getByXPath('//*[@id="heading"]/div/div/div[2]/ul/li[1]/strong'),
			movingTime: getByXPath(
				'//*[@id="heading"]/div/div/div[2]/ul/li[2]/strong',
			),
			elevationGain: getByXPath(
				'//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[2]/strong',
			),
			elapsedTime: getByXPath(
				'//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong',
			),
			calories: getByXPath(
				'//*[@id="heading"]/div/div/div[2]/div[1]/div[1]/div[4]/strong',
			),
			averagePace: getByXPath(
				'//*[@id="heading"]/div/div/div[2]/ul/li[3]/strong',
			),
			averageHeartRate: getByXPath(
				'//*[@id="chart-controls"]/table/tbody/tr[2]/td[3]',
			),
			averageCadence: getByXPath(
				'//*[@id="chart-controls"]/table/tbody/tr[2]/td[4]',
			),
			temperature: getByXPath(
				'//*[@id="chart-controls"]/table/tbody/tr[2]/td[5]',
			),
			humidity: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[6]'),
			wind: getByXPath('//*[@id="chart-controls"]/table/tbody/tr[2]/td[7]'),
		};
	},

	locateEditButton(doc: Document): HTMLElement | null {
		// XPath: /html/body/div[1]/div[3]/nav/div/a
		const result = doc.evaluate(
			"/html/body/div[1]/div[3]/nav/div/a",
			doc,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null,
		);
		return result.singleNodeValue as HTMLElement | null;
	},

	locateTitleField(doc: Document): HTMLInputElement | null {
		// XPath: //*[@id="activity_name"]
		return doc.getElementById("activity_name") as HTMLInputElement | null;
	},

	locateDescriptionField(
		doc: Document,
	): HTMLTextAreaElement | HTMLElement | null {
		// XPath: //*[@id="edit-activity"]/div[1]/div/div[1]/div[1]/div[1]/div/div/div/textarea
		const container = doc.getElementById("edit-activity");
		if (!container) return null;

		const textarea = container.querySelector<HTMLTextAreaElement>(
			"div > div > div:first-child > div:first-child > div:first-child > div > div > div > textarea",
		);

		return textarea;
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
