import { prisma } from "@/lib/prisma";
import { RESOLVED_WINDOW_HOURS } from "@/lib/expiration";
import { parseAllergens } from "@/lib/allergens";
import InventoryList from "@/components/InventoryList";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
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
      <h1 className="font-display font-semibold text-2xl text-navy mb-6">
        Full inventory
      </h1>

      <InventoryList items={items} profiles={profiles} />
    </main>
  );
}
