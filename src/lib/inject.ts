/**
 * Injection manager for activity enhancement
 *
 * Handles dual-page workflow:
 * - Details page: Extract data, trigger LLM, navigate to edit
 * - Edit page: Show preview, allow insert/discard
 */

import type { ExtendedActivityData, SiteAdapter } from "@/lib/adapters/types";
import {
	DOM_ATTRIBUTES,
	ENHANCEMENT_DEBOUNCE_MS,
	MAX_WAIT_FOR_ENHANCED_DATA_MS,
	NAVIGATION_CHECK_INTERVAL,
} from "@/lib/constants";
import { enhanceActivity } from "@/lib/llm";
import { incrementEnhancementCount } from "@/lib/metrics";
import { buildEnhancedPrompt, parseEnhancedActivity } from "@/lib/prompt";
import {
	clearPendingEnhancement,
	getPendingEnhancement,
	type PendingEnhancement,
	savePendingEnhancement,
	updatePendingEnhancement,
} from "@/lib/session";
import { getAdvancedSettings, getSettings } from "@/lib/storage";
import {
	createEnhanceButton,
	createEnhancementPreviewPanel,
	createErrorPanel,
	createResetButton,
	removePreviewPanel,
	resetButton,
	setButtonError,
	setButtonLoading,
	showToast,
} from "@/lib/ui/components";

/**
 * Handle details page: inject AI Enhance button
 */
export async function handleDetailsPage(adapter: SiteAdapter): Promise<void> {
	// Check if button already exists
	const existing = document.querySelector(`[${DOM_ATTRIBUTES.ENHANCE_BUTTON}]`);
	if (existing) return;

	// Locate button anchor (next to title)
	const anchor = adapter.locateTitleRoot(document);
	if (!anchor) {
		console.warn("Cannot inject enhance button: anchor not found");
		return;
	}

	// Create button with details page handler
	const button = createEnhanceButton(() => handleDetailsPageEnhance(adapter));

	// Inject button (same positioning logic as before)
	const h1 = anchor.querySelector("h1");
	if (h1) {
		h1.insertAdjacentElement("afterend", button);
	} else {
		anchor.appendChild(button);
	}
}

/**
 * Handle details page enhancement flow
 */
let detailsEnhanceInProgress = false;
let lastDetailsEnhanceTime = 0;

async function handleDetailsPageEnhance(adapter: SiteAdapter): Promise<void> {
	// Debounce rapid clicks
	const now = Date.now();
	if (now - lastDetailsEnhanceTime < ENHANCEMENT_DEBOUNCE_MS) {
		return;
	}
	lastDetailsEnhanceTime = now;

	// Prevent concurrent enhancements
	if (detailsEnhanceInProgress) {
		return;
	}

	const button = document.querySelector<HTMLButtonElement>(
		`[${DOM_ATTRIBUTES.ENHANCE_BUTTON}]`,
	);
	if (!button) return;

	detailsEnhanceInProgress = true;
	setButtonLoading(button);

	try {
		// 1. Extract comprehensive data
		if (!adapter.extractDetailsPageData) {
			throw new Error("Adapter does not support details page extraction");
		}

		const extractedData = adapter.extractDetailsPageData(document);

		// 2. Save to session storage
		const activityId = extractActivityId(window.location);
		await savePendingEnhancement({
			activityId,
			extractedData,
			originalTitle: extractedData.title,
			originalDescription: extractedData.description,
			timestamp: Date.now(),
		});

		// 3. Trigger LLM call (async, non-blocking)
		void triggerEnhancementAPI(extractedData);

		// 4. Navigate to edit page
		const editButton = adapter.locateEditButton?.(document);
		if (!editButton) {
			throw new Error("Edit button not found");
		}

		// Click edit button programmatically
		editButton.click();
	} catch (error) {
		console.error("Details page enhancement error:", error);
		setButtonError(button);

		// Show error panel
		const errorPanel = createErrorPanel(
			error instanceof Error ? error.message : "Enhancement failed",
			() => {
				removePreviewPanel(errorPanel);
				resetButton(button);
				detailsEnhanceInProgress = false;
				handleDetailsPageEnhance(adapter);
			},
			() => {
				removePreviewPanel(errorPanel);
				resetButton(button);
				detailsEnhanceInProgress = false;
			},
		);

		document.body.appendChild(errorPanel);
		detailsEnhanceInProgress = false;
	}
}

