"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { InboxIcon, MoreVertical, Trash2 } from "lucide-react";

import type { InboxItem } from "@/app/generated/prisma/client";

import { deleteInboxItem } from "@/app/actions/inbox";

import { formatRelativeTime } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";

function InboxListItem({ item }: { item: InboxItem }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteInboxItem(item.id);
      if (result?.success) {
        toast.success(t("toast.inboxDeleted"));
      } else if (result?.success === false) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="group flex items-center gap-2 px-4 py-2.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="wrap-break-word">{item.text}</span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(item.createdAt, t)}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            className="size-8 shrink-0 text-muted-foreground"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="size-4" />
            {t("inbox.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function InboxEmpty() {
  const t = useTranslations("inbox");
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-muted-foreground">
      <InboxIcon className="size-12 opacity-20" />
      <p className="text-lg font-medium">{t("empty")}</p>
      <p className="flex items-center gap-1.5 text-sm">
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> {t("emptyHint")}
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
