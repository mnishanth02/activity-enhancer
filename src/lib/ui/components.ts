/**
 * UI component builders for activity enhancement
 *
 * Creates DOM elements for the enhance button and preview panel.
 * These are vanilla JavaScript elements injected into content scripts.
 */

import { CSS_CLASSES, DOM_ATTRIBUTES } from "@/lib/constants";

/**
 * Extended HTMLDivElement with backdrop reference
 */
interface PanelWithBackdrop extends HTMLDivElement {
	_backdrop?: HTMLDivElement;
}

/**
 * Create the ✨ Enhance button
 * @param onClick - Click handler for the button
 * @returns HTMLButtonElement
 */
export function createEnhanceButton(onClick: () => void): HTMLButtonElement {
	const button = document.createElement("button");
	button.className = CSS_CLASSES.ENHANCE_BUTTON;
	button.setAttribute(DOM_ATTRIBUTES.ENHANCE_BUTTON, "1");
	button.setAttribute("aria-label", "AI Enhance Title and Description");
	button.setAttribute("title", "AI Enhance Title and Description");
	button.setAttribute("type", "button");
	button.setAttribute("tabindex", "0");

	// Create button content with icon and text
	const icon = document.createElement("span");
	icon.textContent = "✨";
	icon.style.marginRight = "6px";

	const text = document.createElement("span");
	text.textContent = "AI Enhance";

	button.appendChild(icon);
	button.appendChild(text);

	// Strava-style button styling
	Object.assign(button.style, {
		display: "inline-flex",
		alignItems: "center",
		padding: "10px 16px",
		border: "2px solid #fc5200",
		borderRadius: "4px",
		background: "white",
		cursor: "pointer",
		fontSize: "14px",
		fontWeight: "600",
		color: "#fc5200",
		marginLeft: "12px",
		transition: "all 0.2s ease",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		lineHeight: "1",
		whiteSpace: "nowrap",
	});

	// Click handler
	button.addEventListener("click", onClick);

	// Keyboard activation (Enter/Space)
	button.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick();
		}
	});

	// Hover effects - match Strava's primary button style
	button.addEventListener("mouseenter", () => {
		button.style.background = "#fc5200";
		button.style.color = "white";
		button.style.transform = "translateY(-1px)";
		button.style.boxShadow = "0 2px 8px rgba(252, 82, 0, 0.3)";
	});

	button.addEventListener("mouseleave", () => {
		button.style.background = "white";
		button.style.color = "#fc5200";
		button.style.transform = "translateY(0)";
		button.style.boxShadow = "none";
	});

	return button;
}

/**
 * Set button to loading state
 * @param button - The enhance button element
 */
export function setButtonLoading(button: HTMLButtonElement): void {
	button.disabled = true;
	const icon = button.querySelector("span:first-child");
	const text = button.querySelector("span:last-child");
	if (icon) icon.textContent = "⏳";
	if (text) text.textContent = "Enhancing...";
	button.style.opacity = "0.6";
	button.style.cursor = "not-allowed";
}

/**
 * Set button to error state
 * @param button - The enhance button element
 */
export function setButtonError(button: HTMLButtonElement): void {
	button.disabled = false;
	const icon = button.querySelector("span:first-child");
	const text = button.querySelector("span:last-child");
	if (icon) icon.textContent = "⚠️";
	if (text) text.textContent = "Retry";
	button.style.borderColor = "#dc2626";
	button.style.color = "#dc2626";
	button.style.opacity = "1";
	button.style.cursor = "pointer";
}

/**
 * Reset button to idle state
 * @param button - The enhance button element
 */
export function resetButton(button: HTMLButtonElement): void {
	button.disabled = false;
	const icon = button.querySelector("span:first-child");
	const text = button.querySelector("span:last-child");
	if (icon) icon.textContent = "✨";
	if (text) text.textContent = "AI Enhance";
	button.style.opacity = "1";
	button.style.borderColor = "#fc5200";
	button.style.color = "#fc5200";
	button.style.cursor = "pointer";
}

