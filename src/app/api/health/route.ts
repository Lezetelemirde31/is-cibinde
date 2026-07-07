export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:8000"}/health`, {
      cache: "no-store"
    });
    const data = await res.json().catch(() => ({ status: "degraded" }));
    return Response.json(
      { status: data.status ?? "degraded", api: data, time: new Date().toISOString() },
      { status: data.status === "ok" ? 200 : 503 }
    );
  } catch {
    return Response.json({ status: "degraded", api: "unreachable" }, { status: 503 });
  }
}
