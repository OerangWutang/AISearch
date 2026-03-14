import { describe, expect, it, vi } from "vitest";
import { computeReminderAtLocalNine, toIcsLocalDateTime } from "./time";

describe("computeReminderAtLocalNine", () => {
  it("returns 5 minutes from now when devFastTrack is true", () => {
    const now = new Date("2025-06-15T10:00:00");
    const cancelDate = new Date("2025-06-30T09:00:00");
    const result = computeReminderAtLocalNine(cancelDate, { now, devFastTrack: true });
    expect(result.getTime()).toBe(now.getTime() + 5 * 60 * 1000);
  });

  it("returns now when cancel date is in the past", () => {
    const now = new Date("2025-06-15T10:00:00");
    const cancelDate = new Date("2025-06-10T09:00:00");
    const result = computeReminderAtLocalNine(cancelDate, { now });
    expect(result.getTime()).toBe(now.getTime());
  });

  it("targets 9 AM on the cancel date when far enough in the future", () => {
    const now = new Date("2025-06-01T08:00:00");
    const cancelDate = new Date("2025-06-15T14:00:00");
    const result = computeReminderAtLocalNine(cancelDate, { now });
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(0);
  });
});

describe("toIcsLocalDateTime", () => {
  it("formats a date as ICS local datetime", () => {
    const date = new Date(2025, 0, 15, 9, 30, 0);
    expect(toIcsLocalDateTime(date)).toBe("20250115T093000");
  });

  it("pads single-digit values", () => {
    const date = new Date(2025, 2, 5, 8, 5, 3);
    expect(toIcsLocalDateTime(date)).toBe("20250305T080503");
  });
});
