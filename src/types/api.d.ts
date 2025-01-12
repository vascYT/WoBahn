import type lines from "../utils/lines";

export type LocationsRes = {
  stations: Station[];
  trains: Train[];
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
