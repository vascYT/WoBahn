import L from "leaflet";
import { Popup } from "react-leaflet";
import type { LineType, Train } from "../types/api";
import DriftMarker from "react-leaflet-drift-marker";
import { getRelativeSeconds } from "@/lib/utils";
import useCountdown from "../hooks/useCountdown";
import { Accessibility } from "lucide-react";
import { useEffect, useState } from "react";

const iconUrls: Record<LineType, string[]> = {
  metro: ["/icons/silberpfeil.png", "/icons/felix.png"],
  bus: ["/icons/silberpfeil.png", "/icons/felix.png"],
  tram: ["/icons/silberpfeil.png", "/icons/felix.png"],
};

interface Props {
  type: LineType;
  train: Train;
}

export default function VehicleMarker({ type, train }: Props) {
  const arrivingIn = useCountdown(
    train.arrivingAt ? getRelativeSeconds(new Date(train.arrivingAt)) : 0
  );
  const [position, setPosition] = useState(train.previousStopCoords);
  const [duration, setDuration] = useState(500);

  useEffect(() => {
    setDuration(
      train.arrivingAt
        ? getRelativeSeconds(new Date(train.arrivingAt)) * 750
        : 500
    );
    setPosition(train.nextStopCoords);
  }, [train.nextStopCoords]);

  return (
    <DriftMarker
      icon={L.icon({
        iconUrl: iconUrls[type][train.barrierFree ? 1 : 0],
        iconSize: [40, 26],
        className: arrivingIn ? "animate-pulse" : undefined,
      })}
      duration={duration}
      position={position}
    >
      <Popup>
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
    </DriftMarker>
  );
}
