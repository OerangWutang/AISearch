import { describe, expect, it } from "vitest";
import { clamp, uid, addDays, parseCsv, uniqueStrings } from "./utils";

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles equal min and max", () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe("uid", () => {
  it("generates unique ids with default prefix", () => {
    const id1 = uid();
    const id2 = uid();
    expect(id1).toMatch(/^tg_/);
    expect(id1).not.toBe(id2);
  });

  it("uses custom prefix", () => {
    expect(uid("rem")).toMatch(/^rem_/);
  });
});

describe("addDays", () => {
  it("adds days to a date", () => {
    const base = new Date("2025-01-01T00:00:00Z");
    const result = addDays(base, 7);
    expect(result.toISOString()).toBe("2025-01-08T00:00:00.000Z");
  });

  it("does not mutate the original date", () => {
    const base = new Date("2025-06-15T12:00:00Z");
    addDays(base, 5);
    expect(base.toISOString()).toBe("2025-06-15T12:00:00.000Z");
  });

  it("handles zero days", () => {
    const base = new Date("2025-03-01T00:00:00Z");
    const result = addDays(base, 0);
    expect(result.toISOString()).toBe("2025-03-01T00:00:00.000Z");
  });
});

describe("parseCsv", () => {
  it("splits and trims values", () => {
    expect(parseCsv("a, b , c")).toEqual(["a", "b", "c"]);
  });

  it("removes empty entries", () => {
    expect(parseCsv("a,,b,")).toEqual(["a", "b"]);
  });

  it("lowercases values", () => {
    expect(parseCsv("FOO,Bar")).toEqual(["foo", "bar"]);
  });

  it("deduplicates entries", () => {
    expect(parseCsv("a, a, A")).toEqual(["a"]);
  });
});

describe("uniqueStrings", () => {
  it("removes duplicates and trims", () => {
    expect(uniqueStrings(["a", " a ", "b", "b"])).toEqual(["a", "b"]);
  });

  it("filters out empty strings", () => {
    expect(uniqueStrings(["a", "", " ", "b"])).toEqual(["a", "b"]);
  });
});
