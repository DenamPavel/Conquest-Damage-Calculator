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
    value: RerollOption,
    tooltip: string
  ) => (
    <div style={{ marginBottom: '12px' }} title={tooltip}>
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
          {renderRerollSelect(
            'Attacker Rerolls',
            'rerolls',
            (unit as Attacker).rerolls,
            'Reroll 6s or all failed attack rolls'
          )}

          <Checkbox
            label="Deadly Blades"
            checked={(unit as Attacker).deadlyBlades}
            onChange={(checked) => updateField('deadlyBlades', checked)}
            tooltip="Failed defense rolls of 6 cause 2 wounds instead of 1"
          />

          <Checkbox
            label="Flawless Strikes"
            checked={(unit as Attacker).flawlessStrikes}
            onChange={(checked) => updateField('flawlessStrikes', checked)}
            tooltip="Hit rolls of 1 set defense to 0 for those hits"
          />

          <Checkbox
            label="Relentless Blows"
            checked={(unit as Attacker).relentlessBlows}
            onChange={(checked) => updateField('relentlessBlows', checked)}
            tooltip="Hit rolls of 1 generate 2 hits instead of 1"
          />

          <Checkbox
            label="Smite"
            checked={(unit as Attacker).smite}
            onChange={(checked) => updateField('smite', checked)}
            tooltip="Set defender's defense to 0"
          />

          <NumberInput
            label="Terrifying"
            value={(unit as Attacker).terrifying}
            onChange={(value) => updateField('terrifying', value)}
            min={0}
            max={6}
            tooltip="Reduces defender's morale by this amount (min 0). Morale rolls of 1 always succeed"
          />

          <Checkbox
            label="Torrential Fire"
            checked={(unit as Attacker).torrentialFire}
            onChange={(checked) => updateField('torrentialFire', checked)}
            tooltip="Generate 1 extra hit for every 2 hits rolled"
          />
        </>
      )}

      {unitType === 'defender' && (
        <>
          {renderRerollSelect(
            'Defensive Rerolls',
            'defensiveRerolls',
            (unit as Defender).defensiveRerolls,
            'Reroll 6s or all failed defense rolls against hits'
          )}
          {renderRerollSelect(
            'Morale Rerolls',
            'moraleRerolls',
            (unit as Defender).moraleRerolls,
            'Reroll 6s or all failed morale rolls'
          )}

          <NumberInput
            label="Hardened"
            value={(unit as Defender).hardened}
            onChange={(value) => updateField('hardened', value)}
            min={0}
            max={6}
            tooltip="Reduces attacker's Cleave by this amount (minimum 0)"
          />

          <NumberInput
            label="Indomitable"
            value={(unit as Defender).indomitable}
            onChange={(value) => updateField('indomitable', value)}
            min={0}
            max={10}
            tooltip="Ignores this many failed morale saves, prioritizing failed 6s after rerolls"
          />

          <Checkbox
            label="Oblivious"
            checked={(unit as Defender).oblivious}
            onChange={(checked) => updateField('oblivious', checked)}
            tooltip="Only suffer 1 damage for every 2 failed morale checks"
          />

          <NumberInput
            label="Tenacious"
            value={(unit as Defender).tenacious}
            onChange={(value) => updateField('tenacious', value)}
            min={0}
            max={10}
            tooltip="Ignores this many failed defense rolls, prioritizing failed 6s after rerolls"
          />
        </>
      )}
    </div>
  );
};
