/**
 * Injection manager for activity enhancement
 *
 * Handles DOM injection, MutationObserver setup, and navigation detection
 * to ensure the enhance button appears exactly once and persists across
 * SPA navigation changes.
 */

import type { SiteAdapter } from "@/lib/adapters/types";
import {
	DOM_ATTRIBUTES,
	ENHANCEMENT_DEBOUNCE_MS,
	NAVIGATION_CHECK_INTERVAL,
} from "@/lib/constants";
import { enhanceActivity } from "@/lib/llm";
import { incrementEnhancementCount } from "@/lib/metrics";
import { buildPrompt, parseEnhancedActivity } from "@/lib/prompt";
import { collectActivity, isValidActivityData } from "@/lib/scrape";
import { getAdvancedSettings, getSettings } from "@/lib/storage";
import {
	createEnhanceButton,
	createErrorPanel,
	createPreviewPanel,
	removePreviewPanel,
	resetButton,
	setButtonError,
	setButtonLoading,
} from "@/lib/ui/components";

/**
 * Ensure the enhance button is injected on the page
 * @param adapter - The site adapter to use
 * @param doc - The document object
 */
export function ensureInjected(
	adapter: SiteAdapter,
	doc: Document = document,
): void {
	// Check if button already exists
	const existing = doc.querySelector(`[${DOM_ATTRIBUTES.ENHANCE_BUTTON}]`);
	if (existing) {
		return;
	}

	// Locate the anchor element
	const anchor = adapter.locateTitleRoot(doc);
	if (!anchor) {
		console.warn("Cannot inject enhance button: anchor element not found");
		return;
	}

	// Create and inject the button
	const button = createEnhanceButton(() => handleEnhance(adapter, button, doc));

	// For Strava: anchor is div.media-middle which has h1 on left, Save button on right
	// Insert our button in the middle (after h1, before Save button)
	const h1 = anchor.querySelector("h1");
	if (h1) {
		// Insert after h1 but make it appear in the same line
		h1.insertAdjacentElement("afterend", button);
	} else {
		// Fallback: append to anchor
		anchor.appendChild(button);
	}
}

/**
 * Handle enhancement flow
 * @param adapter - The site adapter
 * @param button - The enhance button element
 * @param doc - The document object
 */
let enhanceInProgress = false;
let lastEnhanceTime = 0;

async function handleEnhance(
	adapter: SiteAdapter,
	button: HTMLButtonElement,
	doc: Document,
): Promise<void> {
	// Debounce rapid clicks
	const now = Date.now();
	if (now - lastEnhanceTime < ENHANCEMENT_DEBOUNCE_MS) {
		return;
	}
	lastEnhanceTime = now;

	// Prevent concurrent enhancements
	if (enhanceInProgress) {
		return;
	}

	enhanceInProgress = true;
	setButtonLoading(button);

	try {
		// 1. Collect activity data
		const originalData = collectActivity(adapter, doc);

		if (!isValidActivityData(originalData)) {
			throw new Error("No activity data found to enhance");
		}

		// 2. Build prompt
		const settings = await getSettings();
		const prompt = buildPrompt({ activity: originalData, settings });
		// 3. Call LLM
		const advancedSettings = await getAdvancedSettings();
		const result = await enhanceActivity(prompt, advancedSettings);

		if (!result.success) {
			throw new Error(result.error || "Enhancement failed");
		}

		// 4. Parse and validate response
		const enhancedData = parseEnhancedActivity(
			JSON.stringify(result),
			originalData,
		);

		// 5. Show preview panel
		showPreviewPanel(originalData, enhancedData, adapter, button, doc);
	} catch (error) {
		console.error("Enhancement error:", error);
		setButtonError(button);

		// Check if it's an extension context error
		let errorMessage = "Enhancement failed. Please try again.";
		if (
			error instanceof Error &&
			error.message.includes("Extension context invalidated")
		) {
			errorMessage =
				"Extension was updated. Please reload this page to continue.";
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		// Show error panel
		const errorPanel = createErrorPanel(
			errorMessage,
			() => {
				removePreviewPanel(errorPanel);
				resetButton(button);
				enhanceInProgress = false;
				// Don't retry if extension context is invalidated
				if (!errorMessage.includes("reload this page")) {
					handleEnhance(adapter, button, doc);
				}
			},
			() => {
				removePreviewPanel(errorPanel);
				resetButton(button);
				enhanceInProgress = false;
			},
		);
	}
}

/**
 * Show the preview panel
 */
function showPreviewPanel(
	original: { title: string; description: string },
	enhanced: { title: string; description: string },
	adapter: SiteAdapter,
	button: HTMLButtonElement,
	doc: Document,
): void {
	const panel = createPreviewPanel(
		original,
		enhanced,
		() => {
			// Accept: Apply changes to DOM
			try {
				adapter.setTitle(doc, enhanced.title);
				adapter.setDescription(doc, enhanced.description);

				// Increment metrics
				incrementEnhancementCount();

				// Cleanup
				removePreviewPanel(panel);
				resetButton(button);
				enhanceInProgress = false;
			} catch (error) {
				console.error("Failed to apply enhancement:", error);
				alert("Failed to apply changes. Please try again.");
				removePreviewPanel(panel);
				resetButton(button);
				enhanceInProgress = false;
			}
		},
		() => {
			// Cancel: Close panel without changes
			removePreviewPanel(panel);
			resetButton(button);
			enhanceInProgress = false;
		},
	);
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
