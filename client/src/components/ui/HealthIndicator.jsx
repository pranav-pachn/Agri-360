import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function HealthIndicator({ 
  title, 
  value, 
  maxValue = 100, 
  trend = 'stable', 
  status = 'healthy',
  icon,
  showDetails = true 
}) {
  const getHealthStatus = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 70) return { status: 'healthy', color: 'var(--success)', icon: CheckCircle };
    if (percentage >= 40) return { status: 'warning', color: 'var(--warning)', icon: AlertTriangle };
    return { status: 'critical', color: 'var(--danger)', icon: XCircle };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} />;
      case 'down': return <TrendingDown size={16} />;
      default: return <Minus size={16} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'var(--success)';
      case 'down': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  const healthStatus = getHealthStatus(value, maxValue);
  const percentage = Math.round((value / maxValue) * 100);
  const StatusIcon = healthStatus.icon;

  return (
    <div className={`health-card ${healthStatus.status}`}>
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && <div style={{ color: healthStatus.color }}>{icon}</div>}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {percentage}% of optimal
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getTrendColor(trend) }}>
            {getTrendIcon(trend)}
          </div>
          <StatusIcon size={20} style={{ color: healthStatus.color }} />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: healthStatus.color }}>
            {value}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            / {maxValue}
          </span>
        </div>
        
        {/* Progress bar */}
        <div style={{ 
          background: 'rgba(148, 163, 184, 0.1)', 
          borderRadius: 'var(--radius-full)', 
          height: '8px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              background: healthStatus.color,
              height: '100%',
              width: `${percentage}%`,
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {showDetails && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <span className={`badge badge-${healthStatus.status === 'healthy' ? 'success' : healthStatus.status === 'warning' ? 'warning' : 'danger'}`}>
            {healthStatus.status.charAt(0).toUpperCase() + healthStatus.status.slice(1)}
          </span>
          
          {trend !== 'stable' && (
            <span style={{ fontSize: '0.75rem', color: getTrendColor(trend) }}>
              {trend === 'up' ? 'Improving' : 'Declining'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
