import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, type NextFetchEvent } from "next/server";

const baseClerkMiddleware = clerkMiddleware();

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  // On production domains (e.g. Vercel), run standard Clerk middleware with fallback safety
  if (
    req.nextUrl.hostname !== "localhost" &&
    req.nextUrl.hostname !== "127.0.0.1"
  ) {
    try {
      return await baseClerkMiddleware(req, event);
    } catch {
      // Fall through to safe pass-through if secret key is missing/invalid
    }
  }

  // Localhost safe pass-through without dev-browser handshake redirect loops:
  if (req.nextUrl.searchParams.has("__clerk_handshake")) {
    const cleanUrl = req.nextUrl.clone();
    cleanUrl.searchParams.delete("__clerk_handshake");
    return NextResponse.redirect(cleanUrl);
  }

  const headers = new Headers(req.headers);
  headers.delete("cookie");
  headers.set("accept", "*/*");
  headers.delete("sec-fetch-dest");
  headers.delete("sec-fetch-mode");

  const cleanReq = new NextRequest(req.url, {
    method: req.method,
    headers,
  });

  return await baseClerkMiddleware(cleanReq, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
