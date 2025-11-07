import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for proper Tailwind class merging
 *
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged class string with Tailwind conflicts resolved
 *
 * @example
 * cn("px-4", "px-6") // "px-6" (later value wins)
 * cn("px-4", condition && "bg-red-500") // "px-4 bg-red-500" (if condition is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
