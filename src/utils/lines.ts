import type { LineType } from "../types/api";

export default {
  "u1-leopoldau": {
    name: "U1 Leopoldau",
    type: "metro",
    lineId: 301,
    direction: "H",
    color: "#e30413",
    stops: [
      4134, 4135, 4136, 4137, 4138, 4101, 4103, 4105, 4107, 4109, 4111, 4113,
      4115, 4117, 4119, 4121, 4123, 4125, 4127, 4181, 4182, 4183, 4184, 4190,
    ],
  },
  "u1-oberlaa": {
    name: "U1 Oberlaa",
    type: "metro",
    lineId: 301,
    direction: "R",
    color: "#e30413",
    stops: [
      4190, 4189, 4188, 4187, 4186, 4102, 4104, 4106, 4108, 4110, 4112, 4114,
      4116, 4118, 4120, 4122, 4124, 4126, 4128, 4129, 4130, 4131, 4132, 4134,
    ],
  },
  "u2-karlsplatz": {
    name: "U2 Karlsplatz",
    type: "metro",
    lineId: 302,
    direction: "H",
    color: "#9766ae",
    stops: [
      4277, 4278, 4279, 4251, 4252, 4253, 4254, 4256, 4255, 4257, 4258, 4259,
      4260, 4261, 4201, 4203, 4205, 4209, 4211, 4202,
    ],
  },
  "u2-seestadt": {
    name: "U2 Seestadt",
    type: "metro",
    lineId: 302,
    direction: "R",
    color: "#9766ae",
    stops: [
      4202, 4204, 4206, 4210, 4212, 4214, 4262, 4263, 4264, 4265, 4266, 4268,
      4267, 4269, 4270, 4271, 4272, 4274, 4275, 4277,
    ],
  },
  "u3-simmering": {
    name: "U3 Simmering",
    type: "metro",
    lineId: 303,
    direction: "H",
    color: "#e87f10",
    stops: [
      4931, 4932, 4933, 4926, 4927, 4921, 4922, 4923, 4909, 4910, 4911, 4912,
      4913, 4914, 4915, 4916, 4917, 4934, 4935, 4936, 4938,
    ],
  },
  "u3-ottakring": {
    name: "U3 Ottakring",
    type: "metro",
    lineId: 303,
    direction: "R",
    color: "#e87f10",
    stops: [
      4938, 4939, 4940, 4941, 4900, 4901, 4902, 4903, 4904, 4905, 4906, 4907,
      4908, 4918, 4919, 4920, 4924, 4925, 4928, 4929, 4931,
    ],
  },
  "u4-heiligenstadt": {
    name: "U4 Heiligenstadt",
    type: "metro",
    lineId: 304,
    direction: "H",
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
    lineId: 304,
    direction: "R",
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
  "u6-floridsdorf": {
    name: "U6 Floridsdorf",
    type: "metro",
    lineId: 306,
    direction: "H",
    color: "#9c6c2c",
    stops: [
      4635, 4636, 4637, 4638, 4639, 4640, 4615, 4616, 4617, 4618, 4619, 4620,
      4621, 4622, 4623, 4624, 4625, 4626, 4627, 4641, 4642, 4643, 4644, 4646,
    ],
  },
  "u6-siebenhirten": {
    name: "U6 Siebenhirten",
    type: "metro",
    lineId: 306,
    direction: "R",
    color: "#9c6c2c",
    stops: [
      4646, 4647, 4648, 4649, 4650, 4651, 4603, 4604, 4605, 4606, 4607, 4608,
      4609, 4610, 4611, 4612, 4613, 4614, 4629, 4630, 4631, 4632, 4633, 4635,
    ],
  },
} as {
  [line: string]: {
    name: string;
    type: LineType;
    lineId: number;
    direction: "H" | "R";
    color: string;
    stops: number[];
  };
};
