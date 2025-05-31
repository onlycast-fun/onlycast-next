import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMarketCap(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    notation: "compact",
  }).format(value);
}

export function shortPubKey(
  key: string,
  ops?: { len?: number; split?: string }
) {
  if (!key) return "";
  const split = ops?.split;
  const len = ops?.len || 4;

  if (split) {
    return key.slice(0, len) + split + key.slice(-len);
  }
  return key.slice(0, len + 2) + "...".repeat(len / 4) + key.slice(-len);
}
