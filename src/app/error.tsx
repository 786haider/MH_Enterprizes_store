"use client";
import { ErrorMessage } from "@/components/ErrorMessage";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorMessage message="We couldn’t load this page. Please try again." action={<button className="btn-navy" onClick={reset}>Try again</button>} />;
}
