import Image from "next/image";
export function ProductImage({ src, alt, sizes = "(min-width:1024px) 25vw, 50vw", priority = false }: { src?: string | null; alt: string; sizes?: string; priority?: boolean }) {
  if (src) return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />;
  return (
    <svg role="img" aria-label={`${alt} — image coming soon`} viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="120" height="120" fill="#F6F7F9" />
      {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={10 + c * 34} y={10 + r * 34} width="32" height="32" fill={(r + c) % 2 ? "#E9D9B4" : "#E4E7EC"} />))}
    </svg>
  );
}
