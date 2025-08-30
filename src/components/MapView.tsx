import { useLineFetcher } from "@/hooks/useLineStore";
import Map, { GeolocateControl } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { layers, namedFlavor } from "@protomaps/basemaps";
import { useEffect } from "react";
import LineMapOverlay from "./LineMapOverlay";

export default function MapView() {
  useLineFetcher();

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: 16.373819,
        latitude: 48.208176,
        zoom: 12,
      }}
      style={{ flexGrow: 1, width: "100vw" }}
      maxBounds={[
        [16.114197, 48.063397],
        [16.638794, 48.356249],
      ]}
      minZoom={10}
      mapStyle={{
        version: 8,
        sources: {
          vienna: {
            type: "vector",
            url: "pmtiles://https://r2.vasc.dev/vienna.pmtiles",
            attribution:
              '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> | Data source: <a href="https://data.wien.gv.at">Stadt Wien</a>',
          },
        },
        glyphs:
          "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
        sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
        layers: layers("vienna", namedFlavor("light"), { lang: "en" }),
      }}
    >
      <LineMapOverlay />
      <GeolocateControl
        trackUserLocation
        showAccuracyCircle={false}
        positionOptions={{ enableHighAccuracy: true }}
      />
    </Map>
  );
}
