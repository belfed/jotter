"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createInboxItem } from "@/app/actions/inbox";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function InboxCreateDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const formData = new FormData(formRef.current!);
    const result = await createInboxItem(null, formData);

    if (result?.success) {
      setText("");
      setOpen(false);
      toast.success(t("toast.inboxSaved"));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) setText("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          {t("inbox.new")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inbox.createTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("inbox.createPlaceholder")}
            autoComplete="off"
            autoFocus
          />
          <DialogFooter>
            <Button type="submit" disabled={!text.trim()}>
              {t("inbox.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
