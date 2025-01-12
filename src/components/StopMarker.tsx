import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { getRelativeSeconds } from "../utils/misc";
import type { Station } from "../types/api";
import useCountdown from "../hooks/useCountdown";

interface Props {
  station: Station;
}

export default function StopMarker({ station }: Props) {
  const nextDepature = useCountdown(
    station.nextDepature
      ? getRelativeSeconds(new Date(station.nextDepature))
      : 0
  );

  return (
    <Marker
      icon={L.icon({
        iconUrl: "/icons/station.svg",
        iconSize: [20, 20],
      })}
      position={station.coordinates}
    >
      <Popup>
        {station.description}
        <br />
        Next depature: {nextDepature}s
      </Popup>
    </Marker>
  );
}
