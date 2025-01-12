import L from "leaflet";
import { Popup } from "react-leaflet";
import type { TrainLocation } from "../types/api";
import { useMemo } from "react";
import DriftMarker from "react-leaflet-drift-marker";
import { getRelativeSeconds } from "../utils/misc";

interface Props {
  previousLocation: TrainLocation;
  location: TrainLocation;
}

export default function VehicleMarker({ previousLocation, location }: Props) {
  const arrivingIn = useMemo(
    () =>
      location.arrivingAt
        ? getRelativeSeconds(new Date(location.arrivingAt))
        : null,
    [location.arrivingAt]
  );

  return (
    <DriftMarker
      icon={L.icon({
        iconUrl: "/icons/ubahn.png",
        iconSize: [40, 26],
        className: arrivingIn ? "animate-pulse" : undefined,
      })}
      duration={1000}
      position={location.coordinates}
    >
      <Popup>
        {location.description}
        {arrivingIn && (
          <>
            <br /> Arriving in {arrivingIn}s
          </>
        )}
      </Popup>
    </DriftMarker>
  );
}
