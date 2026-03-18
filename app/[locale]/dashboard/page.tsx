import { getLocale, getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";

import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("nav"),
  ]);

  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const [inboxCount, tasks] = await Promise.all([
    prisma.inboxItem.count({ where: { processedAt: null } }),
    prisma.task.findMany({
      where: {
        completed: false,
        dueDate: { lte: thirtyDaysFromNow },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">{t("dashboard")}</h1>
      <DashboardContent
        inboxCount={inboxCount}
        tasks={tasks}
        locale={locale}
      />
    </div>
  );
}
