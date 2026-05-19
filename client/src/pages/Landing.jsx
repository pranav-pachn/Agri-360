import {
  Sprout,
  Home,
  LineChart,
  User,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import DashboardPreview from '../components/landing/DashboardPreview';
import ExplainableAISection from '../components/landing/ExplainableAISection';
import CTASection from '../components/landing/CTASection';

const topNavItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Architecture', to: '/architecture' },
  { label: 'Support Chat', to: '/chat' },
];

const mobileTabs = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Crops', to: '/upload', icon: Sprout },
  { label: 'Analytics', to: '/analytics', icon: LineChart },
  { label: 'Profile', to: '/profile', icon: User },
];

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#060e1a] text-slate-100">
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.5), transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.5), transparent 80%)',
          }}
        />
        {/* Gradient blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-emerald-600/[0.07] blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/[0.06] blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-600/[0.04] blur-[120px]" />
      </div>

      {/* === HEADER === */}
      <header className="sticky top-0 z-50 border-b border-slate-700/30 bg-[#060e1a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-white font-extrabold text-xl tracking-tight no-underline hover:opacity-90 transition-opacity"
            aria-label="AgriMitra 360 home"
          >
            <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center border border-white/20 bg-gradient-to-br from-emerald-500/30 to-blue-500/30">
              <Sprout size={16} />
            </span>
            <span>AgriMitra 360</span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:inline-flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]"
            aria-label="Primary navigation"
          >
            {topNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-slate-300 text-xs font-bold uppercase tracking-[0.08em] px-4 py-2 rounded-full no-underline hover:bg-white/10 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="inline-flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-300 no-underline font-semibold text-sm px-3 py-1.5 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-[#060e1a] bg-white no-underline font-bold text-xs uppercase tracking-[0.06em] px-5 py-2.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <WorkflowSection />
        <DashboardPreview />
        <ExplainableAISection />
        <CTASection />
      </main>

      {/* === FOOTER === */}
      <footer className="relative z-10 border-t border-slate-700/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12 pb-28 lg:pb-12 flex flex-col lg:flex-row justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-xl font-extrabold text-white">AgriMitra 360</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Leading digital transformation in agriculture by combining
              trustworthy AI with credit-ready farm intelligence. Bridging
              the gap between field data and financial confidence.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3" aria-label="Footer links">
            {[
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'Analytics', to: '/analytics' },
              { label: 'Architecture', to: '/architecture' },
              { label: 'Support', to: '/chat' },
              { label: 'Profile', to: '/profile' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-slate-400 text-xs font-bold uppercase tracking-[0.08em] no-underline px-3.5 py-2 rounded-full border border-slate-700/50 hover:text-white hover:border-slate-500 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* === MOBILE NAV === */}
      <nav
        className="fixed left-0 right-0 bottom-0 z-50 lg:hidden flex items-center justify-around border-t border-slate-700/30 bg-[#060e1a]/90 backdrop-blur-xl px-2 py-2.5"
        aria-label="Mobile quick navigation"
      >
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className="flex flex-col items-center gap-1 min-w-[64px] rounded-xl px-3 py-2 text-slate-400 no-underline text-[10px] font-bold uppercase tracking-[0.06em] hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
