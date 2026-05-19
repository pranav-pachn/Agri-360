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
      <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#060e1a]/80 px-4 shadow-sm backdrop-blur-md sm:px-8 lg:hidden">
        {/* Left: Logo & Current Page */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-80"
            title="Go to Dashboard"
          >
            <span className="text-xl sm:text-2xl">🌾</span>
            <span className="hidden text-sm font-black text-emerald-400 sm:inline">Agri360</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector
            selected={language}
            className="hidden sm:block"
            selectClassName="appearance-none rounded-full border border-slate-700 bg-slate-800/60 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-200 shadow-sm transition-colors hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            iconClassName="text-slate-400"
          />

          {/* Search - Hidden on small screens */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 rounded-full border border-slate-700 bg-slate-800/50 py-1.5 pl-9 pr-3 text-xs text-slate-200 backdrop-blur transition-all placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-700 bg-slate-800/50 p-1.5 text-slate-400 transition-all hover:bg-slate-700/50 hover:text-slate-200"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Profile Button */}
          <Link
            to="/profile"
            className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-2.5 py-1.5 transition-all hover:bg-slate-700/50 sm:px-3"
            title={t('profileTitle', 'View profile')}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <User className="h-3 w-3" />
            </div>
            <span className="hidden text-xs font-bold text-slate-300 sm:inline">
              {t('profile', 'Profile')}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-full border border-slate-700 bg-slate-800/50 p-1.5 text-slate-400 transition-all hover:bg-slate-700/50 hover:text-slate-200"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Pill Nav Bar (below main navbar) */}
      <div className="border-b border-slate-800 bg-[#060e1a]/90 px-4 py-2 backdrop-blur-md lg:hidden">
        <div className="mb-2 sm:hidden">
          <LanguageSelector
            selected={language}
            selectClassName="appearance-none w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-3 pr-8 text-sm font-medium text-slate-200 shadow-sm transition-colors hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            iconClassName="text-slate-400"
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
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-300'
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
        <div className="lg:hidden border-b border-slate-800 bg-[#060e1a]/95 backdrop-blur-md">
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
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
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
