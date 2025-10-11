/**
 * Lightweight query parameter state management for popup
 * Inspired by nuqs pattern but simplified for extension popup context
 */

import React from "react";

type QueryStateListener = () => void;
const listeners = new Set<QueryStateListener>();

// Notify listeners on browser navigation (back/forward)
if (typeof window !== "undefined") {
	window.addEventListener("popstate", notifyListeners);
}

/**
 * Get current URLSearchParams
 */
function getSearchParams(): URLSearchParams {
	return new URLSearchParams(window.location.search);
}

/**
 * Get a query parameter value
 */
export function getQueryParam(key: string): string | null {
	const params = getSearchParams();
	return params.get(key);
}

/**
 * Set a query parameter value and update URL
 */
export function setQueryParam(key: string, value: string): void {
	const params = getSearchParams();

	if (value) {
		params.set(key, value);
	} else {
		params.delete(key);
	}

	// Preserve hash fragment when updating URL
	const hash = window.location.hash || "";
	const newUrl = `${window.location.pathname}?${params.toString()}${hash}`;
	window.history.replaceState({}, "", newUrl);

	// Notify listeners
	notifyListeners();
}

/**
 * Delete a query parameter
 */
export function deleteQueryParam(key: string): void {
	setQueryParam(key, "");
}

/**
 * Subscribe to query param changes
 */
export function subscribeToQueryParams(
	listener: QueryStateListener,
): () => void {
	listeners.add(listener);

	// Return unsubscribe function
	return () => {
		listeners.delete(listener);
	};
}

/**
 * Notify all listeners of query param changes
 */
function notifyListeners(): void {
	for (const listener of listeners) {
		listener();
	}
}

/**
 * React hook for query parameter state
 * Usage: const [tab, setTab] = useQueryParam('tab', 'status')
 */
export function useQueryParam(
	key: string,
	defaultValue = "",
): [string, (value: string) => void] {
	const [value, setValue] = React.useState<string>(() => {
		return getQueryParam(key) || defaultValue;
	});

	React.useEffect(() => {
		const unsubscribe = subscribeToQueryParams(() => {
			const newValue = getQueryParam(key) || defaultValue;
			setValue(newValue);
		});

		return unsubscribe;
	}, [key, defaultValue]);

	const setParam = React.useCallback(
		(newValue: string) => {
			setQueryParam(key, newValue);
		},
		[key],
	);

	return [value, setParam];
}
