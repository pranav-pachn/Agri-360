import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const RiskCard = ({ risk = 0.4 }) => {
  const percent = Math.round(risk * 100);
  const getRiskTheme = () => {
    if (percent < 35) {
      return {
        label: 'Low Risk',
        bar: 'bg-green-400',
        badge: 'text-green-200 border-green-400/40 bg-green-500/15',
      };
    }

    if (percent < 70) {
      return {
        label: 'Medium Risk',
        bar: 'bg-yellow-400',
        badge: 'text-yellow-100 border-yellow-300/40 bg-yellow-400/15',
      };
    }

    return {
      label: 'High Risk',
      bar: 'bg-red-400',
      badge: 'text-red-100 border-red-300/40 bg-red-500/15',
    };
  };

  const theme = getRiskTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-slate-600 bg-slate-800 p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.8)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <AlertTriangle className="h-5 w-5 text-yellow-300" />
            Risk Intelligence
          </h2>
          <p className="mt-1 text-sm text-slate-300">Based on disease severity and weather volatility</p>
        </div>

        <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${theme.badge}`}>
          {theme.label}
        </div>
      </div>

      <div className="mt-5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
          <motion.div
            className={`h-3 rounded-full ${theme.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="font-semibold text-white">{percent}%</p>
          <p className="text-slate-300">Weather and disease impact monitored</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RiskCard;
