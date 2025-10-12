export function Header() {
	return (
		<header className="border-b px-6 py-4">
			<div className="flex items-center gap-3">
				<div
					className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
					aria-hidden="true"
				>
					<span className="text-white font-bold text-sm">AE</span>
				</div>
				<div>
					<h1 className="text-lg font-semibold">Activity Enhancer</h1>
					<p className="text-xs text-muted-foreground">
						AI-powered activity descriptions
					</p>
				</div>
			</div>
		</header>
	);
}
