import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getConversationThread } from "@/lib/messaging/service";
import { Conversation } from "./conversation";

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

      <Conversation conversationId={id} initialMessages={data.messages} currentUserId={user.id} />
    </div>
  );
}
