"use client";

import { useActionState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { createInboxItem } from "@/app/actions/inbox";
import type { ActionState } from "@/lib/types";
import type { InboxItem } from "@/app/generated/prisma/client";

export function InboxForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [state, action, pending] = useActionState<ActionState<InboxItem>, FormData>(
    async (prevState, formData) => {
      const text = formData.get("text");
      if (typeof text === "string" && text.trim()) {
        onSubmit(text.trim());
      }
      return createInboxItem(prevState, formData);
    },
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <form ref={formRef} action={action}>
      <Input
        ref={inputRef}
        name="text"
        placeholder="What's on your mind?"
        autoComplete="off"
        disabled={pending}
        autoFocus
      />
    </form>
  );
}
