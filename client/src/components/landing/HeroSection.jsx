import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CloudSun,
  AlertTriangle,
  TrendingUp,
  Leaf,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] },
});

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const floatAnimationSlow = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
  },
};

const floatAnimationFast = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 h-[680px] w-[680px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[540px] w-[540px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/6 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — Copy */}
          <div className="space-y-8">
            <motion.div {...fadeUp(0.1)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AI-Powered Platform
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.2)}
              className="text-5xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-[4.9rem]"
            >
              AI-Powered Agricultural
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                Intelligence
              </span>{' '}
              for Smarter
              <br />
              Farming &amp;{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Financial Trust
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.35)}
              className="max-w-xl text-sm leading-relaxed text-gray-400 md:text-lg"
            >
              Transform crop intelligence into actionable financial and risk
              insights. From disease detection to trust scoring — one platform
              that bridges agriculture and finance.
            </motion.p>

            <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-7 py-3.5 text-sm font-black tracking-wide text-slate-950 shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(45,212,191,0.28)]"
              >
                Analyze Crop
                <ArrowRight
                  size={16}
                  className="text-slate-950 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-slate-900/85 px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-slate-800/95"
              >
                View Dashboard
              </Link>
            </motion.div>

            {/* Social proof pills */}
            <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-3 pt-2">
              {[
                'Trusted by 12,000+ Farmers',
                '15+ Banking Partners',
                'Real-Time Intelligence',
              ].map((text) => (
                <span
                  key={text}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md"
                >
                  {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Glow behind the card */}
            <div className="absolute inset-0 scale-105 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20 blur-2xl" />

            {/* Main dashboard preview card */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
              {/* Mock top bar */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="ml-4 h-5 w-48 rounded bg-slate-700/60" />
              </div>

              {/* Mock grid of mini-cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf size={14} className="text-emerald-400" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Crop Health
                    </span>
                  </div>
                  <p className="text-xl font-bold text-white">94%</p>
                  <p className="text-[10px] text-emerald-400 mt-1">▲ +3.2%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-blue-400" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Yield Est.
                    </span>
                  </div>
                  <p className="text-xl font-bold text-white">4.2T</p>
                  <p className="text-[10px] text-blue-400 mt-1">per hectare</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={14} className="text-amber-400" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Risk Index
                    </span>
                  </div>
                  <p className="text-xl font-bold text-white">Low</p>
                  <p className="text-[10px] text-green-400 mt-1">▼ -12%</p>
                </div>
              </div>

              {/* Mock chart */}
              <div className="h-36 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium">
                    Yield Trend — 12 Months
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    +18.4%
                  </span>
                </div>
                <svg
                  viewBox="0 0 300 80"
                  className="w-full h-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 60 Q30 55 60 48 T120 35 T180 28 T240 18 T300 10"
                    stroke="url(#heroLine)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 60 Q30 55 60 48 T120 35 T180 28 T240 18 T300 10 V80 H0 Z"
                    fill="url(#chartGrad)"
                  />
                </svg>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div {...floatAnimation} className="absolute -top-4 -right-6 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-lg shadow-emerald-500/10 backdrop-blur-lg">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Trust Score
                </p>
                <p className="text-lg font-bold text-white leading-none">842</p>
              </div>
            </motion.div>

            <motion.div {...floatAnimationSlow} className="absolute top-1/2 -left-10 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-lg shadow-blue-500/10 backdrop-blur-lg">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <CloudSun size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Weather Impact
                </p>
                <p className="text-sm font-bold text-white leading-none">+12% Yield</p>
              </div>
            </motion.div>

            <motion.div {...floatAnimationFast} className="absolute -bottom-3 right-8 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-lg shadow-amber-500/10 backdrop-blur-lg">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Risk Level
                </p>
                <p className="text-sm font-bold text-green-400 leading-none">Low</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
