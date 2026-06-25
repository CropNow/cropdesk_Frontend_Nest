import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, FeatureGroup, Marker, Polygon } from "react-leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";
import L from "leaflet";
import { MapOverlayControls } from "./MapOverlayControls";
import { calculateGeodesicArea, squareMetersToAcres } from "@shared/utils/mapUtils";

const blueDotIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div style="
      width: 14px;
      height: 14px;
      background: #4285F4;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(66, 133, 244, 0.6);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 50%;
        background: rgba(66, 133, 244, 0.4);
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }
    </style>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

interface FieldBoundaryMapProps {
  boundaryCoordinates: [number, number][];
  onBoundaryChange: (coords: [number, number][], areaAcres: string) => void;
}

export function FieldBoundaryMap({ boundaryCoordinates, onBoundaryChange }: FieldBoundaryMapProps) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  const handlePolygonGeometry = (layer: any) => {
    if (layer && layer.getLatLngs) {
      let latlngs = layer.getLatLngs();
      if (latlngs && latlngs.length > 0 && Array.isArray(latlngs[0])) {
        latlngs = latlngs[0];
      }
      const coords: [number, number][] = latlngs.map((ll: any) => [ll.lng, ll.lat]);

      if (coords.length > 0) {
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          coords.push([...first]);
        }
      }

      // Convert leaflet latlngs to mapUtils LatLngLike form
      const formattedLatLngs = latlngs.map((ll: any) => ({
        lat: ll.lat,
        lng: ll.lng,
      }));

      const areaSqM = calculateGeodesicArea(formattedLatLngs);
      const areaAcres = squareMetersToAcres(areaSqM).toFixed(2);

      onBoundaryChange(coords, areaAcres);
    }
  };

  const mapComponent = (expanded: boolean) => (
    <MapContainer
      center={
        userLocation ||
        (boundaryCoordinates?.[0]
          ? [boundaryCoordinates[0][1], boundaryCoordinates[0][0]]
          : [12.9716, 77.5946])
      }
      zoom={expanded ? 16 : 13}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    >
      <TileLayer
        url={
          mapType === "street"
            ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        }
        attribution={
          mapType === "street"
            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            : "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }
      />
      <MapOverlayControls
        isExpanded={expanded}
        mapType={mapType}
        onToggleExpand={() => {
          setIsMapExpanded(!expanded);
        }}
        onToggleMapType={() => {
          setMapType((prev) => (prev === "street" ? "satellite" : "street"));
        }}
        onLocationFound={(lat, lng) => setUserLocation([lat, lng])}
      />
      {userLocation && <Marker position={userLocation} icon={blueDotIcon} />}
      {boundaryCoordinates && boundaryCoordinates.length > 0 && (
        <Polygon
          positions={boundaryCoordinates.map((coord) => [coord[1], coord[0]])}
          pathOptions={{
            color: "#00FF9C",
            fillColor: "#00FF9C",
            fillOpacity: 0.2,
          }}
        />
      )}
      <FeatureGroup>
        <GeomanControls
          options={{
            position: "topright",
            drawText: false,
            drawCircle: false,
            drawCircleMarker: false,
            drawMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawPolygon: true,
            editMode: true,
            dragMode: false,
            cutPolygon: false,
            removalMode: true,
            rotateMode: false,
          }}
          globalOptions={{
            continueDrawing: false,
            editable: true,
            pathOptions: {
              color: "#00FF9C",
              fillColor: "#00FF9C",
              fillOpacity: 0.2,
            },
          }}
          onCreate={(e: any) => handlePolygonGeometry(e.layer)}
          onChange={(e: any) => handlePolygonGeometry(e.layer)}
          onUpdate={(e: any) => handlePolygonGeometry(e.layer)}
          onMapRemove={() => {
            onBoundaryChange([], "0.00");
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );

  return (
    <>
      <div className="relative z-[1] h-64 w-full overflow-hidden rounded-2xl border border-cardBorder bg-bgInput">
        {mapComponent(false)}
      </div>

      {isMapExpanded &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 p-4 sm:p-8">
            <div className="relative h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-[2.5rem] border border-borderColor bg-bgCard shadow-2xl animate-in zoom-in-95 duration-300">
              {mapComponent(true)}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
