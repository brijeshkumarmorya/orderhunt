import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameState } from './hooks/useGameState';
import Header from './components/Header';
import TurnIndicator from './components/TurnIndicator';
import GameBoard from './components/GameBoard';
import WinModal from './components/WinModal';
import Toast from './components/Toast';

export default function App() {
  const game = useGameState();
  const [showModal, setShowModal] = useState(false);
  const prevStatus = useRef('playing');

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orderhunt-theme');
      if (saved) return saved;
      // Default to dark mode for backwards compatibility with the original design
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('orderhunt-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    if (game.status !== 'playing' && prevStatus.current === 'playing') {
      setShowModal(true);
    }
    prevStatus.current = game.status;
  }, [game.status]);

  const handlePlayAgain = useCallback(() => {
    game.resetGame();
    setShowModal(false);
  }, [game]);

  const isDisabled = game.turn !== 'user' || game.busy || game.status !== 'playing';

  const displayTarget = game.turn === 'user' ? game.userTarget : game.sysTarget;

  return (
    <div className="game-bg min-h-screen flex flex-col items-center">
      <Header
        difficulty={game.difficulty}
        onSetDifficulty={game.setDifficulty}
        sound={game.sound}
        onToggleSound={game.toggleSound}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewGame={handlePlayAgain}
      />

      {/* Main centered content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-10 w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-8 relative z-10">

        {/* Turn & Target Status */}
        <div className="flex flex-col items-center gap-3 anim-fade-up">
          <TurnIndicator turn={game.turn} thinking={game.thinking} />

          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-1">
              Need
            </span>
            <span className={`text-6xl sm:text-8xl font-display font-extrabold leading-none tracking-tighter ${game.turn === 'user'
              ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-300 dark:to-indigo-500 bg-clip-text text-transparent'
              : 'bg-gradient-to-br from-orange-500 to-orange-700 dark:from-orange-300 dark:to-orange-500 bg-clip-text text-transparent'
              }`}>
              {displayTarget}
            </span>
          </div>
        </div>

        {/* Game board */}
        <div className="w-full flex justify-center anim-fade-up" style={{ animationDelay: '100ms' }}>
          <GameBoard
            cards={game.cards}
            onCardClick={game.clickCard}
            disabled={isDisabled}
            flashCard={game.flashCard}
            resetting={game.resetting}
          />
        </div>

      </div>

      <Toast toast={game.toast} />

      {showModal && (game.status === 'won' || game.status === 'lost') && (
        <WinModal status={game.status} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
