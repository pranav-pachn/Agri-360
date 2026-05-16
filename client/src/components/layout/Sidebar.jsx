import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Leaf, TrendingUp, Map, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Leaf, label: 'Crop Intelligence', path: '/upload' },
    { icon: TrendingUp, label: 'Credit Pulse', path: '/trust-score' },
    { icon: Map, label: 'Land Assets', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col gap-2 border-r border-emerald-100 bg-emerald-50 py-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight text-emerald-800 dark:text-emerald-200">AgriMitra 360</h2>
            <p className="text-xs text-on-surface-variant opacity-70">Digital Agronomist</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg shadow-emerald-900/20 opacity-90'
                  : 'text-emerald-800/70 dark:text-emerald-400/70 hover:bg-emerald-100 dark:hover:bg-slate-800 hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <Link
          to="/trust-score"
          className="block w-full rounded-full bg-secondary py-3 text-center text-sm font-bold text-on-secondary shadow-md transition-all hover:brightness-110"
        >
          Apply for Credit
        </Link>
      </div>
    </aside>
  );
}
