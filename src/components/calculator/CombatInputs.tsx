import React from 'react';
import { Attacker, Defender } from '../../types/UnitTypes';
import { SimulationConfig } from '../../types/SimulationTypes';
import { AttackerInputs } from '../inputs/AttackerInputs';
import { DefenderInputs } from '../inputs/DefenderInputs';
import { SimulationControls } from './SimulationControls';

interface CombatInputsProps {
  attacker: Attacker;
  defender: Defender;
  config: SimulationConfig;
  onAttackerChange: (attacker: Attacker) => void;
  onDefenderChange: (defender: Defender) => void;
  onConfigChange: (config: SimulationConfig) => void;
}

export const CombatInputs: React.FC<CombatInputsProps> = ({
  attacker,
  defender,
  config,
  onAttackerChange,
  onDefenderChange,
  onConfigChange,
}) => {
  return (
    <div className="combat-inputs">
      <div className="units-row">
        <AttackerInputs attacker={attacker} onChange={onAttackerChange} />
        <DefenderInputs defender={defender} onChange={onDefenderChange} />
      </div>
      <SimulationControls config={config} onChange={onConfigChange} />
    </div>
  );
};
