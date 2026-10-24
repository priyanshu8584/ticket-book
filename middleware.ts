import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, type NextFetchEvent } from "next/server";

const baseClerkMiddleware = clerkMiddleware();

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  // When a real CLERK_SECRET_KEY is configured (e.g., on Vercel production), run standard Clerk middleware
  const secretKey = process.env.CLERK_SECRET_KEY || "";
  if (secretKey && !secretKey.includes("placeholder")) {
    return await baseClerkMiddleware(req, event);
  }

  // Local development fallback when CLERK_SECRET_KEY is not present:
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
