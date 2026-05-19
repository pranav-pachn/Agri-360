import { motion } from 'framer-motion';
import { Database, Target, CloudSun, Globe } from 'lucide-react';

const stats = [
  {
    icon: Database,
    value: '150+',
    label: 'Farm Records',
    description: 'Comprehensive agricultural data points',
    gradient: 'from-emerald-500 to-green-600',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  {
    icon: Target,
    value: '82%',
    label: 'Risk Accuracy',
    description: 'Precision in risk assessment scoring',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    icon: CloudSun,
    value: 'Real-Time',
    label: 'Weather Integration',
    description: 'Live meteorological data overlay',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/20',
  },
  {
    icon: Globe,
    value: 'Multi',
    label: 'Lingual AI Assistant',
    description: 'Conversational support in regional languages',
    gradient: 'from-purple-500 to-violet-600',
    glow: 'group-hover:shadow-purple-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export default function StatsSection() {
  return (
    <section className="py-24 relative">
      {/* Subtle divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
            Platform Metrics
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for Scale. Designed for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Trust
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className={`group relative rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm p-7 hover:bg-slate-800/70 hover:border-slate-600/60 hover:-translate-y-1 hover:shadow-2xl ${stat.glow} transition-all duration-300 cursor-default`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-slate-300 mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
