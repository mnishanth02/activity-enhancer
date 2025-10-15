/**
 * Session storage utilities for cross-page state management
 * Uses browser.storage.session (MV3) with automatic expiry
 */

import { storage } from "wxt/utils/storage";
import type { ExtendedActivityData } from "@/lib/adapters/types";

const SESSION_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Pending enhancement data structure for cross-page navigation
 */
export interface PendingEnhancement {
	/** Activity ID extracted from URL */
	activityId: string;
	/** Comprehensive data extracted from details page */
	extractedData: ExtendedActivityData;
	/** Original title before enhancement */
	originalTitle: string;
	/** Original description before enhancement */
	originalDescription: string;
	/** Enhanced title from LLM (populated after API call) */
	enhancedTitle?: string;
	/** Enhanced description from LLM (populated after API call) */
	enhancedDescription?: string;
	/** Timestamp when data was saved (for expiry check) */
	timestamp: number;
}

// Define session storage item
const pendingEnhancementStorage = storage.defineItem<PendingEnhancement | null>(
	"session:ae.pendingEnhancement",
	{ fallback: null },
);

/**
 * Save pending enhancement data to session storage
 * @param data - Pending enhancement data
 */
export async function savePendingEnhancement(
	data: PendingEnhancement,
): Promise<void> {
	await pendingEnhancementStorage.setValue({ ...data, timestamp: Date.now() });
}

/**
 * Get pending enhancement data from session storage
 * Returns null if data doesn't exist or has expired
 * @returns Pending enhancement data or null
 */
export async function getPendingEnhancement(): Promise<PendingEnhancement | null> {
	const data = await pendingEnhancementStorage.getValue();

	if (!data) return null;

	// Check expiry
	const age = Date.now() - data.timestamp;
	if (age > SESSION_EXPIRY_MS) {
		await clearPendingEnhancement();
		return null;
	}

	return data;
}

/**
 * Update existing pending enhancement data with partial updates
 * @param updates - Partial pending enhancement data to merge
 */
export async function updatePendingEnhancement(
	updates: Partial<PendingEnhancement>,
): Promise<void> {
	const current = await getPendingEnhancement();
	if (!current) return;

	await pendingEnhancementStorage.setValue({ ...current, ...updates });
}

/**
 * Clear pending enhancement data from session storage
 */
export async function clearPendingEnhancement(): Promise<void> {
	await pendingEnhancementStorage.setValue(null);
}
