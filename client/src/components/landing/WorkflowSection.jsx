import { motion } from 'framer-motion';
import {
  Sprout,
  ScanSearch,
  ShieldAlert,
  BadgeCheck,
  Lightbulb,
  LayoutDashboard,
} from 'lucide-react';

const steps = [
  {
    icon: Sprout,
    title: 'Farmer Input',
    description: 'Upload crop images and field data',
    gradient: 'from-lime-500 to-green-600',
  },
  {
    icon: ScanSearch,
    title: 'Crop Analysis',
    description: 'AI-powered disease & health detection',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: ShieldAlert,
    title: 'Risk Engine',
    description: 'Multi-factor risk scoring with explanations',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: BadgeCheck,
    title: 'Trust Score',
    description: 'Financial trust & credit readiness',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Lightbulb,
    title: 'Recommendations',
    description: 'Actionable insights & interventions',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Unified view of all intelligence',
    gradient: 'from-violet-500 to-purple-600',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export default function WorkflowSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />

      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
            System Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From Field Data to{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Actionable Intelligence
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A seamless pipeline that transforms raw agricultural data into
            financial-grade insights in seconds.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative"
        >
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[8%] right-[8%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-lime-500/30 via-emerald-500/30 via-blue-500/30 to-purple-500/30 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={stepVariants}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Step number */}
                  <span className="absolute -top-2 -right-1 sm:static sm:mb-2 text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Icon circle */}
                  <div
                    className={`relative z-10 w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 mb-4`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[160px]">
                    {step.description}
                  </p>

                  {/* Arrow connector for small screens */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden mt-4 mb-2 text-slate-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2l6 6-6 6-1.4-1.4L10.2 9H2V7h8.2L6.6 3.4z" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
