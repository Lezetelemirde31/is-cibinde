import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/content/service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Məqalə tapılmadı" };
  return { title: post.title, description: post.excerpt ?? undefined, alternates: { canonical: `/blog/${slug}` } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-2xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">{post.title}</h1>
      <div className="prose mt-6 space-y-4 text-ink/90">
        {post.body.split(/\n{2,}/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
