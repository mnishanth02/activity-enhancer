/**
 * Scraping utilities for activity data collection
 *
 * Pure functions for extracting and sanitizing activity data from DOM
 * using site-specific adapters.
 */

import type { ActivityData, SiteAdapter } from "@/lib/adapters/types";

/**
 * Collect activity data from the current page using the provided adapter
 * @param adapter - The site adapter to use for data extraction
 * @param doc - The document object (defaults to window.document)
 * @returns ActivityData object with title, description, and optional stats
 */
export function collectActivity(
	adapter: SiteAdapter,
	doc: Document = document,
): ActivityData {
	const rawTitle = adapter.getTitle(doc) || "";
	const rawDescription = adapter.getDescription(doc) || "";

	// Collect basic data
	const data: ActivityData = {
		title: sanitize(rawTitle),
		description: sanitize(rawDescription),
	};

	// Try to get stats if the adapter supports it
	if (adapter.getStats) {
		const stats = adapter.getStats(doc);
		if (stats.distance) data.distance = sanitize(stats.distance);
		if (stats.time) data.time = sanitize(stats.time);
		if (stats.sport) data.sport = sanitize(stats.sport);
		if (stats.elevationGain) data.elevationGain = sanitize(stats.elevationGain);
		if (stats.date) data.date = sanitize(stats.date);
	}

	return data;
}

/**
 * Sanitize text by normalizing whitespace and trimming
 * @param text - The text to sanitize
 * @returns Sanitized text with normalized whitespace
 */
export function sanitize(text: string): string {
	return text
		.replace(/\s+/g, " ") // Normalize multiple spaces/newlines to single space
		.trim(); // Remove leading/trailing whitespace
}

/**
 * Truncate text at word boundary to fit within max length
 * @param text - The text to truncate
 * @param maxLength - Maximum allowed length
 * @returns Truncated text at word boundary
 */
export function truncateAtWordBoundary(
	text: string,
	maxLength: number,
): string {
	if (text.length <= maxLength) {
		return text;
	}

	// Find the last space before maxLength
	let truncated = text.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");

	// If we found a space, truncate there; otherwise use the full maxLength
	if (lastSpace > 0) {
		truncated = truncated.slice(0, lastSpace);
	}

	return truncated.trim();
}

/**
 * Validate that activity data is suitable for enhancement
 * @param data - The activity data to validate
 * @returns true if data has at least a title or description
 */
export function isValidActivityData(data: ActivityData): boolean {
	return data.title.length > 0 || data.description.length > 0;
}
