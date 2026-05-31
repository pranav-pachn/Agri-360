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
    <div className="min-h-screen bg-[#060e1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/[0.06] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-[15%] w-[300px] h-[300px] bg-purple-500/[0.04] blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Hero Section */}
        <section className="hidden lg:block space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
            <Leaf size={14} />
            AgriMitra 360
          </div>

          <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.1]">
            Create your account and start making{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              better field decisions
            </span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
            Join farmers and agri teams using one platform to monitor crop health, reduce risk, and build stronger records for funding.
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

        {/* Right: Signup Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400">New Account</p>
              <h2 className="text-xl font-bold text-white">Start free on AgriMitra 360</h2>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-6">
            Create your workspace in minutes and begin tracking crop, risk, and trust signals.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
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
                placeholder="Create a secure password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              {loading ? 'Creating account...' : 'Create free account'}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-800/30 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">OR</span>
              </div>
            </div>

            <SupabaseGoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

            <Link to="/login" className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/40 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white">
              Already have an account? Sign In
              <ArrowRight size={16} />
            </Link>
          </form>
        </div>
      </div>

      {/* Mobile brand badge */}
      <div className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
        <Leaf size={14} />
        AgriMitra 360
      </div>

      {/* Full-screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060e1a]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex flex-col items-center bg-slate-900 border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mb-5"></div>
            <h2 className="text-lg font-bold text-white mb-2">Creating Account</h2>
            <p className="text-slate-400 text-xs">Setting up your secure workspace...</p>
          </div>
        </div>
      )}
    </div>
  );
}
