"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Spinner from "./Spinner";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
  Zap,
} from "lucide-react";
import EventCard from "./EventCard";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryKey = "all" | "concert" | "sports" | "festival" | "comedy";
type SortKey = "date-asc" | "price-asc" | "price-desc" | "capacity-desc";

function getEventCategory(name: string, description: string): CategoryKey {
  const text = `${name} ${description}`.toLowerCase();
  if (
    text.includes("premier league") ||
    text.includes("ipl") ||
    text.includes("formula 1") ||
    text.includes("f1") ||
    text.includes("grand prix") ||
    text.includes("vs")
  ) {
    return "sports";
  }
  if (
    text.includes("standup") ||
    text.includes("comedy") ||
    text.includes("samay") ||
    text.includes("unfiltered")
  ) {
    return "comedy";
  }
  if (
    text.includes("sunburn") ||
    text.includes("lollapalooza") ||
    text.includes("festival") ||
    text.includes("garrix")
  ) {
    return "festival";
  }
  return "concert";
}

const EventList = () => {
  const router = useRouter();
  const events = useQuery(api.events.get);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [sortBy, setSortBy] = useState<SortKey>("date-asc");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter((event) => event.eventDate > Date.now())
      .sort((a, b) => a.eventDate - b.eventDate);
  }, [events]);

  const pastEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter((event) => event.eventDate <= Date.now())
      .sort((a, b) => b.eventDate - a.eventDate);
  }, [events]);

  const filteredUpcoming = useMemo(() => {
    const list = upcomingEvents.filter((ev) => {
      const catMatch =
        activeCategory === "all" ||
        getEventCategory(ev.name, ev.description) === activeCategory;
      const cityMatch =
        cityFilter === "all" ||
        ev.location.toLowerCase().includes(cityFilter.toLowerCase());
      return catMatch && cityMatch;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "capacity-desc") return b.totalTickets - a.totalTickets;
      return a.eventDate - b.eventDate;
    });
  }, [upcomingEvents, activeCategory, cityFilter, sortBy]);

  if (!events) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const totalSeats = upcomingEvents.reduce(
    (acc, ev) => acc + (ev.totalTickets || 0),
    0
  );

  // Pick a spotlight event dynamically from Convex upcoming events
  const spotlightEvent =
    upcomingEvents.find((e) => e.name.toLowerCase().includes("coldplay")) ||
    upcomingEvents[0];

  const categories: {
    id: CategoryKey;
    label: string;
    count: number;
  }[] = [
    { id: "all", label: "All Events", count: upcomingEvents.length },
    {
      id: "concert",
      label: "Concerts & Tours",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "concert"
      ).length,
    },
    {
      id: "sports",
      label: "Sports & Stadium",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "sports"
      ).length,
    },
    {
      id: "festival",
      label: "Festivals & EDM",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "festival"
      ).length,
    },
    {
      id: "comedy",
      label: "Standup Comedy",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "comedy"
      ).length,
    },
  ];

  const cities = ["all", "Kolkata", "Mumbai", "New Delhi", "Greater Noida"];

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      {/* Premium Dark Hero Showcase */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0B0F19] p-6 text-white shadow-2xl sm:p-10 lg:p-12">
        {/* Subtle Radial Accent Glows */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Editorial Headline & Metrics */}
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Real-Time Convex Queue Engine &bull; Instant Stripe Connect
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl sm:leading-[1.12]">
              Book Verified Tickets for{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Iconic Live Events.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Zero scalper bots. Real-time seat locks with automatic queue
              offers, instant QR ticket issuance, and direct multi-vendor
              payouts.
            </p>

            {/* Live Platform Metrics Strip */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="block text-xl font-black text-white sm:text-2xl">
                  {upcomingEvents.length}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Live Upcoming Shows
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="block text-xl font-black text-emerald-400 sm:text-2xl">
                  {totalSeats.toLocaleString("en-IN")}+
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Verified Capacity
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="block text-xl font-black text-cyan-300 sm:text-2xl">
                  &lt;150ms
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Live Queue Sync
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="block text-xl font-black text-amber-300 sm:text-2xl">
                  100%
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Buyer Protection
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Featured Spotlight Card */}
          {spotlightEvent && (
            <div className="lg:col-span-5">
              <div
                onClick={() => router.push(`/event/${spotlightEvent._id}`)}
                className="group cursor-pointer rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-5 shadow-xl backdrop-blur-xl transition-all duration-200 hover:border-blue-400/50 hover:bg-white/10"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    Featured Headliner
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {new Date(spotlightEvent.eventDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold leading-snug text-white group-hover:text-blue-300 transition-colors">
                  {spotlightEvent.name}
                </h3>

                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                  <span className="truncate">{spotlightEvent.location}</span>
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-400">
                  {spotlightEvent.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                      Official Tier Price
                    </span>
                    <span className="text-lg font-black text-white">
                      ₹{spotlightEvent.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition group-hover:bg-blue-500">
                    Book Spotlight Pass
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Category & Filter Controls Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0D111A] p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-slate-900 dark:bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100/80 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    isActive
                      ? "bg-blue-600 dark:bg-slate-950/40 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* City & Sort Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-3 lg:border-t-0 lg:pt-0">
          {/* City Filter Pills */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 dark:bg-slate-900 p-1">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  cityFilter === city
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {city === "all" ? "All Cities" : city}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="date-asc">Sort: Date (Soonest)</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="capacity-desc">Sort: Stadium Capacity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeCategory === "all"
              ? "All Upcoming Events"
              : categories.find((c) => c.id === activeCategory)?.label}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Showing {filteredUpcoming.length} verified live{" "}
            {filteredUpcoming.length === 1 ? "event" : "events"}{" "}
            {cityFilter !== "all" ? `in ${cityFilter}` : "across India"}
          </p>
        </div>

        {(activeCategory !== "all" || cityFilter !== "all") && (
          <button
            onClick={() => {
              setActiveCategory("all");
              setCityFilter("all");
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 underline underline-offset-4"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Upcoming Events Full-Width Grid */}
      {filteredUpcoming.length > 0 ? (
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUpcoming.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="mb-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D111A] p-12 text-center shadow-sm">
          <Ticket className="mx-auto mb-3 h-10 w-10 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching events found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try clearing your category or city filter to see all{" "}
            {upcomingEvents.length} upcoming shows.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setCityFilter("all");
            }}
            className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
          >
            Show All {upcomingEvents.length} Events
          </button>
        </div>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Past Events Archive
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Previously hosted events on Ticketr
              </p>
            </div>
            <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {pastEvents.length} Concluded
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        </div>
      )}

      {/* Platform Guarantees & Architecture Footer */}
      <div className="mt-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0D111A] p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Real-Time Queue & Seat Locks
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Powered by Convex reactive subscriptions. When a buyer joins the
                queue, tickets are atomically reserved with a live expiration
                timer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                100% Verified QR Entry
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Every ticket purchase generates a cryptographically unique QR
                pass linked directly to your account—eliminating duplicate PDFs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Instant Stripe Connect Split Payouts
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Event organizers onboard via Stripe Connect and receive automated
                direct payouts upon checkout with automated refund protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
