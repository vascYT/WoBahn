import EventEmitter from "events";
import { fetchMonitors, getLine } from "../utils/wiener-linien";
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

  public subscribe(line: string, callback: Callback) {
    this.emitter.on(line, callback);
    console.log(
      `subscribed to ${line}, current subscribers: ${this.getSubscriberCount()}`
    );

    // Send data if we already have it
    const data = getLine(line);
    if (data.stations.length > 0 && data.trains.length > 0) {
      callback(data);
    }
  }

  public unsubscribe(line: string, callback: Callback) {
    this.emitter.off(line, callback);
    console.log(
      `unsubscribed from ${line}, current subscribers: ${this.getSubscriberCount()}`
    );
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
        const lines = this.emitter.eventNames() as string[];

        // Refetch data with currently subscribed lines
        await fetchMonitors(lines);

        for (const line of lines) {
          try {
            const data = getLine(line);
            this.emitter.emit(line, data);
          } catch (e) {
            console.error("Couldn't get coords", e);
          }
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
