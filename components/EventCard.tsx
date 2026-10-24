"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  ArrowUpRight,
  Check,
  CircleArrowRight,
  LoaderCircle,
  MapPin,
  PencilIcon,
  Ticket,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import PurchaseTicket from "./PurchaseTicket";

function getCategoryLabel(name: string, description: string) {
  const text = `${name} ${description}`.toLowerCase();
  if (
    text.includes("premier league") ||
    text.includes("ipl") ||
    text.includes("formula 1") ||
    text.includes("f1") ||
    text.includes("grand prix") ||
    text.includes("vs")
  ) {
    return "Sports";
  }
  if (
    text.includes("standup") ||
    text.includes("comedy") ||
    text.includes("samay") ||
    text.includes("unfiltered")
  ) {
    return "Comedy";
  }
  if (
    text.includes("sunburn") ||
    text.includes("lollapalooza") ||
    text.includes("festival") ||
    text.includes("garrix")
  ) {
    return "Festival";
  }
  return "Concert";
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
  const categoryLabel = getCategoryLabel(event.name, event.description);
  const eventDateObj = new Date(event.eventDate);

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status === "waiting") return null;

    if (soldOut) {
      return (
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5">
          <span className="text-xs text-zinc-500">Sold out</span>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      return (
        <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5">
          <div className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
            <CircleArrowRight className="mr-1.5 h-3.5 w-3.5" />
            Next in line (#{queuePosition.position})
          </div>
          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-amber-500" />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-xs">
        <span className="flex items-center text-zinc-600 dark:text-zinc-400">
          <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          Queue position
        </span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          #{queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) return null;

    if (isEventOwner) {
      return (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/seller/events/${eventId}/edit`);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Edit Event
          </button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5">
          <span className="flex items-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <Check className="mr-1.5 h-3.5 w-3.5" />
            Ticket owned
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tickets/${userTicket._id}`);
            }}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 underline underline-offset-2"
          >
            View
          </button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-3">
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-600 dark:text-red-400 flex items-center">
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Offer expired
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
      className={`group flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#121215] transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700 ${
        isPastEvent ? "opacity-65 hover:opacity-100" : ""
      }`}
    >
      <div>
        {/* Event Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900">
              <Ticket className="h-10 w-10 text-zinc-700" />
            </div>
          )}

          {/* Subtle Top Pill */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-md bg-zinc-950/75 px-2.5 py-1 text-[11px] font-medium text-zinc-100 backdrop-blur-md">
              {categoryLabel}
            </span>
          </div>

          {soldOut && (
            <div className="absolute right-3 top-3">
              <span className="rounded-md bg-red-600/90 px-2.5 py-1 text-[11px] font-medium text-white">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Date & Time line */}
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {eventDateObj.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            &middot;{" "}
            {eventDateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {/* Title */}
          <h2 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-white">
            {event.name}
          </h2>

          {/* Venue */}
          <div className="mt-2 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span className="truncate">{event.location}</span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {!isPastEvent && renderTicketStatus()}
          </div>
        </div>
      </div>

      {/* Clean Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 px-4 py-3 sm:px-5">
        <div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            ₹{event.price.toLocaleString("en-IN")}
          </span>
          <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            onwards
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
          <span>
            {isPastEvent
              ? "Ended"
              : soldOut
                ? "Waitlist"
                : `${remainingTickets.toLocaleString("en-IN")} left`}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
