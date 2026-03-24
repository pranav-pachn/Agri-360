import React from 'react';

export default function TrustScoreGauge({ score, size = 200, showLabel = true }) {
  const percentage = ((score - 300) / 600) * 100; // Convert 300-900 range to 0-100%
  const rotation = (percentage * 180) / 100 - 90; // Convert to rotation angle (-90 to 90)
  
  const getScoreColor = (score) => {
    if (score >= 750) return 'var(--success)';      // Excellent
    if (score >= 650) return 'var(--primary)';     // Good
    if (score >= 550) return 'var(--warning)';     // Fair
    if (score >= 450) return 'var(--accent)';      // Below Average
    return 'var(--danger)';                        // Poor
  };

  const getScoreRating = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    if (score >= 450) return 'Below Average';
    return 'Poor';
  };

  const strokeColor = getScoreColor(score);
  const rating = getScoreRating(score);

  return (
    <div className="score-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth="12"
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
        
        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 502.4} 502.4`}
          transform="rotate(-90 100 100)"
          className="animate-fade"
        />
        
        {/* Scale markers */}
        {[0, 25, 50, 75, 100].map((marker, index) => {
          const angle = (marker * 180) / 100 - 90;
          const x1 = 100 + 70 * Math.cos((angle * Math.PI) / 180);
          const y1 = 100 + 70 * Math.sin((angle * Math.PI) / 180);
          const x2 = 100 + 60 * Math.cos((angle * Math.PI) / 180);
          const y2 = 100 + 60 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Center text */}
        <text
          x="100"
          y="90"
          textAnchor="middle"
          className="score-value"
          fill={strokeColor}
          style={{ fontSize: `${size / 12}px` }}
        >
          {score}
        </text>
        
        <text
          x="100"
          y="110"
          textAnchor="middle"
          className="score-label"
          fill="var(--text-muted)"
          style={{ fontSize: `${size / 20}px` }}
        >
          TRUST SCORE
        </text>
      </svg>
      
      {showLabel && (
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <div 
            className="badge"
            style={{
              background: strokeColor === 'var(--success)' ? 'rgba(46, 125, 50, 0.1)' :
                         strokeColor === 'var(--primary)' ? 'rgba(46, 125, 50, 0.1)' :
                         strokeColor === 'var(--warning)' ? 'rgba(255, 143, 0, 0.1)' :
                         strokeColor === 'var(--accent)' ? 'rgba(255, 143, 0, 0.1)' :
                         'rgba(211, 47, 47, 0.1)',
              color: strokeColor,
              border: `1px solid ${strokeColor}33`
            }}
          >
            {rating}
          </div>
        </div>
      )}
    </div>
  );
}
