import { prisma } from "@/lib/prisma";
import {
  parseAllergens,
  findAllergenConflicts,
  conflictSummary,
} from "@/lib/allergens";
import CopyInventory from "./CopyInventory";

function formatDate(date) {
  if (!date) return "no expiration date";
  return `expires ${new Date(date).toLocaleDateString()}`;
}

function buildPrompt(items, profiles) {
  if (items.length === 0) {
    return "My fridge inventory is currently empty — nothing to suggest recipes from yet.";
  }

  const allergyNames = profiles
    .filter((p) => p.allergens.length > 0)
    .map((p) => p.name);

  const lines = items.map((item) => {
    const container = item.containerDescription
      ? ` (${item.containerDescription})`
      : "";
    const conflicts = findAllergenConflicts(
      parseAllergens(item.allergens),
      profiles
    );
    const allergyFlag =
      conflicts.length > 0 ? ` [ALLERGY: ${conflictSummary(conflicts)}]` : "";
    return `- ${item.name}${container} — ${item.location}, ${item.category}, ${item.type}, ${formatDate(
      item.expirationDate
    )}${allergyFlag}`;
  });

  const intro =
    allergyNames.length > 0
      ? `Here's my current fridge/freezer/pantry inventory. Please suggest a few recipe ideas using what I already have, prioritizing items that are expiring soonest. Important: some items are marked [ALLERGY: ...] because someone in my household (${allergyNames.join(
          ", "
        )}) reacts to that ingredient — please don't suggest recipes that use those flagged items, or call it out clearly if an item is genuinely unavoidable. Feel free to note anything I'd need to buy to complete a recipe.`
      : "Here's my current fridge/freezer/pantry inventory. Please suggest a few recipe ideas using what I already have, prioritizing items that are expiring soonest. Feel free to note anything I'd need to buy to complete a recipe.";

  return [intro, "", ...lines].join("\n");
}

export default async function ChatPage() {
  const [items, rawProfiles] = await Promise.all([
    prisma.item.findMany({ where: { status: "active" } }),
    prisma.profile.findMany(),
  ]);

  const profiles = rawProfiles.map((p) => ({
    ...p,
    allergens: parseAllergens(p.allergens),
  }));

  const promptText = buildPrompt(items, profiles);

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="font-display font-semibold text-2xl text-navy mb-2">
        Get recipe ideas
      </h1>
      <p className="font-body text-sm text-stone-600 mb-6">
        Copy your inventory below and paste it into Claude.ai to get recipe
        ideas — no API key, no cost. Once you've used this a while and know
        it's worth automating, this is the piece that upgrades to a live
        chat.
      </p>

      <CopyInventory promptText={promptText} />
    </main>
  );
}
