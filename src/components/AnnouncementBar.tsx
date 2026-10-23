export function AnnouncementBar({ text }: { text: string | null }) {
  if (!text) return null;
  return <div className="bg-navy px-4 py-2 text-center text-xs text-gold-light sm:text-sm">{text}</div>;
}
