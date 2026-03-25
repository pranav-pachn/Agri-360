import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, ShieldCheck, Wallet } from 'lucide-react';

const TrustCard = ({ score = 742 }) => {
  const clampedScore = Math.max(300, Math.min(900, score));
  const normalizedPercent = ((clampedScore - 300) / 600) * 100;
  const circumference = 2 * Math.PI * 84;
  const strokeOffset = circumference - (normalizedPercent / 100) * circumference;

  const getGrade = () => {
    if (clampedScore >= 750) return 'A';
    if (clampedScore >= 650) return 'B';
    return 'C';
  };

  const getGradeTheme = () => {
    const grade = getGrade();
    if (grade === 'A') return 'text-green-300 border-green-400/50 bg-green-500/15';
    if (grade === 'B') return 'text-yellow-200 border-yellow-300/50 bg-yellow-400/15';
    return 'text-red-200 border-red-300/50 bg-red-500/15';
  };

  const getLoanAmount = () => {
    const grade = getGrade();
    if (grade === 'A') return '₹1,00,000';
    if (grade === 'B') return '₹70,000';
    return '₹40,000';
  };

  const getArcColor = () => {
    const grade = getGrade();
    if (grade === 'A') return '#22c55e';
    if (grade === 'B') return '#facc15';
    return '#ef4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
      className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-700/90 via-green-700/85 to-blue-800/85 p-8 shadow-[0_24px_55px_-20px_rgba(16,185,129,0.55)]"
    >
      <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Financial Trust Score
          </div>

          <div className="mt-4 flex items-end gap-4">
            <div className="text-6xl font-black leading-none text-white">{clampedScore}</div>
            <div className={`mb-1 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${getGradeTheme()}`}>
              <BadgeCheck className="h-4 w-4" />
              Grade {getGrade()}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/20 bg-slate-900/30 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/80">Loan Eligibility</p>
            <p className="mt-1 text-xl font-semibold text-white">Eligible for {getLoanAmount()} Loan</p>
            <p className="mt-1 text-sm text-emerald-100/80">Strong repayment confidence and resilient farm profile detected.</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-52 w-52">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="84"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="15"
                fill="transparent"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="84"
                stroke={getArcColor()}
                strokeWidth="15"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Wallet className="h-6 w-6 text-emerald-100" />
              <p className="mt-2 text-4xl font-black text-white">{Math.round(normalizedPercent)}%</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Credit Strength</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrustCard;
