export function daysUntil(date) {
  if (!date) return null;
  const diffMs =
    new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// How soon is "soon" depends on where the item lives — a fridge item
// has days to matter, a freezer item has weeks, a pantry item (once
// opened) is somewhere in between.
export const ATTENTION_THRESHOLD_DAYS = {
  fridge: 3,
  freezer: 30,
  pantry: 14,
};

export function needsAttention(item) {
  const days = daysUntil(item.expirationDate);
  if (days === null) return false;
  const threshold = ATTENTION_THRESHOLD_DAYS[item.location] ?? 3;
  return days <= threshold;
}

// "Expired 1d ago" / "Expires today" / "3 days left" — used by the
// combined Needs Attention list on the dashboard.
export function statusLabel(expirationDate) {
  const days = daysUntil(expirationDate);
  if (days === null) return "";
  if (days < 0) return `expired ${Math.abs(days)}d ago`;
  if (days === 0) return "expires today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

// One place that owns what "expired" / "soon" / "fresh" look like —
// used for both the badge text color and any card's left-edge accent,
// so the two never drift out of sync.
export const TONE_COLORS = {
  expired: { border: "#E5341E", bg: "#FBE1DC", text: "#B32615" },
  soon: { border: "#F5A623", bg: "#FCEACB", text: "#93650F" },
  fresh: { border: "#0D8162", bg: "#EDF3E8", text: "#0D8162" },
};

export function statusTone(expirationDate, location) {
  const days = daysUntil(expirationDate);
  if (days === null) return "fresh";
  if (days <= 0) return "expired";
  const threshold = ATTENTION_THRESHOLD_DAYS[location] ?? 3;
  if (days <= threshold) return "soon";
  return "fresh";
}

export function ExpirationBadge({ expirationDate, location }) {
  const days = daysUntil(expirationDate);
  if (days === null) return null;

  const tone = statusTone(expirationDate, location);
  const colors = TONE_COLORS[tone];

  return (
    <span
      className="font-body text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: colors.bg, color: colors.text }}
    >
      {statusLabel(expirationDate)}
    </span>
  );
}

// How long a resolved item stays correctable in the Resolved view
// before it's considered "long enough ago that you've noticed by now"
// and rolls off — full history always lives in Stats regardless.
export const RESOLVED_WINDOW_HOURS = 48;

export function hoursSince(date) {
  if (!date) return null;
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);
}

export function isRecentlyResolved(item) {
  if (item.status === "active" || !item.resolvedAt) return false;
  const hours = hoursSince(item.resolvedAt);
  return hours !== null && hours < RESOLVED_WINDOW_HOURS;
}

// "Resolved just now" / "Resolved 3h ago" / "Resolved 1d ago"
export function resolvedLabel(resolvedAt) {
  const hours = hoursSince(resolvedAt);
  if (hours === null) return "";
  if (hours < 1) return "Resolved just now";
  const whole = Math.floor(hours);
  if (whole < 24) return `Resolved ${whole}h ago`;
  return `Resolved ${Math.floor(whole / 24)}d ago`;
}
