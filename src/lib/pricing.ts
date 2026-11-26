import "server-only";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

export const cartSchema = z.object({
  items: z
    .array(
      z.object({
        kind: z.enum(["script", "bundle"]),
        id: z.string().uuid(),
        license: z.enum(["standard", "exclusive"]).default("standard"),
      })
    )
    .min(1, "Your cart is empty")
    .max(25, "Too many items in one order"),
});
export type CartInput = z.infer<typeof cartSchema>;

export interface PricedLine {
  scriptId: string | null;
  bundleId: string | null;
  title: string;
  license: "standard" | "exclusive";
  priceInr: number;
}

export class PricingError extends Error {}

/**
 * Recalculates the order from the database. Client-sent prices are ignored entirely.
 * Uses the service-role client so unpublished rows can be detected and rejected.
 */
export async function priceCart(sb: SupabaseClient, input: CartInput, userId: string) {
  const scriptLines = input.items.filter((i) => i.kind === "script");
  const bundleLines = input.items.filter((i) => i.kind === "bundle");

  const ids = new Set(input.items.map((i) => `${i.kind}:${i.id}`));
  if (ids.size !== input.items.length) throw new PricingError("Duplicate item in cart");

  const lines: PricedLine[] = [];

  if (scriptLines.length) {
    const { data: scripts, error } = await sb
      .from("scripts")
      .select("id, title, price_inr, exclusive_price_inr, exclusive_available, is_published")
      .in("id", scriptLines.map((i) => i.id));
    if (error) throw error;
    for (const item of scriptLines) {
      const s = scripts?.find((r) => r.id === item.id);
      if (!s || !s.is_published) throw new PricingError("A script in your cart is no longer available");
      if (item.license === "exclusive") {
        if (!s.exclusive_available || !s.exclusive_price_inr)
          throw new PricingError(`Exclusive licence is no longer available for “${s.title}”`);
        lines.push({ scriptId: s.id, bundleId: null, title: s.title, license: "exclusive", priceInr: s.exclusive_price_inr });
      } else {
        lines.push({ scriptId: s.id, bundleId: null, title: s.title, license: "standard", priceInr: s.price_inr });
      }
    }
  }

  if (bundleLines.length) {
    const { data: bundles, error } = await sb
      .from("bundles")
      .select("id, title, price_inr, is_published")
      .in("id", bundleLines.map((i) => i.id));
    if (error) throw error;
    for (const item of bundleLines) {
      const b = bundles?.find((r) => r.id === item.id);
      if (!b || !b.is_published) throw new PricingError("A bundle in your cart is no longer available");
      lines.push({ scriptId: null, bundleId: b.id, title: b.title, license: "standard", priceInr: b.price_inr });
    }
  }

  // Don't charge people for scripts they already own (standalone lines only).
  const standaloneIds = lines.filter((l) => l.scriptId).map((l) => l.scriptId!);
  if (standaloneIds.length) {
    const { data: owned } = await sb
      .from("purchases")
      .select("script_id, scripts(title)")
      .eq("user_id", userId)
      .in("script_id", standaloneIds);
    if (owned?.length) {
      const first = owned[0] as unknown as { scripts: { title: string } | null };
      throw new PricingError(`You already own “${first.scripts?.title ?? "a script in your cart"}”. Remove it to continue.`);
    }
  }

  const totalInr = lines.reduce((n, l) => n + l.priceInr, 0);
  if (totalInr < 1) throw new PricingError("Invalid order total");
  return { lines, totalInr };
}