/**
 * Create the preview panel for enhanced content
 * @param original - Original title and description
 * @param enhanced - Enhanced title and description
 * @param onAccept - Accept handler
 * @param onCancel - Cancel handler
 * @returns HTMLDivElement
 */
export function createPreviewPanel(
	original: { title: string; description: string },
	enhanced: { title: string; description: string },
	onAccept: () => void,
	onCancel: () => void,
): HTMLDivElement {
	const panel = document.createElement("div");
	panel.className = CSS_CLASSES.PREVIEW_PANEL;
	panel.setAttribute(DOM_ATTRIBUTES.PREVIEW_PANEL, "1");
	panel.setAttribute("role", "dialog");
	panel.setAttribute("aria-label", "Enhanced Activity Preview");

	// Panel styles
	Object.assign(panel.style, {
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		background: "white",
		border: "2px solid #fc5200",
		borderRadius: "12px",
		padding: "24px",
		maxWidth: "600px",
		width: "90%",
		maxHeight: "80vh",
		overflow: "auto",
		boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
		zIndex: "10000",
		fontFamily: "system-ui, -apple-system, sans-serif",
	});

	// Header
	const header = document.createElement("h3");
	header.textContent = "✨ Enhanced Activity";
	header.style.margin = "0 0 20px 0";
	header.style.fontSize = "20px";
	header.style.fontWeight = "bold";
	header.style.color = "#fc5200";
	panel.appendChild(header);

	// Enhanced Title
	const titleSection = createFieldSection(
		"Title",
		original.title,
		enhanced.title,
	);
	panel.appendChild(titleSection);

	// Enhanced Description
	const descSection = createFieldSection(
		"Description",
		original.description,
		enhanced.description,
	);
	panel.appendChild(descSection);

	// Button container
	const buttonContainer = document.createElement("div");
	buttonContainer.style.display = "flex";
	buttonContainer.style.gap = "12px";
	buttonContainer.style.marginTop = "24px";
	buttonContainer.style.justifyContent = "flex-end";

	// Cancel button
	const cancelBtn = document.createElement("button");
	cancelBtn.textContent = "Cancel";
	cancelBtn.setAttribute("type", "button");
	Object.assign(cancelBtn.style, {
		padding: "10px 20px",
		border: "2px solid #e5e7eb",
		borderRadius: "6px",
		background: "white",
		cursor: "pointer",
		fontSize: "14px",
		fontWeight: "500",
	});
	cancelBtn.addEventListener("click", onCancel);
	buttonContainer.appendChild(cancelBtn);

	// Accept button
	const acceptBtn = document.createElement("button");
	acceptBtn.textContent = "Accept";
	acceptBtn.setAttribute("type", "button");
	Object.assign(acceptBtn.style, {
		padding: "10px 20px",
		border: "2px solid #fc5200",
		borderRadius: "6px",
		background: "#fc5200",
		color: "white",
		cursor: "pointer",
		fontSize: "14px",
		fontWeight: "500",
	});
	acceptBtn.addEventListener("click", onAccept);
	buttonContainer.appendChild(acceptBtn);

	panel.appendChild(buttonContainer);

	// Add backdrop
	const backdrop = document.createElement("div");
	backdrop.setAttribute("aria-hidden", "true");
	Object.assign(backdrop.style, {
		position: "fixed",
		top: "0",
		left: "0",
		right: "0",
		bottom: "0",
		background: "rgba(0, 0, 0, 0.5)",
		zIndex: "9999",
	});
	backdrop.addEventListener("click", onCancel);

	// Insert backdrop first
	document.body.appendChild(backdrop);
	document.body.appendChild(panel);

	// Store backdrop reference for cleanup
	(panel as PanelWithBackdrop)._backdrop = backdrop;

	return panel;
}

/**
 * Create a field comparison section (original vs enhanced)
 */
