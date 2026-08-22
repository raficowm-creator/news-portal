"use client";

import { useEffect } from "react";
import { incrementViews } from "@/lib/actions/homeActions";

export default function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    incrementViews(id);
  }, [id]);
  return null;
}
