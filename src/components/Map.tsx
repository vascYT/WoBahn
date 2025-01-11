import L, { type LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import useLocations from "../hooks/useLocations";

interface Props {
  stopCoordinates: LatLngExpression[];
}
export default function Map(props: Props) {
  const { data } = useLocations();

  return (
    <MapContainer
      className="w-screen h-screen"
      center={props.stopCoordinates[0]}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.stopCoordinates.map((c) => (
        <Marker
          icon={L.icon({
            iconUrl: "/icons/station.svg",
            iconSize: [20, 20],
          })}
          position={c}
        >
          <Popup>UBahn Station</Popup>
        </Marker>
      ))}
      {data?.coordinates &&
        data.coordinates.map((c) => (
          <Marker
            icon={L.icon({
              iconUrl: "/icons/ubahn.png",
              iconSize: [40, 26],
            })}
            position={c}
          />
        ))}
    </MapContainer>
  );
}
