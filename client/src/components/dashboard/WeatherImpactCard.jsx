const formatValue = (value, suffix = '') => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '--';
  return `${numeric}${suffix}`;
};

const impactTone = (direction) => {
  if (direction === 'increase') return 'text-rose-400';
  if (direction === 'decrease') return 'text-emerald-400';
  return 'text-slate-200';
};

const impactPrefix = (direction, value) => {
  if (!Number.isFinite(Number(value))) return '';
  if (direction === 'increase' && Number(value) > 0) return '+';
  return '';
};

const WeatherImpactCard = ({ weather, impact }) => {
  const safeWeather = weather || {};
  const safeImpact = impact || {};
  const location = safeWeather.location || 'Unknown location';
  const deltaPercent = Number(safeImpact.deltaPercent);
  const isAvailable = safeWeather.available !== false;

  return (
    <div className="card space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">🌦 Weather Impact</h2>
          <p className="mt-1 text-sm text-gray-400">{location}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
          {isAvailable ? safeWeather.condition || 'Live' : 'Unavailable'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-slate-200">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Temp</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatValue(safeWeather.temperatureC, '°C')}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Humidity</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatValue(safeWeather.humidity, '%')}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Wind</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatValue(safeWeather.windSpeed, ' m/s')}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Impact On Risk</p>
        <p className={`mt-2 text-4xl font-bold ${impactTone(safeImpact.direction)}`}>
          {Number.isFinite(deltaPercent) ? `${impactPrefix(safeImpact.direction, deltaPercent)}${deltaPercent}%` : '--'}
        </p>
        <p className="mt-2 text-sm text-gray-300">{safeImpact.reason || 'Current weather conditions are contributing a neutral risk impact.'}</p>
      </div>
    </div>
  );
};

export default WeatherImpactCard;
