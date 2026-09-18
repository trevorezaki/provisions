"use client";

import { useState, useMemo, useRef } from "react";
import { markFinished, markWasted, reopenItem } from "@/app/actions";
import {
  daysUntil,
  needsAttention,
  isRecentlyResolved,
} from "@/lib/expiration";
import { LOCATIONS } from "@/lib/constants";
import { parseAllergens, findAllergenConflicts } from "@/lib/allergens";
import FilterControl from "@/components/FilterControl";
import SectionHeading from "@/components/SectionHeading";
import ViewTabs from "@/components/ViewTabs";
import ItemCard from "@/components/ItemCard";

const COLLAPSE_MS = 4000;

function formDataFor(id) {
  const fd = new FormData();
  fd.append("id", id);
  return fd;
}

export default function AttentionList({ items: initialItems, profiles = [] }) {
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState("active");
  const [locations, setLocations] = useState(new Set(LOCATIONS));
  const [categories, setCategories] = useState(new Set());
  const [uiPhase, setUiPhase] = useState({}); // id -> phase override for this session
  const timers = useRef({});

  function patchItem(id, patch) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function handlePick(id, action) {
    setUiPhase((p) => ({ ...p, [id]: `confirming-${action}` }));
  }

  function handleCancelPick(id) {
    setUiPhase((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
  }

  function handleConfirm(id, action) {
    // Optimistic update first, so the UI responds instantly.
    patchItem(id, { status: action, resolvedAt: new Date().toISOString() });
    setUiPhase((p) => ({ ...p, [id]: "collapsing" }));

    (action === "finished" ? markFinished : markWasted)(formDataFor(id));

    timers.current[id] = setTimeout(() => {
      setUiPhase((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
    }, COLLAPSE_MS);
  }

  function handleUndo(id) {
    clearTimeout(timers.current[id]);
    patchItem(id, { status: "active", resolvedAt: null });
    setUiPhase((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    reopenItem(formDataFor(id));
  }

  const activeItems = useMemo(() => {
    return items
      .filter((i) => i.status === "active" || uiPhase[i.id] === "collapsing")
      .filter((i) => locations.has(i.location))
      .filter((i) => categories.size === 0 || categories.has(i.category))
      .filter((i) => i.status !== "active" || needsAttention(i))
      .sort((a, b) => daysUntil(a.expirationDate) - daysUntil(b.expirationDate));
  }, [items, uiPhase, locations, categories]);

  const resolvedItems = useMemo(() => {
    return items
      .filter((i) => i.status !== "active" && isRecentlyResolved(i))
      .sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt));
  }, [items]);

  return (
    <div>
      <ViewTabs view={view} setView={setView} resolvedCount={resolvedItems.length} />

      {view === "active" && (
        <>
          <FilterControl
            locations={locations}
            setLocations={setLocations}
            categories={categories}
            setCategories={setCategories}
          />

          <p className="font-body text-sm text-stone-500 mb-3">
            {activeItems.length === 0
              ? ""
              : `${activeItems.length} item${
                  activeItems.length === 1 ? "" : "s"
                } need a look.`}
          </p>

          <SectionHeading>Needs attention</SectionHeading>

          {activeItems.length === 0 && (
            <p className="font-body text-sm text-stone-500 mb-4">
              {items.filter((i) => i.status === "active").length === 0
                ? "Nothing needs attention right now."
                : "Nothing matches these filters."}
            </p>
          )}

          <ul className="flex flex-col gap-2 mb-6">
            {activeItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                phase={uiPhase[item.id] || "idle"}
                onPick={handlePick}
                onCancelPick={handleCancelPick}
                onConfirm={handleConfirm}
                onUndo={handleUndo}
                conflicts={findAllergenConflicts(
                  parseAllergens(item.allergens),
                  profiles
                )}
              />
            ))}
          </ul>
        </>
      )}

      {view === "resolved" && (
        <>
          <p className="font-body text-xs text-stone-400 mb-3">
            Only shows the last 48 hours — full history lives in Stats.
          </p>

          {resolvedItems.length === 0 && (
            <p className="font-body text-sm text-stone-500 mb-4">
              Nothing resolved in the last 48 hours.
            </p>
          )}

          <ul className="flex flex-col gap-2 mb-6">
            {resolvedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                phase="settled"
                onUndo={handleUndo}
                conflicts={findAllergenConflicts(
                  parseAllergens(item.allergens),
                  profiles
                )}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
