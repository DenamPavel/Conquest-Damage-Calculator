import { Attacker, Defender, RerollOption } from '../types/UnitTypes';
import {
  AttackPhaseResult,
  DefensePhaseResult,
  DamagePhaseResult,
  MoralePhaseResult
} from '../types/CombatTypes';
import { SpecialRuleRegistry } from '../types/SpecialRuleTypes';
import { DiceRoller } from './DiceRoller';

/**
 * Helper function to apply reroll logic
 */
function applyRerolls(
  rolls: number[],
  rerollOption: RerollOption,
  threshold: number,
  diceRoller: DiceRoller
): number[] {
  if (rerollOption === 'none') {
    return rolls;
  }

  const newRolls = [...rolls];
  for (let i = 0; i < newRolls.length; i++) {
    const roll = newRolls[i];
    const isFailed = roll > threshold;

    if (rerollOption === 'reroll_sixes' && roll === 6) {
      newRolls[i] = diceRoller.roll();
    } else if (rerollOption === 'reroll_failures' && isFailed) {
      newRolls[i] = diceRoller.roll();
    }
  }

  return newRolls;
}

/**
 * Helper function to ignore failed rolls, prioritizing 6s
 */
function ignoreFailedRolls(
  rolls: number[],
  threshold: number,
  ignoreCount: number
): { newRolls: number[]; ignored: number } {
  if (ignoreCount === 0) {
    return { newRolls: rolls, ignored: 0 };
  }

  const failedIndices: number[] = [];
  const failedSixIndices: number[] = [];

  // Find all failed rolls and separate out the 6s
  rolls.forEach((roll, idx) => {
    if (roll > threshold) {
      failedIndices.push(idx);
      if (roll === 6) {
        failedSixIndices.push(idx);
      }
    }
  });

  // Prioritize 6s, then other failed rolls
  const toIgnore = [
    ...failedSixIndices,
    ...failedIndices.filter(idx => !failedSixIndices.includes(idx))
  ].slice(0, ignoreCount);

  const newRolls = rolls.map((roll, idx) => {
    if (toIgnore.includes(idx)) {
      return 0; // Mark as ignored (will be treated as success)
    }
    return roll;
  });

  return { newRolls, ignored: toIgnore.length };
}

/**
 * Phase 1: Attack Phase
 * Roll (Attacks × Stands + Extra Attacks) d6 dice, hits on rolls ≤ Clash stat
 *
 * Order:
 * 1. Roll attack dice
 * 2. Apply Attacker Rerolls
 * 3. Apply Relentless Blows (1s generate 2 hits)
 * 4. Apply Flawless Strikes (1s set defense to 0 - tracked for later)
 * 5. Apply Torrential Fire (generate extra hits)
 */
export function attackPhase(
  attacker: Attacker,
  diceRoller: DiceRoller,
  ruleRegistry: SpecialRuleRegistry
): AttackPhaseResult {
  const totalDice = (attacker.attacks * attacker.stands) + attacker.extraAttacks;

  // Step 1: Roll attack dice
  let rolls = diceRoller.rollMultiple(totalDice);

  // Step 2: Apply Attacker Rerolls
  rolls = applyRerolls(rolls, attacker.rerolls, attacker.clash, diceRoller);

  // Step 3 & 4: Count hits, applying Relentless Blows
  let hits = 0;
  let flawlessStrikesHits = 0;

  for (const roll of rolls) {
    if (roll <= attacker.clash) {
      if (roll === 1) {
        // Apply Relentless Blows (1s generate 2 hits)
        if (attacker.relentlessBlows) {
          hits += 2;
        } else {
          hits += 1;
        }

        // Track Flawless Strikes (1s set defense to 0 for those hits)
        if (attacker.flawlessStrikes) {
          flawlessStrikesHits += (attacker.relentlessBlows ? 2 : 1);
        }
      } else {
        hits += 1;
      }
    }
  }

  // Step 5: Apply Torrential Fire (generate extra hits for every 2 hits)
  if (attacker.torrentialFire) {
    const extraHits = Math.floor(hits / 2);
    hits += extraHits;
  }

  // Base result before special rules registry
  let result: AttackPhaseResult = {
    totalDiceRolled: totalDice,
    hits,
    diceRolls: rolls,
  };

  // Apply special rules from registry (for extensibility)
  for (const rule of attacker.specialRules) {
    const hook = ruleRegistry.attackPhaseRules.get(rule.id);
    if (hook) {
      result = hook(result, attacker, {} as Defender, {
        randomGenerator: () => diceRoller.roll()
      });
    }
  }

  // Store flawless strikes hits for defense phase
  (result as any).flawlessStrikesHits = flawlessStrikesHits;

  return result;
}

