import { CheckIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Account } from "@/lib/settings-schema";
import { getAccount, saveAccount } from "@/lib/storage";

export function AccountTab() {
	const [account, setAccount] = useState<Account | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Load account data
	useEffect(() => {
		let cancelled = false;

		async function loadAccount() {
			try {
				const data = await getAccount();
				if (cancelled) return;
				setAccount(data);
			} catch (error) {
				console.error("Failed to load account data:", error);
				if (!cancelled) {
					setAccount({ pro: false });
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		loadAccount();

		return () => {
			cancelled = true;
		};
	}, []);

	// Handle sign-in (stub for future OAuth/Stripe integration)
	async function handleSignIn() {
		toast.info("Sign-in flow coming soon!", {
			description: "Authentication will be integrated in the next release.",
		});
		// TODO: Integrate OAuth or Stripe Customer Portal sign-in
		// window.open('https://your-auth-endpoint.com/signin', '_blank');
	}

	// Handle upgrade (stub for future Stripe Checkout)
	async function handleUpgrade(plan: "monthly" | "annual") {
		toast.info(`${plan === "monthly" ? "Monthly" : "Annual"} plan selected!`, {
			description: "Stripe Checkout will be integrated soon.",
		});
		// TODO: Integrate Stripe Checkout
		// const checkoutUrl = await createCheckoutSession(plan);
		// window.open(checkoutUrl, '_blank');
	}

	// Handle manage subscription (stub for Stripe Customer Portal)
	async function handleManageSubscription() {
		toast.info("Opening billing portal...", {
			description: "Stripe Customer Portal will be integrated soon.",
		});
		// TODO: Integrate Stripe Customer Portal
		// const portalUrl = await createPortalSession();
		// window.open(portalUrl, '_blank');
	}

	// Handle logout (clear account data)
	async function handleLogout() {
		try {
			await saveAccount({ pro: false });
			setAccount({ pro: false });
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Failed to logout:", error);
			toast.error("Failed to logout", {
				description: "Please try again.",
			});
		}
	}

	if (isLoading) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[200px]">
				<Spinner />
			</div>
		);
	}

	// Pro user view
	if (account?.pro) {
		return (
			<div className="p-6 space-y-6">
				{/* Pro Badge */ }
				<div className="flex items-center justify-center">
					<Badge variant="default" className="text-base px-4 py-1">
						PRO
					</Badge>
				</div>

				{/* User Information */ }
				<div className="space-y-4">
					<div className="text-center space-y-1">
						<h3 className="text-lg font-semibold">
							{ account.userName || "Pro User" }
						</h3>
						{ account.email && (
							<p className="text-sm text-muted-foreground">{ account.email }</p>
						) }
					</div>

					{/* Subscription Details */ }
					<div className="rounded-lg border bg-accent/50 p-4 space-y-3">
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Plan</span>
								<span className="font-medium">
									{ account.planName || "Pro Plan" }
								</span>
							</div>
							{ account.nextBillingDate && (
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Next Billing</span>
									<span className="font-medium">{ account.nextBillingDate }</span>
								</div>
							) }
						</div>
					</div>

					{/* Pro Features List */ }
					<div className="space-y-2">
						<h4 className="text-sm font-medium">Your Benefits</h4>
						<ul className="space-y-2">
							{ [
								"Unlimited AI enhancements",
								"Weather context integration",
								"Custom prompt templates",
								"Priority support",
								"Advanced analytics",
							].map((feature) => (
								<li key={ feature } className="flex items-start gap-2 text-sm">
									<CheckIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
									<span>{ feature }</span>
								</li>
							)) }
						</ul>
					</div>
				</div>

				{/* Actions */ }
				<div className="space-y-2 pt-2">
					<Button
						variant="outline"
						className="w-full"
						onClick={ handleManageSubscription }
					>
						<ExternalLinkIcon className="h-4 w-4 mr-2" />
						Manage Subscription
					</Button>
					<Button
						variant="ghost"
						className="w-full text-muted-foreground"
						onClick={ handleLogout }
					>
						Logout
					</Button>
				</div>
			</div>
		);
	}

	// Free user view
	return (
		<div className="p-6 space-y-6">
			{/* Header */ }
			<div className="text-center space-y-2">
				<h3 className="text-xl font-bold">Upgrade to Pro</h3>
				<p className="text-sm text-muted-foreground">
					Unlock unlimited enhancements and premium features
				</p>
			</div>

			{/* Features List */ }
			<div className="space-y-3">
				<h4 className="text-sm font-semibold">Pro Features</h4>
				<ul className="space-y-3">
					{ [
						{
							title: "Unlimited Enhancements",
							description:
								"No monthly limits on AI-powered activity enhancements",
						},
						{
							title: "Weather Context",
							description:
								"Automatically include weather data in your activities",
						},
						{
							title: "Custom Prompts",
							description: "Create and save your own enhancement templates",
						},
						{
							title: "Bring Your Own Key",
							description:
								"Use your own API keys for OpenAI, Anthropic, or Gemini",
						},
						{
							title: "Priority Support",
							description: "Get help faster with dedicated support",
						},
					].map((feature) => (
						<li key={ feature.title } className="flex items-start gap-3">
							<div className="rounded-full bg-primary/10 p-1 mt-0.5">
								<CheckIcon className="h-3 w-3 text-primary" />
							</div>
							<div className="space-y-0.5 flex-1">
								<p className="text-sm font-medium">{ feature.title }</p>
								<p className="text-xs text-muted-foreground">
									{ feature.description }
								</p>
							</div>
						</li>
					)) }
				</ul>
			</div>

			{/* Pricing Options */ }
			<div className="space-y-3">
				<h4 className="text-sm font-semibold">Choose Your Plan</h4>
				<div className="grid gap-3">
					{/* Monthly Plan */ }
					<button
						type="button"
						onClick={ () => handleUpgrade("monthly") }
						className="relative rounded-lg border-2 border-border hover:border-primary p-4 text-left transition-colors cursor-pointer"
					>
						<div className="space-y-1">
							<div className="flex items-baseline justify-between">
								<span className="font-semibold">Monthly</span>
								<div className="text-right">
									<span className="text-2xl font-bold">$9</span>
									<span className="text-sm text-muted-foreground">/month</span>
								</div>
							</div>
							<p className="text-xs text-muted-foreground">
								Billed monthly • Cancel anytime
							</p>
						</div>
					</button>

					{/* Annual Plan */ }
					<button
						type="button"
						onClick={ () => handleUpgrade("annual") }
						className="relative rounded-lg border-2 border-primary bg-primary/5 p-4 text-left transition-colors cursor-pointer hover:bg-primary/10"
					>
						<Badge
							variant="default"
							className="absolute -top-2 -right-2 text-xs"
						>
							Save 25%
						</Badge>
						<div className="space-y-1">
							<div className="flex items-baseline justify-between">
								<span className="font-semibold">Annual</span>
								<div className="text-right">
									<span className="text-2xl font-bold">$81</span>
									<span className="text-sm text-muted-foreground">/year</span>
								</div>
							</div>
							<p className="text-xs text-muted-foreground">
								Billed annually • Best value
							</p>
						</div>
					</button>
				</div>
			</div>

			{/* Sign In Option */ }
			<div className="pt-2 border-t">
				<div className="text-center space-y-2">
					<p className="text-xs text-muted-foreground">
						Already have an account?
					</p>
					<Button variant="ghost" size="sm" onClick={ handleSignIn }>
						Sign In
					</Button>
				</div>
			</div>
		</div>
	);
}
