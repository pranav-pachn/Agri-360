import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Leaf, LogIn, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SupabaseGoogleLogin } from '../components/GoogleLogin';

export default function Login() {
  const navigate = useNavigate();
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

      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-blue-500/[0.06] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-500/[0.04] blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Hero Section */}
        <section className="hidden lg:block space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
            <Leaf size={14} />
            AgriMitra 360
          </div>

          <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.1]">
            AI agriculture workflow for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              farmers and lending teams
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            Monitor crop intelligence, review farm risk, and prepare trust-backed records from one practical dashboard.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-3.5">
                <p className="text-sm font-bold text-white">{stat.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Login Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-900/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-400">Secure Access</p>
              <h2 className="text-xl font-bold text-white">Login to your dashboard</h2>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-6">
            Access your AI crop insights, farmer performance, and lending readiness signals.
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all hover:shadow-xl hover:shadow-emerald-900/40 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {/* Google Login Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-800/30 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">OR</span>
              </div>
            </div>

            {/* Google Login Button */}
            <SupabaseGoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <Link to="/signup" className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/40 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white">
              Create account
              <ArrowRight size={16} />
            </Link>
          </form>
        </div>
      </div>

      {/* Mobile brand badge (visible on small screens) */}
      <div className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
        <Leaf size={14} />
        AgriMitra 360
      </div>
    </div>
  );
}
