"use client";

import { useOptimistic } from "react";

import type { InboxItem } from "@/app/generated/prisma/client";

import { InboxForm } from "@/components/inbox/inbox-form";
import { InboxList } from "@/components/inbox/inbox-list";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/dist/client/components/navigation";

export function Inbox({ items }: { items: InboxItem[] }) {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newText: string) => [
      {
        id: crypto.randomUUID(),
        text: newText,
        createdAt: new Date(),
        processedAt: null,
        userId: session.user.id,
      },
      ...state,
    ],
  );

  return (
    <>
      <InboxForm onSubmit={addOptimisticItem} />
      <InboxList items={optimisticItems} />
    </>
  );
}
