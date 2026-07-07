"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessageAction, type SendState } from "./actions";
import { Button } from "@/components/ui/button";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState<SendState, FormData>(sendMessageAction, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) ref.current?.reset();
  }, [pending, state.error]);

  return (
    <form ref={ref} action={action} className="border-t border-border bg-surface p-3">
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className="flex items-end gap-2">
        <textarea
          name="body"
          rows={1}
          required
          placeholder="Mesaj yaz…"
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
        />
        <Button type="submit" disabled={pending}>Göndər</Button>
      </div>
      {state.error && <p className="mt-1 text-xs text-danger">{state.error}</p>}
    </form>
  );
}
