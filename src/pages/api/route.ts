import type { APIRoute } from "astro";
import lines from "@/assets/lines.json";
import { LocationController } from "../../controllers/locations";
import type { RouteRes } from "../../types/api";
import Route from "@/lib/route";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const lineId = url.searchParams.get("line_id");
  const direction = url.searchParams.get("direction");

  if (!lineId || !direction)
    return new Response("'line_id' and 'direction' parameters needed", {
      status: 400,
    });

  if (
    !Object.keys(lines).includes(lineId) ||
    (direction !== "H" && direction !== "R")
  )
    return new Response("Invalid parameters", {
      status: 400,
    });

  const route = new Route(lineId, direction);
  const locationController = LocationController.getInstance();

  let onUpdate: ((data: RouteRes) => void) | null;
  const body = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      onUpdate = (data) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch (e) {
          console.log("Couldn't send message", e);
        }
      };

      locationController.subscribe(route.toString(), onUpdate);
      locationController.startUpdates();

      request.signal.addEventListener("abort", () => {
        console.log("Connection aborted, closing controller...");
        controller.close();
      });
    },
    cancel() {
      if (onUpdate) {
        locationController.unsubscribe(route.toString(), onUpdate);
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