/**
 * Phase 2: Defense Phase
 * Defender rolls 1d6 per hit, removes hits on rolls ≤ Defense OR Evasion
 *
 * Order:
 * 1. Apply Smite (set defense to 0)
 * 2. Apply Cleave (reduce defense, but Hardened reduces cleave first)
 * 3. Roll defense dice
 * 4. Apply Defensive Rerolls
 * 5. Apply Tenacious (ignore failed defense rolls, prioritizing 6s)
 * 6. Apply Deadly Blades (failed defense 6s cause 2 wounds)
 * 7. Calculate wounds
 */
export function defensePhase(
  attacker: Attacker,
  defender: Defender,
  attackResult: AttackPhaseResult,
  diceRoller: DiceRoller,
  ruleRegistry: SpecialRuleRegistry
): DefensePhaseResult {
  const incomingHits = attackResult.hits;

  // Step 1: Apply Smite (set defense to 0)
  let baseDefense = defender.defense;
  if (attacker.smite) {
    baseDefense = 0;
  }

  // Step 2: Apply Cleave with Hardened
  const effectiveCleave = Math.max(0, attacker.cleave - defender.hardened);
  let effectiveDefense = Math.max(0, baseDefense - effectiveCleave);

  // Track Flawless Strikes hits separately
  const flawlessStrikesHits = (attackResult as any).flawlessStrikesHits || 0;

  // Step 3: Roll defense dice
  let rolls = diceRoller.rollMultiple(incomingHits);

  // Apply Flawless Strikes to specific hits (set defense to 0 for those)
  // For simplicity, we'll apply it to the first N hits where N = flawlessStrikesHits
  const modifiedRolls = rolls.map((roll, idx) => {
    if (idx < flawlessStrikesHits) {
      // These hits bypass defense completely (defense = 0)
      return roll > defender.evasion ? roll : 0; // Only evasion can block
    }
    return roll;
  });

  // Step 4: Apply Defensive Rerolls
  const rerolledRolls = applyRerolls(
    modifiedRolls,
    defender.defensiveRerolls,
    Math.max(effectiveDefense, defender.evasion),
    diceRoller
  );

  // Step 5: Apply Tenacious
  const { newRolls: tenacityRolls } = ignoreFailedRolls(
    rerolledRolls,
    Math.max(effectiveDefense, defender.evasion),
    defender.tenacious
  );

  // Step 6 & 7: Count blocked hits and apply Deadly Blades
  let hitsBlocked = 0;
  let wounds = 0;

  for (let i = 0; i < tenacityRolls.length; i++) {
    const roll = tenacityRolls[i];
    const currentDefense = i < flawlessStrikesHits ? 0 : effectiveDefense;

    const isBlocked = roll <= currentDefense || roll <= defender.evasion || roll === 0;

    if (isBlocked) {
      hitsBlocked++;
    } else {
      // Failed defense - check for Deadly Blades
      if (attacker.deadlyBlades && roll === 6) {
        wounds += 2;
      } else {
        wounds += 1;
      }
    }
  }

  let result: DefensePhaseResult = {
    incomingHits,
    totalDefenseRolls: incomingHits,
    hitsBlocked,
    hitsRemaining: wounds, // Use wounds instead of simple count
    defenseRolls: rolls,
  };

  // Apply special rules from registry
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

  // Apply special rules from registry
  for (const rule of defender.specialRules) {
    const hook = ruleRegistry.damagePhaseRules.get(rule.id);
    if (hook) {
      result = hook(result, {} as Attacker, defender, {
        randomGenerator: () => 0
      });
    }
  }

  return result;
}

/**
 * Phase 4: Morale Phase
 * Roll 1d6 per damage point, each roll > Morale = 1 additional wound
 *
 * Order:
 * 1. Roll morale checks
 * 2. Apply Morale Rerolls
 * 3. Apply Indomitable (ignore failed morale saves, prioritizing 6s)
 * 4. Apply Oblivious (only 1 damage per 2 failed morale checks)
 * 5. Calculate final morale damage
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

  // Step 1: Roll morale checks
  let rolls = diceRoller.rollMultiple(damage);

  // Step 2: Apply Morale Rerolls
  rolls = applyRerolls(rolls, defender.moraleRerolls, defender.morale, diceRoller);

  // Step 3: Apply Indomitable
  const { newRolls: indomitableRolls } = ignoreFailedRolls(
    rolls,
    defender.morale,
    defender.indomitable
  );

  // Count failed morale checks
  let failedMoraleChecks = indomitableRolls.filter(roll => roll > defender.morale).length;

  // Step 4: Apply Oblivious
  let moraleWounds = failedMoraleChecks;
  if (defender.oblivious) {
    moraleWounds = Math.floor(failedMoraleChecks / 2);
  }

  let result: MoralePhaseResult = {
    moraleRollsNeeded: damage,
    moraleWounds,
    moraleRolls: rolls,
  };

  // Apply special rules from registry
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
