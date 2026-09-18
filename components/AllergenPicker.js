"use client";

import { useState } from "react";
import { FIXED_ALLERGENS } from "@/lib/allergens";

export default function AllergenPicker({ selected, onChange }) {
  const [customInput, setCustomInput] = useState("");

  function toggle(key) {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    onChange(next);
  }

  function addCustom() {
    const value = customInput.trim();
    if (!value) return;
    const next = new Set(selected);
    next.add(value);
    onChange(next);
    setCustomInput("");
  }

  const fixedKeys = new Set(FIXED_ALLERGENS.map((a) => a.key));
  const customSelected = Array.from(selected).filter((k) => !fixedKeys.has(k));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {FIXED_ALLERGENS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full border ${
              selected.has(key)
                ? "bg-navy border-navy text-cream"
                : "bg-white border-stone-300 text-stone-500"
            }`}
          >
            {label}
          </button>
        ))}
        {customSelected.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border bg-navy border-navy text-cream"
          >
            {key} &times;
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Other allergen (e.g. mango)"
          className="flex-1 rounded-md border border-stone-300 px-2.5 py-1.5 font-body text-xs bg-white"
        />
        <button
          type="button"
          onClick={addCustom}
          className="font-body text-xs font-semibold px-3 rounded-md border border-stone-300 text-stone-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}
