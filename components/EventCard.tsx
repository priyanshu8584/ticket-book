"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CircleArrowRight,
  Flame,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  Ticket,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import PurchaseTicket from "./PurchaseTicket";

function inferCategory(name: string, description: string) {
  const text = `${name} ${description}`.toLowerCase();
  if (
    text.includes("premier league") ||
    text.includes("ipl") ||
    text.includes("formula 1") ||
    text.includes("f1") ||
    text.includes("grand prix") ||
    text.includes("vs")
  ) {
    return {
      label: "Sports & Arena",
      badgeClass: "bg-amber-500/95 text-slate-950",
    };
  }
  if (
    text.includes("standup") ||
    text.includes("comedy") ||
    text.includes("samay") ||
    text.includes("unfiltered")
  ) {
    return {
      label: "Standup Comedy",
      badgeClass: "bg-fuchsia-500/95 text-white",
    };
  }
  if (
    text.includes("sunburn") ||
    text.includes("lollapalooza") ||
    text.includes("festival") ||
    text.includes("garrix")
  ) {
    return {
      label: "Music Festival",
      badgeClass: "bg-cyan-400/95 text-slate-950",
    };
  }
  return {
    label: "Live Concert",
    badgeClass: "bg-indigo-500/95 text-white",
  };
}

const EventCard = ({ eventId }: { eventId: Id<"events"> }) => {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getEventById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) return null;

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event?.userId;
  const remainingTickets = Math.max(
    0,
    availability.totalTickets - availability.purchasedCount
  );
  const soldOut = remainingTickets === 0;
  const category = inferCategory(event.name, event.description);
  const eventDateObj = new Date(event.eventDate);
  const monthShort = eventDateObj
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const dayNum = eventDateObj.toLocaleDateString("en-US", { day: "2-digit" });

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status === "waiting") return null;

    if (soldOut) {
      return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3">
          <div className="flex items-center">
            <Ticket className="mr-2 h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Event is sold out
            </span>
          </div>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      return (
        <div className="flex flex-col items-center justify-between rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 lg:flex-row">
          <div className="flex items-center">
            <CircleArrowRight className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Next in line! (#{queuePosition.position})
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="mr-1 h-3.5 w-3.5 animate-spin text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-amber-700 dark:text-amber-300">
              Waiting for release
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between rounded-xl border border-blue-100 dark:border-blue-500/30 bg-blue-50/80 dark:bg-blue-500/10 p-3">
        <div className="flex items-center">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
            Queue position
          </span>
        </div>
        <span className="rounded-full bg-blue-100 dark:bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
          #{queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) return null;

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/seller/events/${eventId}/edit`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-150 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Manage / Edit Event
          </button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-500/10 p-3">
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Ticket Confirmed!
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tickets/${userTicket._id}`);
            }}
            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            View Pass
          </button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-4">
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3">
              <span className="flex items-center text-xs font-semibold text-red-700 dark:text-red-300">
                <XCircle className="mr-1.5 h-4 w-4" />
                Queue reservation expired
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0D111A] shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:border-blue-500/50 dark:hover:border-blue-500/60 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-blue-500/10 ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      <div>
        {/* Event Poster Header */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-950">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900">
              <Ticket className="h-14 w-14 text-white/20" />
            </div>
          )}

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D111A] via-slate-950/25 to-slate-950/35" />

          {/* Top Bar: Category Badge + Stacked Date Pill */}
          <div className="absolute left-3.5 right-3.5 top-3.5 flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md ${category.badgeClass}`}
            >
              {category.label}
            </span>

            <div className="flex flex-col items-center justify-center rounded-xl border border-white/20 bg-slate-950/80 px-2.5 py-1 text-center text-white shadow-md backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-widest text-blue-400">
                {monthShort}
              </span>
              <span className="text-sm font-black leading-tight">{dayNum}</span>
            </div>
          </div>

          {/* Bottom Bar: Price & Live Availability Badge */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Starting from
              </span>
              <span className="inline-block rounded-lg bg-white/95 dark:bg-slate-950/90 dark:border dark:border-white/15 px-3 py-1 text-base font-black tracking-tight text-slate-950 dark:text-white shadow-md">
                ₹{event.price.toLocaleString("en-IN")}
              </span>
            </div>

            {soldOut ? (
              <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Sold Out
              </span>
            ) : (
              !isPastEvent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/95 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-pulse" />
                  {remainingTickets < 400 ? "Selling Fast" : "Tickets Live"}
                </span>
              )
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="w-full">
              {isEventOwner && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  <StarIcon className="h-3 w-3" />
                  Organizer
                </span>
              )}
              <h2 className="line-clamp-2 min-h-[3.25rem] text-lg font-extrabold leading-snug tracking-tight text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {event.name}
              </h2>
            </div>

            {isPastEvent && (
              <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Concluded
              </span>
            )}
          </div>

          {/* Venue & Date Metadata */}
          <div className="mt-3.5 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center text-slate-600 dark:text-slate-300">
              <div className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                {event.location}
              </span>
            </div>

            <div className="flex items-center text-slate-600 dark:text-slate-300">
              <div className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <CalendarDays className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {eventDateObj.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                &bull;{" "}
                {eventDateObj.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Live Capacity & Queue Meter */}
          <div className="mt-4 rounded-xl border border-slate-100 dark:border-slate-800/90 bg-slate-50/90 dark:bg-slate-900/70 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <Flame className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                <span>
                  {remainingTickets.toLocaleString("en-IN")} of{" "}
                  {availability.totalTickets.toLocaleString("en-IN")} seats left
                </span>
              </span>
              {!isPastEvent && availability.activeOffers > 0 ? (
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {availability.activeOffers} in queue
                </span>
              ) : (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Instant Entry
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(18, 100 - Math.round((remainingTickets / Math.max(1, availability.totalTickets)) * 75)))}%`,
                }}
              />
            </div>
          </div>

          <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
            {event.description}
          </p>

          <div onClick={(e) => e.stopPropagation()}>
            {!isPastEvent && renderTicketStatus()}
          </div>
        </div>
      </div>

      {/* Interactive Card Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 px-5 py-3.5 transition-colors duration-150 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 sm:px-6">
        <div className="flex items-center justify-between text-xs font-bold tracking-wide text-slate-800 dark:text-slate-200 transition-colors duration-150 group-hover:text-white">
          <span>
            {isPastEvent
              ? "View Event Summary"
              : soldOut
                ? "Join Waitlist Queue"
                : "Reserve Verified Tickets"}
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
