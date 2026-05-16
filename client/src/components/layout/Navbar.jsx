import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, User, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Map routes to page titles and icons
  const pageMap = {
    '/dashboard': { title: 'Dashboard', icon: '📊', description: 'Farm Overview' },
    '/upload': { title: 'Crop Scan', icon: '📷', description: 'Disease Detection' },
    '/diagnosis': { title: 'Crop Scan', icon: '📷', description: 'Disease Detection' },
    '/result': { title: 'Analysis Results', icon: '📈', description: 'Assessment' },
    '/trust-score': { title: 'Trust Score', icon: '⭐', description: 'Credit Profile' },
    '/chat': { title: 'Support', icon: '💬', description: 'AI Assistance' },
    '/analytics': { title: 'Analytics', icon: '📉', description: 'Farm Data' },
    '/profile': { title: 'Profile', icon: '👤', description: 'Account' },
    '/applications': { title: 'Applications', icon: '📋', description: 'Loan Status' },
  };

  // Get current page info
  const getCurrentPage = () => {
    for (const [path, info] of Object.entries(pageMap)) {
      if (location.pathname.startsWith(path)) {
        return info;
      }
    }
    return { title: 'AgriMitra 360', icon: '🌾', description: 'Agricultural Intelligence' };
  };

  const currentPage = getCurrentPage();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Crop Scan', path: '/upload', icon: '📷' },
    { name: 'Analytics', path: '/analytics', icon: '📉' },
    { name: 'Support', path: '/chat', icon: '💬' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-emerald-100 bg-emerald-50/80 px-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-8">
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

          {/* Page Title & Description - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-emerald-200 dark:border-slate-700">
            <span className="text-lg">{currentPage.icon}</span>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">{currentPage.title}</h1>
              <p className="text-xs text-emerald-700/60 dark:text-emerald-400/50">{currentPage.description}</p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-all ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-900 dark:bg-emerald-600/30 dark:text-emerald-300'
                    : 'text-emerald-700/70 hover:bg-emerald-600/10 dark:text-emerald-400/70 dark:hover:bg-emerald-600/20'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            title="View profile"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-700 dark:bg-emerald-600/40 dark:text-emerald-400">
              <User className="h-3 w-3" />
            </div>
            <span className="hidden text-xs font-bold text-emerald-900 dark:text-emerald-300 sm:inline">Profile</span>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-100 bg-emerald-50/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
          <div className="space-y-1 p-4">
            {navItems.map((item) => {
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
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
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
