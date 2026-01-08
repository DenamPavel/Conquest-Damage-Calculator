import React from 'react';
import { SimulationConfig } from '../../types/SimulationTypes';
import { ITERATION_CONSTRAINTS } from '../../utils/constants';
import { formatWithCommas } from '../../utils/formatting';

interface SimulationControlsProps {
  config: SimulationConfig;
  onChange: (config: SimulationConfig) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  config,
  onChange,
}) => {
  const handleIterationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onChange({ ...config, iterations: value });
    }
  };

  return (
    <div className="simulation-controls">
      <h3>Simulation Settings</h3>
      <div className="iterations-control">
        <label htmlFor="iterations">
          Iterations: {formatWithCommas(config.iterations)}
        </label>
        <input
          id="iterations"
          type="range"
          min={ITERATION_CONSTRAINTS.min}
          max={ITERATION_CONSTRAINTS.max}
          step={ITERATION_CONSTRAINTS.step}
          value={config.iterations}
          onChange={handleIterationsChange}
        />
        <div className="range-labels">
          <span>{formatWithCommas(ITERATION_CONSTRAINTS.min)}</span>
          <span>{formatWithCommas(ITERATION_CONSTRAINTS.max)}</span>
        </div>
      </div>
    </div>
  );
};
