export default function Toast({ toast }) {
  if (!toast) return null;

  const colors = {
    success: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
    error:   'border-red-500/30 text-red-300 bg-red-500/10',
    info:    'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
    system:  'border-orange-500/30 text-orange-300 bg-orange-500/10',
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div
        key={toast.key}
        className={`anim-toast-in px-4 py-2 rounded-xl border backdrop-blur-md text-sm font-medium shadow-lg ${
          colors[toast.type] || colors.info
        }`}
      >
        {toast.text}
      </div>
    </div>
  );
}
