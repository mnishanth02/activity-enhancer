interface StatusTabProps {
	domain: string | null;
}

export function StatusTab({ domain }: StatusTabProps) {
	return (
		<div className="p-6 space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2">Current Site</h3>
				<p className="text-sm text-muted-foreground">
					{domain || "No active site detected"}
				</p>
			</div>
			<div>
				<p className="text-sm text-muted-foreground">
					Status tab content will be implemented in Phase 2
				</p>
			</div>
		</div>
	);
}
