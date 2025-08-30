import { Layer, Marker, Popup, Source } from "react-map-gl/maplibre";
import MetroIcon from "../assets/felix.png";
import StationIcon from "../assets/metro-station.svg";
import { useEffect, useState } from "react";
import { useLineStore } from "@/hooks/useLineStore";
import type { Station, Train } from "@/types/api";
import { cn, getRelativeSeconds } from "@/lib/utils";
import useCountdown from "@/hooks/useCountdown";
import { Accessibility } from "lucide-react";
import lines from "@/lib/lines";

function VehicleMarker({ train }: { train: Train }) {
  const [position, setPosition] = useState({
    lat: train.previousCoords[0],
    lng: train.previousCoords[1],
  });
  const [isMoving, setIsMoving] = useState(false);
  const arrivingIn = useCountdown(
    train.arrivingAt ? getRelativeSeconds(new Date(train.arrivingAt)) : 0
  );
  const [isPopupShowing, setIsPopupShowing] = useState(false);

  const moveMarker = (
    newPos: { lat: number; lng: number },
    duration: number
  ) => {
    setIsMoving(true);
    const start = position;
    const end = newPos;
    const startTime = performance.now();

    function animate(time: number) {
      const t = Math.min((time - startTime) / duration, 1);
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      setPosition({ lat, lng });

      if (t < 1) requestAnimationFrame(animate);
      else setIsMoving(false);
    }

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (
      train.previousCoords[0] == train.nextCoords[0] &&
      train.previousCoords[0] == train.nextCoords[0]
    )
      return;

    if (
      (isMoving && train.arrivingAt !== null) ||
      (!isMoving && train.arrivingAt === null)
    )
      return;

    moveMarker(
      {
        lat: train.nextCoords[0],
        lng: train.nextCoords[1],
      },
      train.arrivingAt
        ? (getRelativeSeconds(new Date(train.arrivingAt)) - 10) * 1000
        : 500
    );
  }, [train.nextCoords]);

  return (
    <>
      <Marker
        latitude={position.lat}
        longitude={position.lng}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setIsPopupShowing(true);
        }}
      >
        <img
          src={MetroIcon.src}
          className={cn("w-10", train.arrivingAt && "animate-pulse")}
        />
      </Marker>
      {isPopupShowing && (
        <Popup
          latitude={position.lat}
          longitude={position.lng}
          onClose={() => setIsPopupShowing(false)}
        >
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
        </Popup>
      )}
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
  const activeLineId = useLineStore((state) => state.id);
  const activeLineData = useLineStore((state) => state.data);
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  if (!activeLineData || !activeLineId) return <></>;

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
            "line-color": lines[activeLineId].color,
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
