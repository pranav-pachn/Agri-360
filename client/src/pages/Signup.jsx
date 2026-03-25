import { ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SupabaseGoogleLogin } from '../components/GoogleLogin';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const heroStats = useMemo(
    () => [
      { label: 'Field Risk Alerts', value: 'Actionable' },
      { label: 'Crop Health Signals', value: 'AI-guided' },
      { label: 'Loan Trust Profile', value: 'Lender-ready' },
    ],
    []
  );

  const handleGoogleSuccess = () => {
    setError(null);
  };

  const handleGoogleError = (signupError) => {
    setError(signupError.message || 'Google signup failed');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await signUp({ email, password });
      if (authError) throw authError;
    } catch (signupError) {
      setError(signupError.message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell animate-fade">
      <div className="auth-wrapper signup-wrapper">
        <section className="auth-hero reveal reveal-2">
          <div className="auth-brand-badge">
            <Leaf size={16} />
            AgriMitra 360
          </div>

          <h1 className="auth-hero-title signup-title">
            Create your account and start making <span>better field decisions</span>
          </h1>

          <p className="auth-hero-copy">
            Join farmers and agri teams using one platform to monitor crop health, reduce risk, and build stronger records for funding.
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

        <div className="glass-panel auth-card auth-card-elevated reveal reveal-4">
          <div className="auth-card-header">
            <div className="auth-logo-ring">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="auth-eyebrow">New Account</p>
              <h2 className="heading-lg">Start free on AgriMitra 360</h2>
            </div>
          </div>

          <p className="text-body auth-subtitle">
            Create your workspace in minutes and begin tracking crop, risk, and trust signals.
          </p>

          <form onSubmit={handleSignup} className="auth-form">
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
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <div className="auth-error-banner">{error}</div>}

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create free account'}
            </button>

            <div className="auth-divider">
              <span className="auth-divider-text">OR</span>
            </div>

            <SupabaseGoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

            <Link to="/login" className="auth-link-button auth-link-anchor">
              Already have an account? Sign In
              <ArrowRight size={16} />
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
