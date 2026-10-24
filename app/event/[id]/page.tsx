"use client";

import EventCard from "@/components/EventCard";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft, CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useStorageUrl } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import JoinQueue from "@/components/JoinQueue";

export default function EventPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const event = useQuery(api.events.getEventById, {
    eventId: params.id as Id<"events">,
  });
  const availability = useQuery(api.events.getEventAvailability, {
    eventId: params.id as Id<"events">,
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50 dark:bg-[#09090B]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-[#09090B] py-8 sm:py-10">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Events
        </button>

        <div className="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200 dark:border-zinc-800/90 overflow-hidden">
          {imageUrl && (
            <div className="aspect-[21/7] relative w-full bg-zinc-950">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {event.name}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column - Event Details */}
              <div className="lg:col-span-8 space-y-8">
                {!imageUrl && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                    {event.name}
                  </h1>
                )}

                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
                    About
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    <div className="flex items-center text-zinc-500 dark:text-zinc-400 mb-1">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Date</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {new Date(event.eventDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    <div className="flex items-center text-zinc-500 dark:text-zinc-400 mb-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Venue</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {event.location}
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    <div className="flex items-center text-zinc-500 dark:text-zinc-400 mb-1">
                      <Ticket className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Price</span>
                    </div>
                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      ₹{event.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                    <div className="flex items-center text-zinc-500 dark:text-zinc-400 mb-1">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Availability</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {(
                        availability.totalTickets - availability.purchasedCount
                      ).toLocaleString("en-IN")}{" "}
                      / {availability.totalTickets.toLocaleString("en-IN")} left
                    </p>
                  </div>
                </div>

                {/* Event Information */}
                <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                    Venue & Entry Guidelines
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <li>&bull; Doors open 60 minutes before the scheduled start time.</li>
                    <li>&bull; Digital QR ticket is required at entry.</li>
                    <li>&bull; Full automatic refund if the event is cancelled by the organizer.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Ticket Purchase Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-4">
                  <EventCard eventId={params.id as Id<"events">} />
                  {user ? (
                    <JoinQueue
                      eventId={params.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full bg-zinc-900 dark:bg-white hover:opacity-90 text-white dark:text-zinc-950 font-semibold py-5 px-6 rounded-xl transition-opacity text-xs">
                        Sign in to buy tickets
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
