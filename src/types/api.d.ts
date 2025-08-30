import type { LatLngTuple } from "leaflet";
import type lines from "../lib/lines";
import type { TrafficInfo } from "./wiener_linien";

export type LineRes = {
  stations: Station[];
  trains: Train[];
  trafficInfos: TrafficInfo[];
  lastUpdate: string;
};

export type LineType = "metro" | "tram" | "bus";

export type Station = {
  id: number;
  description: string;
  coordinates: LatLngTuple;
  nextDepature: string | null;
  barrierFree: boolean;
};

export type Train = {
  id: string;
  description: string;
  previousCoords: LatLngTuple;
  nextCoords: LatLngTuple;
  arrivingAt: string | null;
  barrierFree: boolean;
  currentStopId: number | null;
  nextStopId: number;
};
