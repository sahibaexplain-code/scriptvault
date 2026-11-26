import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x max-w-xl py-28 text-center">
      <p className="font-mono text-xs text-subtle">ERROR 404 · SCENE MISSING</p>
      <h1 className="mt-4 font-display text-6xl italic">Cut!</h1>
      <p className="mt-4 text-muted">This page didn’t make the final edit.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-ghost">Home</Link>
        <Link href="/scripts" className="btn-primary">Explore scripts</Link>
      </div>
    </section>
  );
}
