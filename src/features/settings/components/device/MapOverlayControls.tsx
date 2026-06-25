import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapOverlayControlsProps {
  mapType: "street" | "satellite";
  onToggleMapType: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onLocationFound?: (lat: number, lon: number) => void;
}

export function MapOverlayControls({
  mapType,
  onToggleMapType,
  isExpanded,
  onToggleExpand,
  onLocationFound,
}: MapOverlayControlsProps) {
  const map = useMap();
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlsRef.current) {
      L.DomEvent.disableClickPropagation(controlsRef.current);
      L.DomEvent.disableScrollPropagation(controlsRef.current);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [isExpanded, map]);

  const handleUserLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const originalTitle = e.currentTarget.getAttribute("title");
    e.currentTarget.setAttribute("title", "Locating...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.flyTo([latitude, longitude], 17, {
            animate: true,
            duration: 1.5,
          });
          if (onLocationFound) onLocationFound(latitude, longitude);
          e.currentTarget.setAttribute("title", originalTitle || "Use My Location");
        },
        (err) => {
          console.error("Geolocation error:", err);
          let errorMsg = "Unable to get location.";
          if (err.code === 1)
            errorMsg =
              "Location permission denied. Please enable location in your browser settings and refresh.";
          else if (err.code === 2) errorMsg = "Location unavailable.";
          else if (err.code === 3) errorMsg = "Location request timed out.";
          alert(errorMsg);
          e.currentTarget.setAttribute("title", originalTitle || "Use My Location");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div ref={controlsRef} className="absolute inset-0 pointer-events-none z-[1000]">
      {/* Bottom Left: Location Button */}
      <div className="absolute bottom-6 left-3 pointer-events-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={handleUserLocation}
          className={`flex items-center justify-center rounded-xl border border-cardBorder bg-[#1a1c1e] text-textHeading shadow-lg shadow-black/40 hover:bg-[#25282c] transition-all active:scale-95 group ${isExpanded ? "px-4 py-2 gap-2 h-11" : "h-10 w-10"}`}
          title="Use My Location"
        >
          <span
            className={`${isExpanded ? "text-xl" : "text-lg"} transition-transform group-active:scale-125`}
          >
            📍
          </span>
          {isExpanded && (
            <span className="text-sm font-bold whitespace-nowrap">Use My Location</span>
          )}
        </button>
      </div>

      {/* Bottom Right: Expand and Satellite Controls */}
      <div className="absolute bottom-6 right-3 flex flex-col gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={onToggleExpand}
          className={`flex items-center justify-center rounded-lg border border-cardBorder bg-[#1a1c1e] text-textHeading shadow-lg shadow-black/40 hover:bg-[#25282c] transition-all active:scale-95 ${isExpanded ? "px-3 py-2 gap-2 h-10" : "h-9 w-9"}`}
          title={isExpanded ? "Collapse Map" : "Expand Map"}
        >
          <span className="text-base">{isExpanded ? "✖" : "⛶"}</span>
          {isExpanded && <span className="text-xs font-bold whitespace-nowrap">Collapse</span>}
        </button>

        <button
          type="button"
          onClick={onToggleMapType}
          className={`flex items-center justify-center rounded-lg border border-cardBorder bg-[#1a1c1e] text-textHeading shadow-lg shadow-black/40 hover:bg-[#25282c] transition-all active:scale-95 ${isExpanded ? "px-3 py-2 gap-2 h-10" : "h-9 w-9"}`}
          title={mapType === "street" ? "Switch to Satellite" : "Switch to Street View"}
        >
          <span className="text-base">{mapType === "street" ? "🛰️" : "🗺️"}</span>
          {isExpanded && (
            <span className="text-xs font-bold whitespace-nowrap">
              {mapType === "street" ? "Satellite" : "Normal"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
