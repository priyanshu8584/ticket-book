import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { Ticket } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950">
              <Ticket className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              ticketr
            </span>
          </Link>
        </div>

        {/* Center Search */}
        <div className="hidden md:block w-full max-w-md">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <SignedIn>
            <div className="flex items-center gap-2.5">
              <Link href="/seller">
                <button className="rounded-lg bg-zinc-900 dark:bg-white px-3.5 py-2 text-xs font-medium text-white dark:text-zinc-950 transition hover:opacity-90">
                  Sell Tickets
                </button>
              </Link>
              <Link href="/tickets">
                <button className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  My Tickets
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-xs font-medium text-white dark:text-zinc-950 transition hover:opacity-90">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/60 px-4 py-2.5 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
