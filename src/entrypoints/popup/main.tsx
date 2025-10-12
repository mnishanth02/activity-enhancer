import { lazy, StrictMode, Suspense, useMemo } from "react";
import "@/assets/style.css";
import ReactDOM from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { useQueryParam } from "@/lib/query-state";
import { Header } from "./components/Header";
import {
	AccountLoadingSkeleton,
	SettingsLoadingSkeleton,
} from "./components/LoadingSkeletons";
import { StatusTab } from "./components/StatusTab";
import { TabsContent, TabsNavigation } from "./components/TabsNavigation";
import { useCurrentDomain } from "./hooks/useCurrentDomain";

// Lazy-load infrequently used tabs to reduce initial bundle evaluation cost
const SettingsTab = lazy(() =>
	import("./components/SettingsTab").then((m) => ({ default: m.SettingsTab })),
);
const AccountTab = lazy(() =>
	import("./components/AccountTab").then((m) => ({ default: m.AccountTab })),
);

function PopupApp() {
	const [activeTab, setActiveTab] = useQueryParam("tab", "status");
	const { domain, error: domainError } = useCurrentDomain();

	// Map tabs to their (potentially lazy) element factory; ensures single conditional switch
	const tabElement = useMemo(() => {
		switch (activeTab) {
			case "status":
				return <StatusTab domain={ domain } />;
			case "settings":
				return (
					<Suspense fallback={ <SettingsLoadingSkeleton /> }>
						<SettingsTab />
					</Suspense>
				);
			case "account":
				return (
					<Suspense fallback={ <AccountLoadingSkeleton /> }>
						<AccountTab />
					</Suspense>
				);
			default:
				return <StatusTab domain={ domain } />; // Fallback for unknown param
		}
	}, [activeTab, domain]);

	// (Optional future) We could surface domainLoading/domainError in UI header/tooltips.
	if (domainError) {
		// Non-fatal: log once (MV3 dev tools) – avoids noisy re-renders.
		console.warn("Domain detection error", domainError);
	}

	return (
		<div className="w-[420px] min-h-[500px] bg-background">
			<Header />
			<TabsNavigation activeTab={ activeTab } onTabChange={ setActiveTab }>
				<TabsContent value={ activeTab }>{ tabElement }</TabsContent>
			</TabsNavigation>
			<Toaster />
		</div>
	);
}

// biome-ignore lint/style/noNonNullAssertion: <false positive>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PopupApp />
	</StrictMode>,
);
