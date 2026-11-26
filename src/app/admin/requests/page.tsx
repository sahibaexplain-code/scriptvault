import { isDemo } from "@/lib/env";
import { adminRequests } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { RequestStatus } from "@/components/request-status";

export default async function AdminRequestsPage() {
  const reqs = await adminRequests();
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Custom requests</h1>
      <div className="mt-8 space-y-3">
        {reqs.map((r) => (
          <article key={r.id} className="rounded-2xl border border-line bg-ink-2 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold">{r.topic}</h2>
                <p className="mt-1 font-mono text-[11px] text-subtle">{r.contentType} · {r.language} · {r.duration} · {r.license} · {formatDate(r.createdAt)}</p>
              </div>
              <RequestStatus id={r.id} status={r.status} readOnly={isDemo} />
            </div>
            {r.details && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">{r.details}</p>}
            <p className="mt-3 text-sm">
              <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Your ScriptVault brief: ${r.topic}`)}`} className="text-volt-hi">{r.name} &lt;{r.email}&gt;</a>
              {r.budget && <span className="text-muted"> · Budget {r.budget}</span>}
              {r.deadline && <span className="text-muted"> · Needed by {formatDate(r.deadline)}</span>}
            </p>
          </article>
        ))}
        {!reqs.length && <p className="text-sm text-muted">No requests yet.</p>}
      </div>
    </div>
  );
}
