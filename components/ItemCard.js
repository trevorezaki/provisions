import Link from "next/link";
import {
  LocationIcon,
  PinIcon,
  CheckIcon,
  XIcon,
  BackIcon,
  WarningIcon,
  EditIcon,
} from "@/components/icons";
import {
  statusTone,
  ExpirationBadge,
  resolvedLabel,
  TONE_COLORS,
} from "@/lib/expiration";
import { conflictSummary } from "@/lib/allergens";

const categoryLabel = (c) => c[0].toUpperCase() + c.slice(1);
const typeLabel = (t) => (t === "cooked" ? "Cooked" : "Raw");

// Left-edge accent: active items use the fresh/soon/expired tone;
// once resolved, the edge reflects the resolution itself instead. An
// allergen conflict always wins, since it matters more than timing.
function borderColorFor(item, hasAllergenConflict) {
  if (hasAllergenConflict) return "#C2540E";
  if (item.status === "active") {
    return TONE_COLORS[statusTone(item.expirationDate, item.location)].border;
  }
  return item.status === "finished" ? "#0D8162" : "#E5341E";
}

export default function ItemCard({
  item,
  phase,
  onPick,
  onCancelPick,
  onConfirm,
  onUndo,
  conflicts = [],
}) {
  const hasAllergenConflict = conflicts.length > 0;
  const borderColor = borderColorFor(item, hasAllergenConflict);

  const contentRow = (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <div>
        <p
          className={`font-body font-medium text-sm ${
            phase === "collapsing" || phase === "settled"
              ? "line-through text-stone-400"
              : "text-stone-900"
          }`}
        >
          {item.name}
        </p>
        <p className="font-body text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
          <LocationIcon location={item.location} className="text-navy/60" />
          {categoryLabel(item.category)} &middot; {typeLabel(item.type)}
        </p>
        {item.containerDescription && (
          <p className="font-body text-[11px] font-semibold text-navy flex items-center gap-1.5 mt-0.5">
            <PinIcon />
            {item.containerDescription}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {(phase === "idle" ||
          phase === "confirming-finished" ||
          phase === "confirming-wasted" ||
          phase === "collapsing") && (
          <ExpirationBadge
            expirationDate={item.expirationDate}
            location={item.location}
          />
        )}
        <Link
          href={`/items/${item.id}/edit`}
          aria-label="Edit item"
          className="text-stone-400 hover:text-navy"
        >
          <EditIcon />
        </Link>
      </div>
    </div>
  );

  return (
    <li
      className="bg-white border border-stone-200 rounded-md overflow-hidden"
      style={{ borderLeftWidth: "4px", borderLeftColor: borderColor }}
    >
      {contentRow}

      {hasAllergenConflict && (
        <div className="flex items-start gap-1.5 px-3.5 py-2 bg-[#FDE8D7] border-t border-[#F3C89A]">
          <WarningIcon className="text-[#B5540A] mt-0.5 shrink-0" />
          <span className="font-body text-[11px] font-semibold text-[#8A3E08]">
            Contains {conflictSummary(conflicts)}
          </span>
        </div>
      )}

      {phase === "idle" && (
        <div className="px-3.5 pb-3.5">
          <div className="flex border border-stone-300 rounded-full overflow-hidden h-9">
            <button
              type="button"
              onClick={() => onPick(item.id, "finished")}
              className="flex-1 flex items-center justify-center gap-1.5 font-body text-xs font-semibold text-signgreen hover:bg-signgreen50"
            >
              <CheckIcon /> Finished
            </button>
            <div className="w-px bg-stone-300" />
            <button
              type="button"
              onClick={() => onPick(item.id, "wasted")}
              className="flex-1 flex items-center justify-center gap-1.5 font-body text-xs font-semibold text-signred hover:bg-signred50"
            >
              <XIcon /> Wasted
            </button>
          </div>
        </div>
      )}

      {(phase === "confirming-finished" || phase === "confirming-wasted") && (
        <div className="px-3.5 pb-3.5">
          <div className="flex items-stretch gap-1.5 h-9">
            {phase === "confirming-finished" ? (
              <button
                type="button"
                onClick={() => onConfirm(item.id, "finished")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-full font-body text-xs font-bold text-white bg-signgreen"
              >
                <CheckIcon /> Confirm Finished
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConfirm(item.id, "wasted")}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-full font-body text-xs font-bold text-white bg-signred"
              >
                <XIcon /> Confirm Wasted
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                onPick(
                  item.id,
                  phase === "confirming-finished" ? "wasted" : "finished"
                )
              }
              className="shrink-0 px-3 rounded-full border border-stone-300 font-body text-[11px] font-semibold text-stone-500 whitespace-nowrap"
            >
              {phase === "confirming-finished" ? "Wasted" : "Finished"} instead
            </button>
            <button
              type="button"
              onClick={() => onCancelPick(item.id)}
              className="shrink-0 w-9 rounded-full border border-stone-300 flex items-center justify-center text-stone-400"
              aria-label="Cancel"
            >
              <BackIcon />
            </button>
          </div>
        </div>
      )}

      {phase === "collapsing" && (
        <>
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 border-t border-stone-100">
            <span
              className={`font-body text-xs font-semibold flex items-center gap-1.5 ${
                item.status === "finished" ? "text-signgreen" : "text-signred"
              }`}
            >
              {item.status === "finished" ? <CheckIcon /> : <XIcon />}
              Marked {item.status === "finished" ? "Finished" : "Wasted"}
            </span>
            <button
              type="button"
              onClick={() => onUndo(item.id)}
              className="font-body text-xs font-bold text-navy underline"
            >
              Undo
            </button>
          </div>
          <div className="h-[2px] bg-stone-200">
            <div
              className="h-full bg-gold origin-left"
              style={{ animation: "item-collapse-timer 4s linear forwards" }}
            />
          </div>
        </>
      )}

      {phase === "settled" && (
        <div className="flex items-center justify-between px-3.5 pb-3.5">
          <p className="font-body text-[10px] text-stone-400">
            {resolvedLabel(item.resolvedAt)}
          </p>
          <div className="flex items-center gap-2.5">
            <span
              className={`font-body text-xs font-semibold flex items-center gap-1.5 ${
                item.status === "finished" ? "text-signgreen" : "text-signred"
              }`}
            >
              {item.status === "finished" ? <CheckIcon /> : <XIcon />}
              {item.status === "finished" ? "Finished" : "Wasted"}
            </span>
            <button
              type="button"
              onClick={() => onUndo(item.id)}
              className="font-body text-[11px] font-semibold text-navy border border-stone-300 rounded-full px-2.5 py-1"
            >
              Undo
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
