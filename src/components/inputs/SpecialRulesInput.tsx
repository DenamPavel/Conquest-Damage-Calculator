import React from 'react';

interface SpecialRulesInputProps {
  unitType: 'attacker' | 'defender';
}

/**
 * Placeholder component for special rules
 * Will be implemented in Phase 2
 */
export const SpecialRulesInput: React.FC<SpecialRulesInputProps> = ({
  unitType,
}) => {
  return (
    <div className="special-rules-input">
      <h4>Special Rules</h4>
      <p className="placeholder-text">Special rules will be added in a future update</p>
    </div>
  );
};
