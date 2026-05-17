import { ArrowRight, BarChart3, Database, Factory, Leaf, ShieldCheck, Sparkles, Sprout } from 'lucide-react';

const steps = [
  {
    title: 'Farmer Input',
    subtitle: 'Field data, images, location context',
    color: 'from-sky-500 to-blue-600',
    icon: Sprout,
  },
  {
    title: 'Crop Analysis',
    subtitle: 'ML / rule-based detection',
    color: 'from-emerald-500 to-green-600',
    icon: Leaf,
  },
  {
    title: 'Yield Prediction',
    subtitle: 'Statistical + rule-based model',
    color: 'from-amber-500 to-yellow-600',
    icon: BarChart3,
  },
  {
    title: 'Risk Engine',
    subtitle: 'Explainable scoring system',
    color: 'from-rose-500 to-red-600',
    icon: ShieldCheck,
  },
  {
    title: 'Trust Score Engine',
    subtitle: 'Financial reliability scoring',
    color: 'from-fuchsia-500 to-purple-600',
    icon: Sparkles,
  },
  {
    title: 'Recommendation Engine',
    subtitle: 'Actionable next steps',
    color: 'from-indigo-500 to-indigo-700',
    icon: Factory,
  },
  {
    title: 'Dashboard & Analytics',
    subtitle: 'Operational and financial intelligence',
    color: 'from-slate-600 to-slate-800',
    icon: Database,
  },
];

const systemLayers = [
  'Input Layer: Farmer data & images',
  'Processing Layer: ML + rule-based engines',
  'Scoring Layer: Risk & Trust computation',
  'Output Layer: Dashboard & recommendations',
];

export default function Architecture() {
  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(15,23,42,0.88))] p-8 shadow-2xl shadow-slate-950/30">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">System Blueprint</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">System Architecture</h1>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              AgriMitra 360 is designed as a modular pipeline that transforms raw agricultural input into explainable operational and financial intelligence.
            </p>
            <p className="mt-3 text-sm font-medium text-sky-300">
              Designed as a modular pipeline enabling scalable agricultural intelligence and financial decision-making.
            </p>
          </div>

          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Core Pipeline</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Farmer Input → Crop Analysis → Yield Prediction → Risk Engine → Trust Score → Recommendation Engine → Dashboard & Analytics
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-center">
                    <div className={`w-[220px] rounded-2xl border border-white/10 bg-gradient-to-br ${step.color} p-[1px] shadow-lg shadow-slate-950/20`}>
                      <div className="h-full rounded-2xl bg-slate-950/80 px-4 py-4 backdrop-blur">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-white">{step.title}</p>
                            <p className="text-xs text-slate-300">{step.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index !== steps.length - 1 && (
                      <span className="mx-2 hidden text-2xl text-slate-500 lg:inline-flex">
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-slate-800 bg-slate-950/55 p-6">
              <h2 className="text-xl font-semibold">System Layers</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                {systemLayers.map((layer) => (
                  <li key={layer} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                    • {layer}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/55 p-6">
              <h2 className="text-xl font-semibold">Why This Pipeline Works</h2>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
                <p>
                  Crop analysis, yield forecasting, explainable risk scoring, and trust computation are separated into focused modules so each layer can evolve independently.
                </p>
                <p>
                  The recommendation layer converts model output into actionable advice, while dashboard analytics expose the final intelligence for agronomy teams and lending workflows.
                </p>
                <p className="text-emerald-300">
                  This architecture is intentionally engineering-forward: modular services, explicit scoring stages, and a clear path from farmer signal to financial decision support.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