/**
 * Handle edit page: show enhanced content preview
 */
export async function handleEditPage(adapter: SiteAdapter): Promise<void> {
	// Check for pending enhancement in session storage
	const pending = await getPendingEnhancement();
	if (!pending) return;

	// Wait for enhanced data (LLM might still be processing)
	try {
		await waitForEnhancedData(pending);
	} catch (error) {
		console.warn("Enhanced data not ready:", error);
		return;
	}

	// Show preview panels above actual fields
	showEnhancementPreview(adapter, pending);
}

/**
 * Show enhancement preview on edit page
 */
function showEnhancementPreview(
	adapter: SiteAdapter,
	pending: PendingEnhancement,
): void {
	if (!pending.enhancedTitle || !pending.enhancedDescription) {
		console.warn("Enhanced data not available yet");
		return;
	}

	// Locate title and description fields
	const titleField = adapter.locateTitleField?.(document);
	const descField = adapter.locateDescriptionField?.(document);

	if (!titleField || !descField) {
		console.warn("Cannot show preview: fields not found");
		return;
	}

	// Create title preview
	const titlePreview = createEnhancementPreviewPanel(
		"title",
		pending.enhancedTitle,
		() => applyEnhancement("title", pending, adapter),
		() => discardEnhancement("title"),
	);

	// Create description preview
	const descPreview = createEnhancementPreviewPanel(
		"description",
		pending.enhancedDescription,
		() => applyEnhancement("description", pending, adapter),
		() => discardEnhancement("description"),
	);

	// Insert above actual fields - better positioning using labels as insertion points
	// Insert after label but before field for cleaner layout

	// Title: Insert after title label
	const titleLabel = document.querySelector('label[for="activity_name"]');
	if (titleLabel?.nextSibling) {
		titleLabel.parentElement?.insertBefore(
			titlePreview,
			titleLabel.nextSibling,
		);
	} else {
		// Fallback: insert before the field itself
		titleField.parentElement?.insertBefore(titlePreview, titleField);
	}

	// Description: Insert after description label
	const descLabel = document.querySelector('label[for="activity_description"]');
	if (descLabel?.nextSibling) {
		descLabel.parentElement?.insertBefore(descPreview, descLabel.nextSibling);
	} else {
		// Fallback: insert before the description field
		descField.parentElement?.insertBefore(descPreview, descField);
	}

	// Create reset button (initially hidden)
	const resetBtn = createResetButton(async () => {
		// Restore original values
		adapter.setTitle(document, pending.originalTitle);
		adapter.setDescription(document, pending.originalDescription);

		// Clear session storage
		await clearPendingEnhancement();

		// Remove all preview UI
		titlePreview.remove();
		descPreview.remove();
		resetBtn.remove();

		// Show success toast
		showToast("Reset to original values", "success");
	});

	// Insert reset button after description field
	descField.parentElement?.appendChild(resetBtn);
}

/**
 * Apply enhancement to actual field
 */
async function applyEnhancement(
	field: "title" | "description",
	pending: PendingEnhancement,
	adapter: SiteAdapter,
): Promise<void> {
	const value =
		field === "title" ? pending.enhancedTitle : pending.enhancedDescription;
	if (!value) return;

	// Apply to actual field
	if (field === "title") {
		adapter.setTitle(document, value);
	} else {
		adapter.setDescription(document, value);
	}

	// Update preview UI state to "Applied"
	const preview = document.querySelector(
		`[data-ae-preview-field="${field}"]`,
	) as HTMLElement;
	if (preview) {
		const applyButton = preview.querySelector<HTMLButtonElement>(
			'[data-action="apply"]',
		);
		if (applyButton) {
			applyButton.textContent = "Applied ✓";
			applyButton.disabled = true;
			applyButton.style.opacity = "0.6";
		}
	}

	// Show reset button
	const resetButton = document.querySelector<HTMLButtonElement>(
		`[${DOM_ATTRIBUTES.RESET_BUTTON}]`,
	);
	if (resetButton) {
		resetButton.style.display = "block";
	}

	showToast(
		`${field === "title" ? "Title" : "Description"} applied`,
		"success",
	);
}

