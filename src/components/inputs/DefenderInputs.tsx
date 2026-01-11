import React from 'react';
import { Defender, STAT_CONSTRAINTS } from '../../types/UnitTypes';
import { NumberInput } from '../common/NumberInput';
import { SpecialRulesInput } from './SpecialRulesInput';

interface DefenderInputsProps {
  defender: Defender;
  onChange: (defender: Defender) => void;
}

export const DefenderInputs: React.FC<DefenderInputsProps> = ({
  defender,
  onChange,
}) => {
  const updateField = (field: keyof Defender, value: number) => {
    onChange({ ...defender, [field]: value });
  };

  return (
    <div className="unit-inputs">
      <h3>Defender</h3>
      <NumberInput
        label="Defense"
        value={defender.defense}
        onChange={(value) => updateField('defense', value)}
        min={STAT_CONSTRAINTS.defense.min}
        max={STAT_CONSTRAINTS.defense.max}
      />
      <NumberInput
        label="Evasion"
        value={defender.evasion}
        onChange={(value) => updateField('evasion', value)}
        min={STAT_CONSTRAINTS.evasion.min}
        max={STAT_CONSTRAINTS.evasion.max}
      />
      <NumberInput
        label="Health"
        value={defender.health}
        onChange={(value) => updateField('health', value)}
        min={STAT_CONSTRAINTS.health.min}
        max={STAT_CONSTRAINTS.health.max}
      />
      <NumberInput
        label="Stands"
        value={defender.stands}
        onChange={(value) => updateField('stands', value)}
        min={STAT_CONSTRAINTS.stands.min}
        max={STAT_CONSTRAINTS.stands.max}
      />
      <NumberInput
        label="Morale"
        value={defender.morale}
        onChange={(value) => updateField('morale', value)}
        min={STAT_CONSTRAINTS.morale.min}
        max={STAT_CONSTRAINTS.morale.max}
      />
      <SpecialRulesInput
        unitType="defender"
        unit={defender}
        onChange={(unit) => onChange(unit as Defender)}
      />
    </div>
  );
};
