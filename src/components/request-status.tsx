"use client";
import { useState } from "react";

const STATUSES = ["new", "quoted", "in_progress", "delivered", "closed"];

export function RequestStatus({ id, status, readOnly }: { id: string; status: string; readOnly: boolean }) {
  const [value, setValue] = useState(status);
  const [err, setErr] = useState(false);
  async function change(v: string) {
    const prev = value;
    setValue(v);
    const res = await fetch(`/api/admin/requests/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: v }) });
    if (!res.ok) { setValue(prev); setErr(true); } else setErr(false);
  }
  return (
    <select value={value} disabled={readOnly} onChange={(e) => change(e.target.value)} className={`input !w-auto !py-1.5 text-xs ${err ? "!border-danger" : ""}`} aria-label="Request status">
      {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
    </select>
  );
}
