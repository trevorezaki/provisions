"use client";

import { useState } from "react";
import { updateItem, deleteItemPermanently } from "@/app/actions";
import { CATEGORIES, TYPES, LOCATIONS } from "@/lib/constants";
import { toDateInputValue } from "@/lib/shelfLife";
import AllergenPicker from "@/components/AllergenPicker";

export default function EditItemForm({ item }) {
  const [name, setName] = useState(item.name);
  const [type, setType] = useState(item.type);
  const [location, setLocation] = useState(item.location);
  const [category, setCategory] = useState(item.category);
  const [containerDescription, setContainerDescription] = useState(
    item.containerDescription || ""
  );
  const [expirationDate, setExpirationDate] = useState(
    item.expirationDate ? toDateInputValue(item.expirationDate) : ""
  );
  const [allergens, setAllergens] = useState(new Set(item.allergens));
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const inputClass =
    "w-full rounded-md border border-stone-300 px-3 py-2 font-body bg-white focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy";
  const labelClass = "block font-body text-sm font-medium mb-1 text-stone-700";

  return (
    <>
      <form action={updateItem} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={item.id} />

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
            <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            id="containerDescription"
            name="containerDescription"
            type="text"
            value={containerDescription}
            onChange={(e) => setContainerDescription(e.target.value)}
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
            onChange={(e) => setExpirationDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Allergens{" "}
            <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            type="hidden"
            name="allergens"
            value={JSON.stringify(Array.from(allergens))}
          />
          <AllergenPicker selected={allergens} onChange={setAllergens} />
        </div>

        <button
          type="submit"
          className="font-body mt-2 bg-navy text-cream rounded-md py-2.5 font-semibold hover:opacity-90"
        >
          Save changes
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-stone-200">
        {!confirmingDelete ? (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="font-body text-xs font-semibold text-signred"
          >
            Delete this item permanently
          </button>
        ) : (
          <div className="bg-signred50 border border-[#f0c9c3] rounded-md p-3">
            <p className="font-body text-xs font-semibold text-[#8A2115] mb-2">
              Delete "{item.name}" permanently? This can't be undone — it's
              gone from your history and stats too, not just resolved.
            </p>
            <div className="flex gap-2">
              <form action={deleteItemPermanently}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="font-body text-xs font-bold text-white bg-signred rounded-md px-3 py-1.5"
                >
                  Yes, delete permanently
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="font-body text-xs font-semibold text-stone-500 border border-stone-300 rounded-md px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
