import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getConversationThread } from "@/lib/messaging/service";
import { timeAgo } from "@/lib/utils";
import { MessageComposer } from "../message-composer";

export const metadata = { title: "Söhbət" };

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const data = await getConversationThread(id);
  if (!data) notFound();

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-lg border border-border bg-panel shadow-card">
      <div className="flex items-center gap-3 border-b border-border bg-surface p-4">
        <Link href="/dashboard/messages" className="text-muted hover:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-display font-semibold text-ink">Söhbət</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {data.messages.length === 0 ? (
          <p className="text-center text-sm text-muted">İlk mesajı yaz.</p>
        ) : (
          data.messages.map((m) => {
            const mine = m.senderId === user.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-3.5 py-2 text-sm ${
                    mine ? "bg-primary text-primary-fg" : "border border-border bg-surface text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-primary-fg/70" : "text-muted"}`}>
                    {timeAgo(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageComposer conversationId={id} />
    </div>
  );
}
