import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  FeatureGroup,
  useMapEvents,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  mode: 'point' | 'polygon';
  value: any; // string for point "lat,lng", stringified JSON for polygon
  onChange: (value: any) => void; // returns "lat,lng" or stringified GeoJSON/latlngs
  height?: string;
  readOnly?: boolean | undefined;
  center?: [number, number] | undefined; // Default center if no value
  onAreaCalculated?: ((sqFt: number) => void) | undefined;
}

// Component to handle map clicks for Point mode
const LocationMarker = ({ position, setPosition, onChange, readOnly }: any) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (readOnly) return;
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange(`${lat}, ${lng}`);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

// Component to handle "Locate Me" or centering
const RecenterMap = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 15);
    }
  }, [center, map, zoom]);
  return null;
};

// Helper for spherical area calculation (fallback if L.GeometryUtil not available)
const calculateGeodesicArea = (latLngs: L.LatLng[]) => {
  // Try to use Leaflet.GeometryUtil if available (from leaflet-draw)
  if ((L as any).GeometryUtil && (L as any).GeometryUtil.geodesicArea) {
    return (L as any).GeometryUtil.geodesicArea(latLngs);
  }

  // Simple fallback for spherical area (Shoelace formula-ish approximation for small areas or proper implementation)
  // Using a simplified version for now, essentially assuming planar for very small fields if util missing,
  // but ideally we want spherical.
  // Let's rely on the fact that leaflet-draw is installed and usually patches L.
  console.warn(
    'L.GeometryUtil.geodesicArea not found, area calculation might be inaccurate.'
  );
  return 0;
};

const LocationPicker = ({
  mode,
  value,
  onChange,
  height = '400px',
  readOnly = false,
  center: defaultCenter,
  onAreaCalculated,
}: LocationPickerProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    defaultCenter || [20.5937, 78.9629]
  ); // Default to India center
  const [zoom, setZoom] = useState(5);
  const featureGroupRef = useRef<any>(null);

  // Initialize state from value
  useEffect(() => {
    if (mode === 'point' && value) {
      const [lat, lng] = value
        .split(',')
        .map((c: string) => parseFloat(c.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
        setMapCenter([lat, lng]);
        setZoom(15);
      }
    }
    // For polygon, we handle initialization in Draw onCreated/onEdited if possible or separate layer logic
    // Handling pre-loaded polygon display requires parsing the value causing Draw control initialization issues
    // For now simpler implementation mainly focuses on CREATING new.
  }, [value, mode]);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    if (mode === 'polygon') {
      // Capture the shape logic
      // We can store as GeoJSON or just latlngs.
      // For simplicity/compatibility with "coordinates" text field, we'll store latlngs array string
      // Or checking if it is rectangle/circle
      const type = e.layerType;
      let coords;

      if (type === 'circle') {
        const latlng = layer.getLatLng();
        const rad = layer.getRadius();
        coords = { type: 'Circle', center: latlng, radius: rad };

        if (onAreaCalculated) {
          // Area of circle = PI * r^2 (in sq meters)
          const areaSqM = Math.PI * Math.pow(rad, 2);
          const areaSqFt = areaSqM * 10.7639;
          onAreaCalculated(areaSqFt);
        }
      } else {
        // Polygon, Rectangle
        // latlngs is array of array for polygon
        const latlngs = layer.getLatLngs()[0];
        coords = {
          type: type === 'rectangle' ? 'Rectangle' : 'Polygon',
          points: latlngs,
        };

        if (onAreaCalculated) {
          const areaSqM = calculateGeodesicArea(latlngs);
          const areaSqFt = areaSqM * 10.7639;
          onAreaCalculated(areaSqFt);
        }
      }
      onChange(JSON.stringify(coords));
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const userPos: [number, number] = [latitude, longitude];
        setMapCenter(userPos);
        setZoom(16);
        if (mode === 'point' && !readOnly) {
          setPosition(userPos);
          onChange(`${latitude}, ${longitude}`);
        }
      });
    } else {
      alert('Geolocation not supported');
    }
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-white/20"
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={mapCenter} zoom={zoom} />

        {mode === 'point' && (
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onChange={onChange}
            readOnly={readOnly}
          />
        )}

        {mode === 'polygon' && !readOnly && (
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              // onEdited={...} // Complex to sync back to state for now
              // onDeleted={...}
              draw={{
                rectangle: true,
                polygon: true,
                circle: true,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>
        )}
      </MapContainer>

      {!readOnly && (
        <button
          type="button"
          onClick={getUserLocation}
          className="absolute bottom-4 left-4 z-[999] bg-white text-black p-2 rounded shadow-lg text-xs font-bold flex items-center gap-1 hover:bg-gray-100"
        >
          📍 Use My Location
        </button>
      )}
    </div>
  );
};

export default LocationPicker;
