import { STAT_CONSTRAINTS } from '../types/UnitTypes';
import { ITERATION_CONSTRAINTS } from './constants';

/**
 * Validate a numeric stat value
 */
export function validateStat(
  value: number,
  statName: keyof typeof STAT_CONSTRAINTS
): { valid: boolean; error?: string } {
  const constraints = STAT_CONSTRAINTS[statName];

  if (isNaN(value)) {
    return { valid: false, error: `${statName} must be a number` };
  }

  if (value < constraints.min) {
    return { valid: false, error: `${statName} must be at least ${constraints.min}` };
  }

  if (value > constraints.max) {
    return { valid: false, error: `${statName} cannot exceed ${constraints.max}` };
  }

  if (!Number.isInteger(value)) {
    return { valid: false, error: `${statName} must be a whole number` };
  }

  return { valid: true };
}

/**
 * Validate simulation iteration count
 */
export function validateIterations(value: number): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: 'Iterations must be a number' };
  }

  if (value < ITERATION_CONSTRAINTS.min) {
    return { valid: false, error: `Iterations must be at least ${ITERATION_CONSTRAINTS.min}` };
  }

  if (value > ITERATION_CONSTRAINTS.max) {
    return { valid: false, error: `Iterations cannot exceed ${ITERATION_CONSTRAINTS.max}` };
  }

  if (!Number.isInteger(value)) {
    return { valid: false, error: 'Iterations must be a whole number' };
  }

  return { valid: true };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
