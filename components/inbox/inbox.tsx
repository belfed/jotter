"use client";

import { useOptimistic } from "react";

import type { InboxItem } from "@/app/generated/prisma/client";

import { InboxForm } from "@/components/inbox/inbox-form";
import { InboxList } from "@/components/inbox/inbox-list";

export function Inbox({ items }: { items: InboxItem[] }) {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newText: string) => [
      {
        id: crypto.randomUUID(),
        text: newText,
        createdAt: new Date(),
        processedAt: null,
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
