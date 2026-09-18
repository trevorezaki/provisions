// The 9 major allergens (FDA's list). Custom entries are stored as
// plain strings alongside these keys, so any string not in this list
// is treated as a custom allergen and just displayed as typed.
export const FIXED_ALLERGENS = [
  { key: "peanuts", label: "Peanuts" },
  { key: "tree_nuts", label: "Tree nuts" },
  { key: "dairy", label: "Dairy" },
  { key: "egg", label: "Egg" },
  { key: "wheat", label: "Wheat / Gluten" },
  { key: "soy", label: "Soy" },
  { key: "fish", label: "Fish" },
  { key: "shellfish", label: "Shellfish" },
  { key: "sesame", label: "Sesame" },
];

export function parseAllergens(json) {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stringifyAllergens(list) {
  return JSON.stringify(list || []);
}

export function allergenLabel(key) {
  const fixed = FIXED_ALLERGENS.find((a) => a.key === key);
  return fixed ? fixed.label : key;
}

// For one item's allergen list, find which of its allergens conflict
// with any household profile, and who each conflict belongs to.
// Returns e.g. [{ allergen: "peanuts", profileNames: ["Alex"] }]
export function findAllergenConflicts(itemAllergens, profiles) {
  const conflicts = [];
  for (const allergen of itemAllergens) {
    const matched = profiles.filter((p) => p.allergens.includes(allergen));
    if (matched.length > 0) {
      conflicts.push({ allergen, profileNames: matched.map((p) => p.name) });
    }
  }
  return conflicts;
}

export function conflictSummary(conflicts) {
  return conflicts
    .map((c) => `${allergenLabel(c.allergen)} (${c.profileNames.join(", ")})`)
    .join("; ");
}
