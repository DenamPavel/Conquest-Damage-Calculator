import React from 'react';
import { formatNumber } from '../../utils/formatting';

interface StatCardProps {
  title: string;
  value: number;
  decimals?: number;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  decimals = 2,
  subtitle,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-value">{formatNumber(value, decimals)}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );
};
