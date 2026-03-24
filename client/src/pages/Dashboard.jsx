import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { Plus, LogOut, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import TrustScoreGauge from '../components/ui/TrustScoreGauge';
import HealthIndicator from '../components/ui/HealthIndicator';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(742); // Mock data - would come from API
  const [healthData, setHealthData] = useState({
    cropHealth: 78,
    yieldPerformance: 85,
    sustainability: 72
  });

  useEffect(() => {
    loadAnalyses();
    loadTrustScore();

    // 🚀 WINNING FEATURE: Supabase Realtime Subscription
    // Subscribe to any insert/update on crop_reports so the dashboard auto-updates
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crop_reports' },
        (payload) => {
          console.log('Realtime Update Received:', payload);
          // Auto-refresh the dashboard data
          loadAnalyses();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await api.get('/analysis');
      setAnalyses(data || []);
    } catch (err) {
      console.error("Failed to load analyses:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrustScore = async () => {
    try {
      // Mock data - in real app this would come from API
      const mockTrustScore = {
        score: 742,
        breakdown: {
          crop_health: { raw: 78, weighted: 23.4 },
          yield_performance: { raw: 85, weighted: 21.25 },
          sustainability: { raw: 72, weighted: 14.4 },
          historical_compliance: { raw: 90, weighted: 9.0 },
          behavioral_patterns: { raw: 65, weighted: 6.5 },
          external_verification: { raw: 80, weighted: 4.0 }
        }
      };
      setTrustScore(mockTrustScore.score);
    } catch (err) {
      console.error("Failed to load trust score:", err);
    }
  };

  const getRecentHealthTrend = () => {
    // Mock trend data
    return Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
  };

  return (
    <div className="container animate-fade">
      <header className="flex-between" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="heading-xl bridge-gradient-text">AgriMitra Dashboard</h1>
          <p className="text-body" style={{ marginTop: '8px' }}>
            Welcome back, {user?.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/upload')} className="btn-primary bridge-gradient">
            <Plus size={20} /> New Analysis
          </button>
          <button 
            onClick={() => signOut()} 
            className="btn-primary" 
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Trust Score Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px', 
        marginBottom: '40px' 
      }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <h3 className="heading-md" style={{ marginBottom: '24px' }}>Your Trust Score</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <TrustScoreGauge score={trustScore} size={180} showLabel={true} />
          </div>
          <div style={{ 
            padding: '12px 16px',
            background: trustScore >= 650 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(255, 143, 0, 0.1)',
            border: `1px solid ${trustScore >= 650 ? 'rgba(46, 125, 50, 0.2)' : 'rgba(255, 143, 0, 0.2)'}`,
            borderRadius: 'var(--radius-md)',
            color: trustScore >= 650 ? 'var(--success)' : 'var(--warning)',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {trustScore >= 750 ? 'Excellent - Eligible for premium loans' :
             trustScore >= 650 ? 'Good - Standard loan terms available' :
             trustScore >= 550 ? 'Fair - Some restrictions may apply' :
             trustScore >= 450 ? 'Below Average - Limited options' :
             'Poor - Financial improvement needed'}
          </div>
        </div>

        <div>
          <h3 className="heading-md" style={{ marginBottom: '16px' }}>Health Indicators</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <HealthIndicator
              title="Crop Health"
              value={healthData.cropHealth}
              trend={getRecentHealthTrend()}
              icon={<Activity size={20} />}
            />
            <HealthIndicator
              title="Yield Performance"
              value={healthData.yieldPerformance}
              trend="up"
              icon={<TrendingUp size={20} />}
            />
            <HealthIndicator
              title="Sustainability"
              value={healthData.sustainability}
              trend="stable"
              icon={<CheckCircle size={20} />}
            />
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h2 className="heading-md">Recent Analyses</h2>
          <button 
            onClick={() => navigate('/upload')}
            className="btn-primary"
            style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', fontSize: '0.875rem' }}
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel loading-skeleton" style={{ height: '180px' }} />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
            <Activity size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
            <h3 className="heading-md" style={{ marginBottom: '8px' }}>No Analyses Yet</h3>
            <p className="text-body" style={{ marginBottom: '24px' }}>Upload your first crop image to generate a Trust Score.</p>
            <button onClick={() => navigate('/upload')} className="btn-primary">
              <Plus size={20} /> Start Your First Analysis
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {analyses.map(record => (
              <div 
                key={record.id} 
                className="glass-panel interactive" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/result/${record.id}`)}
              >
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{record.crop}</span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    background: record.trust_score >= 650 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(255, 143, 0, 0.1)',
                    color: record.trust_score >= 650 ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {record.trust_score} Score
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex-between">
                    <span className="text-sm">Location</span>
                    <span className="text-sm" style={{ color: 'var(--text-main)' }}>{record.location}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-sm">Health Index</span>
                    <span className="text-sm" style={{ color: 'var(--text-main)' }}>{record.health}/100</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-sm">Yield</span>
                    <span className="text-sm" style={{ color: 'var(--text-main)' }}>{record.yield} t/ha</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px' }}>
        <h3 className="heading-md" style={{ marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <button 
            onClick={() => navigate('/upload')}
            className="glass-panel interactive"
            style={{ 
              padding: '20px', 
              textAlign: 'center', 
              border: '1px solid var(--primary)',
              background: 'rgba(46, 125, 50, 0.05)'
            }}
          >
            <Plus size={24} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>New Analysis</div>
            <div className="text-sm">Upload crop image</div>
          </button>
          
          <button 
            className="glass-panel interactive"
            style={{ 
              padding: '20px', 
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => alert('Trust Score details coming soon!')}
          >
            <TrendingUp size={24} style={{ color: 'var(--secondary)', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>View Score Details</div>
            <div className="text-sm">Breakdown & trends</div>
          </button>
          
          <button 
            className="glass-panel interactive"
            style={{ 
              padding: '20px', 
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => alert('Loan application coming soon!')}
          >
            <AlertTriangle size={24} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Apply for Loan</div>
            <div className="text-sm">Use your trust score</div>
          </button>
        </div>
      </div>
    </div>
  );
}
