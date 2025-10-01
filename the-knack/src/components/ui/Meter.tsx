import React from 'react';
import './Meter.css';

interface MeterProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  icon?: string;
}

export const Meter: React.FC<MeterProps> = ({
  label,
  value,
  max = 100,
  color = '#4CAF50',
  icon
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  return (
    <div className="meter">
      <div className="meter__header">
        {icon && <span className="meter__icon">{icon}</span>}
        <span className="meter__label">{label}</span>
        <span className="meter__value">{value}</span>
      </div>
      <div className="meter__bar">
        <div
          className="meter__fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};