/// <reference types="google.maps" />
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polygon,
  DrawingManager,
  Circle,
  Rectangle,
} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAv4C8ghcCodw5X525A-BzfPMWmRkOjVek';

const libraries: ('drawing' | 'geometry' | 'places')[] = [
  'drawing',
  'geometry',
  'places',
];

declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationPickerProps {
  mode: 'point' | 'polygon';
  value: any; // string "lat,lng" OR stringified JSON for shapes
  onChange: (value: any) => void;
  height?: string | undefined;
  readOnly?: boolean | undefined;
  center?: [number, number] | undefined; // [lat, lng]
  onAreaCalculated?: ((sqFt: number) => void) | undefined;
  onLocationDataChange?:
    | ((data: { city?: string; state?: string; country?: string }) => void)
    | undefined;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  mode,
  value,
  onChange,
  height = '400px',
  readOnly = false,
  center: defaultCenter,
  onAreaCalculated,
  onLocationDataChange,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  // Polygon/Shape State
  const [shapePath, setShapePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [shapeType, setShapeType] = useState<
    'Polygon' | 'Rectangle' | 'Circle' | null
  >(null);
  const [circleCenter, setCircleCenter] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [circleRadius, setCircleRadius] = useState<number>(0);
  const [rectangleBounds, setRectangleBounds] =
    useState<google.maps.LatLngBoundsLiteral | null>(null);

  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );

  // Default center (India)
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 20.5937,
    lng: 78.9629,
  });

  // 1. Sync Center Prop
  useEffect(() => {
    if (defaultCenter) {
      setMapCenter({ lat: defaultCenter[0], lng: defaultCenter[1] });
    }
  }, [defaultCenter]);

  // 2. Initialize from Value
  useEffect(() => {
    if (!value || !isLoaded || !window.google) return;

    if (mode === 'point' && typeof value === 'string') {
      const parts = value.split(',').map((v) => parseFloat(v.trim()));
      if (parts.length >= 2) {
        const lat = parts[0];
        const lng = parts[1];
        if (
          lat !== undefined &&
          lng !== undefined &&
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          const pos = { lat, lng };
          setMarkerPosition(pos);
          setMapCenter(pos);
        }
      }
    } else if (mode === 'polygon') {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed.type === 'Polygon' && parsed.points) {
          // Points could be [{lat, lng}] or [[lat, lng]] (leaflet style)
          // Standardize to [{lat, lng}]
          let path: google.maps.LatLngLiteral[] = [];
          if (Array.isArray(parsed.points) && parsed.points.length > 0) {
            if (Array.isArray(parsed.points[0])) {
              // [[lat, lng]]
              path = parsed.points.map((p: any) => ({ lat: p[0], lng: p[1] }));
            } else if ('lat' in parsed.points[0]) {
              // [{lat, lng}]
              path = parsed.points;
            }
          }
          setShapeType('Polygon');
          setShapePath(path);
          const firstPoint = path[0];
          if (path.length > 0 && firstPoint) setMapCenter(firstPoint);
        } else if (parsed.type === 'Circle') {
          setShapeType('Circle');
          setCircleCenter(parsed.center);
          setCircleRadius(parsed.radius);
          setMapCenter(parsed.center);
        } else if (parsed.type === 'Rectangle') {
          // Check if bounds provided or points
          if (parsed.bounds) {
            setRectangleBounds(parsed.bounds);
          } else if (parsed.points && parsed.points.length === 2) {
            // Reconstruct bounds from corners if stored that way
            const bounds = new window.google.maps.LatLngBounds(
              parsed.points[0],
              parsed.points[1]
            );
            setRectangleBounds(bounds.toJSON());
          }
          setShapeType('Rectangle');
        }
      } catch (e) {
        console.warn('Failed to parse polygon value', e);
      }
    }
  }, [value, mode, isLoaded]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Reverse Geocoding: Convert coordinates to city, state, country
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!window.google || !onLocationDataChange) return;

      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      try {
        const response = await geocoder.geocode({ location: latlng });
        if (response.results[0]) {
          const addressComponents = response.results[0].address_components;

          // Extract city (locality or administrative_area_level_2)
          const city = addressComponents.find(
            (c) =>
              c.types.includes('locality') ||
              c.types.includes('administrative_area_level_2')
          )?.long_name;

          // Extract state (administrative_area_level_1)
          const state = addressComponents.find((c) =>
            c.types.includes('administrative_area_level_1')
          )?.long_name;

          // Extract country
          const country = addressComponents.find((c) =>
            c.types.includes('country')
          )?.long_name;

          // Only pass defined values
          const locationData: {
            city?: string;
            state?: string;
            country?: string;
          } = {};
          if (city) locationData.city = city;
          if (state) locationData.state = state;
          if (country) locationData.country = country;

          onLocationDataChange(locationData);
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
      }
    },
    [onLocationDataChange]
  );

  // Point Mode: Handle Map Click
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (readOnly || mode !== 'point' || !e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    onChange(`${lat}, ${lng}`);

    // Trigger reverse geocoding
    reverseGeocode(lat, lng);
  };

  // Polygon Mode: Handle Drawing Complete
  const onOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {
    const overlay = e.overlay;
    // Clear existing shape drawing manually if needed (to allow only one shape?)
    // For now, let's assume one shape per field.
    // We should ideally remove the overlay from map to avoid duplicates visually
    // since we will render it via state (Polygon/Circle component).
    overlay?.setMap(null);

    // Guard against missing window.google just in case
    if (!window.google) return;

    if (e.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const poly = overlay as google.maps.Polygon;
      const path = poly
        .getPath()
        .getArray()
        .map((p) => ({ lat: p.lat(), lng: p.lng() }));
      setShapeType('Polygon');
      setShapePath(path);

      onChange(JSON.stringify({ type: 'Polygon', points: path }));

      if (onAreaCalculated) {
        const areaSqM = window.google.maps.geometry.spherical.computeArea(
          poly.getPath()
        );
        onAreaCalculated(areaSqM * 10.7639); // Convert to SqFt
      }
    } else if (e.type === window.google.maps.drawing.OverlayType.RECTANGLE) {
      const rect = overlay as google.maps.Rectangle;
      const bounds = rect.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        setShapeType('Rectangle');
        setRectangleBounds(bounds.toJSON());

        onChange(
          JSON.stringify({
            type: 'Rectangle',
            bounds: bounds.toJSON(),
            points: [
              { lat: sw.lat(), lng: sw.lng() },
              { lat: ne.lat(), lng: ne.lng() },
            ],
          })
        );

        if (onAreaCalculated) {
          // Approximate area
          const areaSqM = window.google.maps.geometry.spherical.computeArea([
            sw,
            new window.google.maps.LatLng(sw.lat(), ne.lng()),
            ne,
            new window.google.maps.LatLng(ne.lat(), sw.lng()),
          ]);
          onAreaCalculated(areaSqM * 10.7639);
        }
      }
    } else if (e.type === window.google.maps.drawing.OverlayType.CIRCLE) {
      const circ = overlay as google.maps.Circle;
      const center = circ.getCenter();
      const radius = circ.getRadius();

      if (center) {
        setShapeType('Circle');
        setCircleCenter({ lat: center.lat(), lng: center.lng() });
        setCircleRadius(radius);

        onChange(
          JSON.stringify({
            type: 'Circle',
            center: { lat: center.lat(), lng: center.lng() },
            radius,
          })
        );

        if (onAreaCalculated) {
          const areaSqM = Math.PI * Math.pow(radius, 2);
          onAreaCalculated(areaSqM * 10.7639);
        }
      }
    }
  };

  const handleUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const userPos = { lat: latitude, lng: longitude };
        setMapCenter(userPos);
        map?.panTo(userPos);
        map?.setZoom(18); // Zoom in close for field marking

        if (mode === 'point' && !readOnly) {
          setMarkerPosition(userPos);
          onChange(`${latitude}, ${longitude}`);

          // Trigger reverse geocoding
          reverseGeocode(latitude, longitude);
        }
      });
    }
  };

  // Drawing Manager Options (must be defined outside of conditional rendering)
  const drawingManagerOptions = useMemo(() => {
    if (!isLoaded || !window.google) return null;
    return {
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.POLYGON,
          window.google.maps.drawing.OverlayType.RECTANGLE,
          window.google.maps.drawing.OverlayType.CIRCLE,
        ],
      },
      polygonOptions: {
        fillColor: '#2196F3',
        fillOpacity: 0.4,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    };
  }, [isLoaded]);

  if (loadError) {
    return (
      <div className="text-red-500 p-4 border border-red-500 rounded">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-muted h-full w-full rounded-lg">
        Loading Maps...
      </div>
    );
  }

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-white/20"
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={defaultCenter ? 18 : 10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          mapTypeId: 'hybrid', // Best for farming (Satellite + Labels)
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
        }}
      >
        {/* Render Marker (Point Mode) */}
        {mode === 'point' && markerPosition && (
          <Marker position={markerPosition} />
        )}

        {/* Render Shapes (Polygon Mode) */}
        {mode === 'polygon' && (
          <>
            {shapeType === 'Polygon' && shapePath.length > 0 && (
              <Polygon
                paths={shapePath}
                options={{
                  fillColor: '#2196F3',
                  fillOpacity: 0.4,
                  strokeColor: '#2196F3',
                  strokeWeight: 2,
                  editable: !readOnly, // Allow editing if not readOnly
                  draggable: !readOnly,
                }}
                // Handle edits to update state? Requires events (onMouseUp, onDragEnd)
                // For MVP, keep editing simple (re-draw) or just visualization
              />
            )}
            {shapeType === 'Rectangle' && rectangleBounds && (
              <Rectangle
                bounds={rectangleBounds}
                options={{
                  fillColor: '#2196F3',
                  fillOpacity: 0.4,
                  strokeColor: '#2196F3',
                  strokeWeight: 2,
                  editable: !readOnly,
                  draggable: !readOnly,
                }}
              />
            )}
            {shapeType === 'Circle' && circleCenter && (
              <Circle
                center={circleCenter}
                radius={circleRadius}
                options={{
                  fillColor: '#2196F3',
                  fillOpacity: 0.4,
                  strokeColor: '#2196F3',
                  strokeWeight: 2,
                  editable: !readOnly,
                  draggable: !readOnly,
                }}
              />
            )}

            {/* Drawing Controls */}
            {!readOnly && (
              <DrawingManager
                onLoad={(dm) => (drawingManagerRef.current = dm)}
                onOverlayComplete={onOverlayComplete}
                options={drawingManagerOptions as any}
              />
            )}
          </>
        )}
      </GoogleMap>

      {!readOnly && (
        <button
          type="button"
          onClick={handleUserLocation}
          className="absolute bottom-6 left-4 z-[50] bg-white text-black p-2 rounded shadow-lg text-xs font-bold flex items-center gap-1 hover:bg-gray-100"
        >
          📍 Use My Location
        </button>
      )}
    </div>
  );
};

export default LocationPicker;
