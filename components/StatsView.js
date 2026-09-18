"use client";

import { useState, useMemo } from "react";

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function cutoffFor(range) {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : 30;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

const RANGES = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "all", label: "All time" },
];

const TABS = [
  { key: "bought", label: "Most bought" },
  { key: "cooked", label: "Most cooked" },
  { key: "wasted", label: "Most wasted" },
];

function aggregate(items) {
  const map = new Map();
  for (const item of items) {
    const key = normalizeName(item.name);
    const entry = map.get(key) || {
      displayName: item.name,
      category: item.category,
      type: item.type,
      count: 0,
      finished: 0,
      wasted: 0,
    };
    entry.count += 1;
    if (item.status === "finished") entry.finished += 1;
    if (item.status === "wasted") entry.wasted += 1;
    map.set(key, entry);
  }
  return Array.from(map.values());
}

function BarList({ rows, valueKey, barColorClass }) {
  const max = Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.displayName}>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-body text-sm font-medium text-stone-900">
              {row.displayName}
            </span>
            <span className="font-body text-xs font-semibold text-stone-500">
              {row[valueKey]}
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColorClass}`}
              style={{ width: `${(row[valueKey] / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg px-3.5 py-3 flex-1 min-w-[90px]">
      <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
        {label}
      </p>
      <p
        className="font-display font-semibold text-2xl"
        style={{ color: tone || "#1E3968" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function StatsView({ items }) {
  const [range, setRange] = useState("all");
  const [tab, setTab] = useState("bought");

  const filteredItems = useMemo(() => {
    const cutoff = cutoffFor(range);
    if (!cutoff) return items;
    return items.filter((i) => new Date(i.dateAdded) >= cutoff);
  }, [items, range]);

  const aggregated = useMemo(() => aggregate(filteredItems), [filteredItems]);

  const totalFinished = filteredItems.filter((i) => i.status === "finished").length;
  const totalWasted = filteredItems.filter((i) => i.status === "wasted").length;
  const resolvedCount = totalFinished + totalWasted;
  const wasteRate =
    resolvedCount > 0 ? Math.round((totalWasted / resolvedCount) * 100) : null;

  const worstOffender = useMemo(() => {
    return aggregated
      .filter((r) => r.wasted >= 2)
      .sort((a, b) => b.wasted / b.count - a.wasted / a.count)[0];
  }, [aggregated]);

  const mostBought = useMemo(
    () =>
      aggregated
        .filter((r) => r.type === "raw")
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
    [aggregated]
  );
  const mostCooked = useMemo(
    () =>
      aggregated
        .filter((r) => r.type === "cooked")
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
    [aggregated]
  );
  const mostWasted = useMemo(
    () =>
      aggregated
        .filter((r) => r.wasted > 0)
        .sort((a, b) => b.wasted - a.wasted)
        .slice(0, 6),
    [aggregated]
  );

  const tabData = {
    bought: { rows: mostBought, valueKey: "count", barColorClass: "bg-navy" },
    cooked: { rows: mostCooked, valueKey: "count", barColorClass: "bg-signgreen" },
    wasted: { rows: mostWasted, valueKey: "wasted", barColorClass: "bg-signred" },
  }[tab];

  if (items.length === 0) {
    return (
      <p className="font-body text-stone-500">
        No history yet — stats will show up once you've logged a few items.
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-5">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full border ${
              range === r.key
                ? "bg-navy border-navy text-cream"
                : "bg-white border-stone-300 text-stone-500"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        <StatCard label="Logged" value={filteredItems.length} />
        <StatCard label="Finished" value={totalFinished} tone="#0D8162" />
        <StatCard label="Wasted" value={totalWasted} tone="#B32615" />
        <StatCard
          label="Waste rate"
          value={wasteRate === null ? "—" : `${wasteRate}%`}
          tone={wasteRate !== null && wasteRate >= 25 ? "#B32615" : "#1E3968"}
        />
      </div>

      {worstOffender && (
        <div
          className="font-body text-sm rounded-lg border px-4 py-3 mb-5"
          style={{ background: "#FBE1DC", borderColor: "#f3c4bb", color: "#8f2113" }}
        >
          You've wasted <strong>{worstOffender.displayName}</strong>{" "}
          {worstOffender.wasted} of the {worstOffender.count} times you've
          bought it in this range — might be worth buying less of it, or in a
          smaller amount.
        </div>
      )}

      <div className="flex gap-1.5 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full border ${
              tab === t.key
                ? "bg-navy border-navy text-cream"
                : "bg-white border-stone-300 text-stone-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-4">
        {tabData.rows.length === 0 ? (
          <p className="font-body text-sm text-stone-500">
            Nothing here yet for this range.
          </p>
        ) : (
          <BarList
            rows={tabData.rows}
            valueKey={tabData.valueKey}
            barColorClass={tabData.barColorClass}
          />
        )}
      </div>
    </div>
  );
}
