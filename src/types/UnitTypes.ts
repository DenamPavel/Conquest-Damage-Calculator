import { SpecialRule } from './SpecialRuleTypes';

/**
 * Base unit statistics shared between attacker and defender
 */
export interface BaseUnit {
  stands: number;
  specialRules: SpecialRule[];
}

/**
 * Reroll options for attack and defense
 */
export type RerollOption = 'none' | 'reroll_sixes' | 'reroll_failures';

/**
 * Attacking unit configuration
 */
export interface Attacker extends BaseUnit {
  attacks: number; // Attacks per stand
  clash: number; // Hit threshold (1-6)
  cleave: number; // Reduces defender's defense by this amount
  extraAttacks: number; // Additional dice added to attack pool

  // Special Rules
  rerolls: RerollOption; // Reroll 6s or all failures on attack rolls
  deadlyBlades: boolean; // Failed defense rolls of 6 cause 2 wounds instead of 1
  flawlessStrikes: boolean; // Hit rolls of 1 set defense to 0 for those hits
  relentlessBlows: boolean; // Hit rolls of 1 generate 2 hits instead of 1
  smite: boolean; // Set defender's defense to 0
  terrifying: number; // Reduces defender's morale by this amount (min 0), but morale rolls of 1 always succeed
  torrentialFire: boolean; // Generate extra hits for every 2 hits rolled
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

  // Special Rules
  hardened: number; // Reduces attacker's Cleave by this amount
  indomitable: number; // Ignores X failed morale saves, prioritizing failed 6s
  oblivious: boolean; // Only suffer 1 damage for every 2 failed morale checks
  tenacious: number; // Ignores X failed defense rolls, prioritizing failed 6s
  defensiveRerolls: RerollOption; // Reroll 6s or all failures on defense rolls
  moraleRerolls: RerollOption; // Reroll 6s or all failures on morale rolls
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
