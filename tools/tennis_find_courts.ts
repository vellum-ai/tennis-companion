// tools/tennis_find_courts.ts

import { geocode, findCourts } from "../src/courts.ts";
import { getConfig } from "../src/storage.ts";

const tool = {
  description:
    "Find tennis courts near a location using OpenStreetMap data. Returns names, distance, surface, lighting, and access info. Use when the user asks where to play tennis nearby.",
  defaultRiskLevel: "low" as const,
  input_schema: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description:
          "Neighborhood, address, or city, e.g. 'Williamsburg Brooklyn'. Falls back to the configured defaultLocation.",
      },
      radius_km: { type: "number", description: "Search radius in km. Default 3." },
      max_results: { type: "number", description: "Max courts to return. Default 10." },
    },
    required: [],
  },
  execute: async (input, ctx) => {
    const i = input as Record<string, unknown>;
    const cfg = getConfig<{ defaultLocation?: string }>();
    const location = String(i.location ?? "").trim() || cfg.defaultLocation || "";
    if (!location) {
      return {
        content:
          "error: no location given and no defaultLocation configured. Pass a location like 'Williamsburg Brooklyn'.",
        isError: true,
      };
    }
    const radius = Number(i.radius_km) > 0 ? Number(i.radius_km) : 3;
    const max = Number(i.max_results) > 0 ? Number(i.max_results) : 10;

    try {
      const geo = await geocode(location, ctx?.signal);
      if (!geo) {
        return { content: `error: could not geocode '${location}'.`, isError: true };
      }
      const courts = await findCourts(geo.lat, geo.lon, radius, ctx?.signal);
      if (!courts.length) {
        return {
          content: `No tennis courts found within ${radius} km of ${geo.display}. Try a bigger radius_km.`,
          isError: false,
        };
      }
      const lines = courts.slice(0, max).map((c) => {
        const bits = [
          `${c.name} — ${c.distanceKm.toFixed(1)} km`,
          c.surface ? `surface: ${c.surface}` : "",
          c.courts ? `courts: ${c.courts}` : "",
          c.lit === "yes" ? "lit" : "",
          c.access === "private" ? "PRIVATE" : "",
          c.fee === "yes" ? "fee" : c.fee === "no" ? "free" : "",
          `map: https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lon}#map=18/${c.lat}/${c.lon}`,
        ].filter(Boolean);
        return bits.join(" | ");
      });
      return {
        content: `Tennis courts within ${radius} km of ${location}:\n` + lines.join("\n"),
        isError: false,
      };
    } catch (err) {
      return {
        content: `error: court search failed (${err instanceof Error ? err.message : String(err)}).`,
        isError: true,
      };
    }
  },
};

export default tool;
