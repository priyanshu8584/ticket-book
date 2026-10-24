"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/EventCard";
import { Search } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchResults = useQuery(api.events.search, { searchTerm: query });

  if (!searchResults) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-zinc-50/50 dark:bg-[#09090B]">
        <Spinner />
      </div>
    );
  }

  const upcomingEvents = searchResults
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);

  const pastEvents = searchResults
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-[#09090B] py-10">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Search Results Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="w-5 h-5 text-zinc-400" />
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 text-xs">
              {searchResults.length} events found
            </p>
          </div>
        </div>

        {/* No Results State */}
        {searchResults.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <Search className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              No events found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-xs">
              Try a different artist, venue, or city
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
              Past Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
