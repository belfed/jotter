import { getLocale, getTranslations } from "next-intl/server";

import prisma from "@/lib/prisma";

import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";
import { redirect } from "next/dist/client/components/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [locale, t] = await Promise.all([getLocale(), getTranslations("nav")]);

  if (!session) {
    redirect("/signin");
  }

  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const [inboxCount, tasks] = await Promise.all([
    prisma.inboxItem.count({ where: { processedAt: null, userId: session.user.id } }),
    prisma.task.findMany({
      where: {
        completed: false,
        dueDate: { lte: thirtyDaysFromNow },
        userId: session.user.id,
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">{t("dashboard")}</h1>
      <DashboardContent inboxCount={inboxCount} tasks={tasks} locale={locale} />
    </div>
  );
}
