import { notFound } from "next/navigation";
import { isDemo } from "@/lib/env";
import { adminScript } from "@/lib/admin-data";
import { ScriptForm } from "@/components/admin-script-form";

export default async function EditScript({ params }: { params: Promise<{ id: string }> }) {
  const data = await adminScript((await params).id);
  if (!data) notFound();
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Edit script</h1>
      <p className="mt-1 line-clamp-1 text-sm text-muted">{data.script.title}</p>
      <div className="mt-8"><ScriptForm readOnly={isDemo} initial={data} /></div>
    </div>
  );
}
