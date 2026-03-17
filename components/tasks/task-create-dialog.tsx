"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

import { createTask } from "@/app/actions/task";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export function TaskCreateDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const t = useTranslations();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData(formRef.current!);
    const result = await createTask(null, formData);

    if (result?.success) {
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setOpen(false);
      toast.success(t("toast.taskSaved"));
    } else if (result?.success === false) {
      toast.error(result.error);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setTitle("");
      setDescription("");
      setDueDate(undefined);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          {t("tasks.new")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tasks.createTitle")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("tasks.titlePlaceholder")}
            autoComplete="off"
            autoFocus
          />
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              {t("tasks.descriptionLabel")}
            </label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("tasks.descriptionPlaceholder")}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {t("tasks.dueDateLabel")}
            </label>
            <input
              type="hidden"
              name="dueDate"
              value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
            />
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {dueDate
                    ? dueDate.toLocaleDateString()
                    : t("tasks.noDueDate")}
                  <ChevronDownIcon className="size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>
              {t("tasks.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
