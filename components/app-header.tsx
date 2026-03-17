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
    <header className="flex h-12 items-center gap-3 border-b px-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t(pageKey)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
