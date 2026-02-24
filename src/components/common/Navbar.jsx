import React from 'react';
import { User, LogOut, LogIn, TerminalSquare } from 'lucide-react';

export default function Navbar({ isLoggedIn, username, onLogout, onAuthClick }) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <TerminalSquare className="text-white" size={24} strokeWidth={2.5} />
          </div>
          
          <div>
            {/* Text gradient flips to lighter, glowing blues in dark mode */}
            <h1 className="text-4xl font-extrabold bg-linear-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
              ComputeX
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold tracking-widest uppercase">
              Competitive Platform
            </p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Modern User Pill - Flips to deep slate in dark mode */}
              <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 pl-1.5 pr-4 py-1.5 rounded-full shadow-inner transition-colors duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 p-1.5 rounded-full shadow-sm">
                  <User size={16} className="text-white dark:text-slate-950" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide">
                  {username}
                </span>
              </div>
              
              {/* Sleek Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800/50 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow group"
              >
                <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                Logout
              </button>
            </>
          ) : (
            /* Premium Login Button - Inverts to solid white in dark mode for maximum contrast */
            <button
              onClick={onAuthClick}
              className="group relative flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 hover:-translate-y-0.5"
            >
              <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              Sign In
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 dark:ring-black/10 pointer-events-none"></div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}