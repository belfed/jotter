"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ListChecks, MoreVertical, Trash2 } from "lucide-react";

import type { Task } from "@/app/generated/prisma/client";

import { toggleTaskCompleted, deleteTask } from "@/app/actions/task";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";

function formatDueDate(date: Date | null, locale: string): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(date);
}

function TaskListItem({ task, locale }: { task: Task; locale: string }) {
  const t = useTranslations();

  async function handleToggle(checked: boolean) {
    const result = await toggleTaskCompleted(task.id, checked);
    if (result?.success) {
      toast.success(t(checked ? "toast.taskCompleted" : "toast.taskReopened"));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    const result = await deleteTask(task.id);
    if (result?.success) {
      toast.success(t("toast.taskDeleted"));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
  }

  const dueDateLabel = formatDueDate(task.dueDate, locale);

  return (
    <div className="group flex items-center gap-3 px-3 py-2">
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        aria-label={task.title}
      />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            task.completed && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {dueDateLabel ?? t("tasks.noDueDate")}
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
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="size-3.5" />
            {t("tasks.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TasksEmpty() {
  const t = useTranslations("tasks");
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-muted-foreground">
      <ListChecks className="size-12 opacity-20" />
      <p className="text-lg font-medium">{t("empty")}</p>
      <p className="flex items-center gap-1.5 text-sm">
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> {t("emptyHint")}
      </p>
    </div>
  );
}

export function TaskList({ tasks, locale }: { tasks: Task[]; locale: string }) {
  if (tasks.length === 0) {
    return <TasksEmpty />;
  }

  return (
    <div className="divide-y divide-border rounded-xl border">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} locale={locale} />
      ))}
    </div>
  );
}
