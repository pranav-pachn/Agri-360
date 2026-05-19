import { motion } from 'framer-motion';
import { Brain, Eye } from 'lucide-react';

const riskFactors = [
  { label: 'Crop Health Index', value: '+18', type: 'positive' },
  { label: 'Soil Quality Score', value: '+14', type: 'positive' },
  { label: 'Historical Yield', value: '+12', type: 'positive' },
  { label: 'Irrigation Coverage', value: '+8', type: 'positive' },
  { label: 'Weather Volatility', value: '-10', type: 'negative' },
  { label: 'Pest Probability', value: '-6', type: 'negative' },
  { label: 'Market Instability', value: '-4', type: 'negative' },
];

export default function ExplainableAISection() {
  const totalPositive = riskFactors
    .filter((f) => f.type === 'positive')
    .reduce((sum, f) => sum + parseInt(f.value), 0);
  const totalNegative = riskFactors
    .filter((f) => f.type === 'negative')
    .reduce((sum, f) => sum + parseInt(f.value), 0);
  const baseScore = 40;
  const finalScore = baseScore + totalPositive + totalNegative;

  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest uppercase">
              <Brain size={14} />
              Explainable AI
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Not Just Predictions —{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transparent Reasoning
              </span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Every risk score comes with a full factor-by-factor breakdown.
              Understand exactly why a score was generated — no black-box models,
              no hidden logic. Built for auditability and trust.
            </p>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Eye size={16} className="text-purple-400" />
              <span>
                Full transparency • Auditable factors • Lender-ready reports
              </span>
            </div>
          </motion.div>

          {/* Right — XAI Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl blur-2xl scale-110" />

            <div className="relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <Brain size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Risk Score Analysis
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Wheat — Plot 4 — Kharif 2025
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-white">{finalScore}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    Medium Risk
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-700/50 mb-5" />

              {/* Factor breakdown */}
              <div className="space-y-2.5 font-mono text-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
                  <span>CONTRIBUTING FACTORS</span>
                  <span>IMPACT</span>
                </div>

                {riskFactors.map((factor) => (
                  <div
                    key={factor.label}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      factor.type === 'positive'
                        ? 'bg-emerald-500/5 border border-emerald-500/10'
                        : 'bg-red-500/5 border border-red-500/10'
                    }`}
                  >
                    <span className="text-slate-300 text-xs">{factor.label}</span>
                    <span
                      className={`font-bold text-xs ${
                        factor.type === 'positive'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {factor.value}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">
                    BASE SCORE + NET FACTORS
                  </span>
                  <span className="text-sm font-bold text-white">
                    {baseScore} + {totalPositive + totalNegative} ={' '}
                    <span className="text-amber-400">{finalScore}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
