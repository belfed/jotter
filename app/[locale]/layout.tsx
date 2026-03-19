import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { CommandBar } from "@/components/command-bar";
import { InboxCreateDialog } from "@/components/inbox/inbox-create-dialog";
import { TaskCreateDialog } from "@/components/tasks/task-create-dialog";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 px-4 py-6 pb-20 sm:px-6 md:pb-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <BottomNav />
      <CommandBar />
      <InboxCreateDialog />
      <TaskCreateDialog />
      <Toaster duration={2000} />
    </NextIntlClientProvider>
  );
}
