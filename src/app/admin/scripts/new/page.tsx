import { isDemo } from "@/lib/env";
import { ScriptForm } from "@/components/admin-script-form";

export default function NewScript() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">New script</h1>
      <p className="mt-1 text-sm text-muted">Upload the deliverable files, or paste the script text and we’ll generate PDF and DOCX automatically.</p>
      <div className="mt-8"><ScriptForm readOnly={isDemo} /></div>
    </div>
  );
}
