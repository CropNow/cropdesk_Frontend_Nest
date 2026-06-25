import { describe, test, expect } from "vitest";
import {
  isDeviceType,
  getWeatherSummary,
  getStatusColor,
  getStatusVariant,
  formatCurrentTime,
} from "../deviceUtils";

describe("deviceUtils", () => {
  test("isDeviceType", () => {
    expect(isDeviceType("nest")).toBe(true);
    expect(isDeviceType("seed")).toBe(true);
    expect(isDeviceType("aero")).toBe(true);
    expect(isDeviceType("unknown")).toBe(false);
    expect(isDeviceType(null)).toBe(false);
  });

  test("getWeatherSummary", () => {
    const summary = getWeatherSummary();
    expect(summary.city).toBe("Kallakurichi, IN");
    expect(summary.temp).toBe("30 C");
  });

  test("getStatusColor", () => {
    expect(getStatusColor("Optimal")).toBe("#00FF9C");
    expect(getStatusColor("Warning")).toBe("#F59E0B");
    expect(getStatusColor("Critical")).toBe("#EF4444");
  });

  test("getStatusVariant", () => {
    expect(getStatusVariant("Optimal")).toBe("success");
    expect(getStatusVariant("Warning")).toBe("warning");
    expect(getStatusVariant("Critical")).toBe("danger");
  });

  test("formatCurrentTime", () => {
    const d = new Date("2026-06-25T12:00:00.000Z");
    const formatted = formatCurrentTime(d);
    expect(formatted.date).toBeDefined();
    expect(formatted.time).toBeDefined();
  });
});
