import { memo } from 'react';

const Card = memo(function Card({ card, onClick, disabled, flash }) {
  const isFlipped = card.flipped;
  const owned = card.owner;

  const frontExtra =
    flash === 'correct' ? 'is-correct anim-glow'
      : flash === 'wrong' ? 'is-wrong anim-shake'
        : owned === 'user' ? 'is-user'
          : owned === 'system' ? 'is-system'
            : '';

  return (
    <div
      className={`card-perspective w-full aspect-[3/4] card-interactive rounded-lg sm:rounded-xl ${disabled ? 'is-disabled' : ''}`}
      onClick={() => !disabled && !isFlipped && onClick(card.id)}
      role="button"
      tabIndex={disabled || isFlipped ? -1 : 0}
      aria-label={isFlipped ? `Card ${card.value}` : 'Face down card'}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isFlipped) {
          e.preventDefault();
          onClick(card.id);
        }
      }}
    >
      <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Back (face-down) */}
        <div className="card-face card-back">
          <span className="text-slate-400 dark:text-white/20 text-xl sm:text-2xl lg:text-3xl font-display font-bold select-none">?</span>
        </div>

        {/* Front (face-up) */}
        <div className={`card-face card-front ${frontExtra}`}>
          <span className={`text-4xl sm:text-5xl lg:text-6xl font-display font-black select-none tracking-tighter drop-shadow-sm transition-colors duration-300 ${owned === 'user' ? 'text-indigo-500 dark:text-indigo-300'
              : owned === 'system' ? 'text-orange-500 dark:text-orange-300'
                : flash === 'correct' ? 'text-indigo-500 dark:text-indigo-300'
                  : flash === 'wrong' ? 'text-red-500 dark:text-red-300'
                    : 'text-slate-800 dark:text-slate-200'
            }`}>
            {card.value}
          </span>
        </div>
      </div>
    </div>
  );
});

export default Card;
