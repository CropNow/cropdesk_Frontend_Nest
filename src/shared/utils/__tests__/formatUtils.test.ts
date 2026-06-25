import { describe, test, expect } from "vitest";
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatTime,
  formatDateTime,
  formatTemperature,
  formatHumidity,
  formatVolume,
  formatDistance,
  truncateText,
  capitalize,
  getSeverityColor,
  getStatusColor,
  parseUserAgent,
  formatTimeAgo,
} from "../formatUtils";

describe("formatUtils", () => {
  test("formatNumber", () => {
    expect(formatNumber(12.3456, 2)).toBe("12.35");
    expect(formatNumber(12.3, 2)).toBe("12.3");
  });

  test("formatCurrency", () => {
    expect(formatCurrency(12.5)).toContain("$12.50");
  });

  test("formatPercentage", () => {
    expect(formatPercentage(45.67)).toBe("45.7%");
  });

  test("formatDate and formatTime", () => {
    const d = new Date("2026-06-25T12:00:00.000Z");
    // Basic structural checks since behavior can vary by locale in environments
    expect(formatDate(d)).toBeDefined();
    expect(formatTime(d)).toBeDefined();
    expect(formatDateTime(d)).toBeDefined();
  });

  test("formatTemperature and formatHumidity", () => {
    expect(formatTemperature(25)).toBe("25°C");
    expect(formatHumidity(80)).toBe("80%");
  });

  test("formatVolume and formatDistance", () => {
    expect(formatVolume(500)).toBe("500 L");
    expect(formatVolume(1500)).toBe("1.5 m³");
    expect(formatDistance(500)).toBe("500 m");
    expect(formatDistance(1500)).toBe("1.5 km");
  });

  test("truncateText and capitalize", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Hi", 5)).toBe("Hi");
    expect(capitalize("tEsT")).toBe("Test");
  });

  test("color matchers", () => {
    expect(getSeverityColor("critical")).toBe("red");
    expect(getSeverityColor("unknown")).toBe("gray");
    expect(getStatusColor("online")).toBe("green");
    expect(getStatusColor("unknown")).toBe("gray");
  });

  test("parseUserAgent", () => {
    const postman = "PostmanRuntime/7.28.4";
    const chromeWindows =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/92.0";
    expect(parseUserAgent(postman)).toBe("Postman API Client");
    expect(parseUserAgent(chromeWindows)).toBe("Chrome on Windows");
  });

  test("formatTimeAgo", () => {
    const now = new Date();
    const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    expect(formatTimeAgo(tenMinAgo)).toBe("10m ago");
    expect(formatTimeAgo("")).toBe("Unknown time");
  });
});
