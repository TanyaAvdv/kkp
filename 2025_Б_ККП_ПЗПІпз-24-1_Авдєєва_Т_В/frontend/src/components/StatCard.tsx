import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  primary: 'bg-blue-50 border-blue-200 text-blue-700',
  secondary: 'bg-purple-50 border-purple-200 text-purple-700', 
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  danger: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-cyan-50 border-cyan-200 text-cyan-700',
};

const iconColorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-purple-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-cyan-600',
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-lg border-2 ${colorClasses[color]} p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={`inline-flex items-center text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="mr-1">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {trend.isPositive ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${iconColorClasses[color]} opacity-80`}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 transform rotate-45 rounded-lg bg-white/10"></div>
    </div>
  );
};

export default StatCard; 