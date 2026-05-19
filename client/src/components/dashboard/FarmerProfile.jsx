const FarmerProfile = ({
  name = 'Farmer',
  location = '',
  crop = '',
}) => {
  const initials = (name || 'FA')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div className="card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-lg font-bold text-white shadow-lg shadow-emerald-900/30">
            {initials}
          </div>
          <div>
            <p className="section-kicker">Farmer Dashboard</p>
            <h2 className="text-xl font-bold text-white mt-0.5">{name}</h2>
            {location ? (
              <p className="text-sm text-slate-400">{location}</p>
            ) : (
              <p className="text-sm text-slate-600 italic">Location not set</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Crop</p>
            {crop ? (
              <p className="text-sm font-semibold text-white">{crop} 🌾</p>
            ) : (
              <p className="text-sm font-semibold text-slate-600 italic">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
