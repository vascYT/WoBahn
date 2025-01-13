import type { APIRoute } from "astro";
import lines from "../../utils/lines";
import { LocationController } from "../../controllers/locations";
import type { LineRes } from "../../types/api";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const line = url.searchParams.get("id");

  if (!line)
    return new Response("'line' parameter needed", {
      status: 400,
    });

  if (!Object.keys(lines).includes(line))
    return new Response("invalid line", {
      status: 400,
    });

  const locationController = LocationController.getInstance();

  let onUpdate: ((data: LineRes) => void) | null;
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

      locationController.subscribe(line, onUpdate);
      locationController.startUpdates();

      request.signal.addEventListener("abort", () => {
        console.log("Connection aborted, closing controller...");
        controller.close();
      });
    },
    cancel() {
      if (onUpdate) {
        locationController.unsubscribe(line, onUpdate);
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
