import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, User, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../chat/LanguageSelector';
import { protectedMobileMenuItems, protectedPrimaryNavItems } from './navigation';

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = i18n.language || 'en';

  return (
    <>
      <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-emerald-100 bg-emerald-50/80 px-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-8 lg:hidden">
        {/* Left: Logo & Current Page */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-80"
            title="Go to Dashboard"
          >
            <span className="text-xl sm:text-2xl">🌾</span>
            <span className="hidden text-sm font-black text-emerald-900 dark:text-emerald-300 sm:inline">Agri360</span>
          </Link>

          {/* Page title removed to avoid duplicate headers; page components render their own title */}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector
            selected={language}
            className="hidden sm:block"
            selectClassName="appearance-none rounded-full border border-emerald-200 bg-white/70 py-1.5 pl-3 pr-8 text-xs font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-emerald-200 dark:hover:bg-slate-700"
            iconClassName="text-emerald-700/60 dark:text-emerald-300/70"
          />

          {/* Search - Hidden on small screens */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700/50 dark:text-emerald-400/50" />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 rounded-full border border-emerald-200 bg-white/50 py-1.5 pl-9 pr-3 text-xs backdrop-blur transition-all placeholder:text-emerald-700/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:placeholder:text-emerald-400/40 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-emerald-200 bg-white/50 p-1.5 text-emerald-700 transition-all hover:bg-emerald-100/50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-emerald-400 dark:hover:bg-slate-700/50"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Profile Button */}
          <Link
            to="/profile"
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/50 px-2.5 py-1.5 transition-all hover:bg-emerald-50/80 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 sm:px-3"
            title={t('profileTitle', 'View profile')}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-700 dark:bg-emerald-600/40 dark:text-emerald-400">
              <User className="h-3 w-3" />
            </div>
            <span className="hidden text-xs font-bold text-emerald-900 dark:text-emerald-300 sm:inline">
              {t('profile', 'Profile')}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-full border border-emerald-200 bg-white/50 p-1.5 text-emerald-700 transition-all hover:bg-emerald-100/50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-emerald-400 dark:hover:bg-slate-700/50"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div className="border-b border-emerald-100 bg-emerald-50/90 px-4 py-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        <div className="mb-2 sm:hidden">
          <LanguageSelector
            selected={language}
            selectClassName="appearance-none w-full rounded-xl border border-emerald-200 bg-white/80 py-2 pl-3 pr-8 text-sm font-medium text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-emerald-200 dark:hover:bg-slate-700"
            iconClassName="text-emerald-700/60 dark:text-emerald-300/70"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {protectedPrimaryNavItems.map((item) => {
            const isActive =
              location.pathname === item.path || location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-all ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-900 dark:bg-emerald-600/30 dark:text-emerald-300'
                    : 'bg-white/60 text-emerald-700/80 dark:bg-slate-800/70 dark:text-emerald-400/80'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-100 bg-emerald-50/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
          <div className="space-y-1 p-4">
            {protectedMobileMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-900 dark:bg-emerald-600/30 dark:text-emerald-300'
                      : 'text-emerald-700/70 hover:bg-emerald-600/10 dark:text-emerald-400/70 dark:hover:bg-emerald-600/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
