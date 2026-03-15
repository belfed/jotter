"use client";

import { useActionState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createInboxItem } from "@/app/actions/inbox";
import type { ActionState } from "@/lib/types";
import type { InboxItem } from "@/app/generated/prisma/client";

export function CaptureForm() {
  const [state, action, pending] = useActionState<ActionState<InboxItem>, FormData>(
    createInboxItem,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      window.close();
    }
    inputRef.current?.focus();
  }, [state]);

  return (
    <form ref={formRef} action={action}>
      <Input
        ref={inputRef}
        name="text"
        placeholder="Quick capture..."
        autoComplete="off"
        disabled={pending}
        autoFocus
        className="h-12 text-base"
      />
    </form>
  );
}
