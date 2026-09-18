"use client";

import { useState } from "react";
import { CATEGORIES, LOCATIONS } from "@/lib/constants";

const locationLabel = { fridge: "Fridge", freezer: "Freezer", pantry: "Pantry" };
const categoryLabel = (c) => c[0].toUpperCase() + c.slice(1);

export default function FilterControl({
  locations,
  setLocations,
  categories,
  setCategories,
}) {
  const [open, setOpen] = useState(false);

  const activeCount = LOCATIONS.length - locations.size + categories.size;

  function toggleLocation(loc) {
    setLocations((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) {
        // Never allow filtering down to zero locations — that's just
        // an empty list with no way back without reopening the panel.
        if (next.size > 1) next.delete(loc);
      } else {
        next.add(loc);
      }
      return next;
    });
  }

  function toggleCategory(cat) {
    setCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-end mb-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-20 flex items-center gap-1.5 font-body font-semibold text-xs text-navy bg-white border border-stone-300 rounded-full px-3 py-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5h16l-6 8v6l-4 2v-8L4 5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Filter
          {activeCount > 0 && (
            <span className="bg-navy text-cream text-[10px] px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <>
          {/* Click-outside backdrop — dismisses the panel without shifting any layout */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-9 z-20 w-72 bg-white border border-stone-200 rounded-lg shadow-lg px-4 py-3.5">
            <div className="mb-3">
              <p className="font-body font-semibold text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">
                Location
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocation(loc)}
                    className={`font-body font-semibold text-xs px-2.5 py-1 rounded-full border ${
                      locations.has(loc)
                        ? "bg-navy border-navy text-cream"
                        : "bg-white border-stone-300 text-stone-500"
                    }`}
                  >
                    {locationLabel[loc]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body font-semibold text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">
                Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`font-body font-semibold text-xs px-2.5 py-1 rounded-full border ${
                      categories.has(cat)
                        ? "bg-navy border-navy text-cream"
                        : "bg-white border-stone-300 text-stone-500"
                    }`}
                  >
                    {categoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
