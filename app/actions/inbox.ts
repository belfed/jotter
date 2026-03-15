"use server";

import { revalidatePath } from "next/cache";

import { getTranslations } from "next-intl/server";
import { ActionState } from "@/lib/types";
import { to } from "@/lib/utils";

import prisma from "@/lib/prisma";
import { InboxItem } from "../generated/prisma/client";

export const createInboxItem = async (
  _previousState: ActionState<InboxItem>,
  formData: FormData,
): Promise<ActionState<InboxItem>> => {
  const t = await getTranslations();
  const text = formData.get("text");

  if (typeof text !== "string" || text.trim() === "") {
    return { success: false, error: t("validation.textRequired") };
  }

  const [error, item] = await to(
    prisma.inboxItem.create({
      data: { text: text.trim() },
    }),
  );

  if (error) {
    return { success: false, error: t("toast.failedToSave") };
  }

  revalidatePath("/");

  return { success: true, data: item };
};
