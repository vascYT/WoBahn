import L from "leaflet";
import { Popup } from "react-leaflet";
import type { LineType, Train } from "../types/api";
import DriftMarker from "react-leaflet-drift-marker";
import { getRelativeSeconds } from "../utils/misc";
import useCountdown from "../hooks/useCountdown";

const iconUrls: Record<LineType, string> = {
  metro: "/icons/metro.png",
  bus: "/icons/metro.png",
  tram: "/icons/metro.png",
};

interface Props {
  type: LineType;
  train: Train;
}

export default function VehicleMarker({ type, train }: Props) {
  const arrivingIn = useCountdown(
    train.arrivingAt ? getRelativeSeconds(new Date(train.arrivingAt)) : 0
  );

  return (
    <DriftMarker
      icon={L.icon({
        iconUrl: iconUrls[type],
        iconSize: [40, 26],
        className: arrivingIn ? "animate-pulse" : undefined,
      })}
      duration={1000}
      position={train.coordinates}
    >
      <Popup>
        {train.description}
        {train.arrivingAt && (
          <>
            <br /> Arriving in &lt; {arrivingIn}s
          </>
        )}
      </Popup>
    </DriftMarker>
  );
}
