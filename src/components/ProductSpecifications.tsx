import type { Product } from "@/types";
/** Shows only values entered by the administrator. */
export function ProductSpecifications({ product: p }: { product: Product }) {
  const rows: [string, string | null | undefined][] = [
    ["Brand", p.brand?.name], ["Manufacturer", p.manufacturer], ["Model", p.model_number], ["Material", p.material], ["Quality / grade", p.grade], ["Color", p.color],
    ["Available colors", p.available_colors.join(", ")], ["Size", p.size], ["Unit", p.unit], ["Finish", p.finish], ["Style / design", p.style],
    ["Minimum order", p.min_order_qty ? String(p.min_order_qty) : null], ...Object.entries(p.specs),
  ];
  const shown = rows.filter(([, v]) => v && String(v).trim());
  if (!shown.length) return null;
  return (
    <table className="w-full border border-line text-sm"><caption className="sr-only">Technical specifications</caption><tbody>
      {shown.map(([k, v], i) => <tr key={k} className={i % 2 ? "bg-paper" : ""}><th scope="row" className="w-2/5 px-4 py-3 text-left font-medium text-navy">{k}</th><td className="px-4 py-3">{v}</td></tr>)}
    </tbody></table>
  );
}
