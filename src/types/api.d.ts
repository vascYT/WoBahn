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
