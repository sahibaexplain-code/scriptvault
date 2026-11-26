export type Language = "Hindi" | "Hinglish" | "English";
export type ScriptFormat = "YouTube Long-form" | "Reels / Shorts" | "Documentary";
export type License = "standard" | "exclusive";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  /** Two-stop gradient used for generated thumbnails, e.g. ["#7c3aed", "#1e1b4b"] */
  palette: [string, string];
  motif: "orbit" | "brain" | "column" | "eye" | "chart" | "spark" | "smile" | "film";
}

/** Everything about a script that is safe to show publicly. Never contains the paid body. */
export interface Script {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  language: Language;
  format: ScriptFormat;
  durationMinutes: number;
  wordCount: number;
  priceInr: number;
  exclusivePriceInr: number | null;
  exclusiveAvailable: boolean;
  description: string;
  preview: string;
  tags: string[];
  thumbnailUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  salesCount: number;
  rating: number;
  createdAt: string;
}

export interface Bundle {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceInr: number;
  scriptIds: string[];
  isPublished: boolean;
  badge: string | null;
}

export interface CartItem {
  kind: "script" | "bundle";
  id: string;
  slug: string;
  title: string;
  license: License;
  /** Display price only. The server always recalculates from the database. */
  priceInr: number;
}

export interface OrderSummary {
  id: string;
  status: "created" | "paid" | "failed" | "review";
  amountInr: number;
  createdAt: string;
  paidAt: string | null;
  razorpayPaymentId: string | null;
  items: { title: string; license: License; priceInr: number; kind: "script" | "bundle" }[];
}

export interface Purchase {
  scriptId: string;
  slug: string;
  title: string;
  license: License;
  purchasedAt: string;
}
