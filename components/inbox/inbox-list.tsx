import { formatRelativeTime } from "@/lib/format";

import type { InboxItem } from "@/app/generated/prisma/client";

import { Card } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { InboxIcon } from "lucide-react";

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

function InboxEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-muted-foreground">
      <InboxIcon className="size-12 opacity-20" />
      <p className="text-lg font-medium">La tua inbox è vuota!</p>
      <p className="flex items-center gap-1.5 text-sm">
        Premi <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> per jottare qualcosa
      </p>
    </div>
  );
}

export function InboxList({ items }: { items: InboxItem[] }) {
  if (items.length === 0) {
    return <InboxEmpty />;
  }

  return (
    <Card className="gap-0 py-0 divide-y divide-border">
      {items.map((item) => (
        <InboxListItem key={item.id} item={item} />
      ))}
    </Card>
  );
}