function createFieldSection(
	label: string,
	original: string,
	enhanced: string,
): HTMLDivElement {
	const section = document.createElement("div");
	section.style.marginBottom = "16px";

	const labelEl = document.createElement("label");
	labelEl.textContent = label;
	labelEl.style.display = "block";
	labelEl.style.fontWeight = "600";
	labelEl.style.marginBottom = "8px";
	labelEl.style.fontSize = "14px";
	section.appendChild(labelEl);

	// Original value (if different)
	if (original !== enhanced && original) {
		const originalBox = document.createElement("div");
		originalBox.style.padding = "12px";
		originalBox.style.background = "#fef2f2";
		originalBox.style.border = "1px solid #fecaca";
		originalBox.style.borderRadius = "6px";
		originalBox.style.marginBottom = "8px";
		originalBox.style.fontSize = "13px";
		originalBox.style.color = "#991b1b";
		originalBox.textContent = `Original: ${original}`;
		section.appendChild(originalBox);
	}

	// Enhanced value
	const enhancedBox = document.createElement("div");
	enhancedBox.style.padding = "12px";
	enhancedBox.style.background = "#f0fdf4";
	enhancedBox.style.border = "1px solid #bbf7d0";
	enhancedBox.style.borderRadius = "6px";
	enhancedBox.style.fontSize = "13px";
	enhancedBox.style.color = "#166534";
	enhancedBox.textContent = enhanced || "(empty)";
	section.appendChild(enhancedBox);

	return section;
}

/**
 * Remove the preview panel from DOM
 * @param panel - The panel element to remove
 */
export function removePreviewPanel(panel: HTMLDivElement): void {
	const backdrop = (panel as PanelWithBackdrop)._backdrop;
	if (backdrop) {
		backdrop.remove();
	}
	panel.remove();
}

/**
 * Create an error panel
 * @param errorMessage - The error message to display
 * @param onRetry - Retry handler
 * @param onCancel - Cancel handler
 * @returns HTMLDivElement
 */
export function createErrorPanel(
	errorMessage: string,
	onRetry: () => void,
	onCancel: () => void,
): HTMLDivElement {
	const panel = document.createElement("div");
	panel.className = `${CSS_CLASSES.PREVIEW_PANEL} ${CSS_CLASSES.ERROR}`;
	panel.setAttribute(DOM_ATTRIBUTES.PREVIEW_PANEL, "1");

	Object.assign(panel.style, {
		position: "fixed",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		background: "white",
		border: "2px solid #dc2626",
		borderRadius: "12px",
		padding: "24px",
		maxWidth: "500px",
		width: "90%",
		boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
		zIndex: "10000",
		fontFamily: "system-ui, -apple-system, sans-serif",
	});

	// Error icon
	const icon = document.createElement("div");
	icon.textContent = "⚠️";
	icon.style.fontSize = "48px";
	icon.style.textAlign = "center";
	icon.style.marginBottom = "16px";
	panel.appendChild(icon);

	// Error message
	const message = document.createElement("p");
	message.textContent = errorMessage;
	message.style.textAlign = "center";
	message.style.color = "#dc2626";
	message.style.fontSize = "14px";
	message.style.marginBottom = "24px";
	panel.appendChild(message);

	// Button container
	const buttonContainer = document.createElement("div");
	buttonContainer.style.display = "flex";
	buttonContainer.style.gap = "12px";
	buttonContainer.style.justifyContent = "center";

	// Cancel button
	const cancelBtn = document.createElement("button");
	cancelBtn.textContent = "Cancel";
	cancelBtn.setAttribute("type", "button");
	Object.assign(cancelBtn.style, {
		padding: "10px 20px",
		border: "2px solid #e5e7eb",
		borderRadius: "6px",
		background: "white",
		cursor: "pointer",
		fontSize: "14px",
	});
	cancelBtn.addEventListener("click", onCancel);
	buttonContainer.appendChild(cancelBtn);

	// Retry button
	const retryBtn = document.createElement("button");
	retryBtn.textContent = "Retry";
	retryBtn.setAttribute("type", "button");
	Object.assign(retryBtn.style, {
		padding: "10px 20px",
		border: "2px solid #dc2626",
		borderRadius: "6px",
		background: "#dc2626",
		color: "white",
		cursor: "pointer",
		fontSize: "14px",
	});
	retryBtn.addEventListener("click", onRetry);
	buttonContainer.appendChild(retryBtn);

	panel.appendChild(buttonContainer);

	// Add backdrop
	const backdrop = document.createElement("div");
	backdrop.setAttribute("aria-hidden", "true");
	Object.assign(backdrop.style, {
		position: "fixed",
		top: "0",
		left: "0",
		right: "0",
		bottom: "0",
		background: "rgba(0, 0, 0, 0.5)",
		zIndex: "9999",
	});

	document.body.appendChild(backdrop);
	document.body.appendChild(panel);

	(panel as PanelWithBackdrop)._backdrop = backdrop;

	return panel;
}

