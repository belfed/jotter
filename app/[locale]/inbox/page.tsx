import prisma from "@/lib/prisma";

import { InboxList } from "@/components/inbox/inbox-list";

export default async function InboxPage() {
  const items = await prisma.inboxItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <InboxList items={items} />;
}
