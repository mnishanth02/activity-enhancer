import React from "react";
import ReactDOM from "react-dom/client";
import "@/assets/style.css";
import { Button } from "@/components/ui/button";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<div className="">
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<Button>Button</Button>
		</div>
	</React.StrictMode>,
);
