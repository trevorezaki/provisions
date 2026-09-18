const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper to get a date N days from today (negative = past).
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// Each "trip" represents a grocery run, `daysAgo` days before today.
// Each item gets an expiration date computed from the trip date + its
// typical shelf life, so older trips naturally produce long-expired
// (and thus thrown-away) items, while the most recent trips produce
// the "current" fridge contents — some fresh, some expiring soon.
const trips = [
  {
    daysAgo: 58,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Eggs", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Chicken breast", category: "meat", type: "raw", shelfLife: 4 },
      { name: "Spinach", category: "produce", type: "raw", shelfLife: 6, wasted: true },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Carrots", category: "produce", type: "raw", shelfLife: 21 },
      { name: "Tortilla chips", category: "snacks", type: "raw", shelfLife: 60 },
      { name: "Salsa", category: "condiments", type: "raw", shelfLife: 30 },
    ],
  },
  {
    daysAgo: 51,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Greek yogurt", category: "dairy", type: "raw", shelfLife: 14 },
      { name: "Ground beef", category: "meat", type: "raw", shelfLife: 3 },
      { name: "Bell peppers", category: "produce", type: "raw", shelfLife: 10 },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Broccoli", category: "produce", type: "raw", shelfLife: 7, wasted: true },
      { name: "Hummus", category: "condiments", type: "raw", shelfLife: 14 },
    ],
  },
  {
    daysAgo: 44,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Eggs", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Chicken breast", category: "meat", type: "raw", shelfLife: 4 },
      { name: "Spinach", category: "produce", type: "raw", shelfLife: 6, wasted: true },
      { name: "Strawberries", category: "produce", type: "raw", shelfLife: 5, wasted: true },
      { name: "Carrots", category: "produce", type: "raw", shelfLife: 21 },
      { name: "Granola bars", category: "snacks", type: "raw", shelfLife: 90 },
    ],
  },
  {
    daysAgo: 37,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Cheddar cheese", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Salmon fillet", category: "meat", type: "raw", shelfLife: 3 },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Avocados", category: "produce", type: "raw", shelfLife: 5 },
      { name: "Bell peppers", category: "produce", type: "raw", shelfLife: 10 },
      { name: "Soy sauce", category: "condiments", type: "raw", shelfLife: 365 },
    ],
  },
  {
    daysAgo: 30,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Eggs", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Chicken breast", category: "meat", type: "raw", shelfLife: 4 },
      { name: "Bacon", category: "meat", type: "raw", shelfLife: 7 },
      { name: "Spinach", category: "produce", type: "raw", shelfLife: 6, wasted: true },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Broccoli", category: "produce", type: "raw", shelfLife: 7 },
      { name: "Peanut butter", category: "condiments", type: "raw", shelfLife: 180 },
    ],
  },
  {
    daysAgo: 23,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Greek yogurt", category: "dairy", type: "raw", shelfLife: 14 },
      { name: "Ground beef", category: "meat", type: "raw", shelfLife: 3 },
      { name: "Carrots", category: "produce", type: "raw", shelfLife: 21 },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Strawberries", category: "produce", type: "raw", shelfLife: 5 },
      { name: "Tortilla chips", category: "snacks", type: "raw", shelfLife: 60 },
    ],
  },
  {
    daysAgo: 16,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Eggs", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Chicken breast", category: "meat", type: "raw", shelfLife: 4 },
      { name: "Spinach", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Bell peppers", category: "produce", type: "raw", shelfLife: 10 },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Salsa", category: "condiments", type: "raw", shelfLife: 30 },
    ],
  },
  {
    daysAgo: 9,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Cheddar cheese", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Ground beef", category: "meat", type: "raw", shelfLife: 3 },
      { name: "Salmon fillet", category: "meat", type: "raw", shelfLife: 3 },
      { name: "Spinach", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Avocados", category: "produce", type: "raw", shelfLife: 5 },
      { name: "Carrots", category: "produce", type: "raw", shelfLife: 21 },
      { name: "Granola bars", category: "snacks", type: "raw", shelfLife: 90 },
    ],
  },
  {
    daysAgo: 2,
    items: [
      { name: "Whole milk", category: "dairy", type: "raw", shelfLife: 10 },
      { name: "Eggs", category: "dairy", type: "raw", shelfLife: 21 },
      { name: "Chicken breast", category: "meat", type: "raw", shelfLife: 4 },
      { name: "Spinach", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Bananas", category: "produce", type: "raw", shelfLife: 6 },
      { name: "Bell peppers", category: "produce", type: "raw", shelfLife: 10 },
      { name: "Hummus", category: "condiments", type: "raw", shelfLife: 14 },
    ],
  },
];

