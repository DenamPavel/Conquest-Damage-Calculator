import { useState, useCallback, useEffect, useMemo } from 'react';
import { Attacker, Defender } from '../types/UnitTypes';
import { SimulationConfig, SimulationResults } from '../types/SimulationTypes';
import { ConquestSimulator } from '../engine/ConquestSimulator';
import { DEFAULT_ATTACKER, DEFAULT_DEFENDER, DEFAULT_CONFIG } from '../utils/constants';
import { useDebounce } from './useDebounce';

/**
 * Custom hook encapsulating all simulation logic and state
 */
export function useConquestSimulation() {
  // Input state
  const [attacker, setAttacker] = useState<Attacker>(DEFAULT_ATTACKER);
  const [defender, setDefender] = useState<Defender>(DEFAULT_DEFENDER);
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);

  // Simulation state
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized simulator instance
  const simulator = useMemo(() => new ConquestSimulator(), []);

  // Debounced inputs to avoid excessive simulation runs
  const debouncedAttacker = useDebounce(attacker, 500);
  const debouncedDefender = useDebounce(defender, 500);
  const debouncedConfig = useDebounce(config, 500);

  // Main simulation runner
  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setError(null);

    try {
      // Run in setTimeout to avoid blocking UI
      setTimeout(() => {
        try {
          const simulationResults = simulator.runSimulation(
            debouncedAttacker,
            debouncedDefender,
            debouncedConfig
          );
          setResults(simulationResults);
          setIsSimulating(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Simulation failed');
          setIsSimulating(false);
        }
      }, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
      setIsSimulating(false);
    }
  }, [simulator, debouncedAttacker, debouncedDefender, debouncedConfig]);

  // Auto-run simulation when debounced inputs change
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  return {
    // State
    attacker,
    defender,
    config,
    results,
    isSimulating,
    error,

    // Actions
    setAttacker,
    setDefender,
    setConfig,
    runSimulation,
  };
}
