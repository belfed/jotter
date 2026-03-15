"use client";

import { useActionState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createInboxItem } from "@/app/actions/inbox";
import type { ActionState } from "@/lib/types";
import type { InboxItem } from "@/app/generated/prisma/client";

export function InboxForm() {
  const [state, action, pending] = useActionState<
    ActionState<InboxItem>,
    FormData
  >(createInboxItem, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action}>
      <Input
        name="text"
        placeholder="What's on your mind?"
        autoComplete="off"
        disabled={pending}
      />
      {state?.success === false && (
        <p className="mt-1 text-sm text-destructive">{state.error}</p>
      )}
    </form>
  );
}
