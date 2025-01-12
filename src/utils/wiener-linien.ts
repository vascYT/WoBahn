import type { MonitorRes } from "../types/wiener_linien";
import type { StationLocation, TrainLocation } from "../types/api";

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

  // Get train coordinates
  const stations: StationLocation[] = [];
  const trains: TrainLocation[] = [];
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
        "Missing stop in response!\n" +
          monitors
            .map((monitor) => monitor.locationStop.properties.name)
            .join(", ")
      );

    // Save station coordinates
    if (i == 1) {
      stations.push({
        description: monitor.locationStop.properties.title,
        coordinates: [
          previousMonitor.locationStop.geometry.coordinates[1],
          previousMonitor.locationStop.geometry.coordinates[0],
        ],
      });
    }
    stations.push({
      description: monitor.locationStop.properties.title,
      coordinates: [
        monitor.locationStop.geometry.coordinates[1],
        monitor.locationStop.geometry.coordinates[0],
      ],
    });

    const departure = monitor.lines[0].departures.departure[0].departureTime;
    const previousDepature =
      previousMonitor.lines[0].departures.departure[0].departureTime;

    if (departure.countdown == 0) {
      // Train at current stop
      trains.push({
        description: `At ${monitor.locationStop.properties.title}`,
        arrivingAt: null,
        coordinates: [
          monitor.locationStop.geometry.coordinates[1],
          monitor.locationStop.geometry.coordinates[0],
        ],
      });
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

      trains.push({
        description: `Next stop: ${monitor.locationStop.properties.title}`,
        arrivingAt: departure.timeReal
          ? new Date(departure.timeReal).toISOString()
          : new Date(
              Date.now() + departure.countdown * 60 * 1000
            ).toISOString(),
        coordinates: [middleLat, middleLng],
      });
    }
  }

  return { stations, trains };
}
