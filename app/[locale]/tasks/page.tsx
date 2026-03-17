import { getLocale } from "next-intl/server";

import prisma from "@/lib/prisma";

import { TaskList } from "@/components/tasks/task-list";

export default async function TasksPage() {
  const locale = await getLocale();

  const tasks = await prisma.task.findMany({
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  return <TaskList tasks={tasks} locale={locale} />;
}
