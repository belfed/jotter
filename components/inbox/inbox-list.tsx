import type { InboxItem } from "@/app/generated/prisma/client";
import { formatRelativeTime } from "@/lib/format";

function InboxListItem({ item }: { item: InboxItem }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2">
      <span className="wrap-break-word">{item.text}</span>
      <span className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</span>
    </div>
  );
}

export function InboxList({ items }: { items: InboxItem[] }) {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground">No items yet</p>;
  }

  return (
    <div className="divide-y divide-border rounded-md border">
      {items.map((item) => (
        <InboxListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
