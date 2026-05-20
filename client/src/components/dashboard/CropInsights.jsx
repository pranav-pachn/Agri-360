const CropInsights = ({
  disease = '',
  confidence = 0,
  yieldValue = 0,
  lossPercent = 0,
}) => {
  const hasData = Boolean(disease);
  const displayDisease = disease || '—';
  const displayYield = yieldValue > 0 ? `${yieldValue} t/ha` : '—';
  const displayLoss = lossPercent > 0 ? `${lossPercent}%` : '—';
  const displayConfidence = confidence > 0 ? `${confidence}%` : '—';

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-white">🌱 Crop Insights</h2>
        {!hasData && (
          <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
            No analysis yet
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm text-slate-200">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <span className="text-slate-400">Disease</span>
          <span className={`text-base font-semibold ${hasData ? 'text-white' : 'text-slate-500'}`}>
            {hasData ? `🧠 ${displayDisease}` : displayDisease}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <span className="text-slate-400">Confidence</span>
          <span className={`text-base font-semibold ${hasData ? 'text-emerald-400' : 'text-slate-500'}`}>
            {hasData ? `📊 ${displayConfidence}` : displayConfidence}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <span className="text-slate-400">Yield</span>
          <span className={`text-base font-semibold ${yieldValue > 0 ? 'text-white' : 'text-slate-500'}`}>
            {yieldValue > 0 ? `🌾 ${displayYield}` : displayYield}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <span className="text-slate-400">Projected Loss</span>
          <span className={`text-base font-semibold ${lossPercent > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
            {lossPercent > 0 ? `📉 ${displayLoss}` : displayLoss}
          </span>
        </div>
      </div>

      {!hasData && (
        <p className="text-center text-xs text-gray-500">
          Run a crop diagnosis to populate insights
        </p>
      )}
    </div>
  );
};

export default CropInsights;
