import { SpecialRule } from './SpecialRuleTypes';

/**
 * Base unit statistics shared between attacker and defender
 */
export interface BaseUnit {
  stands: number;
  specialRules: SpecialRule[];
}

/**
 * Attacking unit configuration
 */
export interface Attacker extends BaseUnit {
  attacks: number; // Attacks per stand
  clash: number; // Hit threshold (1-6)
  cleave: number; // Reduces defender's defense by this amount
  extraAttacks: number; // Additional dice added to attack pool
  relentlessBlows: boolean; // Rolls of 1 generate 2 hits instead of 1
}

/**
 * Defending unit configuration
 */
export interface Defender extends BaseUnit {
  defense: number; // Defender's defense stat (1-6)
  evasion: number; // Defender's evasion stat (1-6)
  health: number; // Wounds per stand
  currentStands: number; // Stands remaining (for multi-round)
  morale: number; // Morale stat (1-6)
  hardened: number; // Reduces attacker's Cleave by this amount
}

/**
 * Validation constraints for unit stats
 */
export const STAT_CONSTRAINTS = {
  attacks: { min: 1, max: 10, default: 3 },
  stands: { min: 1, max: 10, default: 3 },
  clash: { min: 1, max: 6, default: 4 },
  cleave: { min: 0, max: 6, default: 0 },
  extraAttacks: { min: 0, max: 20, default: 0 },
  defense: { min: 1, max: 6, default: 4 },
  evasion: { min: 1, max: 6, default: 5 },
  health: { min: 1, max: 10, default: 3 },
  morale: { min: 1, max: 6, default: 4 },
  hardened: { min: 0, max: 6, default: 0 },
} as const;
