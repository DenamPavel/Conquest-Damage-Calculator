import { Attacker, Defender } from '../types/UnitTypes';
import { SimulationConfig } from '../types/SimulationTypes';

/**
 * Default attacker configuration
 */
export const DEFAULT_ATTACKER: Attacker = {
  attacks: 4,
  stands: 3,
  clash: 3,
  cleave: 0,
  extraAttacks: 0,
  specialRules: [],
  // Special Rules
  rerolls: 'none',
  deadlyBlades: false,
  flawlessStrikes: false,
  relentlessBlows: false,
  smite: false,
  terrifying: 0,
  torrentialFire: false,
};

/**
 * Default defender configuration
 */
export const DEFAULT_DEFENDER: Defender = {
  defense: 3,
  evasion: 1,
  health: 4,
  currentStands: 3,
  stands: 3,
  morale: 3,
  specialRules: [],
  // Special Rules
  hardened: 0,
  indomitable: 0,
  oblivious: false,
  tenacious: 0,
  defensiveRerolls: 'none',
  moraleRerolls: 'none',
};

/**
 * Default simulation configuration
 */
export const DEFAULT_CONFIG: SimulationConfig = {
  iterations: 10000,
  recordPhaseDetails: false,
};

/**
 * Simulation iteration constraints
 */
export const ITERATION_CONSTRAINTS = {
  min: 1000,
  max: 100000,
  default: 10000,
  step: 1000,
} as const;
