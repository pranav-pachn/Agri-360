import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardAlerts({ riskScore = 0.4, yieldDelta = -12 }) {
  const navigate = useNavigate();

  const alerts = [
    {
      id: 1,
      title: 'Action Required',
      description: 'Early Blight detected in East Plot. Recommended fungicide treatment immediate application.',
      icon: AlertCircle,
      color: 'error',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      id: 2,
      title: 'Yield Projection Update',
      description: `Predicted yield drop of ${Math.abs(yieldDelta)}% if untreated. Current projection: 8.2 Tons/Acre.`,
      icon: TrendingDown,
      color: 'warning',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      {alerts.map((alert, idx) => {
        const Icon = alert.icon;
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: idx * 0.08 }}
            className={`${alert.bgColor} border-l-4 ${alert.borderColor} p-6 rounded-xl`}
          >
            <div className="flex items-start gap-4">
              <Icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-on-surface dark:text-white text-sm">
                  {alert.title}
                </h4>
                <p className="text-sm text-on-surface-variant dark:text-slate-300 mt-1 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.16 }}
        className="flex-1 bg-surface-container-high dark:bg-slate-800/50 rounded-xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
      >
        <div className="relative z-10 h-full flex flex-col justify-between">
          <MessageCircle className="w-8 h-8 text-secondary dark:text-blue-400" />
          <div>
            <h4 className="text-lg font-bold text-on-surface dark:text-white">
              Agri Expert Connect
            </h4>
            <p className="text-sm text-on-surface-variant dark:text-slate-300 mt-1">
              Talk to an agronomist now about your crop issues.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="mt-4 text-secondary dark:text-blue-400 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform"
            >
              Connect Now
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
