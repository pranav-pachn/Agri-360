const CropInsights = ({
  disease = 'Early Blight',
  confidence = 87,
  yieldValue = 12,
  lossPercent = 40,
}) => {
  return (
    <div className="space-y-4 rounded-2xl bg-slate-800 p-5 shadow-md">
      <h2 className="text-lg font-semibold text-white">🌱 Crop Insights</h2>

      <div className="space-y-3 text-sm text-slate-200">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-700/60 px-4 py-3">
          <span className="text-gray-400">Disease</span>
          <span className="text-base font-semibold text-white">🧠 {disease}</span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-700/60 px-4 py-3">
          <span className="text-gray-400">Confidence</span>
          <span className="text-base font-semibold text-emerald-400">📊 {confidence}%</span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-700/60 px-4 py-3">
          <span className="text-gray-400">Yield</span>
          <span className="text-base font-semibold text-white">🌾 {yieldValue} tons/hectare</span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-700/60 px-4 py-3">
          <span className="text-gray-400">Projected Loss</span>
          <span className="text-base font-semibold text-amber-400">📉 {lossPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default CropInsights;
