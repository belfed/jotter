import { getTranslations } from "next-intl/server";

export default async function TasksPage() {
  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("tasks")}</h1>
      <p className="text-muted-foreground">Work in progress</p>
    </div>
  );
}