// Cooking events — each produces a "leftovers" item with a container
// description, spread across the same 2 months.
const cookEvents = [
  { daysAgo: 55, name: "Beef teriyaki", container: "Blue bowl with lid, top shelf", shelfLife: 4 },
  { daysAgo: 48, name: "Chicken stir fry", container: "Glass container, middle shelf", shelfLife: 4 },
  { daysAgo: 41, name: "Vegetable soup", container: "Mason jar", shelfLife: 5 },
  { daysAgo: 34, name: "Spaghetti and meatballs", container: "Tupperware, middle shelf", shelfLife: 4 },
  { daysAgo: 27, name: "Beef teriyaki", container: "Blue bowl with lid, top shelf", shelfLife: 4 },
  { daysAgo: 20, name: "Roast chicken", container: "Foil-covered pan", shelfLife: 5 },
  { daysAgo: 13, name: "Beef tacos", container: "Red container with lid", shelfLife: 3 },
  { daysAgo: 8, name: "Chili", container: "Tupperware, middle shelf", shelfLife: 5 },
  { daysAgo: 4, name: "Beef teriyaki", container: "Blue bowl with lid, top shelf", shelfLife: 4 },
  { daysAgo: 1, name: "Chicken stir fry", container: "Glass container, middle shelf", shelfLife: 4 },
];

// A Costco-style bulk buy: one purchase, portioned into several
// freezer bags, each tracked as its own item with its own bag label.
const freezerPurchases = [
  {
    daysAgo: 16,
    name: "Chicken thighs",
    category: "meat",
    bags: 4,
    shelfLife: 270, // ~9 months, typical for frozen poultry
  },
  {
    daysAgo: 24,
    name: "Ground beef",
    category: "meat",
    bags: 3,
    shelfLife: 120, // ~4 months, typical for frozen ground meat
  },
  {
    daysAgo: 85,
    name: "Salmon fillets",
    category: "meat",
    bags: 2,
    shelfLife: 90, // frozen fish has a much shorter window than red meat
  },
];

// A couple of long-shelf-life pantry items, added once and just sitting
// there — pantry doesn't get the weekly-trip treatment fridge does.
const pantryItems = [
  { daysAgo: 45, name: "Peanut butter", category: "condiments", shelfLife: 180 },
  { daysAgo: 12, name: "Tortilla chips", category: "snacks", shelfLife: 60 },
];

async function main() {
  // Wipe existing data first so this is safe to re-run against a
  // dedicated demo database without accumulating duplicates.
  await prisma.item.deleteMany();

  const records = [];

  for (const trip of trips) {
    const dateAdded = daysFromNow(-trip.daysAgo);
    for (const item of trip.items) {
      const expirationDate = daysFromNow(-trip.daysAgo + item.shelfLife);
      // Anything that expired more than 2 days ago has been resolved
      // one way or another — either finished (the default assumption)
      // or wasted, for the specific items flagged above.
      const resolved = expirationDate < daysFromNow(-2);
      const status = !resolved ? "active" : item.wasted ? "wasted" : "finished";
      records.push({
        name: item.name,
        category: item.category,
        type: item.type,
        location: "fridge",
        expirationDate,
        dateAdded,
        status,
      });
    }
  }

  for (const event of cookEvents) {
    const dateAdded = daysFromNow(-event.daysAgo);
    const expirationDate = daysFromNow(-event.daysAgo + event.shelfLife);
    const resolved = expirationDate < daysFromNow(-2);
    const status = !resolved ? "active" : "finished";
    records.push({
      name: event.name,
      category: "leftovers",
      type: "cooked",
      location: "fridge",
      containerDescription: event.container,
      expirationDate,
      dateAdded,
      status,
    });
  }

  for (const purchase of freezerPurchases) {
    const dateAdded = daysFromNow(-purchase.daysAgo);
    const labelDate = dateAdded.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
    for (let i = 1; i <= purchase.bags; i++) {
      const expirationDate = daysFromNow(-purchase.daysAgo + purchase.shelfLife);
      records.push({
        name: purchase.name,
        category: purchase.category,
        type: "raw",
        location: "freezer",
        containerDescription: `Bag ${i} of ${purchase.bags} \u00b7 labeled ${labelDate}`,
        expirationDate,
        dateAdded,
        status: "active",
      });
    }
  }

  for (const item of pantryItems) {
    const dateAdded = daysFromNow(-item.daysAgo);
    const expirationDate = daysFromNow(-item.daysAgo + item.shelfLife);
    records.push({
      name: item.name,
      category: item.category,
      type: "raw",
      location: "pantry",
      expirationDate,
      dateAdded,
      status: "active",
    });
  }

  for (const record of records) {
    await prisma.item.create({ data: record });
  }

  const activeCount = records.filter((r) => r.status === "active").length;
  const wastedCount = records.filter((r) => r.status === "wasted").length;
  const finishedCount = records.filter((r) => r.status === "finished").length;
  console.log(
    `Seeded ${records.length} items spanning ~2 months (${activeCount} active, ${finishedCount} finished, ${wastedCount} wasted).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
