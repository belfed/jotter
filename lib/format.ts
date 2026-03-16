type TranslateFn = (key: string, values?: Record<string, number>) => string;

export function formatRelativeTime(date: Date, t: TranslateFn): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return t("time.now");

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return t("time.minutesAgo", { count: minutes });

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("time.hoursAgo", { count: hours });

  if (hours < 48) return t("time.yesterday");

  const days = Math.floor(hours / 24);
  if (days < 7) return t("time.daysAgo", { count: days });

  return date.toLocaleDateString();
}
