/**
 * Prompt builder for LLM activity enhancement
 *
 * Constructs prompts using user settings and activity data, following
 * the defined prompt contract (max lengths, tone, hashtags, etc.)
 */

import type { ActivityData, ExtendedActivityData } from "@/lib/adapters/types";
import { CONTENT_LIMITS } from "./constants";
import type { Settings } from "./settings-schema";

export interface PromptInput {
	/** Original activity data */
	activity: ActivityData;
	/** User settings for enhancement */
	settings: Settings;
}

export interface EnhancedPromptInput {
	/** Extended activity data with 15+ fields */
	activity: ExtendedActivityData;
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

/**
 * Build enhanced prompt with all extracted data from details page
 * @param input - Extended activity data and user settings
 * @returns The complete prompt string with all available fields
 */
export function buildEnhancedPrompt(input: EnhancedPromptInput): string {
	const { activity, settings } = input;
	const { tone, generateHashtags, includeWeather } = settings;

	const systemPrompt = `You are an assistant that rewrites endurance activity titles & descriptions.

Constraints:
- Title <= ${CONTENT_LIMITS.TITLE_MAX} characters; motivational, concise; no emojis unless original had them.
- Description <= ${CONTENT_LIMITS.DESCRIPTION_MAX} characters; positive tone; never fabricate stats.
- Maintain factual data present in original text only.
${generateHashtags ? `- Append ${CONTENT_LIMITS.HASHTAGS_MIN}-${CONTENT_LIMITS.HASHTAGS_MAX} lowercase hashtags at end of description (no duplicates).` : ""}
${includeWeather ? "- Incorporate brief weather note if given." : ""}

Return ONLY valid JSON in this exact format:
{
  "title": "enhanced title here",
  "description": "enhanced description here"
}`;

	// Build comprehensive activity context with all available fields
	let activityContext = `User Activity Input:
Title: "${activity.title || "(none)"}"
Description: "${activity.description || "(none)"}"`;

	// Core stats
	if (activity.sport) activityContext += `\nActivity Type: ${activity.sport}`;
	if (activity.activityType)
		activityContext += `\nActivity Type (Detailed): ${activity.activityType}`;
	if (activity.workoutType)
		activityContext += `\nWorkout Type: ${activity.workoutType}`;

	// Athlete and location
	if (activity.athleteName)
		activityContext += `\nAthlete: ${activity.athleteName}`;
	if (activity.location) activityContext += `\nLocation: ${activity.location}`;

	// Time and date
	if (activity.date) activityContext += `\nDate: ${activity.date}`;
	if (activity.timeDisplay)
		activityContext += `\nTime: ${activity.timeDisplay}`;
	if (activity.timeISO) activityContext += `\nTime (ISO): ${activity.timeISO}`;

	// Performance metrics
	if (activity.distance) activityContext += `\nDistance: ${activity.distance}`;
	if (activity.movingTime)
		activityContext += `\nMoving Time: ${activity.movingTime}`;
	if (activity.elapsedTime)
		activityContext += `\nElapsed Time: ${activity.elapsedTime}`;
	if (activity.time) activityContext += `\nDuration: ${activity.time}`;
	if (activity.elevationGain)
		activityContext += `\nElevation Gain: ${activity.elevationGain}`;
	if (activity.calories) activityContext += `\nCalories: ${activity.calories}`;

	// Averages
	if (activity.averagePace)
		activityContext += `\nAverage Pace: ${activity.averagePace}`;
	if (activity.averageHeartRate)
		activityContext += `\nAverage Heart Rate: ${activity.averageHeartRate}`;
	if (activity.averageCadence)
		activityContext += `\nAverage Cadence: ${activity.averageCadence}`;

	// Weather conditions (if includeWeather is enabled and data is available)
	if (includeWeather) {
		if (activity.temperature)
			activityContext += `\nTemperature: ${activity.temperature}`;
		if (activity.humidity)
			activityContext += `\nHumidity: ${activity.humidity}`;
		if (activity.wind) activityContext += `\nWind: ${activity.wind}`;
	}

	activityContext += `\nTone: ${tone}`;

	const userPrompt = `${activityContext}

Please enhance this activity following the constraints above.`;

	return `${systemPrompt}\n\n${userPrompt}`;
}
