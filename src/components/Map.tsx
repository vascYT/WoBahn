import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import useLocations from "../hooks/useLocations";
import LineSelector from "./LineSelector";
import VehicleMarker from "./VehicleMarker";
import StopMarker from "./StopMarker";

export default function Map() {
  const { data } = useLocations();

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
              pathOptions={{ color: "blue" }}
              positions={data.stations.map((s) => s.coordinates)}
            />
            {data.stations.map((s, i) => (
              <StopMarker key={i} station={s} />
            ))}
            {data.trains.map((t, i) => (
              // Index really not ideal as a key, but I don't have a unique id for each train
              <VehicleMarker key={i} train={t} />
            ))}
          </>
        )}
      </MapContainer>
    </>
  );
}
