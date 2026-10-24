import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { ShieldCheck, Sparkles, Ticket } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#07090E]/85 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center gap-3.5 px-4 py-3 sm:px-6 lg:flex-row lg:px-10 xl:px-12">
        <div className="flex w-full items-center justify-between lg:w-auto">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-600/25 transition-transform duration-150 group-hover:scale-105">
              <Ticket className="h-4 w-4 -rotate-12" />
            </div>
            <Image
              src="/logo.png"
              alt="Ticketr"
              width={110}
              height={36}
              className="w-24 lg:w-28 object-contain dark:brightness-125 dark:contrast-125"
            />
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className="w-full lg:max-w-xl lg:ml-6">
          <SearchBar />
        </div>

        <div className="ml-auto hidden lg:flex lg:items-center lg:gap-3">
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 xl:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verified Fan-to-Fan &bull; Stripe Connect</span>
          </div>

          <ThemeToggle />

          <SignedIn>
            <div className="flex items-center gap-2.5">
              <Link href="/seller">
                <button className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sell Tickets
                </button>
              </Link>
              <Link href="/tickets">
                <button className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  My Tickets
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full bg-slate-900 dark:bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600 dark:hover:bg-blue-500">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex w-full justify-center gap-2.5 lg:hidden">
          <SignedIn>
            <Link href="/seller" className="flex-1">
              <button className="w-full rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500">
                Sell Tickets
              </button>
            </Link>
            <Link href="/tickets" className="flex-1">
              <button className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                My Tickets
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
