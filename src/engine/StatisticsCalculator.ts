import { StatisticalSummary } from '../types/SimulationTypes';

/**
 * Calculate statistical summary from simulation results
 */
export function calculateStatistics(values: number[]): StatisticalSummary {
  const sorted = [...values].sort((a, b) => a - b);
  const n = values.length;

  // Mean
  const mean = values.reduce((sum, v) => sum + v, 0) / n;

  // Variance and Standard Deviation
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Median (50th percentile)
  const median = percentile(sorted, 50);

  // Mode (most common value)
  const mode = calculateMode(values);

  // Percentiles
  const percentiles = {
    p25: percentile(sorted, 25),
    p50: median,
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    p95: percentile(sorted, 95),
  };

  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    min: sorted[0],
    max: sorted[n - 1],
    percentiles,
  };
}

/**
 * Calculate percentile from sorted array
 */
function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;

  const index = (p / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) {
    return sortedValues[lower];
  }

  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

/**
 * Calculate mode (most frequent value)
 */
function calculateMode(values: number[]): number {
  if (values.length === 0) return 0;

  const frequency = new Map<number, number>();

  for (const value of values) {
    frequency.set(value, (frequency.get(value) ?? 0) + 1);
  }

  let maxFreq = 0;
  let mode = values[0];

  for (const [value, freq] of frequency) {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = value;
    }
  }

  return mode;
}

/**
 * Build probability distribution from results
 */
export function buildDistribution(values: number[]): Map<number, number> {
  const distribution = new Map<number, number>();
  const total = values.length;

  if (total === 0) return distribution;

  for (const value of values) {
    distribution.set(value, (distribution.get(value) ?? 0) + 1);
  }

  // Convert counts to probabilities
  for (const [value, count] of distribution) {
    distribution.set(value, count / total);
  }

  return distribution;
}
