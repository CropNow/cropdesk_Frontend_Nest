import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names with Tailwind conflict resolution.
 *
 * @param inputs - Class values (strings, arrays, objects, conditionals)
 * @returns A single merged className string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
