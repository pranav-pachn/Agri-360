import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../chat/LanguageSelector';
import { protectedPrimaryNavItems } from './navigation';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { signOut } = useAuth();
  const language = i18n.language || 'en';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col gap-2 border-r border-slate-800 bg-[#060e1a] py-6 lg:flex">
      {/* Brand */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-900/30">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight text-white">AgriMitra 360</h2>
            <p className="text-[11px] font-medium text-slate-500">Digital Agronomist</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {protectedPrimaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600/90 to-blue-600/90 text-white shadow-lg shadow-emerald-900/25'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 hover:translate-x-1'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-3 px-4">
        <div>
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {t('language')}
          </p>
          <LanguageSelector
            selected={language}
            selectClassName="appearance-none w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-3 pr-8 text-sm font-semibold text-slate-200 shadow-sm transition-colors hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
            iconClassName="text-slate-400"
          />
        </div>
        <Link
          to="/trust-score"
          className="block w-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-emerald-900/30 transition-all hover:shadow-lg hover:shadow-emerald-900/40 hover:brightness-110"
        >
          Apply for Credit
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
