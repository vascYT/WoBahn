import type { Station, Train } from "../types/api";
import type {
  DepartureTime,
  MonitorRes,
  TrafficInfo,
} from "../types/wiener_linien";
import lines from "./lines";

let cachedMonitorsRes: MonitorRes | null;
export async function fetchMonitors(lineKeys: string[]) {
  let url =
    "https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&lang&";

  const stopIds = [];
  for (const lineKey of lineKeys) {
    const line = lines[lineKey];
    stopIds.push(...line.stops);
  }
  url += stopIds.map((id) => `stopId=${id}`).join("&");
  console.log(`Refetching ${url}`);

  const res = await fetch(url);
  cachedMonitorsRes = await res.json();
}

export function getLine(lineKey: string) {
  const { stations, trains } = getCoordinates(lineKey);
  const trafficInfos = getTrafficInfos(lineKey);

  return {
    stations,
    trains,
    trafficInfos,
  };
}

const getNextDepatureDate = (departure: DepartureTime) =>
  departure.timeReal
    ? new Date(departure.timeReal).toISOString()
    : new Date(Date.now() + departure.countdown * 60 * 1000).toISOString();

export function getCoordinates(lineKey: string) {
  const stopIds = lines[lineKey].stops;
  const monitors = cachedMonitorsRes?.data.monitors ?? [];

  // Get train coordinates
  const stations: Station[] = [];
  const trains: Train[] = [];
  for (let i = 1; i < stopIds.length; i++) {
    const stopId = stopIds[i];
    const previousStopId = stopIds[i - 1];

    const monitor = monitors.find(
      (monitor) => monitor.locationStop.properties.attributes.rbl === stopId
    );
    const previousMonitor = monitors.find(
      (monitor) =>
        monitor.locationStop.properties.attributes.rbl === previousStopId
    );
    if (!monitor || !previousMonitor) break;

    const departure = monitor.lines[0].departures.departure[0];
    const previousDepature = previousMonitor.lines[0].departures.departure[0];

    // Save station coordinates
    if (i == 1) {
      stations.push({
        description: previousMonitor.locationStop.properties.title,
        nextDepature: getNextDepatureDate(previousDepature.departureTime),
        coordinates: [
          previousMonitor.locationStop.geometry.coordinates[1],
          previousMonitor.locationStop.geometry.coordinates[0],
        ],
      });
    }
    stations.push({
      description: monitor.locationStop.properties.title,
      nextDepature: getNextDepatureDate(departure.departureTime),
      coordinates: [
        monitor.locationStop.geometry.coordinates[1],
        monitor.locationStop.geometry.coordinates[0],
      ],
    });

    if (departure.departureTime.countdown == 0) {
      // Train at current stop
      trains.push({
        description: `At ${monitor.locationStop.properties.title}`,
        arrivingAt: null,
        coordinates: [
          monitor.locationStop.geometry.coordinates[1],
          monitor.locationStop.geometry.coordinates[0],
        ],
      });
    } else if (
      previousDepature.departureTime.countdown >=
      departure.departureTime.countdown
    ) {
      // Train between previous and current stop
      const middleLat =
        (previousMonitor.locationStop.geometry.coordinates[1] +
          monitor.locationStop.geometry.coordinates[1]) /
        2;
      const middleLng =
        (previousMonitor.locationStop.geometry.coordinates[0] +
          monitor.locationStop.geometry.coordinates[0]) /
        2;

      trains.push({
        description: `Next stop: ${monitor.locationStop.properties.title}`,
        arrivingAt: getNextDepatureDate(departure.departureTime),
        coordinates: [middleLat, middleLng],
      });
    }
  }

  return { stations, trains };
}

export function getTrafficInfos(lineKey: string) {
  if (!cachedMonitorsRes || !cachedMonitorsRes.data.trafficInfos) return [];

  const stopIds = lines[lineKey].stops;

  const trafficInfos: TrafficInfo[] = [];
  for (const stopId of stopIds) {
    for (const trafficInfo of cachedMonitorsRes.data.trafficInfos) {
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

  return trafficInfos;
}
