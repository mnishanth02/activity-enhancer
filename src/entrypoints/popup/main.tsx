import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "@/assets/style.css";
import { useQueryParam } from "@/lib/query-state";
import { AccountTab } from "./components/AccountTab";
import { Header } from "./components/Header";
import { SettingsTab } from "./components/SettingsTab";
import { StatusTab } from "./components/StatusTab";
import { TabsContent, TabsNavigation } from "./components/TabsNavigation";

function PopupApp() {
	const [activeTab, setActiveTab] = useQueryParam("tab", "status");
	const [currentDomain, setCurrentDomain] = useState<string | null>(null);

	// Detect current domain from active tab
	useEffect(() => {
		async function detectDomain() {
			try {
				const [tab] = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});

				if (tab?.url) {
					const url = new URL(tab.url);
					setCurrentDomain(url.hostname);
				}
			} catch (error) {
				console.error("Failed to detect domain:", error);
				setCurrentDomain(null);
			}
		}

		detectDomain();
	}, []);

	return (
		<div className="w-[420px] min-h-[500px] bg-background">
			<Header />
			<TabsNavigation activeTab={activeTab} onTabChange={setActiveTab}>
				<TabsContent value="status">
					<StatusTab domain={currentDomain} />
				</TabsContent>
				<TabsContent value="settings">
					<SettingsTab />
				</TabsContent>
				<TabsContent value="account">
					<AccountTab />
				</TabsContent>
			</TabsNavigation>
		</div>
	);
}

// biome-ignore lint/style/noNonNullAssertion: <false positive>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PopupApp />
	</StrictMode>,
);
