/**
 * Format a number to a specified number of decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format a probability (0-1) as a percentage
 */
export function formatPercentage(probability: number, decimals: number = 1): string {
  return `${(probability * 100).toFixed(decimals)}%`;
}

/**
 * Format execution time in milliseconds
 */
export function formatExecutionTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format a large number with commas
 */
export function formatWithCommas(value: number): string {
  return value.toLocaleString();
}
