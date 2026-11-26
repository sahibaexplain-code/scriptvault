"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem } from "@/lib/types";
import { IconCheck, IconX } from "./icons";

interface Toast { id: number; message: string; tone: "ok" | "err" }
interface CartCtx {
  items: CartItem[];
  ready: boolean;
  count: number;
  totalInr: number;
  add: (item: CartItem, opts?: { silent?: boolean }) => void;
  remove: (kind: CartItem["kind"], id: string) => void;
  clear: () => void;
  has: (kind: CartItem["kind"], id: string) => boolean;
  toast: (message: string, tone?: Toast["tone"]) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sv-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "ok") => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const add = useCallback<CartCtx["add"]>((item, opts) => {
    setItems((prev) => [...prev.filter((p) => !(p.kind === item.kind && p.id === item.id)), item]);
    if (!opts?.silent) toast(`Added “${item.title}” to cart`);
  }, [toast]);

  const value = useMemo<CartCtx>(() => ({
    items, ready,
    count: items.length,
    totalInr: items.reduce((n, i) => n + i.priceInr, 0),
    add,
    remove: (kind, id) => setItems((prev) => prev.filter((p) => !(p.kind === kind && p.id === id))),
    clear: () => setItems([]),
    has: (kind, id) => items.some((p) => p.kind === kind && p.id === id),
    toast,
  }), [items, ready, add, toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex max-w-md animate-rise items-center gap-2.5 rounded-full border border-line-strong bg-ink-3/95 px-4 py-2.5 text-sm shadow-2xl backdrop-blur">
            <span className={t.tone === "ok" ? "text-success" : "text-danger"}>{t.tone === "ok" ? <IconCheck size={16} /> : <IconX size={16} />}</span>
            <span className="line-clamp-1">{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
