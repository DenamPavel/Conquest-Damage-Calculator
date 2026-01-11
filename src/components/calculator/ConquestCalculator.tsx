import React from 'react';
import { useConquestSimulation } from '../../hooks/useConquestSimulation';
import { AttackerInputs } from '../inputs/AttackerInputs';
import { DefenderInputs } from '../inputs/DefenderInputs';
import { SpecialRulesInput } from '../inputs/SpecialRulesInput';
import { SimulationControls } from './SimulationControls';
import { DamageDistributionChart } from '../results/DamageDistributionChart';
import { DistributionTable } from '../results/DistributionTable';
import { StatisticsSummary } from '../results/StatisticsSummary';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Attacker, Defender } from '../../types/UnitTypes';
import { formatExecutionTime } from '../../utils/formatting';

export const ConquestCalculator: React.FC = () => {
  const {
    attacker,
    defender,
    config,
    results,
    isSimulating,
    error,
    setAttacker,
    setDefender,
    setConfig,
  } = useConquestSimulation();

  return (
    <div className="conquest-calculator">
      <header className="calculator-header">
        <h1>Conquest Damage Calculator</h1>
        <p>Monte Carlo damage simulator for the Conquest tabletop game</p>
      </header>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {results && <StatisticsSummary results={results} />}

      <div className="three-column-grid">
        <div className="column-1">
          <AttackerInputs attacker={attacker} onChange={setAttacker} />
          <DefenderInputs defender={defender} onChange={setDefender} />
        </div>
        <div className="column-2">
          <div className="special-rules-box">
            <h3>Attacker Special Rules</h3>
            <div className="special-rules-content">
              <SpecialRulesInput
                unitType="attacker"
                unit={attacker}
                onChange={(unit) => setAttacker(unit as Attacker)}
              />
            </div>
          </div>
          <div className="special-rules-box">
            <h3>Defender Special Rules</h3>
            <div className="special-rules-content">
              <SpecialRulesInput
                unitType="defender"
                unit={defender}
                onChange={(unit) => setDefender(unit as Defender)}
              />
            </div>
          </div>
        </div>
        <div className="column-3" style={{ position: 'relative' }}>
          {isSimulating && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: '10px'
            }}>
              <LoadingSpinner />
            </div>
          )}
          {results && (
            <>
              <DamageDistributionChart results={results} />
              <DistributionTable results={results} />
            </>
          )}
          {!results && !isSimulating && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#6c757d',
              background: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <p>Results will appear here after simulation</p>
            </div>
          )}
        </div>
      </div>

      <div className="simulation-settings-bottom">
        <SimulationControls config={config} onChange={setConfig} />
      </div>

      {results && !isSimulating && (
        <div className="execution-info-bottom">
          <p>
            Simulation completed in {formatExecutionTime(results.executionTimeMs)}{' '}
            ({results.config.iterations.toLocaleString()} iterations)
          </p>
        </div>
      )}
    </div>
  );
};
