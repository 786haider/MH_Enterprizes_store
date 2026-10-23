export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="container-x max-w-3xl py-12"><h1 className="text-4xl sm:text-5xl">{title}</h1><div className="rule-gold mt-4" /><div className="mt-8 space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-2xl">{children}</div>
    <p className="mt-10 text-sm text-muted">This is a general template, not legal advice. Have it reviewed by a qualified professional before relying on it.</p></div>;
}
