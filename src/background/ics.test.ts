import { describe, expect, it } from "vitest";
import { generateIcsForReminder } from "./ics";
import type { ReminderRecord } from "../shared/types";

describe("generateIcsForReminder", () => {
  const baseReminder: ReminderRecord = {
    id: "rem_test_001",
    hostname: "example.com",
    domainKey: "example.com",
    createdAt: "2025-06-01T10:00:00.000Z",
    kind: "trial",
    trialDays: 14,
    detectedAt: "2025-06-01T10:00:00.000Z",
    cancelAt: "2025-06-13T09:00:00.000Z",
    reminderAt: "2025-06-13T09:00:00.000Z",
    bufferDays: 2,
    status: "active"
  };

  it("produces valid ICS structure", () => {
    const ics = generateIcsForReminder(baseReminder);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("PRODID:-//TrialGuard//EN");
  });

  it("includes reminder domain in summary", () => {
    const ics = generateIcsForReminder(baseReminder);
    expect(ics).toContain("SUMMARY:Cancel trial for example.com");
  });

  it("includes manage URL when present", () => {
    const reminder = { ...baseReminder, manageUrl: "https://example.com/manage" };
    const ics = generateIcsForReminder(reminder);
    expect(ics).toContain("URL:https://example.com/manage");
  });

  it("omits URL line when no manage URL", () => {
    const ics = generateIcsForReminder(baseReminder);
    expect(ics).not.toContain("URL:");
  });

  it("uses CRLF line endings", () => {
    const ics = generateIcsForReminder(baseReminder);
    expect(ics).toContain("\r\n");
    const lines = ics.split("\r\n").filter(Boolean);
    expect(lines.length).toBeGreaterThan(5);
  });

  it("includes UID with @trialguard.local suffix", () => {
    const ics = generateIcsForReminder(baseReminder);
    expect(ics).toContain("UID:rem_test_001@trialguard.local");
  });
});
