"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Inbox, LayoutDashboard, ListChecks } from "lucide-react";

import { Link } from "@/i18n/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { key: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "inbox" as const, href: "/inbox", icon: Inbox },
  { key: "tasks" as const, href: "/tasks", icon: ListChecks },
];

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <span className="text-lg font-bold tracking-tight">Jotter</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild isActive={!!isActive}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        {t(item.key)}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t("user")}
          </span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
