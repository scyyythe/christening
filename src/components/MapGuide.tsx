import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Rectangle,
  TileLayer,
  useMap,
} from "react-leaflet";
import { event, type Venue } from "../data/event";
import {
  formatDuration,
  getDrivingRoute,
  googleMapsUrl,
  searchPlaces,
  type Place,
  type Route,
} from "../lib/geo";
import { cn } from "../lib/utils";
import { LocateIcon, PinIcon } from "./Icons";
import { Sheet } from "./Sheet";

export type Destination = "church" | "reception";

const destinations: Record<Destination, { tab: string; venue: Venue }> = {
  church: { tab: "Toby's Church", venue: event.church },
  reception: { tab: "Toby's Reception", venue: event.reception },
};

const SEARCH_DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 3;

// Inline SVG so the pins can be Leaflet divIcons styled from CSS.
const pinSvg: Record<Destination, string> = {
  church:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M10 4h4"/><path d="M6 21V11l6-5 6 5v10"/><path d="M3 21h18"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/></svg>',
  reception:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/></svg>',
};

function venueIcon(kind: Destination, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="map-pin${active ? " is-active" : ""}"><span class="map-pin-ring"></span><span class="map-pin-badge">${pinSvg[kind]}</span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

const youIcon = L.divIcon({
  className: "",
  html: '<span class="you-dot"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

type MapViewProps = {
  destination: Venue;
  origin: Place | null;
  route: Route | null;
};

// Keeps the camera on whatever matters: the route, the two points, or the venue.
function MapView({ destination, origin, route }: MapViewProps) {
  const map = useMap();

  // The sheet animates in, so Leaflet measures too early; re-measure after.
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 400);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (route) {
      map.fitBounds(L.latLngBounds(route.points), { padding: [36, 36] });
    } else if (origin) {
      map.fitBounds(
        L.latLngBounds([
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]),
        { padding: [48, 48] },
      );
    } else {
      map.setView([destination.lat, destination.lng], 15);
    }
  }, [map, destination, origin, route]);

  return null;
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 animate-spin", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const geolocationErrors: Record<number, string> = {
  1: "Location access was blocked. You can type a nearby landmark instead.",
  2: "We couldn't tell where you are right now. Try typing a nearby landmark.",
  3: "Finding your location took too long. Try again or type a landmark.",
};

type MapGuideProps = {
  initialTab: Destination;
  onClose: () => void;
};

