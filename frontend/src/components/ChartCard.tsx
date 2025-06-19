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

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  data, 
  type, 
  height = 300 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const renderBarChart = () => (
    <div className="bar-chart" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="bar-item">
          <div 
            className="bar"
            style={{
              height: `${(item.value / maxValue) * 80}%`,
              backgroundColor: item.color || `hsl(${index * 45}, 70%, 50%)`
            }}
          />
          <div className="bar-label">{item.label}</div>
          <div className="bar-value">{item.value}</div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="pie-chart" style={{ height }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
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
                fill={item.color || `hsl(${index * 45}, 70%, 50%)`}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: item.color || `hsl(${index * 45}, 70%, 50%)` }}
              />
              <span>{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="line-chart" style={{ height }}>
      <svg width="100%" height="100%" viewBox="0 0 400 200">
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 350 + 25;
          const y = 175 - (item.value / maxValue) * 150;
          
          return (
            <g key={index}>
              <circle cx={x} cy={y} r="4" fill="#1976d2" />
              {index > 0 && (
                <line
                  x1={(index - 1) / (data.length - 1) * 350 + 25}
                  y1={175 - (data[index - 1].value / maxValue) * 150}
                  x2={x}
                  y2={y}
                  stroke="#1976d2"
                  strokeWidth="2"
                />
              )}
              <text x={x} y="195" textAnchor="middle" fontSize="12">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'line' && renderLineChart()}
      </div>
    </div>
  );
};

export default ChartCard; 