/**
 * Create enhancement preview panel for edit page
 */
export function createEnhancementPreviewPanel(
	field: "title" | "description",
	enhancedValue: string,
	onApply: () => void,
	onDiscard: () => void,
): HTMLDivElement {
	const panel = document.createElement("div");
	panel.className = CSS_CLASSES.ENHANCEMENT_PREVIEW;
	panel.setAttribute("data-ae-preview-field", field);
	panel.setAttribute("role", "region");
	panel.setAttribute("aria-label", `Enhanced ${field} preview`);

	// Subtle, compact panel styles
	Object.assign(panel.style, {
		background: "#fffbf5",
		border: "1px solid #ffedd5",
		borderLeft: "3px solid #fc5200",
		borderRadius: "4px",
		padding: "8px 12px",
		marginBottom: "8px",
		fontFamily: "system-ui, -apple-system, sans-serif",
		fontSize: "13px",
	});

	// Header - more compact
	const header = document.createElement("div");
	header.style.display = "flex";
	header.style.alignItems = "center";
	header.style.justifyContent = "space-between";
	header.style.marginBottom = "6px";

	const headerText = document.createElement("span");
	headerText.style.fontWeight = "600";
	headerText.style.color = "#fc5200";
	headerText.style.fontSize = "12px";
	headerText.textContent = `✨ AI ${field === "title" ? "Title" : "Description"}`;
	header.appendChild(headerText);

	// Action buttons inline in header
	const actions = document.createElement("div");
	actions.style.display = "flex";
	actions.style.gap = "6px";

	// Apply button - smaller
	const applyButton = document.createElement("button");
	applyButton.textContent = "Insert";
	applyButton.setAttribute("data-action", "apply");
	applyButton.setAttribute("type", "button");
	Object.assign(applyButton.style, {
		padding: "4px 10px",
		background: "#fc5200",
		color: "white",
		border: "none",
		borderRadius: "3px",
		cursor: "pointer",
		fontSize: "11px",
		fontWeight: "600",
		transition: "opacity 0.2s",
	});
	applyButton.addEventListener("mouseenter", () => {
		applyButton.style.opacity = "0.9";
	});
	applyButton.addEventListener("mouseleave", () => {
		applyButton.style.opacity = "1";
	});
	applyButton.addEventListener("click", onApply);
	actions.appendChild(applyButton);

	// Discard button - smaller
	const discardButton = document.createElement("button");
	discardButton.textContent = "Discard";
	discardButton.setAttribute("data-action", "discard");
	discardButton.setAttribute("type", "button");
	Object.assign(discardButton.style, {
		padding: "4px 10px",
		background: "transparent",
		color: "#666",
		border: "1px solid #ddd",
		borderRadius: "3px",
		cursor: "pointer",
		fontSize: "11px",
		fontWeight: "600",
		transition: "background 0.2s",
	});
	discardButton.addEventListener("mouseenter", () => {
		discardButton.style.background = "#f5f5f5";
	});
	discardButton.addEventListener("mouseleave", () => {
		discardButton.style.background = "transparent";
	});
	discardButton.addEventListener("click", onDiscard);
	actions.appendChild(discardButton);

	header.appendChild(actions);
	panel.appendChild(header);

	// Enhanced value display - compact
	const valueDisplay = document.createElement("div");
	valueDisplay.style.padding = "6px 8px";
	valueDisplay.style.background = "white";
	valueDisplay.style.borderRadius = "3px";
	valueDisplay.style.fontSize = "13px";
	valueDisplay.style.lineHeight = "1.4";
	valueDisplay.style.color = "#333";
	valueDisplay.style.maxHeight = field === "description" ? "80px" : "auto";
	valueDisplay.style.overflow = "auto";
	valueDisplay.style.whiteSpace =
		field === "description" ? "pre-wrap" : "normal";
	valueDisplay.textContent = enhancedValue;
	panel.appendChild(valueDisplay);

	return panel;
}

