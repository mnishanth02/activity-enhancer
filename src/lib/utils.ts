import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateUniqueKey(prefix = "key") {
	const randomPart = Math.random().toString(36).substring(2, 10);
	const timestamp = Date.now().toString(36);
	return `${prefix}-${timestamp}-${randomPart}`;
}
