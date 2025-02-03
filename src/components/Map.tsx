import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import LineSelector from "./LineSelector";
import VehicleMarker from "./VehicleMarker";
import StopMarker from "./StopMarker";
import { useLineStore } from "../hooks/useLineStore";
import lines from "../utils/lines";
import useLine from "../hooks/useLine";
import LoadingOverlay from "./LoadingOverlay";

export default function Map() {
  const data = useLine();
  const lineId = useLineStore((state) => state.id);

  return (
    <>
      <MapContainer
        className="relative w-screen h-full"
        center={[48.208176, 16.373819]}
        zoom={13}
        minZoom={12}
      >
        <LineSelector trafficInfos={data?.trafficInfos ?? []} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data source: <a href="https://data.wien.gv.at">Stadt Wien</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data ? (
          <>
            <Polyline
              pathOptions={{ color: lines[lineId].color }}
              positions={data.stations.map((s) => s.coordinates)}
            />
            {data.stations.map((s, i) => (
              <StopMarker key={i} type={lines[lineId].type} station={s} />
            ))}
            {data.trains.map((t, i) => (
              // Index really not ideal as a key, but I don't have a unique id for each train
              <VehicleMarker key={i} type={lines[lineId].type} train={t} />
            ))}
          </>
        ) : (
          <LoadingOverlay />
        )}
      </MapContainer>
    </>
  );
}
