import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import useLocations from "../hooks/useLocations";
import LineSelector from "./LineSelector";
import VehicleMarker from "./VehicleMarker";
import StopMarker from "./StopMarker";
import { useLineStore } from "../hooks/useLineStore";
import lines from "../utils/lines";

export default function Map() {
  const { data } = useLocations();
  const lineId = useLineStore((state) => state.id);

  return (
    <>
      <LineSelector />
      <MapContainer
        className="w-screen h-screen"
        center={[48.208176, 16.373819]}
        zoom={13}
        minZoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && (
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
        )}
      </MapContainer>
    </>
  );
}
