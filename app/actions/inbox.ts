"use server";

import { revalidatePath } from "next/cache";

import { ActionState } from "@/lib/types";

import prisma from "@/lib/prisma";
import { InboxItem } from "../generated/prisma/client";

export const createInboxItem = async (
  _previousState: ActionState<InboxItem>,
  formData: FormData,
): Promise<ActionState<InboxItem>> => {
  const text = formData.get("text");

  if (typeof text !== "string" || text.trim() === "") {
    return { success: false, error: "Text is required" };
  }
  const data = { text: text.trim() };

  const item = await prisma.inboxItem.create({
    data,
  });

  revalidatePath("/");

  return { success: true, data: item };
};
