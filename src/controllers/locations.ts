import EventEmitter from "events";
import {
  deleteCachedLine,
  fetchMonitors,
  getCachedLine,
  parseLine,
} from "../lib/server/wiener-linien";
import type { LineRes } from "../types/api";

type Callback = (data: LineRes) => void;

export class LocationController {
  private static instance: LocationController;
  private emitter = new EventEmitter();
  private updateInterval: NodeJS.Timeout | null = null;

  public static getInstance() {
    if (!LocationController.instance) {
      LocationController.instance = new LocationController();
    }
    return LocationController.instance;
  }

  public subscribe(route: string, callback: Callback) {
    this.emitter.on(route, callback);
    console.log(
      `subscribed to ${route}, current subscribers: ${this.getSubscriberCount()}`
    );

    // Send data if we already have it
    const data = getCachedLine(route);
    if (data) {
      callback(data);
    }
  }

  public unsubscribe(line: string, callback: Callback) {
    this.emitter.off(line, callback);
    console.log(
      `unsubscribed from ${line}, current subscribers: ${this.getSubscriberCount()}`
    );

    if (this.emitter.listenerCount(line) < 1) {
      deleteCachedLine(line);
    }
  }

  public getSubscriberCount() {
    const events = this.emitter.eventNames();

    return events.reduce((total, event) => {
      return total + this.emitter.listenerCount(event);
    }, 0);
  }

  public startUpdates() {
    if (this.updateInterval) return;

    console.log("Starting updates...");

    const update = async () => {
      const subscriberCount = this.getSubscriberCount();
      if (subscriberCount > 0) {
        const routes = this.emitter.eventNames() as string[];

        try {
          // Refetch data with currently subscribed lines
          const monitorRes = await fetchMonitors(routes);

          for (const routeStr of routes) {
            const data = parseLine(monitorRes, routeStr);
            this.emitter.emit(routeStr, data);
          }
        } catch (e) {
          console.error("Error refetching monitors");
        }
      } else {
        this.stopUpdates();
      }
    };

    update();
    this.updateInterval = setInterval(update, 15 * 1000);
  }

  public stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log("Updates stopped.");
    }
  }
}
