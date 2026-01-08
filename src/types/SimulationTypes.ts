import { Attacker, Defender } from './UnitTypes';

/**
 * Configuration for Monte Carlo simulation
 */
export interface SimulationConfig {
  iterations: number; // Number of simulations to run
  randomSeed?: number; // Optional seed for reproducibility
  recordPhaseDetails?: boolean; // Whether to track phase-by-phase data
}

/**
 * Result of a single simulation run
 */
export interface SingleSimulationResult {
  attackPhaseHits: number;
  defensePhaseHitsRemaining: number;
  damageDealt: number;
  standsKilled: number;
  moraleWounds: number;
  totalCasualties: number;
}

/**
 * Statistical summary for a metric
 */
export interface StatisticalSummary {
  mean: number;
  median: number;
  mode: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
}

/**
 * Phase-by-phase breakdown (optional detailed tracking)
 */
export interface PhaseBreakdown {
  attackPhase: {
    averageHits: number;
    hitsDistribution: Map<number, number>;
  };
  defensePhase: {
    averageBlocked: number;
    blockedDistribution: Map<number, number>;
  };
  damagePhase: {
    averageDamage: number;
    damageDistribution: Map<number, number>;
  };
  moralePhase: {
    averageWounds: number;
    woundsDistribution: Map<number, number>;
  };
}

/**
 * Aggregated results from all simulation runs
 */
export interface SimulationResults {
  config: SimulationConfig;
  attacker: Attacker;
  defender: Defender;

  // Statistical summaries
  statistics: {
    damage: StatisticalSummary;
    standsKilled: StatisticalSummary;
    moraleWounds: StatisticalSummary;
    totalCasualties: StatisticalSummary;
  };

  // Distribution data for visualization
  distributions: {
    damage: Map<number, number>; // damage value -> probability
    standsKilled: Map<number, number>; // stands killed -> probability
    totalCasualties: Map<number, number>;
  };

  // Optional detailed phase data
  phaseDetails?: PhaseBreakdown;

  // Metadata
  executionTimeMs: number;
  timestamp: Date;
}
