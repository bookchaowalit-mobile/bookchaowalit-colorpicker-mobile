import { describe, expect, it } from "vitest";
import { encodeEnvelope, valueCodec } from "../persist";
import { isHexColor, isSavedColors, MAX_SAVED_COLORS, removeColor, saveColor } from "../saved";

describe("saved colors", () => {
  it("normalizes, de-duplicates and keeps newest first", () => {
    let list = saveColor([], "#abc");
    list = saveColor(list, "#1E88E5");
    list = saveColor(list, "aabbcc");
    expect(list).toEqual(["#AABBCC", "#1E88E5"]);
    expect(saveColor(list, "not a color")).toBe(list);
    expect(removeColor(list, "#1E88E5")).toEqual(["#AABBCC"]);
  });

  it("caps the list", () => {
    let list: string[] = [];
    for (let i = 0; i < MAX_SAVED_COLORS + 3; i++) list = saveColor(list, `#${i.toString(16).padStart(6, "0")}`);
    expect(list).toHaveLength(MAX_SAVED_COLORS);
  });

  it("validates stored data", () => {
    const codec = valueCodec(isSavedColors);
    expect(codec.decode(codec.encode(["#AABBCC"]))).toEqual(["#AABBCC"]);
    expect(codec.decode(encodeEnvelope(["#abc"]))).toBeUndefined();
    expect(isHexColor("#1E88E5")).toBe(true);
    expect(isHexColor("red")).toBe(false);
  });
});
