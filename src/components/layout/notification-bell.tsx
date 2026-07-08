"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { markAllNotificationsReadAction } from "@/lib/notifications/actions";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationLabels = {
  title: string;
  markAllRead: string;
  empty: string;
  ariaLabel: string;
};

export function NotificationBell({
  items,
  unread,
  labels
}: {
  items: NotificationItem[];
  unread: number;
  labels: NotificationLabels;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function markAll() {
    start(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  function closeAndGo() {
    setOpen(false);
    // Give the navigation a beat, then refresh so counts stay in sync.
    start(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={labels.ariaLabel}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel hover:text-ink"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-surface shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-sm font-semibold text-ink">{labels.title}</span>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  disabled={pending}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-60"
                >
                  <Check className="h-3.5 w-3.5" />
                  {labels.markAllRead}
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted">{labels.empty}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((n) => {
                    const unreadItem = !n.readAt;
                    const content = (
                      <div className="flex gap-3">
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            unreadItem ? "bg-primary" : "bg-transparent"
                          )}
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className={cn("text-sm text-ink", unreadItem && "font-medium")}>
                            {n.title}
                          </p>
                          {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{n.body}</p>}
                          <p className="mt-1 text-[11px] text-muted">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    );
                    return (
                      <li key={n.id} className={cn(unreadItem && "bg-primary-tint/40")}>
                        {n.href ? (
                          <Link
                            href={n.href}
                            onClick={closeAndGo}
                            className="block px-4 py-3 transition-colors hover:bg-panel"
                          >
                            {content}
                          </Link>
                        ) : (
                          <div className="px-4 py-3">{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
