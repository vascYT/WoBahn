import type { LineRes, Station, Train } from "../../types/api";
import type {
  DepartureTime,
  Monitor,
  MonitorRes,
  TrafficInfo,
} from "../../types/wiener_linien";
import lines from "../lines";
import { v4 as uuidv4 } from "uuid";

let cachedLines: { [lineKey: string]: LineRes } = {};

export function getTrainId(
  lineKey: string,
  stopId: number,
  currentTrains: Train[]
) {
  const cachedLine = cachedLines[lineKey];
  if (!cachedLine) return uuidv4();

  const stops = lines[lineKey].stops;

  const stopIdIndex = stops.indexOf(stopId);
  const nextStopId =
    stopIdIndex !== -1 && stopIdIndex !== stops.length - 1
      ? stops[stopIdIndex + 1]
      : -1;

  const existingTrain = cachedLine.trains.find(
    (train) =>
      (train.nextStopId === nextStopId || train.nextStopId === stopId) &&
      !currentTrains.map((t) => t.id).includes(train.id)
  );

  return existingTrain ? existingTrain.id : uuidv4();
}

export async function fetchMonitors(lineKeys: string[]) {
  let url =
    "https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&";

  const stopIds = [];
  for (const lineKey of lineKeys) {
    const line = lines[lineKey];
    stopIds.push(...line.stops);
  }
  // using a set removes any duplicate values
  url += [...new Set(stopIds)].map((id) => `stopId=${id}`).join("&");
  console.log(`Refetching ${url}`);

  const res = await fetch(url);
  const data = await res.json();

  return data as MonitorRes;
}

export function getCachedLine(lineKey: string) {
  const cachedLine = cachedLines[lineKey];

  return cachedLine;
}

export function parseLine(monitorRes: MonitorRes, lineKey: string) {
  const { stations, trains } = parseCoordinates(
    monitorRes.data.monitors,
    lineKey
  );
  const trafficInfos = monitorRes.data.trafficInfos
    ? parseTrafficInfos(monitorRes.data.trafficInfos, lineKey)
    : [];

  cachedLines[lineKey] = {
    stations,
    trains,
    trafficInfos,
  };

  return cachedLines[lineKey];
}

const getNextDepatureDate = (departure: DepartureTime) =>
  departure.timeReal
    ? new Date(departure.timeReal).toISOString()
    : new Date(Date.now() + departure.countdown * 60 * 1000).toISOString();

export function parseCoordinates(monitors: Monitor[], lineKey: string) {
  const line = lines[lineKey];

  // Get train coordinates
  const stations: Station[] = [];
  const trains: Train[] = [];
  for (let i = 1; i < line.stops.length; i++) {
    const stopId = line.stops[i];
    const previousStopId = line.stops[i - 1];

    const [previousMonitor, monitor] = [previousStopId, stopId].map((id) =>
      monitors.find(
        (monitor) =>
          monitor.locationStop.properties.attributes.rbl === id &&
          monitor.lines[0].lineId == line.lineId &&
          (i == line.stops.length - 1 ||
            monitor.lines[0].direction == line.direction) // Last stop is always in the other direction
      )
    );
    if (!monitor || !previousMonitor) continue; // skip, if one of them are missing

    const departure = monitor.lines[0].departures.departure[0];
    const previousDepature = previousMonitor.lines[0].departures.departure[0];

    const [prvLng, prvLat] = previousMonitor.locationStop.geometry.coordinates;
    const [lng, lat] = monitor.locationStop.geometry.coordinates;

    if (!(prvLng && prvLat && lng && lat)) continue; // skip, if we don't have coordinates

    // Save station coordinates
    if (i == 1) {
      stations.push({
        description: previousMonitor.locationStop.properties.title,
        nextDepature: getNextDepatureDate(previousDepature.departureTime),
        coordinates: [prvLat, prvLng],
        barrierFree: previousMonitor.lines[0].barrierFree,
      });
    }

    stations.push({
      description: monitor.locationStop.properties.title,
      nextDepature: getNextDepatureDate(departure.departureTime),
      coordinates: [lat, lng],
      barrierFree: monitor.lines[0].barrierFree,
    });

    const nextStopId =
      i !== line.stops.length - 1 ? line.stops[i + 1] : line.stops[i];
    if (departure.departureTime.countdown == 0) {
      // Train at current stop
      trains.push({
        id: getTrainId(lineKey, stopId, trains),
        description: `At ${monitor.locationStop.properties.title}`,
        arrivingAt: null,
        previousStopCoords: [prvLat, prvLng],
        nextStopCoords: [lat, lng],
        barrierFree: monitor.lines[0].barrierFree,
        nextStopId,
      });
    } else if (
      previousDepature.departureTime.countdown >=
      departure.departureTime.countdown
    ) {
      // Train between previous and current stop
      trains.push({
        id: getTrainId(lineKey, stopId, trains),
        description: `Next stop: ${monitor.locationStop.properties.title}`,
        arrivingAt: getNextDepatureDate(departure.departureTime),
        previousStopCoords: [prvLat, prvLng],
        nextStopCoords: [lat, lng],
        barrierFree: monitor.lines[0].barrierFree,
        nextStopId,
      });
    }
  }

  return { stations, trains };
}

export function parseTrafficInfos(
  trafficInfos: TrafficInfo[],
  lineKey: string
) {
  const stopIds = lines[lineKey].stops;

  const data: TrafficInfo[] = [];
  for (const stopId of stopIds) {
    for (const trafficInfo of trafficInfos) {
      if (
        trafficInfo.relatedStops.includes(stopId) &&
        !trafficInfos
          .map((trafficInfo) => trafficInfo.name)
          .includes(trafficInfo.name)
      ) {
        trafficInfos.push(trafficInfo);
      }
    }
  }

  return data;
}
