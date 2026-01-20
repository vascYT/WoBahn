import type { LineRes, Station, Train } from "../../types/api";
import type {
  DepartureTime,
  Monitor,
  MonitorRes,
  TrafficInfo,
} from "../../types/wiener_linien";
import Route from "@/lib/route";

const cachedLines = new Map<string, LineRes>();

export function getTrainId(
  route: string,
  currentStopId: number | null,
  nextStopId: number,
  currentTrains: Train[],
) {
  const cachedLine = getCachedLine(route);
  if (!cachedLine) return crypto.randomUUID();

  const existingTrain = cachedLine.trains.find(
    (train) =>
      (train.nextStopId === nextStopId || train.nextStopId === currentStopId) &&
      !currentTrains.map((t) => t.id).includes(train.id),
  );

  return existingTrain ? existingTrain.id : crypto.randomUUID();
}

export async function fetchMonitors(routesStr: string[]) {
  let url =
    "https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&";

  const stopIds = [];
  for (const routeStr of routesStr) {
    stopIds.push(...Route.fromString(routeStr).getDirection().stops);
  }
  // using a set removes any duplicate values
  url += [...new Set(stopIds)].map((id) => `stopId=${id}`).join("&");
  console.log(`Refetching ${url}`);

  const res = await fetch(url);
  const data = await res.json();

  return data as MonitorRes;
}

export function getCachedLine(routeStr: string) {
  return cachedLines.get(routeStr);
}

export function deleteCachedLine(routeStr: string) {
  cachedLines.delete(routeStr);
}

export function parseLine(monitorRes: MonitorRes, routeStr: string) {
  const route = Route.fromString(routeStr);
  const { stations, trains } = parseCoordinates(
    monitorRes.data.monitors,
    route,
  );
  const trafficInfos = monitorRes.data.trafficInfos
    ? parseTrafficInfos(monitorRes.data.trafficInfos, route)
    : [];

  const line = {
    stations,
    trains,
    trafficInfos,
    lastUpdate: new Date().toISOString(),
  };
  cachedLines.set(route.toString(), line);

  return line;
}

const getNextDepatureDate = (departure: DepartureTime) =>
  departure.timeReal
    ? new Date(departure.timeReal).toISOString()
    : new Date(Date.now() + departure.countdown * 60 * 1000).toISOString();

export function parseCoordinates(monitors: Monitor[], route: Route) {
  const line = route.getLine();
  const stops = route.getDirection().stops;

  // Get train coordinates
  const stations: Station[] = [];
  const trains: Train[] = [];
  for (let i = 1; i < stops.length; i++) {
    const stopId = stops[i];
    const previousStopId = stops[i - 1];

    const [previousMonitor, monitor] = [previousStopId, stopId].map((id) =>
      monitors.find(
        (monitor) =>
          monitor.locationStop.properties.attributes.rbl === id &&
          monitor.lines[0].lineId == Number.parseInt(route.getLineId()) &&
          (i == stops.length - 1 ||
            monitor.lines[0].direction == route.getDirectionStr()), // Last stop is always in the other direction
      ),
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
      const nextStopId = i !== stops.length - 1 ? stops[i + 1] : stops[i];

      // Train at current stop
      trains.push({
        id: getTrainId(route.toString(), stopId, nextStopId, trains),
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
        id: getTrainId(route.toString(), null, stopId, trains),
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

export function parseTrafficInfos(trafficInfos: TrafficInfo[], route: Route) {
  const stopIds = route.getDirection().stops;

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
