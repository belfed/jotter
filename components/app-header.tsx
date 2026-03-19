"use client";

import { useTranslations } from "next-intl";

import { usePathname } from "@/i18n/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { NavUser } from "@/components/nav-user";
import { ThemeToggle } from "@/components/theme-toggle";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "dashboard",
  "/inbox": "inbox",
  "/tasks": "tasks",
};

export function AppHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const pageKey = breadcrumbMap[pathname] ?? "dashboard";

  return (
    <header className="bg-card sticky top-0 z-50 flex h-12 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold tracking-tight md:hidden">Jotter</span>
        <SidebarTrigger className="hidden md:flex" />
        <Separator
          orientation="vertical"
          className="mx-2 hidden data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center md:block"
        />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{t(pageKey)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NavUser />
      </div>
    </header>
  );
}
