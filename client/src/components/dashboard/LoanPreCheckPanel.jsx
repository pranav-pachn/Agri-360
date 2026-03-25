import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  BadgeIndianRupee,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Sprout,
  TrendingUp,
  User,
  X,
} from 'lucide-react';

const inrFormatter = new Intl.NumberFormat('en-IN');

const StatTile = ({ icon: Icon, label, value, tone = 'slate' }) => {
  const toneMap = {
    slate: 'border-slate-600/70 bg-slate-800/60 text-slate-100',
    green: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
    amber: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
    cyan: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100',
  };

  return (
    <div className={`rounded-2xl border p-4 ${toneMap[tone] || toneMap.slate}`}>
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/70">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
};

export default function LoanPreCheckPanel({
  isOpen,
  status,
  data,
  error,
  onClose,
  onProceed,
}) {
  const isLoading = status === 'loading';
  const isReady = status === 'ready';
  const isError = status === 'error';
  const isPreApproved = status === 'preApproved';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Close loan pre-check panel"
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto border-l border-white/10 bg-slate-900/95 p-5 backdrop-blur-xl sm:max-w-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Loan Eligibility Pre-Check"
          >
            <div className="mx-auto max-w-lg pb-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Loan Pre-Check
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Loan Eligibility & Pre-Check</h2>
                  <p className="mt-1 text-sm text-slate-300">AI-powered farm intelligence linked to lender readiness.</p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/15 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isLoading && (
                <div className="rounded-3xl border border-cyan-300/30 bg-cyan-500/10 p-6 text-cyan-100">
                  <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-cyan-200/30 border-t-cyan-200" />
                  <h3 className="text-lg font-semibold">Running loan pre-check...</h3>
                  <p className="mt-1 text-sm text-cyan-100/85">Aggregating trust score, risk, yield and sustainability signals.</p>
                </div>
              )}

              {isError && (
                <div className="rounded-3xl border border-red-300/30 bg-red-500/10 p-6 text-red-100">
                  <div className="mb-3 inline-flex rounded-full bg-red-400/20 p-2">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Unable to load pre-check data</h3>
                  <p className="mt-1 text-sm text-red-100/85">{error || 'Please retry in a moment.'}</p>
                </div>
              )}

              {isReady && data && (
                <div className="space-y-5">
                  <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-800/80 to-slate-900 p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.9)]">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Farmer Profile</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <StatTile icon={User} label="Name" value={data.farmerName} tone="slate" />
                      <StatTile icon={Sprout} label="Crop Type" value={data.cropType} tone="green" />
                      <StatTile icon={TrendingUp} label="Location" value={data.location} tone="cyan" />
                    </div>
                  </section>

                  <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-800/80 to-slate-900 p-5 shadow-[0_16px_45px_-24px_rgba(15,23,42,0.9)]">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Farm Intelligence Summary</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <StatTile icon={AlertCircle} label="Risk Score" value={`${data.riskScorePercent}% (${data.riskLevel})`} tone="amber" />
                      <StatTile icon={TrendingUp} label="Yield Prediction" value={`${data.yieldPrediction} tons/acre`} tone="green" />
                      <StatTile icon={ShieldCheck} label="Sustainability" value={`${data.sustainabilityScore}`} tone="cyan" />
                    </div>
                  </section>

                  <section className="rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-5 text-emerald-50">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">Financial Trust Score</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <StatTile icon={ShieldCheck} label="Score" value={`${data.trustScore}`} tone="green" />
                      <StatTile icon={FileCheck} label="Grade" value={data.trustGrade} tone="green" />
                      <StatTile icon={CheckCircle2} label="Status" value={data.isEligible ? 'Eligible' : 'Review Needed'} tone="green" />
                    </div>
                  </section>

                  <section className="rounded-3xl border border-white/15 bg-slate-800/70 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Smart Insight</h3>
                    <p className="mt-3 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-4 text-sm leading-7 text-cyan-100">{data.smartInsight}</p>
                  </section>

                  <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-800/80 to-slate-900 p-5">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Loan Recommendation</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <StatTile
                        icon={BadgeIndianRupee}
                        label="Eligible Amount"
                        value={`Rs ${inrFormatter.format(data.eligibleLoanAmount)}`}
                        tone="green"
                      />
                      <StatTile icon={TrendingUp} label="Interest Tier" value={data.interestTier} tone="cyan" />
                      <StatTile icon={AlertCircle} label="Insurance Risk" value={data.insuranceRisk} tone="amber" />
                    </div>
                  </section>

                  <button
                    onClick={onProceed}
                    className="w-full rounded-2xl border border-emerald-300/40 bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_20px_40px_-24px_rgba(16,185,129,0.85)] transition hover:brightness-110"
                  >
                    Proceed to Application
                  </button>
                </div>
              )}

              {isPreApproved && data && (
                <div className="rounded-3xl border border-emerald-300/40 bg-emerald-500/10 p-6 text-emerald-50">
                  <div className="mb-4 inline-flex rounded-full border border-emerald-200/40 bg-emerald-500/20 p-3">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold">Loan Pre-Approved</h3>
                  <p className="mt-2 text-sm leading-7 text-emerald-100/90">Your profile is ready for lender integration.</p>
                  <div className="mt-5 rounded-2xl border border-emerald-200/30 bg-emerald-500/10 p-4 text-sm">
                    <p>Approved profile: {data.farmerName}</p>
                    <p>Recommended amount: Rs {inrFormatter.format(data.eligibleLoanAmount)}</p>
                    <p>Risk band: {data.interestTier}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
