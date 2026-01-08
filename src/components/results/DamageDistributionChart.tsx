import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { SimulationResults } from '../../types/SimulationTypes';

interface DamageDistributionChartProps {
  results: SimulationResults;
}

export const DamageDistributionChart: React.FC<DamageDistributionChartProps> = React.memo(({
  results,
}) => {
  // Memoize data transformation to prevent unnecessary recalculations
  const data = useMemo(() => {
    return Array.from(results.distributions.damage.entries())
      .map(([damage, probability]) => ({
        damage,
        probability: probability * 100, // Convert to percentage
      }))
      .sort((a, b) => a.damage - b.damage);
  }, [results.distributions.damage]);

  return (
    <div className="damage-distribution-chart">
      <h3>Damage Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="damage"
            label={{ value: 'Damage', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => typeof value === 'number' ? `${value.toFixed(2)}%` : ''}
            labelFormatter={(label) => `Damage: ${label}`}
          />
          <Bar
            dataKey="probability"
            fill="#8884d8"
            isAnimationActive={false}
          >
            <LabelList
              dataKey="probability"
              position="top"
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
