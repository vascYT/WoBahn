import type { LatLngExpression } from "leaflet";
import type { MonitorRes } from "../types/wiener_linien";

async function fetchMonitors(stops: number[]) {
  const res = await fetch(
    "https://www.wienerlinien.at/ogd_realtime/monitor?" +
      stops.map((id) => `stopId=${id}`).join("&")
  );
  const json = (await res.json()) as MonitorRes;
  return json.data.monitors;
}

export async function getCoordinates(stopsIds: number[]) {
  const monitors = await fetchMonitors(stopsIds);

  const stationCoordinates = monitors.map(
    (monitor) =>
      [
        monitor.locationStop.geometry.coordinates[1],
        monitor.locationStop.geometry.coordinates[0],
      ] as LatLngExpression
  );

  // Get train coordinates
  const trainCoordinates: LatLngExpression[] = [];
  for (let i = 1; i < stopsIds.length; i++) {
    const stopId = stopsIds[i];
    const previousStopId = stopsIds[i - 1];

    const monitor = monitors.find(
      (monitor) => monitor.locationStop.properties.attributes.rbl === stopId
    );
    const previousMonitor = monitors.find(
      (monitor) =>
        monitor.locationStop.properties.attributes.rbl === previousStopId
    );
    if (!monitor || !previousMonitor)
      throw new Error(
        "Missing stop in response! " +
          monitors.map((monitor) => monitor.locationStop.properties.name)
      );

    const departure = monitor.lines[0].departures.departure[0].departureTime;
    const previousDepature =
      previousMonitor.lines[0].departures.departure[0].departureTime;

    if (departure.countdown == 0) {
      // Train at current stop
      trainCoordinates.push([
        monitor.locationStop.geometry.coordinates[1],
        monitor.locationStop.geometry.coordinates[0],
      ]);
    } else if (previousDepature.countdown >= departure.countdown) {
      // Train between previous and current stop
      const middleLat =
        (previousMonitor.locationStop.geometry.coordinates[1] +
          monitor.locationStop.geometry.coordinates[1]) /
        2;
      const middleLng =
        (previousMonitor.locationStop.geometry.coordinates[0] +
          monitor.locationStop.geometry.coordinates[0]) /
        2;

      trainCoordinates.push([middleLat, middleLng]);
    }
  }

  return { stationCoordinates, trainCoordinates };
}
