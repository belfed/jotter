"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { createInboxItem } from "@/app/actions/inbox";
import { CommandDialog } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import type { ActionState } from "@/lib/types";
import type { InboxItem } from "@/app/generated/prisma/client";

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionState<InboxItem>, FormData>(
    createInboxItem,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      toast.success("Item saved");
    } else if (state?.success === false) {
      toast.error(state.error);
    }
    inputRef.current?.focus();
  }, [state]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Jotter"
      description="Jot something down"
    >
      <form ref={formRef} action={action} className="p-3">
        <Input
          ref={inputRef}
          name="text"
          placeholder="Jot something..."
          autoComplete="off"
          disabled={pending}
          autoFocus
          className="h-12 border-0 text-base shadow-none focus-visible:ring-0"
        />
      </form>
      <div className="flex items-center justify-end gap-3 border-t px-3 py-2">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Kbd>Enter</Kbd> to save
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Kbd>Esc</Kbd> to close
        </span>
      </div>
    </CommandDialog>
  );
}
