import type { LatLngExpression } from "leaflet";
import type lines from "../lib/lines";
import type { TrafficInfo } from "./wiener_linien";

export type LineRes = {
  stations: Station[];
  trains: Train[];
  trafficInfos: TrafficInfo[];
};

export type LineType = "metro" | "tram" | "bus";

export type Station = {
  description: string;
  coordinates: LatLngExpression;
  nextDepature: string | null;
  barrierFree: boolean;
};

export type Train = {
  id: string;
  description: string;
  previousStopCoords: LatLngExpression;
  nextStopCoords: LatLngExpression;
  arrivingAt: string | null;
  barrierFree: boolean;
  nextStopId: id;
};
