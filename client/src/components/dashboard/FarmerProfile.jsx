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
    <div className="hero-panel">
      <div className="hero-glow -left-20 -top-20 h-56 w-56 bg-cyan-500" />
      <div className="hero-glow -bottom-24 right-0 h-64 w-64 bg-emerald-500" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-lg font-black text-white shadow-2xl shadow-emerald-900/30">
            {initials}
          </div>
          <div>
            <p className="section-kicker">Farmer Dashboard</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{name}</h2>
            {location ? (
              <p className="text-sm text-gray-400">{location}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">Location not set</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Crop</p>
            {crop ? (
              <p className="text-sm font-semibold text-white">{crop} 🌾</p>
            ) : (
              <p className="text-sm font-semibold text-gray-500 italic">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
