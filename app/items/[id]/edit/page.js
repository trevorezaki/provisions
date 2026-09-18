import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseAllergens } from "@/lib/allergens";
import EditItemForm from "./EditItemForm";

export default async function EditItemPage({ params }) {
  const item = await prisma.item.findUnique({ where: { id: params.id } });

  if (!item) {
    notFound();
  }

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="font-display font-semibold text-2xl text-navy mb-6">
        Edit item
      </h1>

      <EditItemForm
        item={{ ...item, allergens: parseAllergens(item.allergens) }}
      />
    </main>
  );
}
