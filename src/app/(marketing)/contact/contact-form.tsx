"use client";

import { useActionState } from "react";
import { sendContactAction, type ContactState } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactAction, {});

  if (state.ok) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-success">
        Mesajın göndərildi. Tezliklə cavab verəcəyik.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Ad</Label>
          <Input id="name" name="name" required />
          {state.fieldErrors?.name && <p className="mt-1 text-xs text-danger">{state.fieldErrors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">E-poçt</Label>
          <Input id="email" name="email" type="email" required />
          {state.fieldErrors?.email && <p className="mt-1 text-xs text-danger">{state.fieldErrors.email}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Mövzu</Label>
        <Input id="subject" name="subject" />
      </div>
      <div>
        <Label htmlFor="message">Mesaj</Label>
        <Textarea id="message" name="message" rows={5} required />
        {state.fieldErrors?.message && <p className="mt-1 text-xs text-danger">{state.fieldErrors.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Göndərilir…" : "Göndər"}
      </Button>
    </form>
  );
}
