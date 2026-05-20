import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-blue-500/8 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-slate-800/60 backdrop-blur-xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Subtle decorative glow inside */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/8 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/8 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
              Get Started Today
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto">
              Transform Crop Intelligence into{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                Financial Confidence
              </span>
            </h2>

            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Join thousands of farmers and financial institutions using AgriMitra
              360 to make smarter, data-driven agricultural decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-4 text-sm font-black tracking-wide !text-slate-950 shadow-2xl shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(34,211,238,0.28)] drop-shadow-[0_6px_18px_rgba(2,6,23,0.45)]"
              >
                Launch Dashboard
                <ArrowRight
                  size={16}
                  className="text-slate-950 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-slate-900/80 px-8 py-4 text-sm font-semibold tracking-wide !text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-slate-800/90"
              >
                <BarChart3 size={16} />
                Explore Analytics
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
