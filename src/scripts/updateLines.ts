import { parseString } from "@fast-csv/parse";
import fs from "fs/promises";
import type { LineType } from "@/types/api";
import type { LineData } from "@/types/common";

const FILE_PATH = "./src/assets/lines.json";

const file = await fs.readFile(FILE_PATH, { encoding: "utf-8" });
const data: LineData = JSON.parse(file);

const linesRes = await fetch(
  "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-linien.csv",
);
const linesText = await linesRes.text();
const lines: {
  LineID: string;
  LineText: string;
  StortingHelp: string;
  Realtime: string;
  MeansOfTransport: string;
}[] = [];
parseString(linesText, { headers: true, delimiter: ";" })
  .on("data", (row) => lines.push(row))
  .on("end", async () => {
    // Step 1: Add all common lines
    for (const line of lines) {
      if (
        line.MeansOfTransport === "ptRufBus" ||
        line.MeansOfTransport === "ptTrainS"
      )
        continue;

      data[line.LineID] = {
        ...data[line.LineID],
        type: line.MeansOfTransport as LineType,
        lineLabel: line.LineText,
      };

      // clear stops
      if (data[line.LineID].directions) {
        data[line.LineID].directions.H = {
          ...data[line.LineID].directions.H,
          stops: [],
        };
        data[line.LineID].directions.R = {
          ...data[line.LineID].directions.R,
          stops: [],
        };
      } else {
        data[line.LineID].directions = {
          H: {
            directionLabel: "",
            stops: [],
          },
          R: {
            directionLabel: "",
            stops: [],
          },
        };
      }
    }

    // Step 2: Add stops to the lines
    const lineRoutesRes = await fetch(
      "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-fahrwegverlaeufe.csv",
    );
    const lineRoutesText = await lineRoutesRes.text();
    const lineRoutes: {
      LineID: string;
      PatternID: string;
      StopSeqCount: string;
      StopID: string;
      Direction: string;
    }[] = [];
    parseString(lineRoutesText, { headers: true, delimiter: ";" })
      .on("data", (data) => lineRoutes.push(data))
      .on("end", async () => {
        for (const lineRoute of lineRoutes) {
          if (
            (lineRoute.PatternID !== "1" && lineRoute.PatternID !== "2") ||
            lineRoute.Direction === ""
          )
            continue;

          if (data[lineRoute.LineID]) {
            const direction = lineRoute.Direction === "1" ? "H" : "R";
            data[lineRoute.LineID].directions[direction] = {
              ...data[lineRoute.LineID].directions[direction],
              stops: [
                ...data[lineRoute.LineID].directions[direction].stops,
                Number.parseInt(lineRoute.StopID),
              ],
            };
          }
        }

        // Step 3: Add direction labs
        const stopsRes = await fetch(
          "https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-haltepunkte.csv",
        );
        const stopsText = await stopsRes.text();
        const stops: {
          StopID: string;
          DIVA: string;
          StopText: string;
          Municipality: string;
          MunicipalityID: string;
          Longitude: string;
          Latitude: string;
        }[] = [];
        parseString(stopsText, { headers: true, delimiter: ";" })
          .on("data", (data) => stops.push(data))
          .on("end", async () => {
            for (const lineStr in data) {
              const lastStopH = stops.find(
                (stop) =>
                  Number.parseInt(stop.StopID) ===
                  data[lineStr].directions.H.stops[
                    data[lineStr].directions.H.stops.length - 1
                  ],
              );
              const lastStopR = stops.find(
                (stop) =>
                  Number.parseInt(stop.StopID) ===
                  data[lineStr].directions.R.stops[
                    data[lineStr].directions.R.stops.length - 1
                  ],
              );

              data[lineStr].directions.H = {
                ...data[lineStr].directions.H,
                directionLabel: lastStopH?.StopText || "",
              };
              data[lineStr].directions.R = {
                ...data[lineStr].directions.R,
                directionLabel: lastStopR?.StopText || "",
              };

              // Step 4: Dirty fix for last station (metros only)
              if (data[lineStr].type === "ptMetro") {
                data[lineStr].directions.H.stops[
                  data[lineStr].directions.H.stops.length - 1
                ] = data[lineStr].directions.R.stops[0];
                data[lineStr].directions.R.stops[
                  data[lineStr].directions.R.stops.length - 1
                ] = data[lineStr].directions.H.stops[0];
              }
            }

            console.log(`Total number of lines: ${Object.keys(data).length}`);
            await fs.writeFile(FILE_PATH, JSON.stringify(data));
            console.log("Success");
          });
      });
  });
