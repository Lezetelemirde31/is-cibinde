import "server-only";
import { ApiError, apiFetch } from "@/lib/api-client";

export type BlogPostListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
};

export async function listBlogPosts(): Promise<BlogPostListItem[]> {
  return apiFetch("/content/blog", { auth: false, next: { revalidate: 600 } });
}

export type BlogPostDetail = {
  slug: string;
  title: string;
  body: string;
  excerpt: string | null;
  publishedAt: string | null;
};

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    return await apiFetch(`/content/blog/${slug}`, { auth: false, next: { revalidate: 600 } });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export type Category = {
  id: string;
  slug: string;
  nameAz: string;
  nameRu: string | null;
  nameEn: string | null;
};

export async function listCategories(): Promise<Category[]> {
  return apiFetch("/content/categories", { auth: false, next: { revalidate: 3600 } });
}

export type Faq = { id: string; question: string; answer: string; audience: string };

export async function listFaqs(): Promise<Faq[]> {
  return apiFetch("/content/faqs", { auth: false, next: { revalidate: 3600 } });
}

export type SitemapData = {
  jobs: { slug: string; updatedAt: string }[];
  companies: { slug: string }[];
  posts: { slug: string; updatedAt: string }[];
};

export async function getSitemapData(): Promise<SitemapData> {
  return apiFetch("/content/sitemap", { auth: false });
}

export async function sendContact(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ ok: boolean }> {
  return apiFetch("/contact", { method: "POST", body: input, auth: false });
}
