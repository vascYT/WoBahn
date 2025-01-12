import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { getRelativeSeconds } from "../utils/misc";
import type { LineType, Station } from "../types/api";
import useCountdown from "../hooks/useCountdown";

const iconUrls: Record<LineType, string> = {
  metro: "/icons/metro-station.svg",
  bus: "/icons/metro-station.svg",
  tram: "/icons/metro-station.svg",
};

interface Props {
  type: LineType;
  station: Station;
}

export default function StopMarker({ type, station }: Props) {
  const nextDepature = useCountdown(
    station.nextDepature
      ? getRelativeSeconds(new Date(station.nextDepature))
      : 0
  );

  return (
    <Marker
      icon={L.icon({
        iconUrl: iconUrls[type],
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
