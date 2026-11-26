"use client";
import type { License } from "./types";

/** Demo-mode order history, stored only in this browser. Never used in live mode. */
export interface DemoOrder {
  id: string;
  createdAt: string;
  amountInr: number;
  items: { kind: "script" | "bundle"; title: string; license: License; priceInr: number }[];
  scripts: { id: string; slug: string; title: string; license: License }[];
}

const KEY = "sv-demo-orders-v1";

export function getDemoOrders(): DemoOrder[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function saveDemoOrder(o: DemoOrder) {
  try { localStorage.setItem(KEY, JSON.stringify([o, ...getDemoOrders()].slice(0, 50))); } catch {}
}

export function clearDemoOrders() {
  try { localStorage.removeItem(KEY); } catch {}
}
