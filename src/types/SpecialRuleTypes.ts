import { Attacker, Defender } from './UnitTypes';
import { AttackPhaseResult, DefensePhaseResult, DamagePhaseResult, MoralePhaseResult, CombatResolution } from './CombatTypes';

/**
 * Base interface for all special rules
 */
export interface SpecialRule {
  id: string;
  name: string;
  description: string;
  phase: CombatPhase;
}

/**
 * Combat phases where special rules can apply
 */
export enum CombatPhase {
  ATTACK = 'attack',
  DEFENSE = 'defense',
  DAMAGE = 'damage',
  MORALE = 'morale',
}

/**
 * Context passed to special rule hooks
 */
export interface RuleContext {
  randomGenerator: () => number;
  currentIteration?: number;
  previousPhases?: Partial<CombatResolution>;
}

/**
 * Hook for special rule execution
 * Returns modified result based on rule application
 */
export type SpecialRuleHook<T> = (
  baseResult: T,
  attacker: Attacker,
  defender: Defender,
  context: RuleContext
) => T;

/**
 * Registry for special rule implementations
 */
export interface SpecialRuleRegistry {
  attackPhaseRules: Map<string, SpecialRuleHook<AttackPhaseResult>>;
  defensePhaseRules: Map<string, SpecialRuleHook<DefensePhaseResult>>;
  damagePhaseRules: Map<string, SpecialRuleHook<DamagePhaseResult>>;
  moralePhaseRules: Map<string, SpecialRuleHook<MoralePhaseResult>>;
}

/**
 * Create a default empty rule registry
 */
export function createDefaultRuleRegistry(): SpecialRuleRegistry {
  return {
    attackPhaseRules: new Map(),
    defensePhaseRules: new Map(),
    damagePhaseRules: new Map(),
    moralePhaseRules: new Map(),
  };
}

/**
 * Example special rules for future implementation
 */
export const EXAMPLE_RULES = {
  BRUTAL: {
    id: 'brutal',
    name: 'Brutal',
    description: '+1 damage per hit',
    phase: CombatPhase.DAMAGE,
  },
  FEARLESS: {
    id: 'fearless',
    name: 'Fearless',
    description: 'Ignore morale wounds',
    phase: CombatPhase.MORALE,
  },
} as const;
