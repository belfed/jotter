"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Inbox, LayoutDashboard, ListChecks } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "inbox" as const, href: "/inbox", icon: Inbox },
  { key: "tasks" as const, href: "/tasks", icon: ListChecks },
];

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-14 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {t(item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
