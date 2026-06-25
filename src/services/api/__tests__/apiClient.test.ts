import { describe, test, expect, vi, beforeEach } from "vitest";

describe("apiClient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test("should throw error if VITE_API_BASE_URL is not defined", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");

    await expect(async () => {
      await import("../apiClient");
    }).rejects.toThrow("VITE_API_BASE_URL is not set");

    vi.unstubAllEnvs();
  });

  test("should initialize successfully if VITE_API_BASE_URL is defined", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://mockapi.example.com");

    const client = (await import("../apiClient")).default;
    expect(client).toBeDefined();
    expect(client.defaults.baseURL).toBe("https://mockapi.example.com");

    vi.unstubAllEnvs();
  });
});
