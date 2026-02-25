// Convert degrees to radians
function toRad(value: number) {
  return (value * Math.PI) / 180;
}

// Calculate distance between two lat/lng points in km
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if a field coordinate (could be center of shape) is near the farm
export function isLocationValid(
  farmLat: string | number,
  farmLng: string | number,
  fieldCoordsJSON: string,
  maxDistKm = 50 // Allow 50km radius for now, customizable
): { valid: boolean; distance?: number; error?: string } {
  if (!farmLat || !farmLng || !fieldCoordsJSON) return { valid: true }; // Skip if missing data

  const fLat = typeof farmLat === 'string' ? parseFloat(farmLat) : farmLat;
  const fLng = typeof farmLng === 'string' ? parseFloat(farmLng) : farmLng;

  if (isNaN(fLat) || isNaN(fLng)) return { valid: true };

  let targetLat = 0;
  let targetLng = 0;

  try {
    const parsed = JSON.parse(fieldCoordsJSON);
    if (parsed.type === 'Circle') {
      targetLat = parsed.center.lat;
      targetLng = parsed.center.lng;
    } else if (
      parsed.points &&
      Array.isArray(parsed.points) &&
      parsed.points.length > 0
    ) {
      // For polygon, just take the first point or calculate centroid
      // Simple approach: first point
      targetLat = parsed.points[0].lat;
      targetLng = parsed.points[0].lng;
    } else {
      return { valid: true }; // Unknown structure
    }
  } catch (e) {
    return { valid: true }; // Not JSON, maybe manual text?
  }

  const dist = getDistanceKm(fLat, fLng, targetLat, targetLng);

  if (dist > maxDistKm) {
    return {
      valid: false,
      distance: dist,
      error: `Field is ${dist.toFixed(1)}km away from Farm! It must be within ${maxDistKm}km.`,
    };
  }

  return { valid: true, distance: dist };
}

/**
 * Converts frontend shape data (JSON string or Object) to GeoJSON format.
 * Returns { boundary, location } where:
 * - boundary: GeoJSON Polygon
 * - location: GeoJSON Point (Centroid)
 */
export function getGeoJSONFromShape(shapeData: any): {
  boundary: any;
} | null {
  try {
    if (!shapeData) return null;

    let parsed = shapeData;
    if (typeof shapeData === 'string') {
      parsed = JSON.parse(shapeData);
    }

    let rings: number[][] = [];
    let centroid: [number, number] = [0, 0];

    // Case 1: Standard LocationPicker Output { type: 'Polygon', points: [{lat, lng}, ...] }
    if (parsed?.points && Array.isArray(parsed.points)) {
      rings = parsed.points.map((p: any) => {
        const lat = Array.isArray(p) ? p[0] : (p.lat ?? p[1]);
        const lng = Array.isArray(p) ? p[1] : (p.lng ?? p[0]);
        return [Number(lng), Number(lat)];
      });
      if (rings.length > 0) {
        let totalLat = 0;
        let totalLng = 0;
        rings.forEach((r: number[]) => {
          if (r && r.length >= 2) {
            totalLng += r[0] || 0;
            totalLat += r[1] || 0;
          }
        });
        centroid = [totalLng / rings.length, totalLat / rings.length];
      }
    }
    // Case 2: Rectangle shape { type: 'Rectangle', bounds: {north, south, east, west} }
    else if (parsed?.type === 'Rectangle' && parsed?.bounds) {
      const { north, south, east, west } = parsed.bounds;
      rings = [
        [Number(west), Number(south)],
        [Number(east), Number(south)],
        [Number(east), Number(north)],
        [Number(west), Number(north)],
      ];
      centroid = [
        (Number(west) + Number(east)) / 2,
        (Number(north) + Number(south)) / 2,
      ];
    }
    // Case 3: Circle shape { type: 'Circle', center: {lat, lng}, radius: number }
    else if (parsed?.type === 'Circle' && parsed?.center && parsed?.radius) {
      const { lat, lng } = parsed.center;
      const radiusInMeters = parsed.radius;
      const points = 32;
      for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points;
        const angleRad = (angle * Math.PI) / 180;
        // Approximation: 1 deg lat = 111,320m
        const latOffset = (radiusInMeters / 111320) * Math.sin(angleRad);
        const lngOffset =
          (radiusInMeters / (111320 * Math.cos((lat * Math.PI) / 180))) *
          Math.cos(angleRad);
        rings.push([lng + lngOffset, lat + latOffset]);
      }
      centroid = [lng, lat];
    } else {
      return null;
    }

    // Ensure GeoJSON Polygon requirements
    if (rings.length > 0) {
      // Close the loop
      const first = rings[0];
      const last = rings[rings.length - 1];
      if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
        rings.push([...first]);
      }

      return {
        boundary: {
          type: 'Polygon',
          coordinates: [rings],
        },
      };
    }

    return null;
  } catch (e) {
    console.error('Error parsing shape for GeoJSON:', e);
    return null;
  }
}
