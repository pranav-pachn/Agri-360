import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard',       path: '/dashboard' },
    { name: 'Analyze Crop',    path: '/upload' },
    { name: 'Analytics',       path: '/analytics' },
    { name: 'Agri Assistant',  path: '/chat' },
  ];

  return (
    <nav className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center space-x-3 group">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20 group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
          AgriMitra 360
        </span>
      </Link>
      
      <div className="flex items-center space-x-1 sm:space-x-3">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-slate-800 text-green-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
        
        <Link
          to="/profile"
          className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            location.pathname === '/profile'
              ? 'bg-slate-800 text-green-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
          title="View your profile"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
