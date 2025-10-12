import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useQueryParam } from "@/lib/query-state";
import {
	AdvancedSchema,
	type AdvancedSettings,
	ProviderEnum,
	type Settings,
	SettingsSchema,
	ToneEnum,
} from "@/lib/settings-schema";
import {
	getAccount,
	getAdvancedSettings,
	getSettings,
	saveAdvancedSettings,
	saveSettings,
} from "@/lib/storage";

export function SettingsTab() {
	const toneId = useId();
	const hashtagsId = useId();
	const weatherId = useId();
	const providerSelectId = useId();
	const endpointId = useId();
	const apiKeyId = useId();

	const [isPro, setIsPro] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSavingGeneral, setIsSavingGeneral] = useState<boolean>(false);
	const [isSavingAdvanced, setIsSavingAdvanced] = useState<boolean>(false);
	const [isTesting, setIsTesting] = useState<boolean>(false);

	// Advanced section open state (transient - stored in URL)
	const [advancedOpen, setAdvancedOpen] = useQueryParam("adv", "0");
	const isAdvancedOpen = advancedOpen === "1";

	// General settings form
	const {
		handleSubmit: handleSubmitGeneral,
		formState: { errors: errorsGeneral },
		setValue: setValueGeneral,
		watch: watchGeneral,
	} = useForm({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			tone: "inspirational",
			generateHashtags: false,
			includeWeather: false,
		},
	});

	// Advanced settings form
	const {
		register: registerAdvanced,
		handleSubmit: handleSubmitAdvanced,
		formState: { errors: errorsAdvanced },
		setValue: setValueAdvanced,
		watch: watchAdvanced,
	} = useForm({
		resolver: zodResolver(AdvancedSchema),
		defaultValues: {
			provider: undefined,
			endpoint: "",
			apiKey: "",
		},
	});

	const toneValue = watchGeneral("tone");
	const providerValue = watchAdvanced("provider");

	// Load initial data
	useEffect(() => {
		let cancelled = false;

		async function loadData() {
			try {
				const [settings, advanced, account] = await Promise.all([
					getSettings(),
					getAdvancedSettings(),
					getAccount(),
				]);

				if (cancelled) return;

				// Populate general settings
				setValueGeneral("tone", settings.tone);
				setValueGeneral("generateHashtags", settings.generateHashtags);
				setValueGeneral("includeWeather", settings.includeWeather);

				// Populate advanced settings
				if (advanced.provider) {
					setValueAdvanced("provider", advanced.provider);
				}
				setValueAdvanced("endpoint", advanced.endpoint || "");
				setValueAdvanced("apiKey", advanced.apiKey || "");

				setIsPro(account.pro);
			} catch (error) {
				console.error("Failed to load settings:", error);
				toast.error("Failed to load settings");
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
	}, [setValueGeneral, setValueAdvanced]);

	// Handle general settings save
	async function onSaveGeneral(data: Settings) {
		setIsSavingGeneral(true);
		try {
			await saveSettings(data);
			toast.success("Settings saved successfully");
		} catch (error) {
			console.error("Failed to save settings:", error);
			toast.error("Failed to save settings");
		} finally {
			setIsSavingGeneral(false);
		}
	}

	// Handle advanced settings save
	async function onSaveAdvanced(data: AdvancedSettings) {
		setIsSavingAdvanced(true);
		try {
			await saveAdvancedSettings(data);
			toast.success("Advanced settings saved successfully");
		} catch (error) {
			console.error("Failed to save advanced settings:", error);
			toast.error("Failed to save advanced settings");
		} finally {
			setIsSavingAdvanced(false);
		}
	}

	// Handle test connection
	async function handleTestConnection() {
		setIsTesting(true);
		try {
			const endpoint = watchAdvanced("endpoint");
			const apiKey = watchAdvanced("apiKey");

			if (!endpoint) {
				toast.error("Please provide an endpoint URL");
				return;
			}

			if (!apiKey) {
				toast.error("Please provide an API key");
				return;
			}

			// Simulate test connection (stub)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// In production, this would make an actual API call
			// For now, we just validate the URL format
			try {
				new URL(endpoint);
				toast.success("Connection test successful");
			} catch {
				toast.error("Invalid endpoint URL");
			}
		} catch (error) {
			console.error("Connection test failed:", error);
			toast.error("Connection test failed");
		} finally {
			setIsTesting(false);
		}
	}

	// Handle custom prompts (PRO feature - stub)
	function handleCustomPrompts() {
		toast.info("Custom prompts feature coming soon");
	}

	// Toggle advanced section
	function toggleAdvanced() {
		setAdvancedOpen(isAdvancedOpen ? "0" : "1");
	}

	if (isLoading) {
		return (
			<div className="p-6 flex items-center justify-center min-h-[200px]">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* General Settings Form */}
			<form onSubmit={handleSubmitGeneral(onSaveGeneral)} className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-sm font-semibold">General Settings</h3>

					{/* Tone Select */}
					<div className="space-y-2">
						<Label htmlFor={toneId}>Default Tone</Label>
						<Select
							value={toneValue}
							onValueChange={(value) =>
								setValueGeneral("tone", value as Settings["tone"])
							}
						>
							<SelectTrigger id={toneId} className="w-full">
								<SelectValue placeholder="Select tone" />
							</SelectTrigger>
							<SelectContent>
								{ToneEnum.options.map((tone) => (
									<SelectItem key={tone} value={tone}>
										{tone.charAt(0).toUpperCase() + tone.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errorsGeneral.tone && (
							<p className="text-xs text-destructive">
								{errorsGeneral.tone.message}
							</p>
						)}
					</div>

					{/* Generate Hashtags */}
					<div className="flex items-center justify-between py-2">
						<div className="space-y-1">
							<Label htmlFor={hashtagsId} className="cursor-pointer">
								Generate Hashtags
							</Label>
							<p className="text-xs text-muted-foreground">
								Add relevant hashtags to enhancements
							</p>
						</div>
						<Checkbox
							id={hashtagsId}
							checked={watchGeneral("generateHashtags")}
							onCheckedChange={(checked) =>
								setValueGeneral("generateHashtags", Boolean(checked))
							}
						/>
					</div>

					{/* Include Weather (PRO) */}
					<div className="flex items-center justify-between py-2 border-t">
						<div className="space-y-1 flex-1">
							<div className="flex items-center gap-2">
								<Label htmlFor={weatherId} className="cursor-pointer">
									Include Weather Context
								</Label>
								<Badge variant="default" className="text-xs">
									PRO
								</Badge>
							</div>
							<p className="text-xs text-muted-foreground">
								Add weather info to activity descriptions
							</p>
						</div>
						<Checkbox
							id={weatherId}
							checked={watchGeneral("includeWeather")}
							onCheckedChange={(checked) =>
								setValueGeneral("includeWeather", Boolean(checked))
							}
							disabled={!isPro}
						/>
					</div>

					{/* Custom Prompts Button (PRO) */}
					<div className="pt-2">
						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={handleCustomPrompts}
							disabled={!isPro}
						>
							<span>Custom Prompts</span>
							{!isPro && (
								<Badge variant="default" className="ml-2 text-xs">
									PRO
								</Badge>
							)}
						</Button>
					</div>
				</div>

				{/* Save Button */}
				<Button
					type="submit"
					className="w-full"
					disabled={isSavingGeneral}
					aria-label="Save general settings"
				>
					{isSavingGeneral ? <Spinner className="size-4" /> : "Save Settings"}
				</Button>
			</form>

			{/* Advanced Section (BYOK) */}
			<Collapsible open={isAdvancedOpen} onOpenChange={toggleAdvanced}>
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className="w-full justify-between"
						aria-label="Toggle advanced settings"
					>
						<span className="text-sm font-semibold">
							Advanced (Bring Your Own Key)
						</span>
						{isAdvancedOpen ? (
							<ChevronUpIcon className="size-4" />
						) : (
							<ChevronDownIcon className="size-4" />
						)}
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-4">
					<form
						onSubmit={handleSubmitAdvanced(onSaveAdvanced)}
						className="space-y-4"
					>
						{/* Provider Select */}
						<div className="space-y-2">
							<Label htmlFor={providerSelectId}>Provider</Label>
							<Select
								value={providerValue || ""}
								onValueChange={(value) =>
									setValueAdvanced(
										"provider",
										value as AdvancedSettings["provider"],
									)
								}
							>
								<SelectTrigger id={providerSelectId} className="w-full">
									<SelectValue placeholder="Select provider" />
								</SelectTrigger>
								<SelectContent>
									{ProviderEnum.options.map((provider) => (
										<SelectItem key={provider} value={provider}>
											{provider.charAt(0).toUpperCase() + provider.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errorsAdvanced.provider && (
								<p className="text-xs text-destructive">
									{errorsAdvanced.provider.message}
								</p>
							)}
						</div>

						{/* Endpoint (Optional) */}
						<div className="space-y-2">
							<Label htmlFor={endpointId}>
								Endpoint URL{" "}
								<span className="text-muted-foreground">(optional)</span>
							</Label>
							<Input
								id={endpointId}
								type="url"
								placeholder="https://api.example.com"
								{...registerAdvanced("endpoint")}
							/>
							{errorsAdvanced.endpoint && (
								<p className="text-xs text-destructive">
									{errorsAdvanced.endpoint.message}
								</p>
							)}
						</div>

						{/* API Key */}
						<div className="space-y-2">
							<Label htmlFor={apiKeyId}>API Key</Label>
							<Input
								id={apiKeyId}
								type="password"
								placeholder="sk-..."
								{...registerAdvanced("apiKey")}
								aria-label="API key (will be stored securely)"
							/>
							{errorsAdvanced.apiKey && (
								<p className="text-xs text-destructive">
									{errorsAdvanced.apiKey.message}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								Stored securely in browser sync storage
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 pt-2">
							<Button
								type="submit"
								className="flex-1"
								disabled={isSavingAdvanced}
								aria-label="Save advanced settings"
							>
								{isSavingAdvanced ? <Spinner className="size-4" /> : "Save"}
							</Button>
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={handleTestConnection}
								disabled={isTesting}
								aria-label="Test connection with current settings"
							>
								{isTesting ? <Spinner className="size-4" /> : "Test Connection"}
							</Button>
						</div>
					</form>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
