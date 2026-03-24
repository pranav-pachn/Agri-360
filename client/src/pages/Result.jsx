import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, CheckCircle, ShieldAlert, BadgeInfo, TrendingUp, AlertTriangle, Leaf, Camera } from 'lucide-react';
import TrustScoreGauge from '../components/ui/TrustScoreGauge';
import ScoreBreakdown from '../components/charts/ScoreBreakdown';
import HealthTrend from '../components/charts/HealthTrend';
import HealthIndicator from '../components/ui/HealthIndicator';

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExplainability = async () => {
      try {
        // Mock data for demonstration - in real app this would come from API
        const mockResult = {
          id: id,
          score: 742,
          credit_rating: 'Good',
          timestamp: '2026-03-24T10:30:00Z',
          crop: 'Tomato',
          location: 'Punjab, India',
          image_url: '/api/images/tomato-sample.jpg',
          diagnosis: {
            disease: 'Early Blight',
            confidence: 94.7,
            severity: 'Moderate',
            health_score: 62
          },
          yield_prediction: {
            predicted_yield: 18.5,
            unit: 'tons/hectare',
            confidence: 0.78
          },
          sustainability_index: 72,
          breakdown: {
            crop_health: { raw: 62, weighted: 18.6 },
            yield_performance: { raw: 78, weighted: 19.5 },
            sustainability: { raw: 72, weighted: 14.4 },
            historical_compliance: { raw: 90, weighted: 9.0 },
            behavioral_patterns: { raw: 65, weighted: 6.5 },
            external_verification: { raw: 80, weighted: 4.0 }
          },
          recommendations: [
            {
              type: 'Fungicide',
              product: 'Mancozeb 75% WP',
              dosage: '2.5g/L water',
              frequency: 'Every 7 days for 3 weeks',
              urgency: 'High'
            },
            {
              type: 'Cultural Practice',
              action: 'Remove infected lower leaves',
              urgency: 'Immediate'
            }
          ],
          health_trend: [
            { date: '2024-01', score: 68, label: 'Jan' },
            { date: '2024-02', score: 70, label: 'Feb' },
            { date: '2024-03', score: 65, label: 'Mar' },
            { date: '2024-04', score: 62, label: 'Apr' }
          ]
        };
        
        setData(mockResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    setTimeout(() => {
      fetchExplainability();
    }, 1500); // Simulate loading time
  }, [id]);

  if (loading) {
    return (
      <div className="container animate-fade" style={{ maxWidth: '900px' }}>
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <div className="animate-pulse" style={{ marginBottom: '24px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              border: '4px solid var(--primary)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
          
          <h3 className="heading-md" style={{ marginBottom: '12px' }}>AI Analysis in Progress</h3>
          <p className="text-body">Generating comprehensive crop intelligence and trust score...</p>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="container text-center" style={{ color: 'var(--danger)', padding: '40px' }}>Error: {error}</div>;
  if (!data) return null;

  const getCreditRecommendation = (score) => {
    if (score >= 750) return { max: 500000, rate: '7.5%', term: '24 months', category: 'Low' };
    if (score >= 650) return { max: 350000, rate: '8.5%', term: '18 months', category: 'Low-Medium' };
    if (score >= 550) return { max: 200000, rate: '10.5%', term: '12 months', category: 'Medium' };
    if (score >= 450) return { max: 100000, rate: '12.5%', term: '9 months', category: 'High' };
    return { max: 50000, rate: '15%', term: '6 months', category: 'Very High' };
  };

  const creditRec = getCreditRecommendation(data.score);

  return (
    <div className="container animate-fade" style={{ maxWidth: '1200px' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn-primary" 
        style={{ background: 'transparent', padding: '0', color: 'var(--text-muted)', marginBottom: '32px' }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      {/* Header with Trust Score */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '32px', 
        marginBottom: '40px' 
      }}>
        {/* Trust Score Gauge */}
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <h3 className="heading-md" style={{ marginBottom: '24px' }}>AgriCredit Trust Score</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <TrustScoreGauge score={data.score} size={200} showLabel={true} />
          </div>
          
          <div style={{ 
            padding: '16px',
            background: data.score >= 650 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(255, 143, 0, 0.1)',
            border: `1px solid ${data.score >= 650 ? 'rgba(46, 125, 50, 0.2)' : 'rgba(255, 143, 0, 0.2)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>
              Credit Rating: <span style={{ color: data.score >= 650 ? 'var(--success)' : 'var(--warning)' }}>
                {data.credit_rating}
              </span>
            </div>
            <div className="text-sm">
              Max Loan: ₹{creditRec.max.toLocaleString('en-IN')} • Rate: {creditRec.rate}
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="glass-panel">
          <h3 className="heading-md" style={{ marginBottom: '20px' }}>Analysis Summary</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="flex-between">
              <span className="text-sm">Crop</span>
              <span style={{ fontWeight: 600 }}>{data.crop}</span>
            </div>
            <div className="flex-between">
              <span className="text-sm">Location</span>
              <span style={{ fontWeight: 600 }}>{data.location}</span>
            </div>
            <div className="flex-between">
              <span className="text-sm">Analysis Date</span>
              <span style={{ fontWeight: 600 }}>
                {new Date(data.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <div style={{ 
              padding: '12px',
              background: 'rgba(21, 101, 192, 0.1)',
              border: '1px solid rgba(21, 101, 192, 0.2)',
              borderRadius: 'var(--radius-md)',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BadgeInfo size={16} style={{ color: 'var(--info)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>AI Diagnosis</span>
              </div>
              <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                <strong>{data.diagnosis.disease}</strong> detected with {data.diagnosis.confidence}% confidence
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Severity: {data.diagnosis.severity} • Health Score: {data.diagnosis.health_score}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Indicators */}
      <div style={{ marginBottom: '40px' }}>
        <h3 className="heading-md" style={{ marginBottom: '20px' }}>Health Indicators</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          <HealthIndicator
            title="Crop Health"
            value={data.diagnosis.health_score}
            trend="down"
            icon={<Leaf size={20} />}
          />
          <HealthIndicator
            title="Yield Prediction"
            value={data.yield_prediction.confidence * 100}
            maxValue={100}
            trend="stable"
            icon={<TrendingUp size={20} />}
          />
          <HealthIndicator
            title="Sustainability"
            value={data.sustainability_index}
            trend="up"
            icon={<CheckCircle size={20} />}
          />
        </div>
      </div>

      {/* Score Breakdown and Health Trend */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '32px', 
        marginBottom: '40px' 
      }}>
        <ScoreBreakdown scoreData={data.breakdown} />
        <HealthTrend 
          healthData={data.health_trend} 
          title="Health Score Trend"
          timeRange="4 months"
        />
      </div>

      {/* Recommendations */}
      <div className="glass-panel" style={{ marginBottom: '40px' }}>
        <h3 className="heading-md" style={{ marginBottom: '20px' }}>AI Recommendations</h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {data.recommendations.map((rec, index) => (
            <div 
              key={index}
              className="health-card"
              style={{ 
                borderLeft: `4px solid ${rec.urgency === 'High' ? 'var(--danger)' : rec.urgency === 'Immediate' ? 'var(--danger)' : 'var(--warning)'}`
              }}
            >
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {rec.type}: {rec.product || rec.action}
                  </div>
                  {rec.dosage && (
                    <div className="text-sm" style={{ marginBottom: '4px' }}>
                      Dosage: {rec.dosage}
                    </div>
                  )}
                  {rec.frequency && (
                    <div className="text-sm" style={{ marginBottom: '4px' }}>
                      Frequency: {rec.frequency}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${rec.urgency === 'High' || rec.urgency === 'Immediate' ? 'danger' : 'warning'}`}>
                    {rec.urgency} Priority
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Information */}
      <div className="glass-panel">
        <h3 className="heading-md" style={{ marginBottom: '20px' }}>Credit Opportunity</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(46, 125, 50, 0.05)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>
              ₹{creditRec.max.toLocaleString('en-IN')}
            </div>
            <div className="text-sm">Maximum Loan Amount</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(21, 101, 192, 0.05)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--info)', marginBottom: '8px' }}>
              {creditRec.rate}
            </div>
            <div className="text-sm">Interest Rate</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255, 143, 0, 0.05)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>
              {creditRec.term}
            </div>
            <div className="text-sm">Repayment Term</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(156, 39, 176, 0.05)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9C27B0', marginBottom: '8px' }}>
              {creditRec.category}
            </div>
            <div className="text-sm">Risk Category</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-primary bridge-gradient"
            onClick={() => alert('Loan application flow coming soon!')}
          >
            Apply for Loan
          </button>
          <button 
            className="btn-primary"
            style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
            onClick={() => navigate('/upload')}
          >
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
