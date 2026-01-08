import React from 'react';
import { SimulationResults as SimulationResultsType } from '../../types/SimulationTypes';
import { StatisticsSummary } from '../results/StatisticsSummary';
import { DamageDistributionChart } from '../results/DamageDistributionChart';
import { DistributionTable } from '../results/DistributionTable';

interface SimulationResultsProps {
  results: SimulationResultsType;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  results,
}) => {
  return (
    <div className="simulation-results">
      <StatisticsSummary results={results} />
      <DamageDistributionChart results={results} />
      <DistributionTable results={results} />
    </div>
  );
};
