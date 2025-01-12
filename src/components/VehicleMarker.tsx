import L from "leaflet";
import { Popup } from "react-leaflet";
import type { Train } from "../types/api";
import DriftMarker from "react-leaflet-drift-marker";
import { getRelativeSeconds } from "../utils/misc";
import useCountdown from "../hooks/useCountdown";

interface Props {
  train: Train;
}

export default function VehicleMarker({ train }: Props) {
  const arrivingIn = useCountdown(
    train.arrivingAt ? getRelativeSeconds(new Date(train.arrivingAt)) : 0
  );

  return (
    <DriftMarker
      icon={L.icon({
        iconUrl: "/icons/ubahn.png",
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
