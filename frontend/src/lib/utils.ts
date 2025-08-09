import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join classNames together.
 * @param {...*} inputs - Class names to join.
 * @returns {string} - The merged class name string.
 */
export function cn(...inputs: (string | undefined)[]) {
    return twMerge(clsx(...inputs));
}