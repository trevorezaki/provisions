import { prisma } from "@/lib/prisma";
import { RESOLVED_WINDOW_HOURS } from "@/lib/expiration";
import { parseAllergens } from "@/lib/allergens";
import AttentionList from "@/components/AttentionList";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Active items, plus anything resolved recently enough to still be
  // correctable — AttentionList splits these into its two tabs itself.
  const cutoff = new Date(Date.now() - RESOLVED_WINDOW_HOURS * 60 * 60 * 1000);
  const [items, rawProfiles] = await Promise.all([
    prisma.item.findMany({
      where: {
        OR: [{ status: "active" }, { resolvedAt: { gte: cutoff } }],
      },
    }),
    prisma.profile.findMany(),
  ]);

  const profiles = rawProfiles.map((p) => ({
    ...p,
    allergens: parseAllergens(p.allergens),
  }));

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="font-display font-semibold text-3xl text-navy mb-1">
        Provisions
      </h1>

      <p className="font-body text-stone-500 mb-6 text-sm">
        Track what's in the fridge, freezer, and pantry.
      </p>

      <AttentionList items={items} profiles={profiles} />
    </main>
  );
}
