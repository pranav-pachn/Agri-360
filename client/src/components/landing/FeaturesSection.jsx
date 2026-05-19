import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldAlert,
  TrendingUp,
  BadgeCheck,
  Bot,
  CloudSun,
} from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Crop Intelligence',
    description:
      'Detect diseases early from field images using computer vision. Get actionable recommendations before outbreaks impact yield.',
    gradient: 'from-emerald-500 to-green-600',
    borderHover: 'hover:border-emerald-500/40',
  },
  {
    icon: ShieldAlert,
    title: 'Explainable Risk Engine',
    description:
      'Transparent risk scoring with factor-by-factor breakdowns. Every score comes with clear reasoning — no black boxes.',
    gradient: 'from-red-500 to-rose-600',
    borderHover: 'hover:border-red-500/40',
  },
  {
    icon: TrendingUp,
    title: 'Yield Prediction',
    description:
      'ML-driven yield forecasts combining soil, weather, and crop health data for accurate per-hectare estimates.',
    gradient: 'from-blue-500 to-cyan-600',
    borderHover: 'hover:border-blue-500/40',
  },
  {
    icon: BadgeCheck,
    title: 'Financial Trust Score',
    description:
      'Generate lender-ready trust scores that bridge farm performance with credit confidence. Bank-verified scoring.',
    gradient: 'from-amber-500 to-orange-600',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description:
      'Multilingual conversational AI that answers farming questions, explains risk factors, and guides crop management.',
    gradient: 'from-purple-500 to-violet-600',
    borderHover: 'hover:border-purple-500/40',
  },
  {
    icon: CloudSun,
    title: 'Live Weather Overlay',
    description:
      'Real-time meteorological data integrated into every analysis. Understand how weather volatility affects your scores.',
    gradient: 'from-sky-500 to-blue-600',
    borderHover: 'hover:border-sky-500/40',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export default function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Intelligent Farming
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six powerful modules working together to deliver complete
            agricultural intelligence — from field to finance.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                className={`group relative rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-7 ${feature.borderHover} hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="relative text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="relative text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
