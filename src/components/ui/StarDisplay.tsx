import React from 'react';
import './StarDisplay.css';

interface StarDisplayProps {
  count: 0 | 1 | 2 | 3;
  total?: number;
  size?: 'small' | 'medium' | 'large';
}

export const StarDisplay: React.FC<StarDisplayProps> = ({
  count,
  total = 3,
  size = 'medium'
}) => {
  return (
    <div className={`stars stars--${size}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`star ${i < count ? 'star--filled' : 'star--empty'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};