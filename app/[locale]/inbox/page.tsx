import { getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";

import { CreateInboxButton } from "@/components/inbox/inbox-create-dialog";
import { InboxList } from "@/components/inbox/inbox-list";

export default async function InboxPage() {
  const t = await getTranslations("nav");

  const items = await prisma.inboxItem.findMany({
    where: { processedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t("inbox")}</h1>
        <CreateInboxButton />
      </div>
      <InboxList items={items} />
    </div>
  );
}
