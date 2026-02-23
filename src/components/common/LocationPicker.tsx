import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Rectangle,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const TILE_LAYERS = {
  normal: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
  },
};

interface LocationPickerProps {
  mode: 'point' | 'polygon';
  value: any;
  onChange: (value: any) => void;
  height?: string;
  readOnly?: boolean;
  center?: [number, number] | undefined;
  onAreaCalculated?: ((sqFt: number) => void) | undefined;
  onLocationDataChange?: (data: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  mode,
  value,
  onChange,
  height = '400px',
  readOnly = false,
  center,
  onAreaCalculated,
  onLocationDataChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapView, setMapView] = useState<'normal' | 'satellite'>('normal');
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    center || [20.5937, 78.9629]
  );
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [shapePath, setShapePath] = useState<[number, number][]>([]);
  const [shapeType, setShapeType] = useState<
    'Polygon' | 'Rectangle' | 'Circle' | null
  >(null);
  const [circleCenter, setCircleCenter] = useState<[number, number] | null>(
    null
  );
  const [circleRadius, setCircleRadius] = useState<number>(0);
  const [rectangleBounds, setRectangleBounds] = useState<
    [[number, number], [number, number]] | null
  >(null);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const mapRef = useRef<L.Map>(null);

  const KARNATAKA_CENTER: [number, number] = [15.3173, 75.7139];

  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      setMapCenter(center);
    } else {
      setMapCenter(KARNATAKA_CENTER);
    }
  }, [center]);

  useEffect(() => {
    if (!value) return;

    if (mode === 'point' && typeof value === 'string') {
      const parts = value.split(',').map((v) => parseFloat(v.trim()));
      const lat = parts[0];
      const lng = parts[1];
      if (
        parts.length >= 2 &&
        lat !== undefined &&
        lng !== undefined &&
        !isNaN(lat) &&
        !isNaN(lng)
      ) {
        const pos: [number, number] = [lat, lng];
        setMarkerPosition(pos);
        setMapCenter(pos);
      }
    } else if (mode === 'polygon') {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed.type === 'Polygon' && parsed.points) {
          let path: [number, number][] = [];
          if (Array.isArray(parsed.points) && parsed.points.length > 0) {
            if (Array.isArray(parsed.points[0])) {
              path = parsed.points.map((p: any) => [p[0], p[1]]);
            } else if ('lat' in parsed.points[0]) {
              path = parsed.points.map((p: any) => [p.lat, p.lng]);
            }
          }
          setShapeType('Polygon');
          setShapePath(path);
          if (path.length > 0 && path[0]) setMapCenter(path[0]);
        } else if (parsed.type === 'Circle' && parsed.center) {
          setShapeType('Circle');
          setCircleCenter([parsed.center.lat, parsed.center.lng]);
          setCircleRadius(parsed.radius);
          setMapCenter([parsed.center.lat, parsed.center.lng]);
        } else if (parsed.type === 'Rectangle') {
          setShapeType('Rectangle');
          if (parsed.bounds) {
            setRectangleBounds([
              [parsed.bounds.south, parsed.bounds.west],
              [parsed.bounds.north, parsed.bounds.east],
            ]);
          } else if (parsed.points && parsed.points.length === 2) {
            setRectangleBounds([
              [parsed.points[0].lat, parsed.points[0].lng],
              [parsed.points[1].lat, parsed.points[1].lng],
            ]);
          }
        }
      } catch (e) {
        console.warn('Failed to parse polygon value', e);
      }
    }
  }, [value, mode]);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      if (!onLocationDataChange) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        if (data.address) {
          const locationData: {
            address?: string;
            city?: string;
            state?: string;
            country?: string;
          } = {};

          // Build address from available components
          const addressParts = [];
          if (data.address.road) addressParts.push(data.address.road);
          if (data.address.neighbourhood)
            addressParts.push(data.address.neighbourhood);
          if (data.address.city || data.address.town || data.address.village) {
            addressParts.push(
              data.address.city || data.address.town || data.address.village
            );
          }
          if (data.address.county) addressParts.push(data.address.county);

          if (addressParts.length > 0) {
            locationData.address = addressParts.join(', ');
          }

          if (data.address.city || data.address.town || data.address.village) {
            locationData.city =
              data.address.city || data.address.town || data.address.village;
          }
          if (data.address.state) {
            locationData.state = data.address.state;
          }
          if (data.address.country) {
            locationData.country = data.address.country;
          }
          onLocationDataChange(locationData);
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
      }
    },
    [onLocationDataChange]
  );

  const handleMapClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (readOnly || mode !== 'point') return;

      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onChange(`${lat}, ${lng}`);
      reverseGeocode(lat, lng);
    },
    [readOnly, mode, onChange, reverseGeocode]
  );

  const calculateGeodesicArea = (latLngs: L.LatLng[]): number => {
    const earthRadius = 6378137;
    let area = 0;
    const coords = latLngs.map((ll): [number, number] => {
      const lat = ll.lat;
      const lng = ll.lng;
      return [(lat * Math.PI) / 180, (lng * Math.PI) / 180];
    });

    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      const coordI = coords[i];
      const coordJ = coords[j];

      if (coordI && coordJ) {
        const x1 = coordI[0];
        const y1 = coordI[1];
        const x2 = coordJ[0];
        const y2 = coordJ[1];

        if (
          x1 !== undefined &&
          x2 !== undefined &&
          y1 !== undefined &&
          y2 !== undefined
        ) {
          area += (y2 - y1) * (2 + Math.sin(x1) + Math.sin(x2));
        }
      }
    }

    area = Math.abs((area * earthRadius * earthRadius) / 2.0);
    return area;
  };

  const handleCreated = useCallback(
    (e: any) => {
      const layer = e.layer as L.Layer;
      const featureGroup = featureGroupRef.current;
      if (!featureGroup) return;

      featureGroup.clearLayers();
      featureGroup.addLayer(layer);

      const layerType = e.layerType;

      if (layerType === 'polygon') {
        const polygon = layer as L.Polygon;
        const latLngs = polygon.getLatLngs()[0] as L.LatLng[];
        const path = latLngs.map((ll) => [ll.lat, ll.lng] as [number, number]);
        setShapeType('Polygon');
        setShapePath(path);
        onChange(JSON.stringify({ type: 'Polygon', points: path }));

        if (onAreaCalculated) {
          const areaSqM = calculateGeodesicArea(latLngs);
          onAreaCalculated(areaSqM * 10.7639);
        }
      } else if (layerType === 'rectangle') {
        const rectangle = layer as L.Rectangle;
        const bounds = rectangle.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        setRectangleBounds([
          [sw.lat, sw.lng],
          [ne.lat, ne.lng],
        ]);
        setShapeType('Rectangle');

        onChange(
          JSON.stringify({
            type: 'Rectangle',
            bounds: {
              north: ne.lat,
              east: ne.lng,
              south: sw.lat,
              west: sw.lng,
            },
            points: [
              { lat: sw.lat, lng: sw.lng },
              { lat: ne.lat, lng: ne.lng },
            ],
          })
        );

        if (onAreaCalculated) {
          const latLngs: L.LatLng[] = [
            L.latLng(sw.lat, sw.lng),
            L.latLng(sw.lat, ne.lng),
            L.latLng(ne.lat, ne.lng),
            L.latLng(ne.lat, sw.lng),
          ];
          const areaSqM = calculateGeodesicArea(latLngs);
          onAreaCalculated(areaSqM * 10.7639);
        }
      } else if (layerType === 'circle') {
        const circle = layer as L.Circle;
        const center = circle.getLatLng();
        const radius = circle.getRadius();

        setCircleCenter([center.lat, center.lng]);
        setCircleRadius(radius);
        setShapeType('Circle');

        onChange(
          JSON.stringify({
            type: 'Circle',
            center: { lat: center.lat, lng: center.lng },
            radius,
          })
        );

        if (onAreaCalculated) {
          const areaSqM = Math.PI * Math.pow(radius, 2);
          onAreaCalculated(areaSqM * 10.7639);
        }
      }
    },
    [onChange, onAreaCalculated]
  );

  const handleUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);

        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }

        if (mode === 'point' && !readOnly) {
          setMarkerPosition([latitude, longitude]);
          onChange(`${latitude}, ${longitude}`);
        }

        reverseGeocode(latitude, longitude);
      });
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 150);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getZoomLevel = () => {
    if (center) return 14;
    return 10;
  };

  const currentZoom = getZoomLevel();

  const containerStyle = isExpanded
    ? {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '80vh',
        width: '90vw',
        maxWidth: '1000px',
        maxHeight: '700px',
        zIndex: 9999,
        background: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
      }
    : {
        height,
      };

  const mapContainerStyle = isExpanded
    ? {
        width: '100%',
        height: '100%',
        borderRadius: '12px',
      }
    : {
        width: '100%',
        height: '100%',
      };

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-white/20"
      style={containerStyle}
    >
      <div style={mapContainerStyle}>
        <MapContainer
          center={mapCenter}
          zoom={currentZoom}
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url={TILE_LAYERS[mapView].url}
            attribution={TILE_LAYERS[mapView].attribution}
          />

          <MapEvents onClick={handleMapClick} />

          {mode === 'point' && markerPosition && (
            <Marker position={markerPosition} />
          )}

          {mode === 'polygon' && !readOnly && (
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topleft"
                onCreated={handleCreated}
                draw={{
                  rectangle: true,
                  polygon: true,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                }}
              />
            </FeatureGroup>
          )}

          {mode === 'polygon' &&
            shapeType === 'Polygon' &&
            shapePath.length > 0 && (
              <Polygon
                positions={shapePath}
                pathOptions={{
                  color: '#2196F3',
                  fillColor: '#2196F3',
                  fillOpacity: 0.4,
                }}
              />
            )}

          {mode === 'polygon' &&
            shapeType === 'Rectangle' &&
            rectangleBounds && (
              <Rectangle
                bounds={rectangleBounds}
                pathOptions={{
                  color: '#2196F3',
                  fillColor: '#2196F3',
                  fillOpacity: 0.4,
                }}
              />
            )}

          {mode === 'polygon' && shapeType === 'Circle' && circleCenter && (
            <Circle
              center={circleCenter}
              radius={circleRadius}
              pathOptions={{
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.4,
              }}
            />
          )}
        </MapContainer>
      </div>

      {!readOnly && (
        <>
          {/* Expand/Collapse button - positioned below draw controls */}
          <button
            type="button"
            onClick={toggleExpand}
            className={`absolute top-4 right-4 z-[1000] bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors ${isExpanded ? 'px-4 py-2' : 'p-1'} flex items-center gap-2`}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <span className={isExpanded ? 'text-lg' : 'text-sm'}>⛶</span>
            {isExpanded && (
              <span className="text-sm font-semibold">
                {isExpanded ? 'Collapse' : 'Expand'}
              </span>
            )}
          </button>

          {/* Bottom left - Action buttons */}
          <div
            className={`absolute z-[1000] flex gap-2 ${isExpanded ? 'bottom-4 left-4' : 'bottom-6 left-4'}`}
          >
            <button
              type="button"
              onClick={handleUserLocation}
              className={`bg-white text-black rounded-lg shadow-lg hover:bg-gray-100 transition-colors ${isExpanded ? 'px-4 py-2' : 'p-1'} flex items-center gap-2`}
              title="Use My Location"
            >
              <span className={isExpanded ? 'text-xl' : 'text-base'}>📍</span>
              {isExpanded && (
                <span className="text-sm font-semibold">Use My Location</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMapView(mapView === 'normal' ? 'satellite' : 'normal');
              }}
              className={`bg-white text-black rounded-lg shadow-lg hover:bg-gray-100 transition-colors ${isExpanded ? 'px-4 py-2' : 'p-1'} flex items-center gap-2`}
              title={`Current: ${mapView === 'normal' ? 'Normal' : 'Satellite'}`}
            >
              <span className={isExpanded ? 'text-xl' : 'text-base'}>
                {mapView === 'normal' ? '🗺️' : '🛰️'}
              </span>
              {isExpanded && (
                <span className="text-sm font-semibold">
                  {mapView === 'normal' ? 'Normal' : 'Satellite'}
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const MapEvents: React.FC<{ onClick: (e: LeafletMouseEvent) => void }> = ({
  onClick,
}) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

export default LocationPicker;
