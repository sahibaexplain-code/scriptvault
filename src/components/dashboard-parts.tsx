import Link from "next/link";
import { IconDownload } from "./icons";

export function DownloadButtons({ scriptId }: { scriptId: string }) {
  return (
    <div className="flex gap-2">
      <a href={`/api/download/${scriptId}?format=pdf`} className="btn-primary btn-sm" download><IconDownload size={14} /> PDF</a>
      <a href={`/api/download/${scriptId}?format=docx`} className="btn-ghost btn-sm" download><IconDownload size={14} /> DOCX</a>
    </div>
  );
}

export function EmptyLibrary() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-line-strong p-10 text-center">
      <p className="font-display text-2xl italic">Your library is empty.</p>
      <p className="mt-2 text-sm text-muted">Scripts you buy appear here, ready to download.</p>
      <Link href="/scripts" className="btn-primary mt-6">Explore scripts</Link>
    </div>
  );
}
