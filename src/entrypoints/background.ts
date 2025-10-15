export default defineBackground(() => {
	// Enable session storage access from content scripts
	// By default, session storage is only accessible from trusted contexts (background/popup)
	// We need to explicitly allow content scripts to access it for cross-page state
	browser.storage.session
		.setAccessLevel({
			accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
		})
		.then(() => {
			console.log("Session storage access level set for content scripts");
		})
		.catch((error) => {
			console.error("Failed to set session storage access level:", error);
		});
});
