import React from 'react';
import { Attacker, STAT_CONSTRAINTS } from '../../types/UnitTypes';
import { NumberInput } from '../common/NumberInput';

interface AttackerInputsProps {
  attacker: Attacker;
  onChange: (attacker: Attacker) => void;
}

export const AttackerInputs: React.FC<AttackerInputsProps> = ({
  attacker,
  onChange,
}) => {
  const updateField = (field: keyof Attacker, value: number) => {
    onChange({ ...attacker, [field]: value });
  };

  return (
    <div className="unit-inputs">
      <h3>Attacker</h3>
      <NumberInput
        label="Attacks"
        value={attacker.attacks}
        onChange={(value) => updateField('attacks', value)}
        min={STAT_CONSTRAINTS.attacks.min}
        max={STAT_CONSTRAINTS.attacks.max}
      />
      <NumberInput
        label="Stands"
        value={attacker.stands}
        onChange={(value) => updateField('stands', value)}
        min={STAT_CONSTRAINTS.stands.min}
        max={STAT_CONSTRAINTS.stands.max}
      />
      <NumberInput
        label="Clash"
        value={attacker.clash}
        onChange={(value) => updateField('clash', value)}
        min={STAT_CONSTRAINTS.clash.min}
        max={STAT_CONSTRAINTS.clash.max}
      />
      <NumberInput
        label="Cleave"
        value={attacker.cleave}
        onChange={(value) => updateField('cleave', value)}
        min={STAT_CONSTRAINTS.cleave.min}
        max={STAT_CONSTRAINTS.cleave.max}
      />
      <NumberInput
        label="Extra Attacks"
        value={attacker.extraAttacks}
        onChange={(value) => updateField('extraAttacks', value)}
        min={STAT_CONSTRAINTS.extraAttacks.min}
        max={STAT_CONSTRAINTS.extraAttacks.max}
      />
    </div>
  );
};
