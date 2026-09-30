import { describe, expect, it } from "vitest";
import {
  adjustLightness,
  contrastRatio,
  formatHsl,
  formatRgb,
  hexToRgb,
  hslToRgb,
  normalizeHex,
  parseColor,
  readableTextColor,
  rgbToHex,
  rgbToHsl,
  wcagRating,
} from "../color";

describe("normalizeHex", () => {
  it("expands shorthand and uppercases", () => {
    expect(normalizeHex("abc")).toBe("#AABBCC");
    expect(normalizeHex(" #4a90d9 ")).toBe("#4A90D9");
  });

  it("rejects invalid input", () => {
    expect(normalizeHex("#12345")).toBeNull();
    expect(normalizeHex("zzzzzz")).toBeNull();
  });
});

describe("conversions", () => {
  it("round-trips hex, rgb and hsl", () => {
    for (const hex of ["#FF0000", "#00FF00", "#0000FF", "#808080", "#4A90D9", "#000000"]) {
      expect(rgbToHex(hslToRgb(rgbToHsl(hexToRgb(hex))))).toBe(hex);
    }
  });

  it("formats CSS strings", () => {
    expect(formatRgb(hexToRgb("#4A90D9"))).toBe("rgb(74, 144, 217)");
    expect(formatHsl(rgbToHsl(hexToRgb("#FF0000")))).toBe("hsl(0, 100%, 50%)");
  });
});

describe("parseColor", () => {
  it("accepts hex, rgb() and hsl()", () => {
    expect(parseColor("#0f0")).toBe("#00FF00");
    expect(parseColor("rgb(74, 144, 217)")).toBe("#4A90D9");
    expect(parseColor("rgba(0,0,0,0.5)")).toBe("#000000");
    expect(parseColor("hsl(240, 100%, 50%)")).toBe("#0000FF");
    expect(parseColor("hsl(120deg, 100%, 25%)")).toBe("#008000");
  });

  it("rejects malformed or out-of-range input", () => {
    expect(parseColor("rgb(256, 0, 0)")).toBeNull();
    expect(parseColor("hsl(0, 120%, 50%)")).toBeNull();
    expect(parseColor("red")).toBeNull();
    expect(parseColor("")).toBeNull();
  });
});

describe("contrast", () => {
  it("matches WCAG extremes", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });

  it("rates ratios", () => {
    expect(wcagRating(21)).toBe("AAA");
    expect(wcagRating(4.5)).toBe("AA");
    expect(wcagRating(3.2)).toBe("AA Large");
    expect(wcagRating(2.9)).toBe("Fail");
  });

  it("picks readable text", () => {
    expect(readableTextColor("#FFFF00")).toBe("#000000");
    expect(readableTextColor("#000080")).toBe("#FFFFFF");
  });
});

describe("adjustLightness", () => {
  it("lightens, darkens and clamps", () => {
    expect(adjustLightness("#808080", 100)).toBe("#FFFFFF");
    expect(adjustLightness("#808080", -100)).toBe("#000000");
    expect(adjustLightness("#FF0000", -25)).toBe("#800000");
  });
});
