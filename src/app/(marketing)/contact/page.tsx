import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Əlaqə",
  description: "İş Cibində komandası ilə əlaqə saxla.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <div className="container-page max-w-2xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Əlaqə</h1>
      <p className="mt-2 mb-8 text-muted">Sualın və ya təklifin var? Bizə yaz.</p>
      <ContactForm />
    </div>
  );
}
