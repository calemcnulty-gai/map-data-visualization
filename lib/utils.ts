import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID for data tracking
 * @returns {string} Unique identifier
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert percentile to parent-friendly format
 * @param percentile - The percentile value (1-99)
 * @returns Formatted string like "Top X% or "Bottom X%"
 */
export function formatPercentileForParents(percentile: number): string {
  if (percentile >= 50) {
    // For 50th percentile and above, show as "Top X%"
    const topPercent = 100 - percentile;
    if (topPercent === 0) {
      return 'Top 1%';
    }
    return `Top ${topPercent}%`;
  } else {
    // For below 50th percentile, show as "Bottom X%"
    return `Bottom ${percentile}%`;
  }
} 