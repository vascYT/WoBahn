import type { LineType } from "./api";

export type LineData = {
  [line: string]: {
    type: LineType;
    lineLabel: string;
    color: string?;
    directions: {
      H: {
        directionLabel: string;
        stops: number[];
      };
      R: {
        directionLabel: string;
        stops: number[];
      };
    };
  };
};
