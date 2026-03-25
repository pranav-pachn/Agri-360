import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Leaf, LogIn, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SupabaseGoogleLogin } from '../components/GoogleLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const heroStats = useMemo(
    () => [
      { label: 'AI Crop Analysis', value: 'Real-time' },
      { label: 'Loan Readiness', value: 'Trust-based' },
      { label: 'Farmer Decisioning', value: 'Actionable' },
    ],
    []
  );

  const handleGoogleSuccess = (userInfo) => {
    console.log('Google login successful:', userInfo);
    setError(null);
    // Navigation will be handled by the AuthContext
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
    setError(error.message || 'Google login failed');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn({ email, password });
        
      if (error) throw error;
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell animate-fade">
      <div className="auth-wrapper">
        <section className="auth-hero">
          <div className="auth-brand-badge">
            <Leaf size={16} />
            AgriMitra 360
          </div>

          <h1 className="auth-hero-title">
            AI agriculture workflow for <span>farmers and lending teams</span>
          </h1>

          <p className="auth-hero-copy">
            Monitor crop intelligence, review farm risk, and prepare trust-backed records from one practical dashboard.
          </p>

          <div className="auth-stat-grid">
            {heroStats.map((stat) => (
              <div key={stat.label} className="auth-stat-card">
                <span>{stat.value}</span>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </section>

        <div className="glass-panel auth-card auth-card-elevated">
          <div className="auth-card-header">
            <div className="auth-logo-ring">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="auth-eyebrow">Secure Access</p>
              <h2 className="heading-lg">Login to your dashboard</h2>
            </div>
          </div>

          <p className="text-body auth-subtitle">
            Access your AI crop insights, farmer performance, and lending readiness signals.
          </p>

          <form onSubmit={handleAuth} className="auth-form">
            <div className="auth-field-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input-field auth-input"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error-banner">{error}</div>}

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {/* Google Login Divider */}
            <div className="auth-divider">
              <span className="auth-divider-text">OR</span>
            </div>

            {/* Google Login Button */}
            <SupabaseGoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <Link to="/signup" className="auth-link-button auth-link-anchor">
              Create account
              <ArrowRight size={16} />
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
