import React from 'react';

export default function HealthTrend({ 
  healthData = [], 
  title = "Health Score Trend",
  timeRange = "6 months",
  showAverage = true 
}) {
  // Sample data if none provided
  const defaultData = [
    { date: '2024-01', score: 65, label: 'Jan' },
    { date: '2024-02', score: 68, label: 'Feb' },
    { date: '2024-03', score: 72, label: 'Mar' },
    { date: '2024-04', score: 70, label: 'Apr' },
    { date: '2024-05', score: 75, label: 'May' },
    { date: '2024-06', score: 78, label: 'Jun' }
  ];

  const data = healthData.length > 0 ? healthData : defaultData;
  
  const maxScore = 100;
  const minScore = 0;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = 600;
  const chartInnerWidth = chartWidth - padding.left - padding.right;
  const chartInnerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scale
  const xScale = (index) => (index / (data.length - 1)) * chartInnerWidth;
  const yScale = (score) => chartInnerHeight - ((score - minScore) / (maxScore - minScore)) * chartInnerHeight;

  // Calculate average
  const averageScore = data.reduce((sum, item) => sum + item.score, 0) / data.length;
  const averageY = yScale(averageScore);

  // Generate path for the line
  const linePath = data
    .map((item, index) => {
      const x = xScale(index);
      const y = yScale(item.score);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generate area path
  const areaPath = `${linePath} L ${xScale(data.length - 1)} ${chartInnerHeight} L ${xScale(0)} ${chartInnerHeight} Z`;

  const getScoreColor = (score) => {
    if (score >= 70) return '#2E7D32';
    if (score >= 40) return '#FF8F00';
    return '#D32F2F';
  };

  const getTrend = () => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3);
    const older = data.slice(0, -3);
    const recentAvg = recent.reduce((sum, item) => sum + item.score, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, item) => sum + item.score, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'declining';
    return 'stable';
  };

  const trend = getTrend();
  const trendColor = trend === 'improving' ? '#2E7D32' : trend === 'declining' ? '#D32F2F' : '#FF8F00';

  return (
    <div className="glass-panel">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h3 className="heading-md" style={{ marginBottom: '8px' }}>{title}</h3>
          <p className="text-sm">Health score progression over {timeRange}</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: getScoreColor(data[data.length - 1]?.score || 0) 
          }}>
            {data[data.length - 1]?.score || 0}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: trendColor,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            justifyContent: 'flex-end'
          }}>
            {trend === 'improving' && '📈 Improving'}
            {trend === 'declining' && '📉 Declining'}
            {trend === 'stable' && '➡️ Stable'}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ 
        width: '100%', 
        overflowX: 'auto',
        marginBottom: '16px'
      }}>
        <svg 
          width={chartWidth} 
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ minWidth: '300px' }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((score) => {
            const y = yScale(score);
            return (
              <g key={score}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeDasharray="2,2"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="10"
                >
                  {score}
                </text>
              </g>
            );
          })}

          {/* Average line */}
          {showAverage && (
            <line
              x1={padding.left}
              y1={averageY + padding.top}
              x2={chartWidth - padding.right}
              y2={averageY + padding.top}
              stroke="rgba(255, 143, 0, 0.5)"
              strokeDasharray="4,2"
              strokeWidth="1"
            />
          )}

          {/* Area */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            opacity="0.3"
            transform={`translate(${padding.left}, ${padding.top})`}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${padding.left}, ${padding.top})`}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = xScale(index) + padding.left;
            const y = yScale(item.score) + padding.top;
            const color = getScoreColor(item.score);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color}
                  stroke="var(--bg-card)"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="50%" stopColor="#1565C0" />
              <stop offset="100%" stopColor="#2E7D32" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#2E7D32', borderRadius: '2px' }} />
            <span>Good (70+)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#FF8F00', borderRadius: '2px' }} />
            <span>Fair (40-69)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#D32F2F', borderRadius: '2px' }} />
            <span>Poor (&lt;40)</span>
          </div>
        </div>
        
        {showAverage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '2px', background: '#FF8F00' }} />
            <span>Avg: {averageScore.toFixed(0)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
