import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export default function AIInsightPanel({
  riskLevel = 'Medium Risk',
  riskScore = 0.35,
  yieldValue = 2.8,
  yieldDelta = -12,
}) {
  const severity = riskScore >= 0.7 ? 'high' : riskScore >= 0.35 ? 'moderate' : 'low';

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-3xl border border-cyan-300/25 bg-gradient-to-r from-blue-950/90 via-slate-900 to-cyan-950/90 p-7 shadow-[0_20px_55px_-24px_rgba(8,145,178,0.65)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            <Brain className="h-3.5 w-3.5" />
            AI Insight
          </div>
          <h3 className="mt-3 text-xl font-semibold text-white">Crop and finance impact narrative</h3>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-200">
            Detected early blight with {severity} severity. Yield may reduce by {Math.abs(yieldDelta)}% and current risk is classified as {riskLevel.toLowerCase()}. Recommended action: apply fungicide within 48 hours and monitor moisture to protect expected yield of {yieldValue} tons/acre.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-3 text-cyan-100">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
    </motion.section>
  );
}
