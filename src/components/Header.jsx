import { memo } from 'react';

const Header = memo(function Header({ difficulty, onSetDifficulty, sound, onToggleSound, theme, onToggleTheme, onNewGame }) {
  // Cycle difficulty
  const difficulties = ['easy', 'medium', 'hard'];
  const nextDiff = difficulties[(difficulties.indexOf(difficulty) + 1) % difficulties.length];

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center bg-white/80 dark:bg-[#060913]/80 backdrop-blur-lg border-b border-slate-200 dark:border-indigo-500/20 shadow-lg shadow-slate-200/50 dark:shadow-black/30 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full max-w-5xl">
        
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-2.5">
          <svg className="w-9 h-9 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradLogo" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stopColor="#6366F1"/>
                <stop offset="100%" stopColor="#8B5CF6"/>
              </linearGradient>
            </defs>
            <rect x="6" y="10" width="24" height="28" rx="6" fill="url(#gradLogo)" opacity="0.25"/>
            <rect x="12" y="6" width="24" height="28" rx="6" fill="url(#gradLogo)" opacity="0.45"/>
            <rect x="18" y="10" width="24" height="28" rx="6" fill="url(#gradLogo)"/>
            <text x="30" y="28" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
              1→10
            </text>
          </svg>
          <h1 className="font-display font-bold text-lg sm:text-xl tracking-wide select-none text-slate-800 dark:text-white drop-shadow-sm dark:drop-shadow-md">
            OrderHunt
          </h1>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4 sm:gap-5 text-sm font-medium">
          {/* Difficulty */}
          <button
            onClick={() => onSetDifficulty(nextDiff)}
            className="capitalize text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all flex items-center gap-1.5 focus:outline-none"
            title="Difficulty"
          >
            <span className={`block h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] ${
                difficulty === 'easy' ? 'bg-emerald-400 text-emerald-400' :
                difficulty === 'medium' ? 'bg-yellow-400 text-yellow-400' : 'bg-red-400 text-red-400'
              }`} />
            <span className="hidden sm:inline pt-px">{difficulty}</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all text-lg focus:outline-none"
            title="Toggle Sound"
          >
            {sound ? '🔊' : '🔇'}
          </button>

          {/* Theme */}
          <button
            onClick={onToggleTheme}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all focus:outline-none"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Restart */}
          <button
            onClick={onNewGame}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all focus:outline-none ml-1"
            title="Restart Game"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
