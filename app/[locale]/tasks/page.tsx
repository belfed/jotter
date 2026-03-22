import { getLocale, getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";

import { CreateTaskButton } from "@/components/tasks/task-create-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { auth } from "@/lib/auth";
import { redirect } from "next/dist/client/components/navigation";
import { headers } from "next/dist/server/request/headers";

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [locale, t] = await Promise.all([getLocale(), getTranslations("nav")]);

  if (!session) {
    redirect("/signin");
  }

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{t("tasks")}</h1>
        <CreateTaskButton />
      </div>
      <TaskList tasks={tasks} locale={locale} />
    </div>
  );
}
