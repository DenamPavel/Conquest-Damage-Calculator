/**
 * Result of the attack phase
 */
export interface AttackPhaseResult {
  totalDiceRolled: number;
  hits: number;
  diceRolls?: number[]; // Optional for debugging
}

/**
 * Result of the defense phase
 */
export interface DefensePhaseResult {
  incomingHits: number;
  totalDefenseRolls: number;
  hitsBlocked: number;
  hitsRemaining: number;
  defenseRolls?: number[]; // Optional for debugging
}

/**
 * Result of the damage phase
 */
export interface DamagePhaseResult {
  damage: number;
  standsKilled: number;
  fractionalStands: number; // Remaining partial stand damage
}

/**
 * Result of the morale phase
 */
export interface MoralePhaseResult {
  moraleRollsNeeded: number;
  moraleWounds: number;
  moraleRolls?: number[]; // Optional for debugging
}

/**
 * Complete combat resolution for a single iteration
 */
export interface CombatResolution {
  attackPhase: AttackPhaseResult;
  defensePhase: DefensePhaseResult;
  damagePhase: DamagePhaseResult;
  moralePhase: MoralePhaseResult;
}
