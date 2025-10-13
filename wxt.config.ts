import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	modules: ["@wxt-dev/module-react"],
	manifest: () => ({
		name: "Activity Enhancer",
		description: "Enhance your activity experience on various platforms.",
		version: "1.0.0",
		permissions: [
			"storage",
			"tabs",
			"notifications",
			"activeTab",
			"scripting",
			"background",
		],
	}),
});
