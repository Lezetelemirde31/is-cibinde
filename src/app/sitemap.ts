import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/content/service";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/jobs",
    "/companies",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/cookies"
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "daily", priority: path === "" ? 1 : 0.7 }));

  const { jobs, companies, posts } = await getSitemapData().catch(() => ({
    jobs: [],
    companies: [],
    posts: []
  }));

  return [
    ...staticRoutes,
    ...jobs.map((j) => ({
      url: `${base}/jobs/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8
    })),
    ...companies.map((c) => ({
      url: `${base}/companies/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5
    }))
  ];
}
