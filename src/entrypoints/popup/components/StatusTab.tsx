import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getEnhancementCount } from "@/lib/metrics";
import { useQueryParam } from "@/lib/query-state";
import { getAccount, getDomainPrefs, setDomainPref } from "@/lib/storage";
import { TabLoadingSkeleton } from "./LoadingSkeletons";

interface StatusTabProps {
	domain: string | null;
}

export function StatusTab({ domain }: StatusTabProps) {
	const toggleId = useId();
	const [, setActiveTab] = useQueryParam("tab", "status");
	const [isEnabled, setIsEnabled] = useState<boolean>(true);
	const [isPro, setIsPro] = useState<boolean>(false);
	const [enhancementCount, setEnhancementCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isToggling, setIsToggling] = useState<boolean>(false);

	// Load initial state from storage
	useEffect(() => {
		let cancelled = false;

		async function loadData() {
			try {
				const [prefs, account, count] = await Promise.all([
					getDomainPrefs(),
					getAccount(),
					getEnhancementCount(),
				]);

				if (cancelled) return;

				// Default to enabled if no preference set
				const enabled = domain ? (prefs[domain] ?? true) : true;
				setIsEnabled(enabled);
				setIsPro(account.pro);
				setEnhancementCount(count);
			} catch (error) {
				console.error("Failed to load status data:", error);
				if (!cancelled) {
					// Fallback to default values
					setIsEnabled(true);
					setIsPro(false);
					setEnhancementCount(0);
					toast.error("Failed to load status data", {
						description: "Using default values. Please refresh the popup.",
					});
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		loadData();

		return () => {
			cancelled = true;
		};
	}, [domain]);

	// Handle toggle with optimistic UI
	async function handleToggle(checked: boolean) {
		if (!domain || isToggling) return;

		setIsToggling(true);
		const previousValue = isEnabled;

		// Optimistic update
		setIsEnabled(checked);

		try {
			await setDomainPref(domain, checked);
			toast.success(
				checked ? "AI enhancement enabled" : "AI enhancement disabled",
				{
					description: `Changes saved for ${domain}`,
				},
			);
		} catch (error) {
			// Rollback on error
			console.error("Failed to save domain preference:", error);
			setIsEnabled(previousValue);
			toast.error("Failed to save preference", {
				description: "Please try again.",
			});
		} finally {
			setIsToggling(false);
		}
	}

	// Navigate to account tab
	function handleUpgradeCTA() {
		setActiveTab("account");
	}

	if (isLoading) {
		return <TabLoadingSkeleton />;
	}

	return (
		<div className="p-6 space-y-6">
			{/* Current Site Section */ }
			<div className="space-y-2">
				<h3 className="text-sm font-medium">Current Site</h3>
				<p className="text-sm text-muted-foreground">
					{ domain || "No active site detected" }
				</p>
			</div>

			{/* Enhancement Toggle */ }
			{ domain && (
				<div className="flex items-center justify-between py-3 border-y">
					<div className="space-y-1">
						<label
							htmlFor={ toggleId }
							className="text-sm font-medium cursor-pointer"
						>
							Enable AI Enhancement
						</label>
						<p className="text-xs text-muted-foreground">
							Enhance activities on this site
						</p>
					</div>
					<Switch
						id={ toggleId }
						checked={ isEnabled }
						onCheckedChange={ handleToggle }
						disabled={ isToggling }
						aria-label="Toggle AI enhancement for this site"
					/>
				</div>
			) }

			{/* Monthly Enhancement Count */ }
			<div className="space-y-2">
				<h3 className="text-sm font-medium">This Month</h3>
				<div className="flex items-baseline gap-2">
					<span className="text-2xl font-bold">{ enhancementCount }</span>
					<span className="text-sm text-muted-foreground">
						enhancement{ enhancementCount !== 1 ? "s" : "" }
					</span>
				</div>
			</div>

			{/* Pro Status or CTA */ }
			{ isPro ? (
				<div className="rounded-lg border bg-accent/50 p-4 space-y-2">
					<div className="flex items-center gap-2">
						<Badge variant="default">PRO</Badge>
						<span className="text-sm font-medium">Active</span>
					</div>
					<p className="text-xs text-muted-foreground">
						Enjoying unlimited enhancements and premium features
					</p>
				</div>
			) : (
				<div className="rounded-lg border bg-accent/50 p-4 space-y-3">
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">Upgrade to Pro</h4>
						<p className="text-xs text-muted-foreground">
							Unlock unlimited enhancements, weather context, and custom prompts
						</p>
					</div>
					<Button
						size="sm"
						className="w-full"
						onClick={ handleUpgradeCTA }
						aria-label="Upgrade to Pro plan"
					>
						View Plans
					</Button>
				</div>
			) }
		</div>
	);
}
