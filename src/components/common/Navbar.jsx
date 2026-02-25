import React from 'react';
import { User, LogOut, LogIn, TerminalSquare } from 'lucide-react';
import computeXLogo from '../../assets/image.png';

export default function Navbar({ isLoggedIn, username, onLogout, onAuthClick }) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0">
          <img
            src={computeXLogo}
            alt="ComputeX Logo"
            className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />

          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold bg-linear-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight leading-tight">
              ComputeX
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-widest uppercase hidden sm:block mt-0.5 leading-none">
              Competitive Platform
            </p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn ? (
            <>
              {/* Modern User Pill - Flips to deep slate in dark mode */}
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 p-1 sm:pl-1.5 sm:pr-4 sm:py-1.5 rounded-full shadow-inner transition-colors duration-300">
                <div className="bg-linear-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 p-1.5 rounded-full shadow-sm shrink-0">
                  <User className="w-4 h-4 sm:w-4 sm:h-4 text-white dark:text-slate-950" strokeWidth={2.5} />
                </div>
                {/* Hide username on mobile, show on sm+ screens */}
                <span className="font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm tracking-wide hidden sm:block max-w-[100px] md:max-w-[150px] truncate">
                  {username}
                </span>
              </div>

              {/* Sleek Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800/50 p-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shadow-sm hover:shadow group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
                {/* Hide text on mobile, show on sm+ screens */}
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            /* Premium Login Button - Inverts to solid white in dark mode for maximum contrast */
            <button
              onClick={onAuthClick}
              className="group relative flex items-center gap-1.5 sm:gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-0.5 transition-transform duration-300 shrink-0" />
              <span>Sign In</span>
              <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-1 ring-inset ring-white/10 dark:ring-black/10 pointer-events-none"></div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}