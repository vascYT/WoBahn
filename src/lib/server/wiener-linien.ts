import type { LineRes, Station, Train } from "../../types/api";
import type {
  DepartureTime,
  Monitor,
  MonitorRes,
  TrafficInfo,
} from "../../types/wiener_linien";
import lines from "../lines";

const cachedLines = new Map<string, LineRes>();

export function getTrainId(
  lineKey: string,
  currentStopId: number | null,
  nextStopId: number,
  currentTrains: Train[]
) {
  const cachedLine = cachedLines.get(lineKey);
  if (!cachedLine) return crypto.randomUUID();

  const existingTrain = cachedLine.trains.find(
    (train) =>
      (train.nextStopId === nextStopId || train.nextStopId === currentStopId) &&
      !currentTrains.map((t) => t.id).includes(train.id)
  );

  return existingTrain ? existingTrain.id : crypto.randomUUID();
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
  return cachedLines.get(lineKey);
}

export function deleteCachedLine(lineKey: string) {
  cachedLines.delete(lineKey);
}

export function parseLine(monitorRes: MonitorRes, lineKey: string) {
  const { stations, trains } = parseCoordinates(
    monitorRes.data.monitors,
    lineKey
  );
  const trafficInfos = monitorRes.data.trafficInfos
    ? parseTrafficInfos(monitorRes.data.trafficInfos, lineKey)
    : [];

  const line = {
    stations,
    trains,
    trafficInfos,
  };
  cachedLines.set(lineKey, line);

  return line;
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
        id: previousMonitor.locationStop.properties.attributes.rbl,
        description: previousMonitor.locationStop.properties.title,
        nextDepature: getNextDepatureDate(previousDepature.departureTime),
        coordinates: [prvLat, prvLng],
        barrierFree: previousDepature.vehicle?.barrierFree ?? false,
      });
    }

    stations.push({
      id: monitor.locationStop.properties.attributes.rbl,
      description: monitor.locationStop.properties.title,
      nextDepature: getNextDepatureDate(departure.departureTime),
      coordinates: [lat, lng],
      barrierFree: departure.vehicle?.barrierFree ?? false,
    });

    if (departure.departureTime.countdown == 0) {
      const nextStopId =
        i !== line.stops.length - 1 ? line.stops[i + 1] : line.stops[i];

      // Train at current stop
      trains.push({
        id: getTrainId(lineKey, stopId, nextStopId, trains),
        description: `At ${monitor.locationStop.properties.title}`,
        arrivingAt: null,
        previousCoords: [lat, lng],
        nextCoords: [lat, lng],
        barrierFree: departure.vehicle?.barrierFree ?? false,
        currentStopId: stopId,
        nextStopId,
      });
    } else if (
      previousDepature.departureTime.countdown >=
      departure.departureTime.countdown
    ) {
      // Train between previous and current stop
      trains.push({
        id: getTrainId(lineKey, null, stopId, trains),
        description: `Next stop: ${monitor.locationStop.properties.title}`,
        arrivingAt: getNextDepatureDate(departure.departureTime),
        previousCoords: [prvLat, prvLng],
        nextCoords: [lat, lng],
        barrierFree: departure.vehicle?.barrierFree ?? false,
        currentStopId: null,
        nextStopId: stopId,
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
