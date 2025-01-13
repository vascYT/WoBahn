import type lines from "../utils/lines";
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
};

export type Train = {
  description: string;
  coordinates: LatLngExpression;
  arrivingAt: string | null;
};
