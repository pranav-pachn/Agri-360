import { Link, useLocation } from 'react-router-dom';
import { Home, Leaf, TrendingUp, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Leaf, label: 'Crops', path: '/upload' },
    { icon: TrendingUp, label: 'Finance', path: '/trust-score' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex justify-around items-center px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-emerald-100 dark:border-slate-800">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.path || location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 transition-all duration-100 text-center ${
              isActive
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-400 dark:text-slate-500 active:bg-emerald-50 dark:active:bg-slate-800 active:scale-90'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
