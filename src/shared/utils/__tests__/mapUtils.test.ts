import { describe, test, expect } from "vitest";
import { calculateGeodesicArea, squareMetersToAcres } from "../mapUtils";

describe("mapUtils", () => {
  describe("calculateGeodesicArea", () => {
    test("should calculate area for a simple polygon shape", () => {
      // 0.001 degrees latitude is ~111 meters, 0.001 degrees longitude at equator is ~111 meters
      // Let's create a small polygon block
      const coordinates = [
        { lat: 0.0, lng: 0.0 },
        { lat: 0.0, lng: 0.001 },
        { lat: 0.001, lng: 0.001 },
        { lat: 0.001, lng: 0.0 },
        { lat: 0.0, lng: 0.0 },
      ];

      const area = calculateGeodesicArea(coordinates);
      expect(area).toBeGreaterThan(12000);
      expect(area).toBeLessThan(13000);
    });

    test("should return 0 for empty coordinate array", () => {
      const area = calculateGeodesicArea([]);
      expect(area).toBe(0);
    });
  });

  describe("squareMetersToAcres", () => {
    test("should convert square meters to acres correctly", () => {
      expect(squareMetersToAcres(4046.86)).toBeCloseTo(1.0, 3);
    });
  });
});
