import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatRelativeTime } from "./format";

const mockT = (key: string, values?: Record<string, number>) => {
  if (values) return `${key}:${JSON.stringify(values)}`;
  return key;
};

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'now' for less than 60 seconds ago", () => {
    const date = new Date("2025-01-15T11:59:30Z");
    expect(formatRelativeTime(date, mockT)).toBe("time.now");
  });

  it("returns minutes ago for less than 60 minutes", () => {
    const date = new Date("2025-01-15T11:45:00Z");
    expect(formatRelativeTime(date, mockT)).toBe('time.minutesAgo:{"count":15}');
  });

  it("returns hours ago for less than 24 hours", () => {
    const date = new Date("2025-01-15T09:00:00Z");
    expect(formatRelativeTime(date, mockT)).toBe('time.hoursAgo:{"count":3}');
  });

  it("returns yesterday for 24-48 hours ago", () => {
    const date = new Date("2025-01-14T10:00:00Z");
    expect(formatRelativeTime(date, mockT)).toBe("time.yesterday");
  });

  it("returns days ago for 2-6 days", () => {
    const date = new Date("2025-01-12T12:00:00Z");
    expect(formatRelativeTime(date, mockT)).toBe('time.daysAgo:{"count":3}');
  });

  it("returns formatted date for 7+ days ago", () => {
    const date = new Date("2025-01-01T12:00:00Z");
    const result = formatRelativeTime(date, mockT);
    expect(result).not.toContain("time.");
    expect(result).toBeTruthy();
  });
});
