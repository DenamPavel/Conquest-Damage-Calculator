import { Attacker, Defender } from '../types/UnitTypes';
import {
  AttackPhaseResult,
  DefensePhaseResult,
  DamagePhaseResult,
  MoralePhaseResult
} from '../types/CombatTypes';
import { SpecialRuleRegistry } from '../types/SpecialRuleTypes';
import { DiceRoller } from './DiceRoller';

/**
 * Phase 1: Attack Phase
 * Roll (Attacks × Stands + Extra Attacks) d6 dice, hits on rolls ≤ Clash stat
 * Relentless Blows: Rolls of 1 generate 2 hits instead of 1
 */
export function attackPhase(
  attacker: Attacker,
  diceRoller: DiceRoller,
  ruleRegistry: SpecialRuleRegistry
): AttackPhaseResult {
  const totalDice = (attacker.attacks * attacker.stands) + attacker.extraAttacks;
  const rolls = diceRoller.rollMultiple(totalDice);

  // Count hits, applying Relentless Blows if active
  let hits = 0;
  for (const roll of rolls) {
    if (roll <= attacker.clash) {
      // Relentless Blows: Rolls of 1 generate 2 hits
      if (attacker.relentlessBlows && roll === 1) {
        hits += 2;
      } else {
        hits += 1;
      }
    }
  }

  // Base result before special rules
  let result: AttackPhaseResult = {
    totalDiceRolled: totalDice,
    hits,
    diceRolls: rolls,
  };

  // Apply special rules
  for (const rule of attacker.specialRules) {
    const hook = ruleRegistry.attackPhaseRules.get(rule.id);
    if (hook) {
      result = hook(result, attacker, {} as Defender, {
        randomGenerator: () => diceRoller.roll()
      });
    }
  }

  return result;
}

/**
 * Phase 2: Defense Phase
 * Defender rolls 1d6 per hit, removes hits on rolls ≤ Defense OR Evasion
 * Cleave reduces the defender's defense value
 * Hardened reduces the attacker's Cleave value
 */
export function defensePhase(
  attacker: Attacker,
  defender: Defender,
  incomingHits: number,
  diceRoller: DiceRoller,
  ruleRegistry: SpecialRuleRegistry
): DefensePhaseResult {
  const rolls = diceRoller.rollMultiple(incomingHits);

  // Apply hardened: reduce cleave by hardened amount, minimum 0
  const effectiveCleave = Math.max(0, attacker.cleave - defender.hardened);

  // Apply cleave: reduce defense by effective cleave amount, but not below 1
  const effectiveDefense = Math.max(1, defender.defense - effectiveCleave);

  // Hit is blocked if roll ≤ (Defense - Cleave) OR roll ≤ Evasion
  const hitsBlocked = rolls.filter(
    roll => roll <= effectiveDefense || roll <= defender.evasion
  ).length;

  let result: DefensePhaseResult = {
    incomingHits,
    totalDefenseRolls: incomingHits,
    hitsBlocked,
    hitsRemaining: incomingHits - hitsBlocked,
    defenseRolls: rolls,
  };

  // Apply special rules
  for (const rule of defender.specialRules) {
    const hook = ruleRegistry.defensePhaseRules.get(rule.id);
    if (hook) {
      result = hook(result, attacker, defender, {
        randomGenerator: () => diceRoller.roll()
      });
    }
  }

  return result;
}

/**
 * Phase 3: Damage Phase
 * Remaining hits = damage. Calculate stands lost (damage ÷ Health)
 */
export function damagePhase(
  defender: Defender,
  hitsRemaining: number,
  ruleRegistry: SpecialRuleRegistry
): DamagePhaseResult {
  const damage = hitsRemaining;
  const standsKilled = Math.floor(damage / defender.health);
  const fractionalStands = damage % defender.health;

  let result: DamagePhaseResult = {
    damage,
    standsKilled,
    fractionalStands,
  };

  // Apply special rules
  for (const rule of defender.specialRules) {
    const hook = ruleRegistry.damagePhaseRules.get(rule.id);
    if (hook) {
      result = hook(result, {} as Attacker, defender, {
        randomGenerator: () => 0 // Damage phase typically doesn't need randomness
      });
    }
  }

  return result;
}

/**
 * Phase 4: Morale Phase
 * Roll 1d6 per damage point, each roll > Morale = 1 additional wound
 */
export function moralePhase(
  defender: Defender,
  damage: number,
  diceRoller: DiceRoller,
  ruleRegistry: SpecialRuleRegistry
): MoralePhaseResult {
  if (damage === 0) {
    return {
      moraleRollsNeeded: 0,
      moraleWounds: 0,
      moraleRolls: [],
    };
  }

  const rolls = diceRoller.rollMultiple(damage);
  const moraleWounds = rolls.filter(roll => roll > defender.morale).length;

  let result: MoralePhaseResult = {
    moraleRollsNeeded: damage,
    moraleWounds,
    moraleRolls: rolls,
  };

  // Apply special rules
  for (const rule of defender.specialRules) {
    const hook = ruleRegistry.moralePhaseRules.get(rule.id);
    if (hook) {
      result = hook(result, {} as Attacker, defender, {
        randomGenerator: () => diceRoller.roll()
      });
    }
  }

  return result;
}
