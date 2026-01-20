import { Layer, Marker, Popup, Source } from "react-map-gl/maplibre";
import FelixIcon from "../assets/felix.png";
import SilberpfeilIcon from "../assets/silberpfeil.png";
import StationIcon from "../assets/metro-station.svg";
import { useEffect, useRef, useState } from "react";
import { useLineStore } from "@/hooks/useLineStore";
import type { Station, Train } from "@/types/api";
import { cn, getRelativeSeconds } from "@/lib/utils";
import useCountdown from "@/hooks/useCountdown";
import { Accessibility } from "lucide-react";
import type { AnimatedMarkerRef } from "./AnimatedMarker";
import AnimatedMarker from "./AnimatedMarker";

function VehicleMarker({ train }: { train: Train }) {
  const markerRef = useRef<AnimatedMarkerRef>(null);
  const arrivingIn = useCountdown(
    train.arrivingAt ? getRelativeSeconds(new Date(train.arrivingAt)) : 0,
  );

  useEffect(() => {
    if (!markerRef.current) return;

    const isMoving = markerRef.current.isMoving();
    if (
      (isMoving && train.arrivingAt !== null) ||
      (!isMoving && train.arrivingAt === null)
    )
      return;

    markerRef.current.moveTo(
      {
        lat: train.nextCoords[0],
        lng: train.nextCoords[1],
      },
      train.arrivingAt
        ? (getRelativeSeconds(new Date(train.arrivingAt)) - 10) * 1000
        : 500,
    );
  }, [train.nextCoords, markerRef.current]);

  return (
    <>
      <AnimatedMarker
        ref={markerRef}
        popupContent={
          <>
            {import.meta.env.DEV && (
              <>
                {train.id} <br />
                Next stop: {train.nextStopId} <br />
                Current stop: {train.currentStopId} <br />
              </>
            )}
            {train.description}
            {train.arrivingAt && (
              <>
                <br /> Arriving in &lt; {arrivingIn}s
              </>
            )}
            {train.barrierFree && (
              <Accessibility className="bg-blue-600 rounded-full stroke-white p-[2px] size-5 mt-1" />
            )}
          </>
        }
        initialLat={train.previousCoords[0]}
        initialLng={train.previousCoords[1]}
      >
        <img
          src={train.barrierFree ? FelixIcon.src : SilberpfeilIcon.src}
          className={cn("w-10", train.arrivingAt && "animate-pulse")}
        />
      </AnimatedMarker>
    </>
  );
}

function StationMarker({
  station,
  onClick,
}: {
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
      <img src={StationIcon.src} className="w-5" />
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
      : 0,
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
  const activeLine = useLineStore((state) => state.activeRoute);
  const activeLineData = useLineStore((state) => state.data);
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  if (!activeLineData || !activeLine) return <></>;

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
            "line-color": activeLine.getColor(),
            "line-width": 5,
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
          station={station}
          onClick={() => {
            setActiveStation(station);
          }}
        />
      ))}
      {activeLineData.trains.map((train) => (
        <VehicleMarker key={train.id} train={train} />
      ))}
    </>
  );
}
