import { Layer, Marker, Popup, Source } from "react-map-gl/maplibre";
import FelixIcon from "../assets/felix.png";
import SilberpfeilIcon from "../assets/silberpfeil.png";
import StationIcon from "../assets/metro-station.svg";
import { useEffect, useRef, useState } from "react";
import { useRouteStore } from "@/hooks/useRouteStore";
import type { LineType, Station, Vehicle } from "@/types/api";
import { cn, getRelativeSeconds } from "@/lib/utils";
import useCountdown from "@/hooks/useCountdown";
import { Accessibility } from "lucide-react";
import type { AnimatedMarkerRef } from "./AnimatedMarker";
import AnimatedMarker from "./AnimatedMarker";
import type Route from "@/lib/route";

function VehicleMarker({ route, vehicle }: { route: Route; vehicle: Vehicle }) {
  const markerRef = useRef<AnimatedMarkerRef>(null);
  const arrivingIn = useCountdown(
    vehicle.arrivingAt ? getRelativeSeconds(new Date(vehicle.arrivingAt)) : 0
  );

  useEffect(() => {
    if (!markerRef.current) return;

    const isMoving = markerRef.current.isMoving();
    if (isMoving && vehicle.arrivingAt !== null) return;

    markerRef.current.moveTo(
      {
        lat: vehicle.nextCoords[0],
        lng: vehicle.nextCoords[1],
      },
      vehicle.arrivingAt
        ? (getRelativeSeconds(new Date(vehicle.arrivingAt)) - 10) * 1000
        : 500
    );
  }, [vehicle.nextCoords, markerRef.current]);

  return (
    <>
      <AnimatedMarker
        ref={markerRef}
        popupContent={
          <>
            {import.meta.env.DEV && (
              <>
                {vehicle.id} <br />
                Next stop: {vehicle.nextStopId} <br />
                Current stop: {vehicle.currentStopId} <br />
              </>
            )}
            {vehicle.description}
            {vehicle.arrivingAt && (
              <>
                <br /> Arriving in &lt; {arrivingIn}s
              </>
            )}
            {vehicle.barrierFree && (
              <Accessibility className="bg-blue-600 rounded-full stroke-white p-[2px] size-5 mt-1" />
            )}
          </>
        }
        initialLat={vehicle.previousCoords[0]}
        initialLng={vehicle.previousCoords[1]}
      >
        {route.getLine().type === "ptMetro" ? (
          <img
            src={vehicle.barrierFree ? FelixIcon.src : SilberpfeilIcon.src}
            className={cn("w-10", vehicle.arrivingAt && "animate-pulse")}
          />
        ) : (
          <div className="bg-orange-400 border-2 border-white w-5 h-5 rounded-full" />
        )}
      </AnimatedMarker>
    </>
  );
}

function StationMarker({
  route,
  station,
  onClick,
}: {
  route: Route;
  station: Station;
  onClick: () => void;
}) {
  return (
    <Marker
      latitude={station.coordinates[0]}
      longitude={station.coordinates[1]}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      {route.getLine().type === "ptMetro" ? (
        <img src={StationIcon.src} className="w-5" />
      ) : (
        <div
          className="flex items-center justify-center w-4 h-4 rounded-full text-white font-bold"
          style={{ backgroundColor: route.getColor() }}
        >
          <p>H</p>
        </div>
      )}
    </Marker>
  );
}

function StationPopup({
  station,
  onClose,
}: {
  station: Station;
  onClose: () => void;
}) {
  const nextDepature = useCountdown(
    station.nextDepature
      ? getRelativeSeconds(new Date(station.nextDepature))
      : 0
  );

  return (
    <Popup
      anchor="top"
      latitude={station.coordinates[0]}
      longitude={station.coordinates[1]}
      onClose={onClose}
    >
      {import.meta.env.DEV && (
        <>
          {station.id} <br />
        </>
      )}
      {station.description}
      <br />
      Next depature: {nextDepature}s
      {station.barrierFree && (
        <Accessibility className="bg-blue-600 rounded-full stroke-white p-[2px] size-5 mt-1" />
      )}
    </Popup>
  );
}

export default function LineMapOverlay() {
  const activeRoute = useRouteStore((state) => state.active);
  const activeLineData = useRouteStore((state) => state.data);
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  if (!activeLineData || !activeRoute) return <></>;

  const lineType = activeRoute.getLine().type;
  return (
    <>
      <Source
        id="polylineLayer"
        type="geojson"
        data={{
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: activeLineData.stations.map((s) => [
              s.coordinates[1],
              s.coordinates[0],
            ]),
          },
        }}
      >
        <Layer
          id="lineLayer"
          type="line"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": activeRoute.getColor(),
            "line-width": 3,
          }}
        />
      </Source>
      {activeStation && (
        <StationPopup
          station={activeStation}
          onClose={() => setActiveStation(null)}
        />
      )}
      {activeLineData.stations.map((station) => (
        <StationMarker
          key={station.id}
          route={activeRoute}
          station={station}
          onClick={() => {
            setActiveStation(station);
          }}
        />
      ))}
      {activeLineData.vehicles.map((vehicle) => (
        <VehicleMarker key={vehicle.id} route={activeRoute} vehicle={vehicle} />
      ))}
    </>
  );
}
