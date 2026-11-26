"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconX } from "./icons";

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className={`relative flex max-h-[88vh] w-full animate-rise flex-col overflow-hidden rounded-t-3xl border border-line-strong bg-ink-2 shadow-[0_30px_120px_-20px_rgb(155_92_255/0.35)] sm:rounded-3xl ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"}`}>
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className="line-clamp-1 text-sm font-medium">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-white/5 hover:text-fg" aria-label="Close dialog"><IconX /></button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
