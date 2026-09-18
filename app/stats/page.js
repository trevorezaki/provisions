import { prisma } from "@/lib/prisma";
import StatsView from "@/components/StatsView";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  // Pull every item ever logged (including finished/wasted ones) so
  // frequency and trends reflect real history, not just what's active
  // right now. Time-range filtering happens client-side so switching
  // ranges feels instant.
  const items = await prisma.item.findMany({
    orderBy: { dateAdded: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="font-display font-semibold text-2xl text-navy mb-1">
        Stats
      </h1>
      <p className="font-body text-sm text-stone-600 mb-5">
        What you buy, what you cook, and what you waste.
      </p>

      <StatsView items={items} />
    </main>
  );
}
