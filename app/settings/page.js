import { prisma } from "@/lib/prisma";
import { parseAllergens } from "@/lib/allergens";
import ProfilesManager from "@/components/ProfilesManager";

export default async function SettingsPage() {
  const rawProfiles = await prisma.profile.findMany({
    orderBy: { createdAt: "asc" },
  });
  const profiles = rawProfiles.map((p) => ({
    ...p,
    allergens: parseAllergens(p.allergens),
  }));

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="font-display font-semibold text-2xl text-navy mb-1">
        Settings
      </h1>
      <p className="font-body text-sm text-stone-500 mb-6">
        Add anyone in your household with a food allergy. Items containing
        one of their allergens will be flagged wherever they show up in the
        app, including recipe suggestions.
      </p>

      <ProfilesManager profiles={profiles} />
    </main>
  );
}
