"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { InboxIcon, ListChecks, MoreVertical, Trash2 } from "lucide-react";

import type { InboxItem } from "@/app/generated/prisma/client";

import { deleteInboxItem } from "@/app/actions/inbox";
import { openTaskDialog } from "@/components/tasks/task-create-dialog";

import { formatRelativeTime } from "@/lib/format";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";

function InboxListItem({ item }: { item: InboxItem }) {
  const t = useTranslations();

  async function handleDelete() {
    const result = await deleteInboxItem(item.id);
    if (result?.success) {
      toast.success(t("toast.inboxDeleted"));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
  }

  return (
    <div className="group flex items-center gap-2 px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="wrap-break-word text-sm">{item.text}</span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(item.createdAt, t)}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground focus-visible:border-transparent focus-visible:ring-0"
          >
            <MoreVertical className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => openTaskDialog(item.text, item.id)}
          >
            <ListChecks className="size-3.5" />
            {t("inbox.convertToTask")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="size-3.5" />
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
    <div className="divide-y divide-border rounded-xl border">
      {items.map((item) => (
        <InboxListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
