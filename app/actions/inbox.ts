"use server";

import { revalidatePath } from "next/cache";

import { ActionState } from "@/lib/types";
import { to } from "@/lib/utils";

import prisma from "@/lib/prisma";
import { InboxItemCreateInput } from "../generated/prisma/models";
import { InboxItem } from "../generated/prisma/client";

export const createInboxItem = async (
  _previousState: ActionState<InboxItem>,
  formData: FormData,
): Promise<ActionState<InboxItem>> => {
  const text = formData.get("text");

  if (typeof text !== "string" || text.trim() === "") {
    return { success: false, error: "Text is required" };
  }
  const data: Pick<InboxItemCreateInput, "text"> = { text };

  const [error, item] = await to(
    prisma.inboxItem.create({
      data,
    }),
  );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true, data: item };
};
