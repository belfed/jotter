"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

import { ActionState } from "@/lib/types";
import { InboxItem } from "@/app/generated/prisma/client";

import prisma from "@/lib/prisma";
import { to } from "@/lib/utils";
import { auth } from "@/lib/auth";

export const createInboxItem = async (
  _previousState: ActionState<InboxItem>,
  formData: FormData,
): Promise<ActionState<InboxItem>> => {
  const t = await getTranslations();
  const session = await auth.api.getSession({ headers: await headers() });
  const text = formData.get("text");

  if (!session) {
    redirect("/signin");
  }

  if (typeof text !== "string" || text.trim() === "") {
    return { success: false, error: t("validation.textRequired") };
  }

  const [error, item] = await to(
    prisma.inboxItem.create({
      data: { text: text.trim(), userId: session.user.id },
    }),
  );

  if (error) {
    return { success: false, error: t("toast.failedToSave") };
  }

  revalidatePath("/");

  return { success: true, data: item };
};

export async function deleteInboxItem(id: string): Promise<ActionState> {
  const t = await getTranslations();

  const [error] = await to(prisma.inboxItem.delete({ where: { id } }));

  if (error) {
    return { success: false, error: t("toast.failedToDelete") };
  }

  revalidatePath("/");

  return { success: true, data: undefined };
}
