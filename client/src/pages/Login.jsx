import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleAuth = async (e, isSignUp) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = isSignUp 
        ? await signUp({ email, password })
        : await signIn({ email, password });
        
      if (error) throw error;
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper animate-fade">
      <div className="glass-panel auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-lg gradient-text" style={{ marginBottom: '8px' }}>AgriMitra 360</h1>
          <p className="text-body">The Intelligence Bridge between Farms & Finance</p>
        </div>

        <form onSubmit={(e) => handleAuth(e, false)}>
          <div style={{ marginBottom: '16px' }}>
            <label className="input-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="farmer@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              <LogIn size={20} />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
            <button 
              type="button" 
              onClick={(e) => handleAuth(e, true)} 
              className="btn-primary" 
              style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
              disabled={loading}
            >
              Create Account
            </button>

            <div style={{ position: 'relative', margin: '16px 0', textAlign: 'center' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <span style={{ 
                position: 'absolute', 
                top: '-10px', left: '50%', transform: 'translateX(-50%)', 
                background: 'var(--bg-card)', padding: '0 10px', 
                fontSize: '0.875rem', color: 'var(--text-muted)' 
              }}>OR</span>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleAuth} 
              className="btn-primary" 
              style={{ 
                background: '#fff', color: '#333', border: '1px solid #ccc',
                display: 'flex', gap: '12px'
              }}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
