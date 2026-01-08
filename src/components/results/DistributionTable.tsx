import React from 'react';
import { SimulationResults } from '../../types/SimulationTypes';
import { formatPercentage } from '../../utils/formatting';

interface DistributionTableProps {
  results: SimulationResults;
}

export const DistributionTable: React.FC<DistributionTableProps> = ({
  results,
}) => {
  // Convert Map to sorted array
  const data = Array.from(results.distributions.damage.entries())
    .map(([damage, probability]) => ({
      damage,
      probability,
    }))
    .sort((a, b) => a.damage - b.damage);

  return (
    <div className="distribution-table">
      <h3>Distribution Data</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Damage</th>
              <th>Probability</th>
              <th>Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              // Calculate cumulative probability
              const cumulative = data
                .slice(0, index + 1)
                .reduce((sum, r) => sum + r.probability, 0);

              return (
                <tr key={row.damage}>
                  <td>{row.damage}</td>
                  <td>{formatPercentage(row.probability)}</td>
                  <td>{formatPercentage(cumulative)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
