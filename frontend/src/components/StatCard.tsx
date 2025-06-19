import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend 
}) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-card-title">{title}</div>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
      <div className="stat-card-value">{value}</div>
      {trend && (
        <div className={`stat-card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
          <span className="trend-icon">
            {trend.isPositive ? '↗' : '↘'}
          </span>
          <span className="trend-value">{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
  );
};

export default StatCard; 