/** Saved colors: pure helpers (no React Native imports) so they are unit-testable. */
import { normalizeHex } from "./color";

export const MAX_SAVED_COLORS = 24;

/** Adds a color at the front; an existing color moves to the front instead of duplicating. */
export function saveColor(list: string[], color: string): string[] {
  const hex = normalizeHex(color);
  if (!hex) return list;
  return [hex, ...list.filter((c) => c !== hex)].slice(0, MAX_SAVED_COLORS);
}

export function removeColor(list: string[], color: string): string[] {
  return list.filter((c) => c !== color);
}

/** Type guard used when loading saved colors: a list of normalized `#RRGGBB` strings. */
export function isSavedColors(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((c) => typeof c === "string" && normalizeHex(c) === c);
}

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && normalizeHex(value) === value;
}
