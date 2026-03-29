export default function TurnIndicator({ turn, thinking }) {
  const isUser = turn === 'user';

  return (
    <div className="flex items-center justify-center gap-2">
      <span className={`relative flex h-2.5 w-2.5 ${isUser ? '' : ''}`}>
        <span className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
          isUser ? 'bg-indigo-400' : 'bg-orange-400'
        }`} />
        <span className={`relative block h-2.5 w-2.5 rounded-full ${
          isUser ? 'bg-indigo-400' : 'bg-orange-400'
        }`} />
      </span>

      <span className="text-xs uppercase tracking-[0.15em] font-bold text-slate-500 dark:text-slate-300 drop-shadow-sm select-none">
        {isUser ? 'Your Turn' : 'AI Turn'}
      </span>

      {thinking && (
        <span className="flex gap-1 ml-1 opacity-80">
          <span className="dot-1 w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="dot-2 w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="dot-3 w-1.5 h-1.5 rounded-full bg-orange-400" />
        </span>
      )}
    </div>
  );
}
