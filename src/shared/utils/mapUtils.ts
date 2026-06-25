/**
 * Map utilities - geodesic area calculation, geojson helpers
 */

export interface LatLngLike {
  lat: number;
  lng: number;
}

export const calculateGeodesicArea = (latLngs: LatLngLike[]): number => {
  const earthRadius = 6378137; // Radius in meters
  let area = 0;
  const coords = latLngs.map((ll) => [(ll.lat * Math.PI) / 180, (ll.lng * Math.PI) / 180]);

  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    area += (coords[j][1] - coords[i][1]) * (2 + Math.sin(coords[i][0]) + Math.sin(coords[j][0]));
  }

  area = Math.abs((area * earthRadius * earthRadius) / 2.0);
  return area; // Square meters
};

export const squareMetersToAcres = (sqMeters: number): number => {
  return sqMeters * 0.000247105;
};
