"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function markFinished(formData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    throw new Error("Item id is required");
  }

  await prisma.item.update({
    where: { id },
    data: { status: "finished", resolvedAt: new Date() },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
}

export async function markWasted(formData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    throw new Error("Item id is required");
  }

  await prisma.item.update({
    where: { id },
    data: { status: "wasted", resolvedAt: new Date() },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
}

// Reverses a markFinished/markWasted — used both for the immediate
// "Undo" right after confirming, and for correcting a mistake found
// later in the Resolved view.
export async function reopenItem(formData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    throw new Error("Item id is required");
  }

  await prisma.item.update({
    where: { id },
    data: { status: "active", resolvedAt: null },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
}

export async function createItem(formData) {
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString() || "other";
  const type = formData.get("type")?.toString() || "raw";
  const location = formData.get("location")?.toString() || "fridge";
  const containerDescription =
    formData.get("containerDescription")?.toString().trim() || null;
  const expirationDateRaw = formData.get("expirationDate")?.toString();
  const allergens = formData.get("allergens")?.toString() || "[]";

  if (!name) {
    throw new Error("Item name is required");
  }

  await prisma.item.create({
    data: {
      name,
      category,
      type,
      location,
      containerDescription,
      expirationDate: expirationDateRaw ? new Date(expirationDateRaw) : null,
      allergens,
    },
  });

  redirect("/");
}

export async function updateItem(formData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString() || "other";
  const type = formData.get("type")?.toString() || "raw";
  const location = formData.get("location")?.toString() || "fridge";
  const containerDescription =
    formData.get("containerDescription")?.toString().trim() || null;
  const expirationDateRaw = formData.get("expirationDate")?.toString();
  const allergens = formData.get("allergens")?.toString() || "[]";

  if (!id || !name) {
    throw new Error("Item id and name are required");
  }

  // Editing only ever touches the item's own details — lifecycle state
  // (status/resolvedAt) stays managed exclusively through
  // Finished/Wasted/Undo, so editing can never accidentally resolve
  // or reopen something.
  await prisma.item.update({
    where: { id },
    data: {
      name,
      category,
      type,
      location,
      containerDescription,
      expirationDate: expirationDateRaw ? new Date(expirationDateRaw) : null,
      allergens,
    },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function deleteItemPermanently(formData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    throw new Error("Item id is required");
  }

  await prisma.item.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function createProfile(formData) {
  const name = formData.get("name")?.toString().trim();
  const allergens = formData.get("allergens")?.toString() || "[]";

  if (!name) {
    throw new Error("Profile name is required");
  }

  await prisma.profile.create({ data: { name, allergens } });

  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/chat");
}

export async function updateProfile(formData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const allergens = formData.get("allergens")?.toString() || "[]";

  if (!id || !name) {
    throw new Error("Profile id and name are required");
  }

  await prisma.profile.update({ where: { id }, data: { name, allergens } });

  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/chat");
}

export async function deleteProfile(formData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    throw new Error("Profile id is required");
  }

  await prisma.profile.delete({ where: { id } });

  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/chat");
}
