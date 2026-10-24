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
      <div className="min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-[#07090E]">
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090E] py-12 transition-colors duration-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Search Results Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Search Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              Found {searchResults.length} matching events
            </p>
          </div>
        </div>

        {/* No Results State */}
        {searchResults.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#0D111A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No events found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              Try adjusting your search terms or browse all upcoming events
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
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
