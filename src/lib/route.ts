import lines from "@/assets/lines.json";
import type { LineData } from "@/types/common";

export default class Route {
  private lineId: string;
  private directionStr: "H" | "R";

  public constructor(lineId: string, directionStr: "H" | "R") {
    this.lineId = lineId;
    this.directionStr = directionStr;
  }

  public static fromString(routeStr: string) {
    const split = routeStr.split("-");
    if (split[1] !== "H" && split[1] !== "R")
      throw "Invalid format for Route string";

    return new Route(split[0], split[1]);
  }

  public getLine() {
    const linesData = lines as unknown as LineData;
    return linesData[this.lineId];
  }

  public getDirection() {
    return this.getLine().directions[this.directionStr];
  }

  public getColor() {
    const line = this.getLine();
    if (line.color) return line.color;

    return line.type === "ptTram" ? "#d3312c" : "#1c60a7";
  }

  public getLineId() {
    return this.lineId;
  }

  public getDirectionStr() {
    return this.directionStr;
  }

  public toString() {
    return `${this.lineId}-${this.directionStr}`;
  }
}
