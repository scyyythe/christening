// Free OpenStreetMap services: Nominatim (place search) and the public OSRM
// demo server (driving routes). Both are rate limited, so keep calls light.

// Nominatim asks apps to identify themselves. Browsers won't let pages set a
// User-Agent, so put a contact email here and it's sent as the `email` param.
const NOMINATIM_EMAIL = "";

export type LatLng = { lat: number; lng: number };

export type Place = LatLng & { label: string };

export type Route = {
  distanceKm: number;
  durationMin: number;
  // [lat, lng] pairs, ready for a Leaflet polyline.
  points: [number, number][];
};

type NominatimResult = { lat: string; lon: string; display_name: string };

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    countrycodes: "ph",
    limit: "5",
    "accept-language": "en",
  });
  if (NOMINATIM_EMAIL) params.set("email", NOMINATIM_EMAIL);

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { signal },
  );
  if (!res.ok) throw new Error(`Place search failed (${res.status})`);
  const results: NominatimResult[] = await res.json();
  return results.map((r) => ({
    lat: Number(r.lat),
    lng: Number(r.lon),
    label: r.display_name,
  }));
}

export async function getDrivingRoute(
  from: LatLng,
  to: LatLng,
  signal?: AbortSignal,
): Promise<Route> {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    { signal },
  );
  if (!res.ok) throw new Error(`Routing failed (${res.status})`);
  const data = await res.json();
  const route = data.routes?.[0];
  if (data.code !== "Ok" || !route) throw new Error("No route found");

  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    points: route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng],
    ),
  };
}

export function formatDuration(minutes: number) {
  const total = Math.max(1, Math.round(minutes));
  if (total < 60) return `${total} min${total === 1 ? "" : "s"}`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return `${hours} hr${hours === 1 ? "" : "s"}${mins ? ` ${mins} mins` : ""}`;
}

export function googleMapsUrl(to: LatLng, from?: LatLng | null) {
  const params = new URLSearchParams({
    api: "1",
    destination: `${to.lat},${to.lng}`,
    travelmode: "driving",
  });
  if (from) params.set("origin", `${from.lat},${from.lng}`);
  return `https://www.google.com/maps/dir/?${params}`;
}