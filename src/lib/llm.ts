/**
 * LLM integration module for activity enhancement
 *
 * Handles calling LLM providers (OpenAI, Anthropic, Gemini, or custom)
 * using BYOK (Bring Your Own Key) advanced settings or default provider.
 *
 * NOTE: This is a stub implementation. Real API calls will be added next.
 */

import type { AdvancedSettings } from "./settings-schema";

export interface EnhancementResult {
	/** Enhanced title */
	title: string;
	/** Enhanced description */
	description: string;
	/** Whether the enhancement was successful */
	success: boolean;
	/** Error message if enhancement failed */
	error?: string;
}

/**
 * Enhance activity using LLM
 * @param prompt - The complete prompt to send to LLM
 * @param settings - Advanced settings for BYOK provider selection
 * @returns Enhanced activity or error
 */
export async function enhanceActivity(
	prompt: string,
	settings: AdvancedSettings,
): Promise<EnhancementResult> {
	try {
		// Determine which provider to use
		const provider = settings.provider || "openai";
		// const endpoint = settings.endpoint;
		// const apiKey = settings.apiKey;

		// For now, return mock data
		// TODO: Implement real API calls based on provider
		if (import.meta.env.DEV) {
			console.log("🤖 [LLM] Prompt:", prompt);
			console.log("🔧 [LLM] Provider:", provider);
		}

		// Mock response for development
		const mockResponse = await mockEnhancement(prompt);

		return {
			...mockResponse,
			success: true,
		};
	} catch (error) {
		console.error("LLM enhancement failed:", error);
		return {
			title: "",
			description: "",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

/**
 * Mock enhancement for development/testing
 * @param prompt - The prompt (unused in mock)
 * @returns Mock enhanced activity
 */
async function mockEnhancement(prompt: string): Promise<EnhancementResult> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Extract original title and description from prompt
	const titleMatch = prompt.match(/Title:\s*"([^"]*)"/);
	const descMatch = prompt.match(/Description:\s*"([^"]*)"/);

	const originalTitle = titleMatch?.[1] || "Morning Run";
	const originalDesc = descMatch?.[1] || "";

	// Return enhanced version
	return {
		title: `✨ ${originalTitle} - Epic Journey`,
		description: originalDesc
			? `${originalDesc} What an incredible experience! Every step was worth it. #motivation #fitness #running`
			: "An amazing workout that pushed boundaries and achieved new goals. #motivation #fitness #running",
		success: true,
	};
}

// TODO: Implement real API calls for OpenAI, Anthropic, Gemini, and Custom endpoints
// Functions will be added when moving from mock to production
