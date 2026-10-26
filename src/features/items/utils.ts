import { Colors, ItemPalette } from "@/@core/constants/theme";
import { ApiError } from "@/@core/helpers/api-error";
import type { ArcRaidersItems } from "@/features/home/types";

export const getRarityColor = (rarity?: string | null) =>
  ItemPalette[rarity?.toLowerCase() ?? ""] ?? Colors.textSecondary;

/** Appends a hex alpha, e.g. withAlpha("#4A8FBF", 0.2) */
export const withAlpha = (hex: string, alpha: number) =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;

export const getCategory = (item: ArcRaidersItems) =>
  [item.item_type, item.subcategory].filter(Boolean).join(" / ");
/** "Rare" for the API; the UI keeps lowercase keys that match ItemPalette */
export const toApiRarity = (r: string) =>
  r.charAt(0).toUpperCase() + r.slice(1);

/** "damage_per_second" / "damagePerSecond" -> "Damage Per Second" */
export const titleize = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Safe display string for fields whose shape is `unknown` */
export const formatValue = (v: unknown): string => {
  if (v == null || v === "") return "—";
  if (typeof v === "number") return v.toLocaleString();
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(formatValue).join(", ");
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    const label = o.name ?? o.title ?? o.label;
    if (typeof label === "string") return label;
    return Object.entries(o)
      .filter(([, val]) => val != null)
      .map(([k, val]) => `${titleize(k)}: ${formatValue(val)}`)
      .join(" · ");
  }
  return String(v);
};

export const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

export const errorCopy = (error: unknown) => {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case "network":
        return "You're offline. Check your connection and try again.";
      case "timeout":
        return "The server took too long to answer. Try again.";
      case "http":
        return error.status === 429
          ? "Too many requests. Wait a moment, then try again."
          : `The server returned an error (${error.status}).`;
      case "invalid-content":
      case "parse":
        return "The server sent data the app couldn't read.";
    }
  }
  return "Something went wrong while loading items.";
};
