import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared loading skeleton for tab content
 * Provides consistent loading experience across all tabs
 */
export function TabLoadingSkeleton() {
	return (
		<div className="p-6 space-y-6">
			{/* Header skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-5 w-48" />
			</div>

			{/* Toggle/Control skeleton */}
			<div className="flex items-center justify-between py-3 border-y">
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-48" />
				</div>
				<Skeleton className="h-6 w-11 rounded-full" />
			</div>

			{/* Content section skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-8 w-32" />
			</div>

			{/* Card skeleton */}
			<div className="rounded-lg border p-4 space-y-3">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-3 w-3/4" />
			</div>
		</div>
	);
}

/**
 * Skeleton for settings form fields
 */
export function SettingsLoadingSkeleton() {
	return (
		<div className="p-6 space-y-6">
			{/* General Settings Section */}
			<div className="space-y-4">
				<Skeleton className="h-5 w-32" />

				{/* Select field */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-10 w-full rounded-md" />
				</div>

				{/* Checkbox */}
				<div className="flex items-center space-x-2">
					<Skeleton className="h-4 w-4 rounded" />
					<Skeleton className="h-4 w-40" />
				</div>

				{/* Pro features */}
				<div className="space-y-3">
					<Skeleton className="h-4 w-28" />
					<div className="flex items-center space-x-2">
						<Skeleton className="h-4 w-4 rounded" />
						<Skeleton className="h-4 w-36" />
					</div>
				</div>
			</div>

			{/* Save button */}
			<Skeleton className="h-10 w-full rounded-md" />

			{/* Advanced section */}
			<div className="border-t pt-4">
				<Skeleton className="h-10 w-full rounded-md" />
			</div>
		</div>
	);
}

/**
 * Skeleton for account view
 */
export function AccountLoadingSkeleton() {
	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<Skeleton className="h-6 w-48 mx-auto" />
				<Skeleton className="h-4 w-64 mx-auto" />
			</div>

			{/* Features list */}
			<div className="space-y-3">
				<Skeleton className="h-4 w-24" />
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="flex items-start gap-3">
						<Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
						<div className="space-y-1 flex-1">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-full" />
						</div>
					</div>
				))}
			</div>

			{/* Pricing cards */}
			<div className="grid gap-3">
				<Skeleton className="h-24 w-full rounded-lg" />
				<Skeleton className="h-24 w-full rounded-lg" />
			</div>
		</div>
	);
}
