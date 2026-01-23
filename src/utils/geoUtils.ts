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
