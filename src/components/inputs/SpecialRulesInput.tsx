import React from 'react';
import { Attacker, Defender, RerollOption } from '../../types/UnitTypes';
import { Checkbox } from '../common/Checkbox';
import { NumberInput } from '../common/NumberInput';

interface SpecialRulesInputProps {
  unitType: 'attacker' | 'defender';
  unit: Attacker | Defender;
  onChange: (unit: Attacker | Defender) => void;
}

/**
 * Special Rules Input Component
 * Handles all special rules for both attackers and defenders
 */
export const SpecialRulesInput: React.FC<SpecialRulesInputProps> = ({
  unitType,
  unit,
  onChange,
}) => {
  const updateField = <K extends keyof (Attacker & Defender)>(
    field: K,
    value: any
  ) => {
    onChange({ ...unit, [field]: value });
  };

  const renderRerollSelect = (
    label: string,
    field: 'rerolls' | 'defensiveRerolls' | 'moraleRerolls',
    value: RerollOption
  ) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => updateField(field, e.target.value as RerollOption)}
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}
      >
        <option value="none">None</option>
        <option value="reroll_sixes">Reroll 6s</option>
        <option value="reroll_failures">Reroll All Failures</option>
      </select>
    </div>
  );

  return (
    <div>
      {unitType === 'attacker' && (
        <>
          {renderRerollSelect('Attacker Rerolls', 'rerolls', (unit as Attacker).rerolls)}

          <Checkbox
            label="Deadly Blades"
            checked={(unit as Attacker).deadlyBlades}
            onChange={(checked) => updateField('deadlyBlades', checked)}
          />

          <Checkbox
            label="Flawless Strikes"
            checked={(unit as Attacker).flawlessStrikes}
            onChange={(checked) => updateField('flawlessStrikes', checked)}
          />

          <Checkbox
            label="Relentless Blows"
            checked={(unit as Attacker).relentlessBlows}
            onChange={(checked) => updateField('relentlessBlows', checked)}
          />

          <Checkbox
            label="Smite"
            checked={(unit as Attacker).smite}
            onChange={(checked) => updateField('smite', checked)}
          />

          <Checkbox
            label="Torrential Fire"
            checked={(unit as Attacker).torrentialFire}
            onChange={(checked) => updateField('torrentialFire', checked)}
          />
        </>
      )}

      {unitType === 'defender' && (
        <>
          {renderRerollSelect('Defensive Rerolls', 'defensiveRerolls', (unit as Defender).defensiveRerolls)}
          {renderRerollSelect('Morale Rerolls', 'moraleRerolls', (unit as Defender).moraleRerolls)}

          <NumberInput
            label="Hardened"
            value={(unit as Defender).hardened}
            onChange={(value) => updateField('hardened', value)}
            min={0}
            max={6}
          />

          <NumberInput
            label="Indomitable"
            value={(unit as Defender).indomitable}
            onChange={(value) => updateField('indomitable', value)}
            min={0}
            max={10}
          />

          <Checkbox
            label="Oblivious"
            checked={(unit as Defender).oblivious}
            onChange={(checked) => updateField('oblivious', checked)}
          />

          <NumberInput
            label="Tenacious"
            value={(unit as Defender).tenacious}
            onChange={(value) => updateField('tenacious', value)}
            min={0}
            max={10}
          />
        </>
      )}
    </div>
  );
};
