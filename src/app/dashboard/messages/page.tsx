import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listConversations } from "@/lib/messaging/service";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Mesajlar" };

export default async function MessagesPage() {
  await requireUser();
  const conversations = await listConversations();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Mesajlar</h1>
      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Hələ söhbət yoxdur"
          description="İşəgötürənlər səninlə əlaqə saxladıqda söhbətlər burada görünəcək."
        />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/messages/${c.id}`}
              className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-panel"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-tint font-display font-semibold text-primary">
                  {c.otherName.charAt(0)}
                </span>
                <div>
                  <p className="font-medium text-ink">{c.otherName}</p>
                  <p className="text-xs text-muted">{timeAgo(c.lastMessageAt)}</p>
                </div>
              </div>
              {c.unread > 0 && <Badge tone="primary">{c.unread}</Badge>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
