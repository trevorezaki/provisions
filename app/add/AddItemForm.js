"use client";

import { useState, useEffect } from "react";
import { createItem } from "@/app/actions";
import { CATEGORIES, TYPES, LOCATIONS } from "@/lib/constants";
import AllergenPicker from "@/components/AllergenPicker";
import { suggestedExpirationDate, toDateInputValue } from "@/lib/shelfLife";

export default function AddItemForm() {
  const [barcode, setBarcode] = useState("");
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | error | done
  const [lookupError, setLookupError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("raw");
  const [location, setLocation] = useState("fridge");
  const [category, setCategory] = useState("other");
  const [allergens, setAllergens] = useState(new Set());

  const [expirationDate, setExpirationDate] = useState(() =>
    toDateInputValue(suggestedExpirationDate("fridge", "other"))
  );
  const [dateManuallySet, setDateManuallySet] = useState(false);

  // Re-suggest a date whenever location or category changes — but only
  // until the person edits the date themselves, at which point their
  // choice always wins.
  useEffect(() => {
    if (!dateManuallySet) {
      setExpirationDate(toDateInputValue(suggestedExpirationDate(location, category)));
    }
  }, [location, category, dateManuallySet]);

  async function handleLookup() {
    if (!barcode.trim()) return;
    setLookupStatus("loading");
    setLookupError("");

    try {
      const res = await fetch(
        `/api/barcode?code=${encodeURIComponent(barcode.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setLookupStatus("error");
        setLookupError(data.error || "Lookup failed");
        return;
      }

      if (data.name) setName(data.name);
      if (data.category) setCategory(data.category);
      if (data.allergens && data.allergens.length > 0) {
        setAllergens(new Set(data.allergens));
      }
      setLookupStatus("done");
    } catch (err) {
      setLookupStatus("error");
      setLookupError("Couldn't reach the barcode lookup service");
    }
  }

  const inputClass =
    "w-full rounded-md border border-stone-300 px-3 py-2 font-body bg-white focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy";
  const labelClass = "block font-body text-sm font-medium mb-1 text-stone-700";

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="font-display font-semibold text-2xl text-navy mb-6">
        Add an item
      </h1>

      <div className="mb-6 p-4 rounded-lg border border-stone-200 bg-white">
        <label className={labelClass} htmlFor="barcode">
          Look up by barcode{" "}
          <span className="text-stone-400 font-normal">(optional)</span>
        </label>
        <div className="flex gap-2">
          <input
            id="barcode"
            type="text"
            inputMode="numeric"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="e.g. 0044000032914"
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={handleLookup}
            disabled={lookupStatus === "loading"}
            className="font-body bg-navy text-cream rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {lookupStatus === "loading" ? "Looking up…" : "Look up"}
          </button>
        </div>
        {lookupStatus === "done" && (
          <p className="font-body text-xs mt-2" style={{ color: "#0D8162" }}>
            Found it — name and category filled in below. Double check before
            saving.
          </p>
        )}
        {lookupStatus === "error" && (
          <p className="font-body text-xs mt-2" style={{ color: "#B32615" }}>
            {lookupError} — you can still fill in the fields manually.
          </p>
        )}
        <p className="font-body text-xs text-stone-400 mt-2">
          Type the barcode number printed under the barcode lines. No camera
          scanning yet — that's a future enhancement.
        </p>
      </div>

      <form action={createItem} className="flex flex-col gap-4">
        <div>
          <label className={labelClass} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Leftover beef teriyaki"
            autoComplete="off"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="type">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "raw" ? "Raw grocery item" : "Cooked / leftover"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="location">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l[0].toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="containerDescription">
            Container / bag note{" "}
            <span className="text-stone-400 font-normal">
              (optional — e.g. which bowl, or which freezer bag)
            </span>
          </label>
          <input
            id="containerDescription"
            name="containerDescription"
            type="text"
            placeholder="e.g. Blue bowl with lid, top shelf"
            autoComplete="off"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="expirationDate">
            Expiration date
          </label>
          <input
            id="expirationDate"
            name="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => {
              setDateManuallySet(true);
              setExpirationDate(e.target.value);
            }}
            className={inputClass}
          />
          <p className="font-body text-xs text-stone-400 mt-1">
            {dateManuallySet
              ? "Set manually."
              : "Auto-suggested based on category & location — edit if you know the real date."}
          </p>
        </div>

        <div>
          <label className={labelClass}>
            Allergens{" "}
            <span className="text-stone-400 font-normal">
              (optional — flags this item if it matches a household profile)
            </span>
          </label>
          <input type="hidden" name="allergens" value={JSON.stringify(Array.from(allergens))} />
          <AllergenPicker selected={allergens} onChange={setAllergens} />
        </div>

        <button
          type="submit"
          className="font-body mt-2 bg-navy text-cream rounded-md py-2.5 font-semibold hover:opacity-90"
        >
          Add item
        </button>
      </form>
    </main>
  );
}
