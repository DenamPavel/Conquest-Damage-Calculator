import React from 'react';
import { SimulationResults } from '../../types/SimulationTypes';
import { StatCard } from '../common/StatCard';
import { formatExecutionTime } from '../../utils/formatting';

interface StatisticsSummaryProps {
  results: SimulationResults;
}

export const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({
  results,
}) => {
  // Calculate total damage (clash damage + morale damage)
  const totalDamage = results.statistics.damage.mean + results.statistics.moraleWounds.mean;

  return (
    <div className="statistics-summary">
      <h3>Results Summary</h3>
      <div className="stat-cards-grid">
        <StatCard
          title="Average Clash Damage"
          value={results.statistics.damage.mean}
          subtitle={`Std Dev: ${results.statistics.damage.stdDev.toFixed(2)}`}
        />
        <StatCard
          title="Average Morale Damage"
          value={results.statistics.moraleWounds.mean}
          subtitle={`Std Dev: ${results.statistics.moraleWounds.stdDev.toFixed(2)}`}
        />
        <StatCard
          title="Average Stands Killed"
          value={results.statistics.standsKilled.mean}
          subtitle={`Max: ${results.statistics.standsKilled.max}`}
        />
        <StatCard
          title="Average Total Damage"
          value={totalDamage}
          subtitle={`Clash + Morale`}
        />
      </div>
    </div>
  );
};