export function MapGuide({ initialTab, onClose }: MapGuideProps) {
  const [tab, setTab] = useState<Destination>(initialTab);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [origin, setOrigin] = useState<Place | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchAbort = useRef<AbortController | null>(null);

  const { tab: tabLabel, venue } = destinations[tab];
  const venueLatLng = useMemo(() => ({ lat: venue.lat, lng: venue.lng }), [venue]);

  // Debounced place search as the guest types.
  useEffect(() => {
    const text = query.trim();
    if (text.length < MIN_QUERY_LENGTH || text === origin?.label) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      searchAbort.current?.abort();
      const controller = new AbortController();
      searchAbort.current = controller;
      setSearching(true);
      try {
        const places = await searchPlaces(text, controller.signal);
        setSuggestions(places);
        setMessage(
          places.length ? null : "We couldn't find that place, try a nearby landmark.",
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessage("Place search isn't responding right now. Please try again.");
        }
      } finally {
        if (searchAbort.current === controller) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, origin]);

  // Route from the chosen start point to the active tab's venue.
  useEffect(() => {
    if (!origin) {
      setRoute(null);
      return;
    }
    const controller = new AbortController();
    setRouteLoading(true);
    setRoute(null);
    getDrivingRoute(origin, venueLatLng, controller.signal)
      .then((r) => {
        setRoute(r);
        setMessage(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setMessage(
          "We couldn't get driving directions right now. Google Maps below can still guide you.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setRouteLoading(false);
      });
    return () => controller.abort();
  }, [origin, venueLatLng]);

  const choose = (place: Place) => {
    setOrigin(place);
    setQuery(place.label);
    setSuggestions([]);
    setMessage(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions[0]) choose(suggestions[0]);
    else if (query.trim().length >= MIN_QUERY_LENGTH && !searching)
      setMessage("We couldn't find that place, try a nearby landmark.");
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setMessage("Your browser can't share its location. Try typing a nearby landmark.");
      return;
    }
    setLocating(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        choose({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "My current location",
        });
      },
      (err) => {
        setLocating(false);
        setMessage(geolocationErrors[err.code] ?? geolocationErrors[2]);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  return (
    <Sheet label="Find your way" onClose={onClose}>
      <header className="pr-12">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-mist">
          A little guide for your day
        </p>
        <h2 className="font-script text-4xl leading-tight text-navy sm:text-5xl">
          Find your way, dear
        </h2>
      </header>

      <div
        role="tablist"
        aria-label="Destination"
        className="mt-4 inline-flex w-full rounded-full border border-white/70 bg-white/60 p-1 sm:w-auto"
      >
        {(Object.keys(destinations) as Destination[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition sm:flex-none",
              tab === key ? "bg-sky text-white shadow" : "text-mist hover:text-navy",
            )}
          >
            {destinations[key].tab}
          </button>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl border border-white/70 shadow-glass">
        <MapContainer
          center={[venue.lat, venue.lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-64 w-full sm:h-80"
          attributionControl
        >
          <TileLayer
            className="map-tiles"
            // Standard OSM tiles: free and keyless for a low-traffic page like
            // this one (CARTO's basemaps now require an API key).
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
          {/* A whisper of the theme blue over the tiles, under routes and pins. */}
          <Pane name="tint" style={{ zIndex: 250, pointerEvents: "none" }}>
            <Rectangle
              bounds={[
                [-85, -180],
                [85, 180],
              ]}
              pathOptions={{ stroke: false, fillColor: "#3E7CC4", fillOpacity: 0.08 }}
              interactive={false}
            />
          </Pane>
          {(Object.keys(destinations) as Destination[]).map((key) => (
            <Marker
              key={`${key}-${tab === key}`}
              position={[destinations[key].venue.lat, destinations[key].venue.lng]}
              icon={venueIcon(key, tab === key)}
              title={destinations[key].venue.name}
              zIndexOffset={tab === key ? 1000 : 0}
            />
          ))}
          {origin && (
            <Marker position={[origin.lat, origin.lng]} icon={youIcon} title="You" />
          )}
          {route && (
            <Polyline
              positions={route.points}
              pathOptions={{
                color: "#3E7CC4",
                weight: 5,
                dashArray: "10 12",
                lineCap: "round",
                className: "route-line",
              }}
            />
          )}
          <MapView destination={venue} origin={origin} route={route} />
        </MapContainer>
        {routeLoading && (
          <div className="absolute inset-x-0 top-3 z-[500] flex justify-center">
            <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-sky shadow">
              <Spinner /> Finding the best route…
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <label
          htmlFor="map-origin"
          className="text-[0.65rem] font-semibold uppercase tracking-widest text-mist"
        >
          Where are you coming from?
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <input
              id="map-origin"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setMessage(null);
              }}
              placeholder="Type a city, mall or landmark"
              autoComplete="off"
              role="combobox"
              aria-expanded={suggestions.length > 0}
              aria-controls="map-suggestions"
              className="h-12 w-full rounded-full border border-white/70 bg-white/80 pl-5 pr-10 text-sm text-navy placeholder:text-mist/70 focus:outline-none focus:ring-2 focus:ring-sky"
            />
            {searching && <Spinner className="absolute right-4 top-4 text-sky" />}
            {suggestions.length > 0 && (
              <ul
                id="map-suggestions"
                role="listbox"
                className="absolute inset-x-0 top-full z-[600] mt-2 overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-glass backdrop-blur"
              >
                {suggestions.map((place) => (
                  <li key={`${place.lat},${place.lng}`} role="option" aria-selected="false">
                    <button
                      type="button"
                      onClick={() => choose(place)}
                      className="flex w-full items-start gap-2 px-4 py-3 text-left text-xs text-mist transition hover:bg-cloud"
                    >
                      <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                      <span className="line-clamp-2">{place.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" onClick={useMyLocation} className="btn-secondary h-12" disabled={locating}>
            {locating ? <Spinner className="text-sky" /> : <LocateIcon className="h-4 w-4 text-sky" />}
            Use my location
          </button>
        </div>
      </form>

      {message && (
        <p role="status" className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-xs text-ink">
          {message}
        </p>
      )}

      <div className="glass mt-4 p-5">
        {route && origin ? (
          <p className="text-sm leading-relaxed text-mist">
            <span aria-hidden="true">📍 </span>
            You&apos;re about <strong className="text-navy">{route.distanceKm.toFixed(1)} km</strong>{" "}
            away from{" "}
            <span className="font-display text-2xl font-bold leading-none text-navy">{tabLabel}</span>{" "}
            — around <strong className="text-navy">{formatDuration(route.durationMin)}</strong> by car
          </p>
        ) : (
          <div>
            <p className="font-display text-3xl font-bold uppercase leading-none tracking-wide text-navy">
              {venue.name}
            </p>
            <p className="mt-1 text-sm text-mist">{venue.address}</p>
          </div>
        )}
        <a
          href={googleMapsUrl(venue.mapsQuery || venueLatLng, origin)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 w-full"
        >
          Open in Google Maps
        </a>
      </div>
    </Sheet>
  );
}
