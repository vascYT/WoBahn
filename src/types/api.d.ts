import type { LatLngTuple } from "leaflet";
import type lines from "../lib/lines";
import type { TrafficInfo } from "./wiener_linien";

export type RouteRes = {
  stations: Station[];
  vehicles: Vehicle[];
  trafficInfos: TrafficInfo[];
  lastUpdate: string;
};

export type LineType =
  | "ptTramWLB"
  | "ptMetro"
  | "ptTram"
  | "ptBusCity"
  | "ptBusNight";

export type Station = {
  id: number;
  description: string;
  coordinates: LatLngTuple;
  nextDepature: string | null;
  barrierFree: boolean;
};

export type Vehicle = {
  id: string;
  description: string;
  previousCoords: LatLngTuple;
  nextCoords: LatLngTuple;
  arrivingAt: string | null;
  barrierFree: boolean;
  currentStopId: number | null;
  nextStopId: number;
};
