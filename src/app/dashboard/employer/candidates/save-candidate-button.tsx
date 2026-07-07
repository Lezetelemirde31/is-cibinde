"use client";

import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleSaveCandidateAction } from "../actions";
import { Button } from "@/components/ui/button";

export function SaveCandidateButton({
  candidateId,
  initiallySaved
}: {
  candidateId: string;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();

  return (
    <Button
      variant={saved ? "primary" : "secondary"}
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleSaveCandidateAction(candidateId);
          setSaved(res.saved);
        })
      }
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saxlanıldı" : "Saxla"}
    </Button>
  );
}
