import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ onApplyLoan }) {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Analyze Crop',
      description: 'Upload an image for AI crop diagnosis and decision support',
      micro: '2 min workflow',
      icon: Camera,
      gradient: 'from-green-500 to-emerald-600',
      onClick: () => navigate('/upload'),
    },
    {
      title: 'View Trust Score',
      description: 'Review financial trust readiness and lender positioning',
      micro: 'Credit overview',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-600',
      onClick: () => navigate('/dashboard'),
    },
    {
      title: 'Apply for Loan',
      description: 'Move toward loan application with your farm intelligence profile',
      micro: 'Financing pre-check',
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-600',
      onClick: () => {
        if (typeof onApplyLoan === 'function') {
          onApplyLoan();
          return;
        }

        navigate('/dashboard');
      },
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.8)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-900/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            <FileText className="h-3.5 w-3.5" />
            Fast workflow
          </div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="mt-1 text-sm text-slate-300">Launch the next best action from your dashboard</p>
        </div>

        <div className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              onClick={action.onClick}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className={`group w-full overflow-hidden rounded-2xl bg-gradient-to-r ${action.gradient} p-[1px] text-left shadow-[0_16px_36px_-20px_rgba(0,0,0,0.7)] transition-all duration-300`}
            >
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-slate-900/35 px-5 py-5 text-white backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner shadow-white/10">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{action.title}</div>
                    <div className="mt-1 text-sm text-white/85">{action.description}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.14em] text-white/75">{action.micro}</div>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-600 bg-slate-700 p-4 text-slate-300">
        <p className="mb-1 text-sm font-semibold text-white">💡 Pro Tip</p>
        <p className="text-xs leading-6">Run crop analysis regularly to strengthen your trust profile, reduce risk surprises, and improve financing readiness.</p>
      </div>
    </div>
  );
}
