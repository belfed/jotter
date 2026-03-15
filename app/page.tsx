import prisma from "@/lib/prisma";
import { InboxForm } from "@/components/inbox/inbox-form";
import { InboxList } from "@/components/inbox/inbox-list";

export default async function Home() {
  const items = await prisma.inboxItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">       Inbox</h1>
      <InboxForm />
      <InboxList items={items} />
    </main>
  );
}
