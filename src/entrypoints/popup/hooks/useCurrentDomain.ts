/**
 * Hook: useCurrentDomain
 * Extracts the active tab's domain (hostname) once after mount.
 * - Defers work with setTimeout(0) to let initial paint occur quickly.
 * - Guards against state updates after unmount.
 * - Exposes loading + error for future UI affordances (currently unused).
 */
import { useEffect, useState } from "react";

interface UseCurrentDomainState {
	domain: string | null;
	loading: boolean;
	error: Error | null;
}

export function useCurrentDomain(): UseCurrentDomainState {
	const [state, setState] = useState<UseCurrentDomainState>({
		domain: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		let cancelled = false;
		const handle = setTimeout(() => {
			(async () => {
				try {
					const [tab] = await browser.tabs.query({
						active: true,
						currentWindow: true,
					});
					if (cancelled) return;
					if (tab?.url) {
						try {
							const url = new URL(tab.url);
							setState({ domain: url.hostname, loading: false, error: null });
						} catch (parseErr) {
							setState({
								domain: null,
								loading: false,
								error: parseErr as Error,
							});
						}
					} else {
						setState({ domain: null, loading: false, error: null });
					}
				} catch (err) {
					if (!cancelled) {
						setState({ domain: null, loading: false, error: err as Error });
					}
				}
			})();
		}, 0);

		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
	}, []);

	return state;
}
