import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsNavigationProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	children: React.ReactNode;
}

export function TabsNavigation({
	activeTab,
	onTabChange,
	children,
}: TabsNavigationProps) {
	return (
		<Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
			<TabsList className="w-full grid grid-cols-3">
				<TabsTrigger value="status">Status</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
				<TabsTrigger value="account">Account</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	);
}

export { TabsContent };
