const AnalyticsCard = ({ title, subtitle, children }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md">
      <div className="mb-4">
        <p className="text-lg font-semibold tracking-tight text-white">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

const AnalyticsSection = ({
  yieldTrend = [],
  riskDistribution = [],
}) => {
  const safeYieldTrend = yieldTrend.length
    ? yieldTrend
    : [
      { label: 'Jan', value: 8.6 },
      { label: 'Feb', value: 9.4 },
      { label: 'Mar', value: 10.1 },
      { label: 'Apr', value: 11.2 },
      { label: 'May', value: 12 },
    ];

  const safeRiskDistribution = riskDistribution.length
    ? riskDistribution
    : [
      { label: 'Low', value: 32, tone: 'bg-emerald-400' },
      { label: 'Medium', value: 44, tone: 'bg-amber-400' },
      { label: 'High', value: 24, tone: 'bg-rose-400' },
    ];

  const maxYield = Math.max(...safeYieldTrend.map((item) => item.value), 1);
  const maxRisk = Math.max(...safeRiskDistribution.map((item) => item.value), 1);

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">📈 Analytics</h2>
        <p className="mt-1 text-sm text-gray-400">Season-level intelligence and portfolio risk mix.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnalyticsCard title="📊 Yield Trends" subtitle="Season-level production outlook">
          <div className="flex h-44 items-end gap-3">
            {safeYieldTrend.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-cyan-400"
                    style={{ height: `${Math.max(12, (item.value / maxYield) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300">{item.label}</p>
                <p className="text-xs font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="⚠️ Risk Distribution" subtitle="Current portfolio risk mix">
          <div className="space-y-4">
            {safeRiskDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-600">
                  <div
                    className={`h-3 rounded-full ${item.tone || 'bg-emerald-400'}`}
                    style={{ width: `${Math.max(8, (item.value / maxRisk) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default AnalyticsSection;
