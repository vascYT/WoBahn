export type StationLocation = {
  description: string;
  coordinates: LatLngExpression;
};

export type TrainLocation = StationLocation & {
  arrivingAt: string | null;
};
