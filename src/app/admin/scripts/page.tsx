import Link from "next/link";
import { adminScripts } from "@/lib/admin-data";
import { CATEGORIES } from "@/lib/catalog/sample-data";
import { formatINR, formatNumber } from "@/lib/format";
import { IconPen } from "@/components/icons";

export default async function AdminScripts() {
  const scripts = await adminScripts();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight">Scripts</h1><p className="mt-1 text-sm text-muted">{scripts.length} total · {scripts.filter((s) => s.isPublished).length} published</p></div>
        <Link href="/admin/scripts/new" className="btn-primary btn-sm">+ New script</Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-ink-3 font-mono text-[11px] text-subtle uppercase">
            <tr>{["Title", "Category", "Lang", "Price", "Exclusive", "Sales", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {scripts.map((s) => (
              <tr key={s.id} className="bg-ink-2 hover:bg-ink-3">
                <td className="max-w-xs px-4 py-3"><p className="line-clamp-1 font-medium">{s.title}</p><p className="font-mono text-[11px] text-subtle">{s.format}</p></td>
                <td className="px-4 py-3 text-muted">{CATEGORIES.find((c) => c.slug === s.category)?.name}</td>
                <td className="px-4 py-3 text-muted">{s.language}</td>
                <td className="px-4 py-3 font-mono">{formatINR(s.priceInr)}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.exclusiveAvailable && s.exclusivePriceInr ? formatINR(s.exclusivePriceInr) : <span className="text-subtle">—</span>}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(s.salesCount)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${s.isPublished ? "bg-success/10 text-success" : "bg-white/5 text-subtle"}`}>{s.isPublished ? "Live" : "Draft"}</span>
                  {s.isFeatured && <span className="ml-1.5 rounded-full bg-volt/15 px-2 py-0.5 font-mono text-[10px] text-volt-hi uppercase">Featured</span>}
                </td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/scripts/${s.id}`} className="inline-flex items-center gap-1.5 text-volt-hi"><IconPen size={14} />Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
