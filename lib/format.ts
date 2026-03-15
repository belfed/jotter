export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "adesso";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min fa`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ore fa`;

  if (hours < 48) return "ieri";

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} giorni fa`;

  return date.toLocaleDateString();
}
