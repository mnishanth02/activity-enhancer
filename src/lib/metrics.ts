import { getMetrics, saveMetrics } from "./storage";

/**
 * Increment the monthly enhancement count
 * Called from content script when an enhancement is accepted
 */
export async function incrementEnhancementCount(): Promise<void> {
	try {
		const metrics = await getMetrics();
		const now = new Date();
		const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

		// Check if we need to reset the counter (new month)
		if (metrics.lastResetDate !== currentMonth) {
			metrics.monthlyEnhancementCount = 1;
			metrics.lastResetDate = currentMonth;
		} else {
			metrics.monthlyEnhancementCount += 1;
		}

		await saveMetrics(metrics);
	} catch (error) {
		console.error("Failed to increment enhancement count:", error);
	}
}

/**
 * Get the current monthly enhancement count
 */
export async function getEnhancementCount(): Promise<number> {
	try {
		const metrics = await getMetrics();
		const now = new Date();
		const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

		// If we're in a new month, return 0
		if (metrics.lastResetDate !== currentMonth) {
			return 0;
		}

		return metrics.monthlyEnhancementCount;
	} catch (error) {
		console.error("Failed to get enhancement count:", error);
		return 0;
	}
}
