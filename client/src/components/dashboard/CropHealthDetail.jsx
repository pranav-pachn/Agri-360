import { motion } from 'framer-motion';

export default function CropHealthDetail({
  latestReport = null,
  riskScore = 0.4,
}) {
  const cropName = latestReport?.crop || 'Tomato';
  const location = latestReport?.location || 'Punjab, India';
  const cropImage = '/assets/loan-dashboard-farmer.svg';

  // Calculate health score as inverse of risk
  const healthScore = Math.max(0, Math.min(100, Math.round((1 - riskScore) * 100)));
  const healthLevel =
    healthScore >= 70 ? 'Healthy' : healthScore >= 40 ? 'Fair' : 'Critical Attention';
  const healthColor =
    healthScore >= 70 ? 'text-emerald-500' : healthScore >= 40 ? 'text-amber-500' : 'text-red-500';

  const lastUpdate = latestReport?.timestamp
    ? new Date(latestReport.timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '2h ago';

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.24 }}
      className="md:col-span-12 lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 bg-surface-container dark:bg-slate-800/70 rounded-3xl overflow-hidden"
    >
      {/* Image Panel */}
      <div className="lg:col-span-1 h-64 lg:h-auto overflow-hidden relative">
        <img
          alt="Crop detail"
          className="w-full h-full object-cover"
          src={cropImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
          <div>
            <span className="bg-primary dark:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Active Crop
            </span>
            <h3 className="text-3xl font-bold text-white mt-2">
              {cropName}
            </h3>
          </div>
        </div>
      </div>

      {/* Stats & Diagnostic Panel */}
      <div className="lg:col-span-2 p-10 flex flex-col md:flex-row gap-10">
        {/* Health Score */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-end gap-3 mb-4">
            <span className={`text-7xl font-black leading-none ${healthColor}`}>
              {healthScore}%
            </span>
            <div className="mb-2">
              <span className="block text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase">
                Health Score
              </span>
              <span className={`block text-sm font-bold ${healthColor}`}>
                {healthLevel}
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-variant dark:bg-slate-700 h-4 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-600 ${
                healthScore >= 70
                  ? 'bg-emerald-500'
                  : healthScore >= 40
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Summary */}
        <div className="flex-1 space-y-6 border-l border-on-surface-variant/10 pl-0 md:pl-10">
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest mb-3">
              Diagnostic Summary
            </h4>
            <div className="flex items-center gap-3 text-on-surface dark:text-white">
              <span className="material-symbols-outlined text-red-500" style={{ fontSize: '20px' }}>
                coronavirus
              </span>
              <span className="font-medium">Early Blight detected</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low dark:bg-slate-900 p-4 rounded-xl">
              <span className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase">
                Last Update
              </span>
              <span className="block text-sm font-bold text-on-surface dark:text-white">
                {lastUpdate}
              </span>
            </div>
            <div className="bg-surface-container-low dark:bg-slate-900 p-4 rounded-xl">
              <span className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase">
                Plot Size
              </span>
              <span className="block text-sm font-bold text-on-surface dark:text-white">
                1.5 Acres
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button className="text-primary dark:text-blue-400 font-bold text-sm hover:underline">
              View Full Report →
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
