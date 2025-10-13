/**
 * Prompt builder for LLM activity enhancement
 *
 * Constructs prompts using user settings and activity data, following
 * the defined prompt contract (max lengths, tone, hashtags, etc.)
 */

import type { ActivityData } from "@/lib/adapters/types";
import { CONTENT_LIMITS } from "./constants";
import type { Settings } from "./settings-schema";

export interface PromptInput {
	/** Original activity data */
	activity: ActivityData;
	/** User settings for enhancement */
	settings: Settings;
}

/**
 * Build the enhancement prompt for the LLM
 * @param input - Activity data and user settings
 * @returns The complete prompt string
 */
export function buildPrompt(input: PromptInput): string {
	const { activity, settings } = input;
	const { tone, generateHashtags, includeWeather } = settings;

	const systemPrompt = `You are an assistant that rewrites endurance activity titles & descriptions.

Constraints:
- Title <= ${CONTENT_LIMITS.TITLE_MAX} characters; motivational, concise; no emojis unless original had them.
- Description <= ${CONTENT_LIMITS.DESCRIPTION_MAX} characters; positive tone; never fabricate stats.
- Maintain factual data present in original text only.
${generateHashtags ? `- Append ${CONTENT_LIMITS.HASHTAGS_MIN}-${CONTENT_LIMITS.HASHTAGS_MAX} lowercase hashtags at end of description (no duplicates).` : ""}
${includeWeather ? "- Incorporate brief weather note if given (not available now)." : ""}

Return ONLY valid JSON in this exact format:
{
  "title": "enhanced title here",
  "description": "enhanced description here"
}`;

	// Build activity context with available stats
	let activityContext = `User Activity Input:
Title: "${activity.title || "(none)"}"
Description: "${activity.description || "(none)"}"`;

	// Add stats if available
	if (activity.sport) {
		activityContext += `\nActivity Type: ${activity.sport}`;
	}
	if (activity.distance) {
		activityContext += `\nDistance: ${activity.distance}`;
	}
	if (activity.time) {
		activityContext += `\nTime: ${activity.time}`;
	}
	if (activity.elevationGain) {
		activityContext += `\nElevation Gain: ${activity.elevationGain}`;
	}

	activityContext += `\nTone: ${tone}`;

	const userPrompt = `${activityContext}

Please enhance this activity following the constraints above.`;

	return `${systemPrompt}\n\n${userPrompt}`;
}

/**
 * Validate and parse the LLM response
 * @param response - Raw response from LLM
 * @param original - Original activity data (for fallback)
 * @returns Parsed and validated enhanced activity
 */
export function parseEnhancedActivity(
	response: string,
	original: ActivityData,
): { title: string; description: string } {
	try {
		// Try to extract JSON from response (handle potential markdown wrappers)
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			console.warn("No JSON found in response, using original");
			return original;
		}

		const parsed = JSON.parse(jsonMatch[0]);

		// Extract title and description with fallbacks
		const title = (parsed.title || original.title).trim();
		const description = (parsed.description || original.description).trim();

		// Enforce max lengths by truncating at word boundaries
		const truncatedTitle = truncateIfNeeded(title, CONTENT_LIMITS.TITLE_MAX);
		const truncatedDescription = truncateIfNeeded(
			description,
			CONTENT_LIMITS.DESCRIPTION_MAX,
		);

		return {
			title: truncatedTitle,
			description: truncatedDescription,
		};
	} catch (error) {
		console.error("Failed to parse LLM response:", error);
		console.debug("Raw response:", response);
		return original;
	}
}

/**
 * Truncate text at word boundary if it exceeds max length
 * @param text - Text to potentially truncate
 * @param maxLength - Maximum allowed length
 * @returns Truncated text or original if within limit
 */
function truncateIfNeeded(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}

	// Truncate at word boundary
	let truncated = text.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");

	if (lastSpace > 0) {
		truncated = truncated.slice(0, lastSpace);
	}

	return truncated.trim();
}
