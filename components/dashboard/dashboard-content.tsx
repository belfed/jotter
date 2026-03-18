"use client";

import { useTranslations } from "next-intl";
import { Inbox, ArrowRight, CalendarClock, CircleCheck } from "lucide-react";

import type { Task } from "@/app/generated/prisma/client";

import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleTaskCompleted } from "@/app/actions/task";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function groupTasks(tasks: Task[], t: (key: string) => string) {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));

  const groups: { label: string; tasks: Task[] }[] = [
    { label: t("dashboard.overdue"), tasks: [] },
    { label: t("dashboard.today"), tasks: [] },
    { label: t("dashboard.thisWeek"), tasks: [] },
    { label: t("dashboard.later"), tasks: [] },
  ];

  for (const task of tasks) {
    if (!task.dueDate) {
      groups[3].tasks.push(task);
      continue;
    }
    const due = startOfDay(task.dueDate);
    if (due < today) {
      groups[0].tasks.push(task);
    } else if (due < tomorrow) {
      groups[1].tasks.push(task);
    } else if (due < endOfWeek) {
      groups[2].tasks.push(task);
    } else {
      groups[3].tasks.push(task);
    }
  }

  return groups.filter((g) => g.tasks.length > 0);
}

function formatDueDate(date: Date | null, locale: string): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

function InboxNudge({ count }: { count: number }) {
  const t = useTranslations();
  return (
    <Link
      href="/inbox"
      className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 transition-colors hover:bg-muted"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Inbox className="size-4" />
      </div>
      <div className="flex-1 text-sm">
        <span className="font-medium">
          {t("dashboard.inboxNudge", { count })}
        </span>
        <span className="text-muted-foreground">
          {" "}&mdash; {t("dashboard.inboxNudgeHint")}
        </span>
      </div>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function DashboardTaskItem({
  task,
  locale,
}: {
  task: Task;
  locale: string;
}) {
  const t = useTranslations();
  const today = startOfDay(new Date());
  const isOverdue = task.dueDate && startOfDay(task.dueDate) < today;
  const dueDateLabel = formatDueDate(task.dueDate, locale);

  async function handleToggle(checked: boolean) {
    const result = await toggleTaskCompleted(task.id, checked);
    if (result?.success) {
      toast.success(t(checked ? "toast.taskCompleted" : "toast.taskReopened"));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        aria-label={task.title}
      />
      <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
      {dueDateLabel && (
        <span
          className={cn(
            "shrink-0 text-xs",
            isOverdue ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          {dueDateLabel}
        </span>
      )}
    </div>
  );
}

function UpcomingTasks({
  tasks,
  locale,
}: {
  tasks: Task[];
  locale: string;
}) {
  const t = useTranslations();
  const groups = groupTasks(tasks, t);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <CircleCheck className="size-10 opacity-20" />
        <p className="text-sm">{t("dashboard.allClear")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <CalendarClock className="size-4" />
        {t("dashboard.upcoming")}
      </div>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <div className="divide-y divide-border rounded-xl border">
              {group.tasks.map((task) => (
                <DashboardTaskItem
                  key={task.id}
                  task={task}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks" className="gap-1.5 text-muted-foreground">
            {t("dashboard.viewAllTasks")}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function DashboardContent({
  inboxCount,
  tasks,
  locale,
}: {
  inboxCount: number;
  tasks: Task[];
  locale: string;
}) {
  return (
    <div className="space-y-6">
      {inboxCount > 0 && <InboxNudge count={inboxCount} />}
      <UpcomingTasks tasks={tasks} locale={locale} />
    </div>
  );
}
