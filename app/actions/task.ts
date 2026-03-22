"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import type { ActionState } from "@/lib/types";
import type { Task } from "@/app/generated/prisma/client";

import prisma from "@/lib/prisma";
import { to } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createTask(
  _previousState: ActionState<Task>,
  formData: FormData,
): Promise<ActionState<Task>> {
  const session = await auth.api.getSession({ headers: await headers() });
  const t = await getTranslations();
  const title = formData.get("text");
  const descriptionRaw = formData.get("description");
  const dueDateRaw = formData.get("dueDate");
  const inboxItemIdRaw = formData.get("inboxItemId");

  if (!session) {
    redirect("/signin");
  }

  if (typeof title !== "string" || title.trim() === "") {
    return { success: false, error: t("validation.textRequired") };
  }

  const description =
    typeof descriptionRaw === "string" && descriptionRaw.trim()
      ? descriptionRaw.trim()
      : undefined;
  const dueDate =
    typeof dueDateRaw === "string" && dueDateRaw ? new Date(dueDateRaw) : undefined;
  const inboxItemId =
    typeof inboxItemIdRaw === "string" && inboxItemIdRaw ? inboxItemIdRaw : undefined;

  const taskData = {
    title: title.trim(),
    description,
    dueDate,
    inboxItemId,
    userId: session.user.id,
  };

  const [error, task] = await to(
    inboxItemId
      ? prisma.$transaction(async (tx) => {
          await tx.inboxItem.update({
            where: { id: inboxItemId },
            data: { processedAt: new Date() },
          });
          return tx.task.create({ data: taskData });
        })
      : prisma.task.create({ data: taskData }),
  );

  if (error) {
    return { success: false, error: t("toast.failedToSave") };
  }

  revalidatePath("/");

  return { success: true, data: task };
}

export async function toggleTaskCompleted(
  id: string,
  completed: boolean,
): Promise<ActionState<Task>> {
  const t = await getTranslations();

  const [error, task] = await to(
    prisma.task.update({
      where: { id },
      data: { completed },
    }),
  );

  if (error) {
    return { success: false, error: t("toast.failedToSave") };
  }

  revalidatePath("/");

  return { success: true, data: task };
}

export async function deleteTask(id: string): Promise<ActionState<Task>> {
  const t = await getTranslations();

  const [error, task] = await to(prisma.task.delete({ where: { id } }));

  if (error) {
    return { success: false, error: t("toast.failedToDelete") };
  }

  revalidatePath("/");

  return { success: true, data: task };
}
