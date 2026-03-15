import prisma from "@/lib/prisma";

import { Inbox } from "@/components/inbox/inbox";

export default async function Home() {
  const items = await prisma.inboxItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
      <Inbox items={items} />
    </main>
  );
}
