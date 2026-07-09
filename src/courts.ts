// src/courts.ts
// Nearby tennis court search via OpenStreetMap: Nominatim for geocoding,
// Overpass API for court features. Free, no API key.

const UA = "tennis-companion-plugin/0.1 (vellum assistant plugin)";

export interface Court {
  name: string;
  distanceKm: number;
  surface?: string;
  courts?: string;
  lit?: string;
  access?: string;
  fee?: string;
  lat: number;
  lon: number;
}

export async function geocode(
  query: string,
  signal?: AbortSignal,
): Promise<{ lat: number; lon: number; display: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal });
  if (!res.ok) throw new Error(`geocoding failed: HTTP ${res.status}`);
  const results = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  if (!results.length) return null;
  return {
    lat: parseFloat(results[0].lat),
    lon: parseFloat(results[0].lon),
    display: results[0].display_name,
  };
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function findCourts(
  lat: number,
  lon: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<Court[]> {
  const radiusM = Math.round(radiusKm * 1000);
  const query = `[out:json][timeout:20];nwr["sport"="tennis"](around:${radiusM},${lat},${lon});out center tags;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });
  if (!res.ok) throw new Error(`court search failed: HTTP ${res.status}`);
  const data = (await res.json()) as {
    elements: Array<{
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }>;
  };

  const seen = new Map<string, Court>();
  for (const el of data.elements ?? []) {
    const clat = el.lat ?? el.center?.lat;
    const clon = el.lon ?? el.center?.lon;
    if (clat === undefined || clon === undefined) continue;
    const tags = el.tags ?? {};
    const name = tags.name || tags["addr:street"] || "Unnamed tennis court";
    // Dedupe: same name within ~150m collapses to one entry.
    const key = `${name}:${clat.toFixed(3)}:${clon.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.set(key, {
      name,
      distanceKm: haversineKm(lat, lon, clat, clon),
      surface: tags.surface,
      courts: tags.capacity || tags.courts,
      lit: tags.lit,
      access: tags.access,
      fee: tags.fee,
      lat: clat,
      lon: clon,
    });
  }
  let courts = [...seen.values()];

  // Enrich unnamed courts with the surrounding park's name (one extra
  // Overpass query, bbox containment). OSM pitches are rarely named but
  // usually sit inside a named park.
  if (courts.some((c) => c.name === "Unnamed tennis court")) {
    try {
      const parks = await findParks(lat, lon, radiusKm, signal);
      for (const c of courts) {
        if (c.name !== "Unnamed tennis court") continue;
        const hit = parks.find(
          (p) =>
            c.lat >= p.minlat && c.lat <= p.maxlat &&
            c.lon >= p.minlon && c.lon <= p.maxlon,
        );
        if (hit) c.name = `${hit.name} tennis courts`;
      }
    } catch {
      // Park enrichment is best-effort; unnamed courts still return.
    }
  }

  // Merge courts sharing a name within ~400m; count merged entries.
  const merged = new Map<string, Court & { mergedCount: number }>();
  for (const c of courts.sort((a, b) => a.distanceKm - b.distanceKm)) {
    const existing = [...merged.values()].find(
      (m) =>
        m.name === c.name &&
        haversineKm(m.lat, m.lon, c.lat, c.lon) < 0.4,
    );
    if (existing) {
      existing.mergedCount++;
      if (!existing.courts) existing.courts = String(existing.mergedCount);
      else if (/^\d+$/.test(existing.courts))
        existing.courts = String(existing.mergedCount);
      if (!existing.surface && c.surface) existing.surface = c.surface;
      if (!existing.lit && c.lit) existing.lit = c.lit;
    } else {
      merged.set(`${c.name}:${c.lat.toFixed(3)}`, { ...c, mergedCount: 1 });
    }
  }
  return [...merged.values()].sort((a, b) => a.distanceKm - b.distanceKm);
}

interface ParkBounds {
  name: string;
  minlat: number;
  minlon: number;
  maxlat: number;
  maxlon: number;
}

async function findParks(
  lat: number,
  lon: number,
  radiusKm: number,
  signal?: AbortSignal,
): Promise<ParkBounds[]> {
  const radiusM = Math.round(radiusKm * 1000) + 500;
  const query = `[out:json][timeout:20];(way["leisure"~"park|recreation_ground|sports_centre"]["name"](around:${radiusM},${lat},${lon});relation["leisure"~"park|recreation_ground|sports_centre"]["name"](around:${radiusM},${lat},${lon}););out bb tags;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    elements: Array<{
      bounds?: { minlat: number; minlon: number; maxlat: number; maxlon: number };
      tags?: Record<string, string>;
    }>;
  };
  const parks: ParkBounds[] = [];
  for (const el of data.elements ?? []) {
    if (!el.bounds || !el.tags?.name) continue;
    parks.push({ name: el.tags.name, ...el.bounds });
  }
  // Smallest areas first so a court matches its immediate park, not a borough-wide relation.
  return parks.sort(
    (a, b) =>
      (a.maxlat - a.minlat) * (a.maxlon - a.minlon) -
      (b.maxlat - b.minlat) * (b.maxlon - b.minlon),
  );
}
