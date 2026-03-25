import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

const YieldCard = ({ yieldValue = 2.8, trendDelta = -12 }) => {
  const isNegative = trendDelta < 0;
  const trendText = `${isNegative ? 'down' : 'up'} ${Math.abs(trendDelta)}% ${isNegative ? 'below' : 'above'} optimal`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-slate-600 bg-slate-800 p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.8)]"
    >
      <h2 className="text-lg font-semibold text-white">Yield Intelligence</h2>

      <div className="mt-4 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-blue-200">Expected Yield</p>
        <p className="mt-1 text-3xl font-bold text-white">{yieldValue} tons/acre</p>
      </div>

      <div className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${isNegative ? 'border-red-300/40 bg-red-500/15 text-red-200' : 'border-green-300/40 bg-green-500/15 text-green-200'}`}>
        {isNegative ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
        {trendText}
      </div>

      <p className="mt-3 text-sm text-slate-300">AI projects current output versus optimized farm conditions for season planning.</p>
    </motion.div>
  );
};

export default YieldCard;
