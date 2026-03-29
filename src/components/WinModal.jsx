import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function WinModal({ status, onPlayAgain }) {
  const isWin = status === 'won';

  useEffect(() => {
    if (!isWin) return;
    const end = Date.now() + 2500;
    const colors = ['#6366f1', '#a78bfa', '#3b82f6'];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [isWin]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md anim-fade-in"
      onClick={onPlayAgain}
    >
      <div
        className="anim-scale-in bg-white/95 dark:bg-[#131b2f]/80 border border-slate-200 dark:border-white/5 rounded-[2rem] p-10 sm:p-12 max-w-sm mx-4 text-center shadow-[0_0_80px_-20px_rgba(99,102,241,0.2)] dark:shadow-[0_0_80px_-20px_rgba(99,102,241,0.4)] backdrop-blur-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-6xl sm:text-7xl mb-6 anim-float drop-shadow-xl select-none">
          {isWin ? '🏆' : '💀'}
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-black mb-3 select-none">
          {isWin ? (
            <span className="bg-gradient-to-b from-indigo-500 to-indigo-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
              Victory
            </span>
          ) : (
            <span className="bg-gradient-to-b from-orange-500 to-orange-700 dark:from-white dark:to-orange-400 bg-clip-text text-transparent">
              Defeat
            </span>
          )}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium select-none">
          {isWin
            ? 'You beat the AI in the race to 10.'
            : 'The AI finished the sequence first.'}
        </p>

        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-white font-bold tracking-widest uppercase text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
