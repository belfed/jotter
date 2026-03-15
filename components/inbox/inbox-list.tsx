import { formatRelativeTime } from "@/lib/format";

import type { InboxItem } from "@/app/generated/prisma/client";

import { Card } from "@/components/ui/card";

function InboxListItem({ item }: { item: InboxItem }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-2.5">
      <span className="wrap-break-word">{item.text}</span>
      <span className="text-xs text-muted-foreground">
        {formatRelativeTime(item.createdAt)}
      </span>
    </div>
  );
}

export function InboxList({ items }: { items: InboxItem[] }) {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground">No items yet</p>;
  }

  return (
    <Card className="gap-0 py-0 divide-y divide-border">
      {items.map((item) => (
        <InboxListItem key={item.id} item={item} />
      ))}
    </Card>
  );
}
