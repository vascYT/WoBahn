import type { APIRoute } from "astro";
import { getCoordinates } from "../../utils/wiener-linien";
import stopIds from "../../utils/stop-ids";

type ResCache = {
  data: Awaited<ReturnType<typeof getCoordinates>>;
  lastUpdate: Date;
};

const cache = new Map<string, ResCache>();
const refreshInterval = 10000;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const line = url.searchParams.get("line");

  if (!line)
    return new Response("line parameter needed", {
      status: 400,
    });

  if (!Object.keys(stopIds).includes(line))
    return new Response("invalid line", {
      status: 400,
    });

  const cachedRes = cache.get(line);
  if (
    !cachedRes ||
    new Date().getTime() - cachedRes.lastUpdate.getTime() > refreshInterval
  ) {
    try {
      const data = await getCoordinates(stopIds[line]);
      cache.set(line, {
        data,
        lastUpdate: new Date(),
      });

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error("Couldn't refresh data");
    }
  }

  return new Response(JSON.stringify(cachedRes!.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
