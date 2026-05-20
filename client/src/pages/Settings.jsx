import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Shield, Sparkles, SunMoon, UserCog, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const toggleRows = [
  { id: 'alerts', title: 'Weather & Risk Alerts', description: 'Get push-style updates for crop risk and weather shifts.', icon: Bell },
  { id: 'digest', title: 'Weekly Intelligence Digest', description: 'Receive a concise AI summary of yield, trust, and risk trends.', icon: Sparkles },
  { id: 'privacy', title: 'Private Farm Profile', description: 'Keep location and farm preferences visible only inside your account.', icon: Shield },
  { id: 'sync', title: 'Background Sync', description: 'Keep farm metadata and dashboard data synchronized in the background.', icon: Wifi },
];

const quickActions = [
  { title: 'Update Profile', description: 'Edit name, crop, and location details.' },
  { title: 'Review Trust Score', description: 'See the latest lending posture and drivers.' },
  { title: 'Open AI Assistant', description: 'Ask questions about crop, finance, or weather.' },
];

export default function Settings() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState({
    alerts: true,
    digest: true,
    privacy: true,
    sync: false,
  });

  const activeCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);

  const handleToggle = (id) => {
    setEnabled((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <header className="hero-panel space-y-5">
          <div className="hero-glow -left-20 -top-20 h-56 w-56 bg-cyan-500" />
          <div className="hero-glow right-0 top-0 h-64 w-64 bg-emerald-500" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="section-kicker">Account Controls</p>
              <h1 className="page-title">Settings</h1>
              <p className="section-subtitle text-base">
                Tune notifications, privacy, and the intelligence experience without changing your farm data or workflow.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-gray-400 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Active Controls</p>
              <p className="mt-1 text-3xl font-bold text-white">{activeCount}/4</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="card space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Preferences</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">Adjust how AgriMitra 360 communicates and syncs with your account.</p>
            </div>

            <div className="space-y-4">
              {toggleRows.map((row) => {
                const Icon = row.icon;
                const checked = enabled[row.id];

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => handleToggle(row.id)}
                    className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      checked
                        ? 'border-cyan-400/30 bg-cyan-500/10 shadow-2xl shadow-cyan-500/10'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className={`rounded-2xl p-3 ${checked ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-300'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-white">{row.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${checked ? 'bg-cyan-500/15 text-cyan-200' : 'bg-slate-800/80 text-slate-400'}`}>
                          {checked ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-gray-400">{row.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="btn-saas-primary" type="button">
                <CheckCircle2 className="h-4 w-4" />
                Save Preferences
              </button>
              <button className="btn-saas-secondary" type="button" onClick={() => navigate('/profile')}>
                <UserCog className="h-4 w-4" />
                Open Profile
              </button>
            </div>
          </motion.section>

          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
              className="card space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 text-white shadow-lg shadow-emerald-900/20">
                  <SunMoon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">Experience</h2>
                  <p className="text-sm text-gray-400">Visual style and intelligence behavior.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Theme</p>
                  <p className="mt-2 text-lg font-semibold text-white">Dark Premium</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Motion</p>
                  <p className="mt-2 text-lg font-semibold text-white">Subtle &amp; Responsive</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Language</p>
                  <p className="mt-2 text-lg font-semibold text-white">Multi-lingual Ready</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Sync</p>
                  <p className="mt-2 text-lg font-semibold text-white">Realtime Dashboard</p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
              className="card space-y-5"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-white">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      if (item.title === 'Update Profile') navigate('/profile');
                      if (item.title === 'Review Trust Score') navigate('/trust-score');
                      if (item.title === 'Open AI Assistant') navigate('/chat');
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-slate-800/80"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                    </div>
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                  </button>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}