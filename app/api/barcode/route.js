import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim();

  if (!code) {
    return NextResponse.json(
      { error: "Missing barcode 'code' query param" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
      code
    )}.json`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Lookup failed" },
      { status: 502 }
    );
  }

  const data = await res.json();

  if (data.status !== 1 || !data.product) {
    return NextResponse.json(
      { error: "No product found for that barcode" },
      { status: 404 }
    );
  }

  const product = data.product;

  return NextResponse.json({
    name: product.product_name || product.generic_name || "",
    category: guessCategory(product.categories_tags || []),
    allergens: mapAllergens(product.allergens_tags || []),
  });
}

// Open Food Facts uses its own allergen tag taxonomy (e.g. "en:milk",
// "en:nuts") — map the ones that correspond to our fixed 9 allergens.
// Anything OFF flags that we don't recognize is simply left out; the
// person can still add it manually via the custom allergen field.
function mapAllergens(tags) {
  const mapping = {
    "en:milk": "dairy",
    "en:eggs": "egg",
    "en:nuts": "tree_nuts",
    "en:peanuts": "peanuts",
    "en:gluten": "wheat",
    "en:soybeans": "soy",
    "en:fish": "fish",
    "en:crustaceans": "shellfish",
    "en:molluscs": "shellfish",
    "en:sesame-seeds": "sesame",
  };
  const mapped = tags.map((t) => mapping[t]).filter(Boolean);
  return Array.from(new Set(mapped));
}

// Maps Open Food Facts' category tags onto our simpler category list.
function guessCategory(tags) {
  const joined = tags.join(" ").toLowerCase();
  if (joined.includes("dairy") || joined.includes("milk") || joined.includes("cheese")) {
    return "dairy";
  }
  if (joined.includes("meat") || joined.includes("poultry") || joined.includes("fish")) {
    return "meat";
  }
  if (joined.includes("fruit") || joined.includes("vegetable") || joined.includes("produce")) {
    return "produce";
  }
  if (joined.includes("snack") || joined.includes("chip") || joined.includes("candy")) {
    return "snacks";
  }
  if (joined.includes("sauce") || joined.includes("condiment") || joined.includes("spread")) {
    return "condiments";
  }
  return "other";
}
