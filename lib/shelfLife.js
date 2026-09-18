// Rough default shelf life in days, by storage location and category.
// These are intentionally generic — a real "chicken breast" and a real
// "yogurt" don't have the same shelf life even though both are just
// "meat, fridge" or "dairy, fridge" here. The goal is a reasonable
// starting point, always editable, not a precise per-food database.
const SHELF_LIFE_DAYS = {
  fridge: {
    produce: 7,
    dairy: 10,
    meat: 3,
    leftovers: 4,
    snacks: 30,
    condiments: 30,
    other: 7,
  },
  freezer: {
    produce: 240,
    dairy: 90,
    meat: 120,
    leftovers: 90,
    snacks: 180,
    condiments: 180,
    other: 180,
  },
  pantry: {
    produce: 14,
    dairy: 60,
    meat: 3,
    leftovers: 3,
    snacks: 90,
    condiments: 180,
    other: 90,
  },
};

export function suggestedShelfLifeDays(location, category) {
  const forLocation = SHELF_LIFE_DAYS[location] || SHELF_LIFE_DAYS.fridge;
  return forLocation[category] ?? forLocation.other;
}

export function suggestedExpirationDate(location, category, fromDate = new Date()) {
  const days = suggestedShelfLifeDays(location, category);
  const d = new Date(fromDate);
  d.setDate(d.getDate() + days);
  return d;
}

// Formats a Date as YYYY-MM-DD for an <input type="date"> value.
export function toDateInputValue(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
