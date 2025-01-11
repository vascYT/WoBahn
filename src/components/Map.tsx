import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import useLocations from "../hooks/useLocations";
import LineSelector from "./LineSelector";

export default function Map() {
  const { data } = useLocations();

  return (
    <>
      <LineSelector />
      <MapContainer
        className="w-screen h-screen"
        center={[48.208176, 16.373819]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && (
          <>
            {data.stationCoordinates.map((c, i) => (
              <Marker
                key={i}
                icon={L.icon({
                  iconUrl: "/icons/station.svg",
                  iconSize: [20, 20],
                })}
                position={c}
              />
            ))}
            {data.trainCoordinates.map((c, i) => (
              <Marker
                key={i}
                icon={L.icon({
                  iconUrl: "/icons/ubahn.png",
                  iconSize: [40, 26],
                })}
                position={c}
              />
            ))}
          </>
        )}
      </MapContainer>
    </>
  );
}
