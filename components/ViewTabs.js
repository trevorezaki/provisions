export default function ViewTabs({ view, setView, resolvedCount }) {
  return (
    <div className="flex items-center gap-1.5 mb-4">
      <button
        type="button"
        onClick={() => setView("active")}
        className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full border ${
          view === "active"
            ? "bg-navy border-navy text-cream"
            : "bg-white border-stone-300 text-stone-500"
        }`}
      >
        Active
      </button>
      <button
        type="button"
        onClick={() => setView("resolved")}
        className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
          view === "resolved"
            ? "bg-navy border-navy text-cream"
            : "bg-white border-stone-300 text-stone-500"
        }`}
      >
        Resolved
        {resolvedCount > 0 && (
          <span
            className={`text-[10px] px-1.5 rounded-full ${
              view === "resolved" ? "bg-cream text-navy" : "bg-stone-200 text-stone-600"
            }`}
          >
            {resolvedCount}
          </span>
        )}
      </button>
    </div>
  );
}
