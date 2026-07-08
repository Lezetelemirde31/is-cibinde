"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { getThreadMessagesAction, postMessageAction } from "../actions";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Msg = { id: string; senderId: string; body: string; createdAt: string };

const POLL_MS = 4000;

export function Conversation({
  conversationId,
  initialMessages,
  currentUserId
}: {
  conversationId: string;
  initialMessages: Msg[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Live updates: poll for new messages.
  useEffect(() => {
    let active = true;
    const timer = setInterval(async () => {
      const latest = await getThreadMessagesAction(conversationId);
      if (active && latest) setMessages(latest);
    }, POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError(undefined);
    const res = await postMessageAction(conversationId, body);
    if (res.ok) {
      setText("");
      const latest = await getThreadMessagesAction(conversationId);
      if (latest) setMessages(latest);
    } else {
      setError(res.error);
    }
    setSending(false);
  }

  return (
    <>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted">İlk mesajı yaz.</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUserId;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3.5 py-2 text-sm",
                    mine ? "bg-primary text-primary-fg" : "border border-border bg-surface text-ink"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className={cn("mt-1 text-[10px]", mine ? "text-primary-fg/70" : "text-muted")}>
                    {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t border-border bg-surface p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(e);
              }
            }}
            rows={1}
            placeholder="Mesaj yaz…"
            maxLength={4000}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </form>
    </>
  );
}
