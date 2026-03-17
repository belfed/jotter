import { getLocale, getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";

import { TaskCreateDialog } from "@/components/tasks/task-create-dialog";
import { TaskList } from "@/components/tasks/task-list";

export default async function TasksPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("nav")]);

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t("tasks")}</h1>
        <TaskCreateDialog />
      </div>
      <TaskList tasks={tasks} locale={locale} />
    </div>
  );
}
