import prisma from "@/lib/prisma";
import { InboxForm } from "@/components/inbox/inbox-form";
import { InboxTable } from "@/components/inbox/inbox-table";

export default async function Home() {
  const items = await prisma.inboxItem.findMany();

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Inbox</h1>
      <InboxForm />
      <InboxTable items={items} />
    </main>
  );
}
