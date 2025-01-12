import type { LineType } from "../types/api";

export default {
  "u4-heiligenstadt": {
    name: "U4 Heiligenstadt",
    type: "metro",
    color: "#04943c",
    stops: [
      4401, // Hütteldorf
      4403, // Ober St. Veit
      4405, // Unter St. Veit
      4407, // Braunschweiggasse
      4409, // Hietzing
      4411, // Schönbrunn
      4413, // Meidling Hauptstraße
      4437, // Längenfeldgasse
      4415, // Margaretengürtel
      4417, // Pilgramgasse
      4419, // Kettenbrückengasse
      4421, // Karlsplatz
      4423, // Stadtpark
      4425, // Landstraße
      4427, // Schwedenplatz
      4429, // Schottenring
      4431, // Roßauer Lände
      4433, // Friedensbrücke
      4439, // Spittelau
      4402, // Heiligenstadt
    ],
  },
  "u4-huetteldorf": {
    name: "U4 Hütteldorf",
    type: "metro",
    color: "#04943c",
    stops: [
      4402, // Heiligenstadt
      4440, // Spittelau
      4404, // Friedensbrücke
      4406, // Roßauer Lände
      4408, // Schottenring
      4410, // Schwedenplatz
      4412, // Landstraße
      4414, // Stadtpark
      4416, // Karlsplatz
      4418, // Kettenbrückengasse
      4420, // Pilgramgasse
      4422, // Margaretengürtel
      4438, // Längenfeldgasse
      4424, // Meidling Hauptstraße
      4426, // Schönbrunn
      4428, // Hietzing
      4430, // Braunschweiggasse
      4432, // Unter St. Veit
      4434, // Ober St. Veit
      4401, // Hütteldorf
    ],
  },
} as {
  [line: string]: {
    name: string;
    type: LineType;
    color: string;
    stops: number[];
  };
};
