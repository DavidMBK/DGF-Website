import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Unisce classi Tailwind risolvendo i conflitti. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
