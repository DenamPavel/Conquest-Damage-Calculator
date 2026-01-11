import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  tooltip?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  tooltip,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(newValue, min), max));
    }
  };

  return (
    <div className="number-input" title={tooltip}>
      <label htmlFor={label}>
        {label}
        <input
          id={label}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
