"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 w-4 h-4 transition-colors duration-150" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists, stadiums, cities, or tours..."
          className="w-full py-2.5 pl-11 pr-24 bg-slate-100/80 hover:bg-slate-100 focus:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 dark:focus:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-full border border-slate-200/90 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-150"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150 shadow-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
}
