import React from 'react';
import { Attacker, Defender } from '../../types/UnitTypes';
import { SimulationConfig } from '../../types/SimulationTypes';
import { AttackerInputs } from '../inputs/AttackerInputs';
import { DefenderInputs } from '../inputs/DefenderInputs';
import { SpecialRulesInput } from '../inputs/SpecialRulesInput';
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
      <div className="special-rules-row">
        <SpecialRulesInput
          unitType="attacker"
          unit={attacker}
          onChange={(unit) => onAttackerChange(unit as Attacker)}
        />
        <SpecialRulesInput
          unitType="defender"
          unit={defender}
          onChange={(unit) => onDefenderChange(unit as Defender)}
        />
      </div>
      <SimulationControls config={config} onChange={onConfigChange} />
    </div>
  );
};
