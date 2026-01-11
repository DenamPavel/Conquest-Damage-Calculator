import { Attacker, Defender } from '../types/UnitTypes';
import {
  SimulationConfig,
  SimulationResults,
  SingleSimulationResult
} from '../types/SimulationTypes';
import { CombatResolution } from '../types/CombatTypes';
import { SpecialRuleRegistry, createDefaultRuleRegistry } from '../types/SpecialRuleTypes';
import { DiceRoller } from './DiceRoller';
import { attackPhase, defensePhase, damagePhase, moralePhase } from './CombatPhases';
import { calculateStatistics, buildDistribution } from './StatisticsCalculator';

/**
 * Main Monte Carlo simulation orchestrator
 */
export class ConquestSimulator {
  private diceRoller: DiceRoller;
  private specialRuleRegistry: SpecialRuleRegistry;

  constructor(randomSeed?: number) {
    this.diceRoller = new DiceRoller(randomSeed);
    this.specialRuleRegistry = createDefaultRuleRegistry();
  }

  /**
   * Execute Monte Carlo simulation
   *
   * Algorithm:
   * 1. For each iteration (1 to N):
   *    a. Run attack phase
   *    b. Run defense phase
   *    c. Run damage phase
   *    d. Run morale phase
   *    e. Record results
   * 2. Aggregate results into distributions
   * 3. Calculate statistics (mean, std dev, percentiles)
   * 4. Return comprehensive results object
   */
  public runSimulation(
    attacker: Attacker,
    defender: Defender,
    config: SimulationConfig
  ): SimulationResults {
    const startTime = performance.now();
    const results: SingleSimulationResult[] = [];

    // Phase 1: Run Monte Carlo iterations
    for (let i = 0; i < config.iterations; i++) {
      const combatResolution = this.resolveOneCombat(attacker, defender);
      results.push(this.extractSingleResult(combatResolution, defender));
    }

    // Phase 2: Build distributions
    const distributions = this.buildDistributions(results);

    // Phase 3: Calculate statistics
    const statistics = this.calculateAllStatistics(results);

    const executionTimeMs = performance.now() - startTime;

    return {
      config,
      attacker,
      defender,
      statistics,
      distributions,
      executionTimeMs,
      timestamp: new Date(),
    };
  }

  /**
   * Resolve a single combat encounter
   */
  private resolveOneCombat(
    attacker: Attacker,
    defender: Defender
  ): CombatResolution {
    // Phase 1: Attack Phase
    const attackResult = attackPhase(
      attacker,
      this.diceRoller,
      this.specialRuleRegistry
    );

    // Phase 2: Defense Phase
    const defenseResult = defensePhase(
      attacker,
      defender,
      attackResult,
      this.diceRoller,
      this.specialRuleRegistry
    );

    // Phase 3: Damage Phase
    const damageResult = damagePhase(
      defender,
      defenseResult.hitsRemaining,
      this.specialRuleRegistry
    );

    // Phase 4: Morale Phase
    const moraleResult = moralePhase(
      defender,
      damageResult.damage,
      this.diceRoller,
      this.specialRuleRegistry,
      attacker
    );

    return {
      attackPhase: attackResult,
      defensePhase: defenseResult,
      damagePhase: damageResult,
      moralePhase: moraleResult,
    };
  }

  /**
   * Extract single result from combat resolution
   */
  private extractSingleResult(resolution: CombatResolution, defender: Defender): SingleSimulationResult {
    const clashDamage = resolution.damagePhase.damage;
    const moraleWounds = resolution.moralePhase.moraleWounds;
    const totalDamage = clashDamage + moraleWounds;

    // Calculate total stands killed including morale damage
    const standsKilled = Math.floor(totalDamage / defender.health);

    return {
      attackPhaseHits: resolution.attackPhase.hits,
      defensePhaseHitsRemaining: resolution.defensePhase.hitsRemaining,
      damageDealt: clashDamage,
      standsKilled,
      moraleWounds,
      totalCasualties: standsKilled,
    };
  }

  /**
   * Build probability distributions from all results
   */
  private buildDistributions(results: SingleSimulationResult[]) {
    return {
      damage: buildDistribution(results.map(r => r.damageDealt)),
      standsKilled: buildDistribution(results.map(r => r.standsKilled)),
      totalCasualties: buildDistribution(results.map(r => r.totalCasualties)),
    };
  }

  /**
   * Calculate statistics for all metrics
   */
  private calculateAllStatistics(results: SingleSimulationResult[]) {
    return {
      damage: calculateStatistics(results.map(r => r.damageDealt)),
      standsKilled: calculateStatistics(results.map(r => r.standsKilled)),
      moraleWounds: calculateStatistics(results.map(r => r.moraleWounds)),
      totalCasualties: calculateStatistics(results.map(r => r.totalCasualties)),
    };
  }
}
