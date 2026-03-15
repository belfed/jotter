import prisma from "@/lib/prisma";
import { InboxList } from "@/components/inbox/inbox-list";
import { Kbd } from "@/components/ui/kbd";

export default async function Home() {
  const items = await prisma.inboxItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>K</Kbd> to jot
        </span>
      </div>
      <InboxList items={items} />
    </main>
  );
}