/**
 * Create reset button for edit page (initially hidden)
 */
export function createResetButton(onClick: () => void): HTMLButtonElement {
	const button = document.createElement("button");
	button.className = "ae-reset-btn";
	button.setAttribute(DOM_ATTRIBUTES.RESET_BUTTON, "1");
	button.setAttribute("aria-label", "Reset to original values");
	button.setAttribute("type", "button");
	button.textContent = "🔄 Reset to Original";

	Object.assign(button.style, {
		display: "none", // Initially hidden
		marginTop: "16px",
		padding: "10px 16px",
		border: "2px solid #666",
		borderRadius: "4px",
		background: "white",
		color: "#666",
		cursor: "pointer",
		fontSize: "14px",
		fontWeight: "600",
		fontFamily: "system-ui, -apple-system, sans-serif",
	});

	button.addEventListener("click", onClick);

	// Hover effects
	button.addEventListener("mouseenter", () => {
		button.style.background = "#666";
		button.style.color = "white";
	});

	button.addEventListener("mouseleave", () => {
		button.style.background = "white";
		button.style.color = "#666";
	});

	return button;
}

/**
 * Show toast notification
 */
export function showToast(
	message: string,
	type: "success" | "error" | "info" = "info",
): void {
	const toast = document.createElement("div");
	toast.setAttribute("role", "alert");
	toast.setAttribute("aria-live", "polite");
	toast.textContent = message;

	// Color scheme based on type
	let bgColor = "#333";
	let borderColor = "#555";

	if (type === "success") {
		bgColor = "#10b981";
		borderColor = "#059669";
	} else if (type === "error") {
		bgColor = "#dc2626";
		borderColor = "#b91c1c";
	} else if (type === "info") {
		bgColor = "#3b82f6";
		borderColor = "#2563eb";
	}

	Object.assign(toast.style, {
		position: "fixed",
		bottom: "24px",
		right: "24px",
		background: bgColor,
		color: "white",
		padding: "12px 20px",
		borderRadius: "8px",
		border: `2px solid ${borderColor}`,
		fontSize: "14px",
		fontWeight: "600",
		fontFamily: "system-ui, -apple-system, sans-serif",
		zIndex: "10000",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
		animation: "ae-toast-slide-in 0.3s ease-out",
	});

	// Add animation keyframes if not already present
	if (!document.getElementById("ae-toast-styles")) {
		const style = document.createElement("style");
		style.id = "ae-toast-styles";
		style.textContent = `
			@keyframes ae-toast-slide-in {
				from {
					opacity: 0;
					transform: translateY(20px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		`;
		document.head.appendChild(style);
	}

	document.body.appendChild(toast);

	// Auto-remove after 3 seconds
	setTimeout(() => {
		toast.style.opacity = "0";
		toast.style.transform = "translateY(20px)";
		toast.style.transition = "all 0.3s ease-out";

		setTimeout(() => {
			toast.remove();
		}, 300);
	}, 3000);
}
