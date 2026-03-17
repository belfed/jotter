"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Inbox, ListChecks } from "lucide-react";

import type { ItemType } from "@/lib/types";
import { itemTypes, getItemTypeForRoute } from "@/lib/types";

import { createInboxItem } from "@/app/actions/inbox";
import { createTask } from "@/app/actions/task";

import { cn } from "@/lib/utils";

import { usePathname } from "@/i18n/navigation";

import { CommandDialog } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";

export function CommandBar() {
  const pathname = usePathname();
  const contextualDefault = getItemTypeForRoute(pathname);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType>(contextualDefault);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();

  useEffect(() => {
    setSelectedType(contextualDefault);
  }, [contextualDefault]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setText("");
      setSelectedType(contextualDefault);
    }
  }

  async function submitAs(type: ItemType) {
    if (!text.trim()) return;

    const formData = new FormData(formRef.current!);

    const result =
      type === "task"
        ? await createTask(null, formData)
        : await createInboxItem(null, formData);

    if (result?.success) {
      setText("");
      setSelectedType(contextualDefault);
      toast.success(t(`toast.${type}Saved`));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
    inputRef.current?.focus();
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    submitAs(selectedType);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (text.trim() && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const currentIndex = itemTypes.indexOf(selectedType);
      const nextIndex =
        e.key === "ArrowDown"
          ? (currentIndex + 1) % itemTypes.length
          : (currentIndex - 1 + itemTypes.length) % itemTypes.length;
      setSelectedType(itemTypes[nextIndex]);
    }
  }

  const hasText = text.trim().length > 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t("commandBar.title")}
      description={t("commandBar.description")}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="p-3">
        <Input
          ref={inputRef}
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("commandBar.placeholder")}
          autoComplete="off"
          autoFocus
          className="h-12 border-0 text-base shadow-none focus-visible:ring-0"
        />
      </form>
      {hasText && (
        <div className="border-t">
          <div className="px-2 py-1.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submitAs("inbox")}
              onMouseEnter={() => setSelectedType("inbox")}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted hover:text-foreground",
                selectedType === "inbox"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Inbox className="size-4" />
              {t("commandBar.inboxOption")}
              <span className="ml-auto flex items-center gap-2">
                <span className={cn(selectedType !== "inbox" && "invisible")}>
                  <Kbd>Enter</Kbd>
                </span>
              </span>
            </button>
          </div>
          <div className="border-t px-2 py-1.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submitAs("task")}
              onMouseEnter={() => setSelectedType("task")}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted hover:text-foreground",
                selectedType === "task"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <ListChecks className="size-4" />
              {t("commandBar.taskOption")}
              <span className={cn("ml-auto", selectedType !== "task" && "invisible")}>
                <Kbd>Enter</Kbd>
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end gap-3 border-t px-3 py-2">
        {hasText && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Kbd>↑↓</Kbd> {t("commandBar.navigateHint")}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Kbd>Enter</Kbd> {t("commandBar.saveHint")}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Kbd>Esc</Kbd> {t("commandBar.closeHint")}
        </span>
      </div>
    </CommandDialog>
  );
}
