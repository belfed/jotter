"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import type { ActionState } from "@/lib/types";
import type { Task } from "@/app/generated/prisma/client";

import prisma from "@/lib/prisma";
import { to } from "@/lib/utils";

export async function createTask(
  _previousState: ActionState<Task>,
  formData: FormData,
): Promise<ActionState<Task>> {
  const t = await getTranslations();
  const title = formData.get("text");

  if (typeof title !== "string" || title.trim() === "") {
    return { success: false, error: t("validation.textRequired") };
  }

  const [error, task] = await to(
    prisma.task.create({
      data: { title: title.trim() },
    }),
  );

  if (error) {
    return { success: false, error: t("toast.failedToSave") };
  }

  revalidatePath("/");

  return { success: true, data: task };
}

export async function processInboxItemToTask(
  inboxItemId: string,
): Promise<ActionState<Task>> {
  const t = await getTranslations();

  const [error, task] = await to(
    prisma.$transaction(async (tx) => {
      const inboxItem = await tx.inboxItem.update({
        where: { id: inboxItemId },
        data: { processedAt: new Date() },
      });

      return tx.task.create({
        data: {
          title: inboxItem.text,
          inboxItemId: inboxItem.id,
        },
      });
    }),
  );

  if (error) {
    return { success: false, error: t("toast.failedToSave") };
  }

  revalidatePath("/");

  return { success: true, data: task };
}
