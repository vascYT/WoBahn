import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import LineSelector from "./LineSelector";
import VehicleMarker from "./VehicleMarker";
import StationMarker from "./StationMarker";
import { useLineStore } from "../hooks/useLineStore";
import lines from "../lib/lines";
import useLine from "../hooks/useLine";
import LoadingOverlay from "./LoadingOverlay";
import TrafficInfos from "./TrafficInfos";

export default function Map() {
  const data = useLine();
  const lineId = useLineStore((state) => state.id);

  return (
    <>
      <MapContainer
        className="relative w-screen grow outline-none"
        center={[48.208176, 16.373819]}
        zoom={13}
        minZoom={12}
      >
        <div className="absolute top-0 right-0 z-[600] flex flex-col items-end p-1">
          <LineSelector />
          {data?.trafficInfos && (
            <TrafficInfos trafficInfos={data.trafficInfos} />
          )}
        </div>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data source: <a href="https://data.wien.gv.at">Stadt Wien</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark:brightness-75 dark:contrast-125 dark:hue-rotate-180 dark:invert transition-all duration-300"
        />
        {data ? (
          <>
            <Polyline
              pathOptions={{ color: lines[lineId].color }}
              positions={data.stations.map((s) => s.coordinates)}
            />
            {data.stations.map((s) => (
              <StationMarker key={s.id} type={lines[lineId].type} station={s} />
            ))}
            {data.trains.map((t) => (
              <VehicleMarker key={t.id} type={lines[lineId].type} train={t} />
            ))}
          </>
        ) : (
          <LoadingOverlay />
        )}
      </MapContainer>
    </>
  );
}
