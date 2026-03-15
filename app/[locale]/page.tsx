import prisma from "@/lib/prisma";
import { InboxList } from "@/components/inbox/inbox-list";
import { Kbd } from "@/components/ui/kbd";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("inbox");
  const items = await prisma.inboxItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>K</Kbd> {t("shortcutHint")}
        </span>
      </div>
      <InboxList items={items} />
    </main>
  );
}