/**
 * Discard enhancement preview
 */
async function discardEnhancement(
	field: "title" | "description",
): Promise<void> {
	const preview = document.querySelector(`[data-ae-preview-field="${field}"]`);
	if (preview) {
		preview.remove();
	}

	// If both previews are discarded, clear session storage
	const remainingPreviews = document.querySelectorAll(
		"[data-ae-preview-field]",
	);
	if (remainingPreviews.length === 0) {
		await clearPendingEnhancement();
	}

	showToast(`${field === "title" ? "Title" : "Description"} discarded`, "info");
}

/**
 * Wait for enhanced data from LLM
 */
async function waitForEnhancedData(
	_pending: PendingEnhancement,
	maxWaitMs: number = MAX_WAIT_FOR_ENHANCED_DATA_MS,
): Promise<void> {
	const startTime = Date.now();

	while (Date.now() - startTime < maxWaitMs) {
		const updated = await getPendingEnhancement();

		if (updated?.enhancedTitle && updated?.enhancedDescription) {
			return; // Data is ready
		}

		// Wait 500ms before checking again
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	throw new Error("Timeout waiting for enhanced data");
}

/**
 * Trigger LLM API call in background
 */
async function triggerEnhancementAPI(
	data: ExtendedActivityData,
): Promise<void> {
	try {
		const settings = await getSettings();
		const advancedSettings = await getAdvancedSettings();

		// Build enhanced prompt with all extracted data
		const prompt = buildEnhancedPrompt({ activity: data, settings });

		// Call LLM
		const result = await enhanceActivity(prompt, advancedSettings);

		if (!result.success) {
			throw new Error(result.error || "Enhancement failed");
		}

		// Parse response
		const enhanced = parseEnhancedActivity(JSON.stringify(result), {
			title: data.title,
			description: data.description,
		});

		// Update session storage with enhanced data
		await updatePendingEnhancement({
			enhancedTitle: enhanced.title,
			enhancedDescription: enhanced.description,
		});

		// Increment metrics
		await incrementEnhancementCount();
	} catch (error) {
		console.error("LLM enhancement error:", error);

		// Update session storage with error flag
		await updatePendingEnhancement({
			enhancedTitle: undefined,
			enhancedDescription: undefined,
		});
	}
}

/**
 * Extract activity ID from URL
 */
function extractActivityId(location: Location): string {
	const match = location.pathname.match(/\/activities\/(\d+)/);
	return match?.[1] || "";
}

/**
 * Setup navigation watcher for SPA route changes
 * @param onNavigate - Callback when navigation is detected
 * @returns Cleanup function
 */
export function setupNavigationWatcher(onNavigate: () => void): () => void {
	let lastUrl = window.location.href;

	// Polling interval
	const intervalId = setInterval(() => {
		const currentUrl = window.location.href;
		if (currentUrl !== lastUrl) {
			lastUrl = currentUrl;
			onNavigate();
		}
	}, NAVIGATION_CHECK_INTERVAL);

	// Also listen to popstate
	window.addEventListener("popstate", onNavigate);

	// Cleanup function
	return () => {
		clearInterval(intervalId);
		window.removeEventListener("popstate", onNavigate);
	};
}

/**
 * Setup MutationObserver for dynamic content changes
 * @param adapter - The site adapter
 * @param callback - Callback when relevant mutations occur
 * @returns MutationObserver instance
 */
export function setupMutationObserver(
	adapter: SiteAdapter,
	callback: () => void,
): MutationObserver {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				// Use adapter's mutation filter if available
				if (adapter.mutationFilter && !adapter.mutationFilter(node)) {
					continue;
				}

				// Relevant mutation detected
				callback();
				return;
			}
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	return observer;
}
