import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts } from "@/lib/content/service";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bloq",
  description: "Karyera, işə qəbul və iş axtarışı üzrə məqalələr.",
  alternates: { canonical: "/blog" }
};
export const revalidate = 600;

export default async function BlogPage() {
  const posts = await listBlogPosts().catch(() => []);

  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Bloq</h1>
      <p className="mt-2 mb-8 text-muted">Karyera və işə qəbul üzrə məsləhətlər.</p>
      {posts.length === 0 ? (
        <p className="text-muted">Məqalələr tezliklə dərc olunacaq.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <article key={p.slug} className="border-b border-border pb-6">
              <Link href={`/blog/${p.slug}`} className="font-display text-xl font-semibold text-ink hover:text-primary">
                {p.title}
              </Link>
              {p.excerpt && <p className="mt-1 text-muted">{p.excerpt}</p>}
              {p.publishedAt && <p className="mt-1 text-xs text-muted">{timeAgo(p.publishedAt)}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
