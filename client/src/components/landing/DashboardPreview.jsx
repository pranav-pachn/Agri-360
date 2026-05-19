import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  BadgeCheck,
  AlertTriangle,
  BarChart3,
  Activity,
} from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-500/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
            Dashboard Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Complete{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Command Center
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Monitor crop health, track risks, and manage trust scores — all from
            a single unified dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 rounded-3xl blur-2xl scale-105" />

          {/* Main dashboard mockup */}
          <div className="relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/40">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-700/40 border border-slate-600/30">
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className="text-xs text-slate-400 font-mono">
                    agrimitra-360.app/dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6">
              {/* Summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: ShieldCheck, label: 'Trust Score', value: '842', change: '+12', changeType: 'up', iconClass: 'text-emerald-400' },
                  { icon: Activity, label: 'Risk Index', value: '28', change: '-5', changeType: 'down', iconClass: 'text-green-400' },
                  { icon: TrendingUp, label: 'Yield Est.', value: '4.2T/ha', change: '+8%', changeType: 'up', iconClass: 'text-blue-400' },
                  { icon: CloudSun, label: 'Weather', value: 'Clear', change: 'Stable', changeType: 'neutral', iconClass: 'text-amber-400' },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className="rounded-xl bg-slate-700/30 border border-slate-600/20 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          size={14}
                          className={card.iconClass}
                        />
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {card.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {card.value}
                      </p>
                      <span
                        className={`text-[10px] font-semibold mt-1 inline-block ${
                          card.changeType === 'up'
                            ? 'text-emerald-400'
                            : card.changeType === 'down'
                            ? 'text-green-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {card.changeType === 'up' ? '▲' : card.changeType === 'down' ? '▼' : '●'}{' '}
                        {card.change}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Charts row */}
              <div className="grid md:grid-cols-5 gap-4">
                {/* Analytics chart */}
                <div className="md:col-span-3 rounded-xl bg-slate-700/30 border border-slate-600/20 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Yield Analytics
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        12-month performance trend
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                      +18.4%
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 400 120"
                    className="w-full h-28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="dashLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[30, 60, 90].map((y) => (
                      <line
                        key={y}
                        x1="0" y1={y} x2="400" y2={y}
                        stroke="rgba(148,163,184,0.08)"
                        strokeWidth="1"
                      />
                    ))}
                    <path
                      d="M0 90 Q50 82 100 70 T200 52 T300 35 T400 18"
                      stroke="url(#dashLine)"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <path
                      d="M0 90 Q50 82 100 70 T200 52 T300 35 T400 18 V120 H0 Z"
                      fill="url(#dashGrad)"
                    />
                    {/* Data dots */}
                    {[
                      [0, 90], [100, 70], [200, 52], [300, 35], [400, 18],
                    ].map(([x, y]) => (
                      <circle
                        key={`${x}-${y}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#10b981"
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                </div>

                {/* Risk breakdown */}
                <div className="md:col-span-2 rounded-xl bg-slate-700/30 border border-slate-600/20 p-5">
                  <h4 className="text-sm font-semibold text-white mb-4">
                    Risk Breakdown
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Crop Health', value: 85, color: 'bg-emerald-500' },
                      { label: 'Weather Risk', value: 42, color: 'bg-amber-500' },
                      { label: 'Pest Threat', value: 23, color: 'bg-green-500' },
                      { label: 'Market Risk', value: 56, color: 'bg-blue-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-400">{item.label}</span>
                          <span className="text-xs font-semibold text-white">
                            {item.value}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-700/60">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating accent cards */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 lg:-right-6 z-10 hidden md:flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-500/30 bg-slate-900/95 backdrop-blur-lg shadow-lg"
          >
            <BadgeCheck size={16} className="text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Status
              </p>
              <p className="text-xs font-bold text-emerald-400">Bank Verified</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute -bottom-3 -left-4 lg:-left-6 z-10 hidden md:flex items-center gap-2.5 px-4 py-3 rounded-xl border border-amber-500/30 bg-slate-900/95 backdrop-blur-lg shadow-lg"
          >
            <AlertTriangle size={16} className="text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Alert
              </p>
              <p className="text-xs font-bold text-amber-400">Wheat Rust — Plot 4</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
