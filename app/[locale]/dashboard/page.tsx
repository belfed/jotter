import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
      <p className="text-muted-foreground">Work in progress</p>
    </div>
  );
}
