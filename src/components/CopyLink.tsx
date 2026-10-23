"use client";
import { useState } from "react";
import { Check, Link2 } from "lucide-react";
export function CopyLink({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" className="btn-outline" onClick={async () => { try { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 2000); } catch { window.prompt("Copy this link:", url); } }}>
    {done ? <Check size={16} /> : <Link2 size={16} />}<span aria-live="polite">{done ? "Link copied" : "Copy link"}</span></button>;
}
