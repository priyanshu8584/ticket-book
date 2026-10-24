"use client";

import { api } from "@/convex/_generated/api";
import { useStorageUrl } from "@/lib/utils";
import { useQuery } from "convex/react";
import Spinner from "./Spinner";
import { ArrowRight, CalendarDays, MapPin, Ticket } from "lucide-react";
import EventCard from "./EventCard";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CategoryKey = "all" | "concert" | "sports" | "festival" | "comedy";
type SortKey = "date-asc" | "price-asc" | "price-desc";

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

  const spotlightEvent =
    upcomingEvents.find((e) => e.name.toLowerCase().includes("coldplay")) ||
    upcomingEvents[0];

  const spotlightImageUrl = useStorageUrl(spotlightEvent?.imageStorageId);

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

  const categories: {
    id: CategoryKey;
    label: string;
    count: number;
  }[] = [
    { id: "all", label: "All Events", count: upcomingEvents.length },
    {
      id: "concert",
      label: "Concerts",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "concert"
      ).length,
    },
    {
      id: "sports",
      label: "Sports",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "sports"
      ).length,
    },
    {
      id: "festival",
      label: "Festivals",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "festival"
      ).length,
    },
    {
      id: "comedy",
      label: "Comedy",
      count: upcomingEvents.filter(
        (e) => getEventCategory(e.name, e.description) === "comedy"
      ).length,
    },
  ];

  const cities = ["all", "Kolkata", "Mumbai", "New Delhi", "Greater Noida"];

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10">
      {/* Editorial Featured Event Banner */}
      {spotlightEvent && (
        <div
          onClick={() => router.push(`/event/${spotlightEvent._id}`)}
          className="group relative mb-10 cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-zinc-950"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Content */}
            <div className="relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:col-span-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-zinc-200">
                  <span>Featured Event</span>
                </div>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl lg:leading-[1.15]">
                  {spotlightEvent.name}
                </h1>

                <p className="mt-3 max-w-xl line-clamp-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {spotlightEvent.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-zinc-400" />
                    <span>
                      {new Date(spotlightEvent.eventDate).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    <span>{spotlightEvent.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-[11px] text-zinc-400">
                      Tickets from
                    </span>
                    <span className="text-base font-bold text-white">
                      ₹{spotlightEvent.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200">
                    <span>Get Tickets</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative min-h-[240px] lg:col-span-5 lg:min-h-[340px] bg-zinc-900 overflow-hidden">
              {spotlightImageUrl && (
                <Image
                  src={spotlightImageUrl}
                  alt={spotlightEvent.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-zinc-950 lg:via-zinc-950/20 lg:to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Single Clean Filter & Navigation Bar */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-4 lg:flex-row lg:items-center">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] ${
                    isActive
                      ? "text-zinc-300 dark:text-zinc-600"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* City & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === "all" ? "All Locations" : city}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 cursor-pointer"
          >
            <option value="date-asc">Date: Soonest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Upcoming Events Grid */}
      {filteredUpcoming.length > 0 ? (
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUpcoming.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="mb-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] p-12 text-center">
          <Ticket className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            No events match your filters
          </h3>
          <button
            onClick={() => {
              setActiveCategory("all");
              setCityFilter("all");
            }}
            className="mt-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800/80 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Past Events
            </h2>
            <span className="text-xs text-zinc-500">
              {pastEvents.length} archived
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
