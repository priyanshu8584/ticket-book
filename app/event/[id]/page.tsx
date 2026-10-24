"use client";

import EventCard from "@/components/EventCard";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#07090E]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#07090E] py-8 sm:py-12 transition-colors duration-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D111A] px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Events
        </button>

        <div className="bg-white dark:bg-[#0D111A] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-sm overflow-hidden">
          {imageUrl && (
            <div className="aspect-[21/8] relative w-full bg-slate-950">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D111A] via-slate-950/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Official Verified Event
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {event.name}
                  </h1>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column - Event Details */}
              <div className="lg:col-span-7 space-y-8">
                {!imageUrl && (
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {event.name}
                  </h1>
                )}

                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    About This Event
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {event.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50/90 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1.5">
                      <CalendarDays className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {new Date(event.eventDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="bg-slate-50/90 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1.5">
                      <MapPin className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Venue Location
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {event.location}
                    </p>
                  </div>

                  <div className="bg-slate-50/90 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1.5">
                      <Ticket className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Ticket Price
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{event.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-slate-50/90 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1.5">
                      <Users className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Live Availability
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {(
                        availability.totalTickets - availability.purchasedCount
                      ).toLocaleString("en-IN")}{" "}
                      / {availability.totalTickets.toLocaleString("en-IN")}{" "}
                      seats remaining
                    </p>
                  </div>
                </div>

                {/* Additional Event Information */}
                <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/70 dark:border-blue-500/20 rounded-2xl p-6">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-950 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Entry & Buyer Protection Guidelines
                  </h3>
                  <ul className="space-y-2.5 text-sm text-blue-900/90 dark:text-slate-300 font-medium">
                    <li>
                      &bull; Doors open 60 minutes prior to the scheduled show
                      start time.
                    </li>
                    <li>
                      &bull; Instant QR code pass is generated inside &ldquo;My
                      Tickets&rdquo; immediately after Stripe checkout.
                    </li>
                    <li>
                      &bull; 100% automatic refund guarantee if the event is
                      cancelled by the organizer.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Ticket Purchase Card */}
              <div className="lg:col-span-5">
                <div className="sticky top-24 space-y-4">
                  <EventCard eventId={params.id as Id<"events">} />
                  {user ? (
                    <JoinQueue
                      eventId={params.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-6 rounded-2xl transition-all duration-150 shadow-md hover:shadow-lg text-sm">
                        Sign In to Reserve Tickets
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
