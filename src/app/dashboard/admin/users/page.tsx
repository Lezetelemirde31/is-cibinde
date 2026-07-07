import { requireRole } from "@/lib/auth";
import { listUsersForAdmin } from "@/lib/admin/service";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { setUserRoleAction, toggleUserStatusAction } from "../actions";
import { ModerationButtons } from "../moderation-buttons";

export const metadata = { title: "İstifadəçilər" };

const roleLabel: Record<string, string> = {
  job_seeker: "İş axtaran", employer: "İşəgötürən", moderator: "Moderator", admin: "Admin"
};

export default async function AdminUsersPage() {
  const staff = await requireRole(["admin"]);
  const rows = await listUsersForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">İstifadəçilər</h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-panel text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">E-poçt</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Qeydiyyat</th>
              <th className="px-4 py-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{u.email}</td>
                <td className="px-4 py-3"><Badge tone="primary">{roleLabel[u.role]}</Badge></td>
                <td className="px-4 py-3">
                  <Badge tone={u.status === "suspended" ? "danger" : "success"}>
                    {u.status === "suspended" ? "Dayandırılıb" : "Aktiv"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">{timeAgo(u.createdAt)}</td>
                <td className="px-4 py-3">
                  {u.id === staff.id ? (
                    <span className="text-xs text-muted">Sən</span>
                  ) : (
                    <ModerationButtons
                      actions={[
                        u.role === "moderator"
                          ? { label: "Moderatorluğu ləğv et", run: setUserRoleAction.bind(null, u.id, "job_seeker") }
                          : { label: "Moderator et", run: setUserRoleAction.bind(null, u.id, "moderator") },
                        {
                          label: u.status === "suspended" ? "Aktivləşdir" : "Dayandır",
                          variant: u.status === "suspended" ? "primary" : "danger",
                          run: toggleUserStatusAction.bind(null, u.id)
                        }
                      ]}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
