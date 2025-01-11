import type { APIRoute } from "astro";
import { U4HeiligenstadtStops } from "../../utils/stop-ids";
import { getCoordinates } from "../../utils/wiener-linien";

export const GET: APIRoute = async () => {
  const coordinates = await getCoordinates(U4HeiligenstadtStops);

  return new Response(
    JSON.stringify({
      coordinates,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
