import React from 'react';

export default function ScoreBreakdown({ scoreData, title = "Trust Score Breakdown" }) {
  const components = [
    { 
      key: 'crop_health', 
      label: 'Crop Health', 
      weight: 30, 
      color: '#2E7D32',
      icon: '🌱'
    },
    { 
      key: 'yield_performance', 
      label: 'Yield Performance', 
      weight: 25, 
      color: '#1565C0',
      icon: '📊'
    },
    { 
      key: 'sustainability', 
      label: 'Sustainability', 
      weight: 20, 
      color: '#FF8F00',
      icon: '🌍'
    },
    { 
      key: 'historical_compliance', 
      label: 'Historical Compliance', 
      weight: 10, 
      color: '#4CAF50',
      icon: '📋'
    },
    { 
      key: 'behavioral_patterns', 
      label: 'Behavioral Patterns', 
      weight: 10, 
      color: '#2196F3',
      icon: '🔄'
    },
    { 
      key: 'external_verification', 
      label: 'External Verification', 
      weight: 5, 
      color: '#9C27B0',
      icon: '✅'
    }
  ];

  const getScoreLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#2E7D32' };
    if (score >= 60) return { level: 'Good', color: '#4CAF50' };
    if (score >= 40) return { level: 'Average', color: '#FF8F00' };
    if (score >= 20) return { level: 'Below Average', color: '#F57C00' };
    return { level: 'Poor', color: '#D32F2F' };
  };

  const maxBarWidth = 100;
  const chartHeight = 280;

  return (
    <div className="glass-panel">
      <div style={{ marginBottom: '24px' }}>
        <h3 className="heading-md" style={{ marginBottom: '8px' }}>{title}</h3>
        <p className="text-sm">
          How each component contributes to your overall Trust Score
        </p>
      </div>

      <div style={{ height: `${chartHeight}px`, position: 'relative' }}>
        {/* Chart bars */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          height: '100%'
        }}>
          {components.map((component, index) => {
            const componentData = scoreData[component.key] || { raw: 0, weighted: 0 };
            const scoreLevel = getScoreLevel(componentData.raw);
            const barWidth = (componentData.raw / 100) * maxBarWidth;
            
            return (
              <div
                key={component.key}
                className="animate-slide-in"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                {/* Component label */}
                <div style={{ 
                  minWidth: '140px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1rem' }}>{component.icon}</span>
                  <span>{component.label}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)',
                    marginLeft: '4px'
                  }}>
                    ({component.weight}%)
                  </span>
                </div>

                {/* Bar container */}
                <div style={{ 
                  flex: 1,
                  height: '32px',
                  background: 'rgba(148, 163, 184, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Background grid lines */}
                  {[25, 50, 75].map((percentage) => (
                    <div
                      key={percentage}
                      style={{
                        position: 'absolute',
                        left: `${percentage}%`,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        background: 'rgba(148, 163, 184, 0.2)'
                      }}
                    />
                  ))}

                  {/* Progress bar */}
                  <div
                    style={{
                      height: '100%',
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${component.color}88, ${component.color})`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'width 0.8s ease',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '8px'
                    }}
                  >
                    {/* Score text on bar */}
                    <span style={{
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      {componentData.raw}
                    </span>
                  </div>
                </div>

                {/* Score and level */}
                <div style={{ 
                  minWidth: '80px',
                  textAlign: 'right',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ 
                    fontWeight: 600, 
                    color: scoreLevel.color 
                  }}>
                    {componentData.weighted.toFixed(1)}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)' 
                  }}>
                    {scoreLevel.level}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <strong>Formula:</strong> Weighted average of all components
        </div>
        
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#2E7D32', borderRadius: '2px' }} />
            <span>Raw Score</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(46, 125, 50, 0.5)', borderRadius: '2px' }} />
            <span>Weighted Contribution</span>
          </div>
        </div>
      </div>
    </div>
  );
}
