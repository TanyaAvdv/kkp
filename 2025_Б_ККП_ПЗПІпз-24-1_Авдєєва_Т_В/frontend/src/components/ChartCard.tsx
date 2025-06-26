import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  type: 'bar' | 'pie' | 'line';
  height?: number;
}

const defaultColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
  '#F97316', '#EC4899', '#06B6D4', '#84CC16', '#6366F1'
];

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  data, 
  type, 
  height = 300 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const renderBarChart = () => (
    <div className="space-y-4" style={{ height }}>
      <div className="flex items-end justify-around h-full space-x-2 pb-8">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 max-w-16">
            <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden">
              <div 
                className="w-full transition-all duration-700 ease-out rounded-t-lg"
                style={{
                  height: `${(item.value / maxValue) * (height - 80)}px`,
                  backgroundColor: item.color || defaultColors[index % defaultColors.length]
                }}
              />
            </div>
            <div className="mt-2 text-xs font-medium text-gray-600 text-center truncate w-full">
              {item.label}
            </div>
            <div className="text-sm font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center space-x-8" style={{ height }}>
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || defaultColors[index % defaultColors.length]}
                  stroke="#fff"
                  strokeWidth="3"
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color || defaultColors[index % defaultColors.length] }}
              />
              <span className="text-sm text-gray-700 font-medium">{item.label}</span>
              <span className="text-sm font-bold text-gray-900 ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={`M 25 175 ${data.map((item, index) => {
            const x = (index / (data.length - 1)) * 350 + 25;
            const y = 175 - (item.value / maxValue) * 150;
            return `L ${x} ${y}`;
          }).join(' ')} L ${(data.length - 1) / (data.length - 1) * 350 + 25} 175 Z`}
          fill="url(#gradient)"
        />
        
        {/* Line */}
        <polyline
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 350 + 25;
            const y = 175 - (item.value / maxValue) * 150;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 350 + 25;
          const y = 175 - (item.value / maxValue) * 150;
          
          return (
            <g key={index}>
              <circle cx={x} cy={y} r="5" fill="#fff" stroke="#3B82F6" strokeWidth="3" 
                      className="hover:r-6 transition-all duration-200" />
              <text x={x} y="195" textAnchor="middle" fontSize="12" className="fill-gray-600 font-medium">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="w-full">
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </div>
    </div>
  );
};

export default ChartCard; 