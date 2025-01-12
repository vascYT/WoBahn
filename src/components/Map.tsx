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
              <Marker
                key={i}
                icon={L.icon({
                  iconUrl: "/icons/station.svg",
                  iconSize: [20, 20],
                })}
                position={s.coordinates}
              >
                <Popup>{s.description}</Popup>
              </Marker>
            ))}
            {data.trains.map((t, i) => (
              <VehicleMarker key={i} previousLocation={t} location={t} />
            ))}
          </>
        )}
      </MapContainer>
    </>
  );
}
