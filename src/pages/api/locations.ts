import type { APIRoute } from "astro";
import { getCoordinates } from "../../utils/wiener-linien";
import lines from "../../utils/lines";
import type { LocationsRes } from "../../types/api";

type ResCache = {
  data: LocationsRes;
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

  if (!Object.keys(lines).includes(line))
    return new Response("invalid line", {
      status: 400,
    });

  const cachedRes = cache.get(line);
  if (
    !cachedRes ||
    new Date().getTime() - cachedRes.lastUpdate.getTime() > refreshInterval
  ) {
    try {
      const data = await getCoordinates(lines[line].stops);

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
