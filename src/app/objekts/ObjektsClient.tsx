"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SearchX,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Objekt } from "@/types/objekt";
import { membersList, getMemberColor } from "@/lib/members";
import {
  ALL_OBJEKTS_JSON_URL,
  getObjektSeasons,
  getObjektClasses,
  DEFAULT_SEASONS,
  DEFAULT_CLASSES,
} from "@/lib/objekts";
import ObjektCard from "@/components/objekt-card";
import ObjektModal from "@/components/objekt-modal";
import CustomDropdown, { DropdownOption } from "@/components/custom-dropdown";
import SeasonDropdown from "@/components/season-dropdown";
import Breadcrumb from "@/components/breadcrumb";
import TriplesLogo from "@/components/triples-logo";

type SortOption =
  | "newest"
  | "oldest"
  | "collectionNoAsc"
  | "collectionNoDesc"
  | "memberAsc"
  | "memberDesc";

const SORT_OPTIONS: DropdownOption<SortOption>[] = [
  { value: "newest", label: "Latest Drop", subLabel: "recent release → S1..S24" },
  { value: "collectionNoAsc", label: "Collection Code", subLabel: "100Z → 101A → 999" },
  { value: "collectionNoDesc", label: "Code (Descending)", subLabel: "999 → 101A → 100Z" },
  { value: "oldest", label: "Oldest Drop", subLabel: "earliest release → S1..S24" },
  { value: "memberAsc", label: "Member (S1 → S24)", subLabel: "chronological reveal" },
  { value: "memberDesc", label: "Member (S24 → S1)", subLabel: "reverse reveal" },
];

const ITEMS_PER_PAGE = 30; // Divisible by 3 (mobile 10 rows) and 5 (desktop 6 rows) - zero empty slots

export default function ObjektsClient() {
  const searchParams = useSearchParams();
  const [objekts, setObjekts] = useState<Objekt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Avatar strip horizontal drag state
  const avatarTrackRef = useRef<HTMLDivElement>(null);

  const availableSeasons = useMemo(() => {
    return ["All", ...(objekts.length > 0 ? getObjektSeasons(objekts) : DEFAULT_SEASONS)];
  }, [objekts]);

  const availableClasses = useMemo(() => {
    return ["All", ...(objekts.length > 0 ? getObjektClasses(objekts) : DEFAULT_CLASSES)];
  }, [objekts]);

  const classOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: "All", label: "all", subLabel: "all rarity tiers" },
      ...availableClasses
        .filter((c) => c !== "All")
        .map((c) => ({
          value: c,
          label: c.toLowerCase(),
          subLabel: `${c} Class edition`,
        })),
    ];
  }, [availableClasses]);

  const typeOptions: DropdownOption[] = [
    { value: "All", label: "all", subLabel: "digital & physical" },
    { value: "online", label: "online", subLabel: "COSMO digital cards" },
    { value: "offline", label: "offline", subLabel: "event physical cards" },
  ];

  // Filters State (initialized with search params if present)
  const [selectedSeason, setSelectedSeason] = useState(searchParams?.get("season") || "All");
  const [selectedMember, setSelectedMember] = useState(searchParams?.get("member") || "All");
  const [selectedClass, setSelectedClass] = useState(searchParams?.get("class") || "All");
  const [selectedOnOffline, setSelectedOnOffline] = useState(searchParams?.get("format") || "All");
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams?.get("sort") as SortOption) || "newest"
  );

  // Pagination & Modal State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedObjekt, setSelectedObjekt] = useState<Objekt | null>(null);

  // Fetch Objekts JSON from Hugging Face dataset
  useEffect(() => {
    let isMounted = true;
    const loadObjekts = async () => {
      try {
        setLoading(true);

        // 1. Try Cache API first (handles 11.8MB without 5MB sessionStorage quota error)
        if (typeof window !== "undefined" && "caches" in window) {
          try {
            const cache = await caches.open("triples_objekts_v1");
            const cachedRes = await cache.match(ALL_OBJEKTS_JSON_URL);
            if (cachedRes) {
              const cachedData: Objekt[] = await cachedRes.json();
              if (isMounted && cachedData.length > 0) {
                setObjekts(cachedData);
                setLoading(false);
                return;
              }
            }
          } catch {
            // Cache API disabled or restricted
          }
        }

        // 2. Fetch from Hugging Face dataset
        const res = await fetch(ALL_OBJEKTS_JSON_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Objekts`);

        // Clone and store in Cache API for instant subsequent page visits
        if (typeof window !== "undefined" && "caches" in window) {
          try {
            const cache = await caches.open("triples_objekts_v1");
            await cache.put(ALL_OBJEKTS_JSON_URL, res.clone());
          } catch {
            // Ignore cache put failure
          }
        }

        const data: Objekt[] = await res.json();

        if (isMounted) {
          setObjekts(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load Objekts dataset");
          setLoading(false);
        }
      }
    };

    loadObjekts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedSeason,
    selectedMember,
    selectedClass,
    selectedOnOffline,
    searchQuery,
    sortBy,
  ]);

  // Client-side filtering & sorting
  const filteredObjekts = useMemo(() => {
    return objekts
      .filter((item) => {
        // Season filter
        if (selectedSeason !== "All" && item.season !== selectedSeason) {
          return false;
        }

        // Member filter
        if (
          selectedMember !== "All" &&
          item.member.toLowerCase() !== selectedMember.toLowerCase()
        ) {
          return false;
        }

        // Class filter
        if (selectedClass !== "All" && item.class !== selectedClass) {
          return false;
        }

        // Format (online / offline) filter
        if (selectedOnOffline !== "All") {
          const isOnline = selectedOnOffline === "online";
          if (isOnline && item.onOffline !== "online") return false;
          if (!isOnline && item.onOffline !== "offline") return false;
        }

        // Search query (matches collection number, slug, member name, description)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchNo = item.collectionNo?.toLowerCase().includes(query);
          const matchSlug = item.slug?.toLowerCase().includes(query);
          const matchMember = item.member?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          const matchCode = item.shortCode?.toLowerCase().includes(query);

          if (!matchNo && !matchSlug && !matchMember && !matchDesc && !matchCode) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          // 12-hour drop release window grouping (Latest drop first)
          const batchA = Math.floor((a.createdAt || 0) / 43200000);
          const batchB = Math.floor((b.createdAt || 0) / 43200000);
          if (batchB !== batchA) {
            return batchB - batchA;
          }
          // Within same drop batch: Member order S1 -> S24
          const memberDiff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
          if (memberDiff !== 0) return memberDiff;
          // Within same member in drop: Collection code ascending (e.g. 351A -> 352A)
          return (a.collectionNo || "").localeCompare(b.collectionNo || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        if (sortBy === "oldest") {
          // 12-hour drop release window grouping (Earliest drop first)
          const batchA = Math.floor((a.createdAt || 0) / 43200000);
          const batchB = Math.floor((b.createdAt || 0) / 43200000);
          if (batchA !== batchB) {
            return batchA - batchB;
          }
          const memberDiff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
          if (memberDiff !== 0) return memberDiff;
          return (a.collectionNo || "").localeCompare(b.collectionNo || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        if (sortBy === "collectionNoAsc") {
          const cmp = (a.collectionNo || "").localeCompare(b.collectionNo || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
          if (cmp !== 0) return cmp;
          return (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
        }
        if (sortBy === "collectionNoDesc") {
          const cmp = (b.collectionNo || "").localeCompare(a.collectionNo || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
          if (cmp !== 0) return cmp;
          return (b.memberSortOrder || 0) - (a.memberSortOrder || 0);
        }
        if (sortBy === "memberAsc") {
          const diff = (a.memberSortOrder || 0) - (b.memberSortOrder || 0);
          if (diff !== 0) return diff;
          return (a.collectionNo || "").localeCompare(b.collectionNo || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        if (sortBy === "memberDesc") {
          const diff = (b.memberSortOrder || 0) - (a.memberSortOrder || 0);
          if (diff !== 0) return diff;
          return (a.collectionNo || "").localeCompare(b.collectionNo || "", undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        return 0;
      });
  }, [
    objekts,
    selectedSeason,
    selectedMember,
    selectedClass,
    selectedOnOffline,
    searchQuery,
    sortBy,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredObjekts.length / ITEMS_PER_PAGE) || 1;
  const paginatedObjekts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredObjekts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredObjekts, currentPage]);

  const resetFilters = () => {
    setSelectedSeason("All");
    setSelectedMember("All");
    setSelectedClass("All");
    setSelectedOnOffline("All");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedSeason !== "All" ||
    selectedMember !== "All" ||
    selectedClass !== "All" ||
    selectedOnOffline !== "All" ||
    searchQuery.trim() !== "" ||
    sortBy !== "newest";

  const activeFilterCount = [
    selectedSeason !== "All",
    selectedMember !== "All",
    selectedClass !== "All",
    selectedOnOffline !== "All",
    searchQuery.trim() !== "",
    sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#08080A] text-zinc-950 dark:text-zinc-100 pt-20 sm:pt-24 lg:pt-28 pb-24 sm:pb-32 min-h-screen selection:bg-[#D4FF00] selection:text-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Objekts Vault" }]} />

        {/* ── 1. Page Header (Editorial High-Fashion Masthead) ── */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] sm:whitespace-nowrap">
                <span>Objekts</span>{" "}
                <span className="font-accent text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
                  Vault
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed pt-1">
                Official digital photocard archive. High-resolution front &amp; back scans across all seasons, classes, and member dimensions registered in the MODHAUS ecosystem.
              </p>
            </div>

            {/* Dynamic Status Counter Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 w-fit shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] shrink-0" aria-hidden="true" />
              <span className="font-bold text-zinc-950 dark:text-white">
                {loading ? "..." : `${filteredObjekts.length.toLocaleString()} Objekts`}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500">&bull;</span>
              <span>{availableSeasons.length - 1} Seasons</span>
            </div>
          </div>
        </div>

        {/* ── 2. Member Story Avatar Strip (Official MODHAUS Colors) ── */}
        <div className="mb-6 py-2 px-0.5 overflow-x-auto no-scrollbar" ref={avatarTrackRef}>
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* OT24 / ALL Bubble */}
            <button
              type="button"
              onClick={() => setSelectedMember("All")}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] transition-all duration-200 ${
                  selectedMember === "All"
                    ? "ring-2 ring-zinc-950 dark:ring-[#D4FF00] scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-[#14141B] border border-zinc-200/80 dark:border-white/10 flex items-center justify-center font-mono font-bold text-[11px] sm:text-xs text-zinc-950 dark:text-white shadow-sm">
                  0T24
                </div>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-mono tracking-tight transition-colors ${
                  selectedMember === "All"
                    ? "text-zinc-950 dark:text-white font-bold"
                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                }`}
              >
                ALL
              </span>
            </button>

            {/* 24 Member Bubbles with Official MODHAUS Identity Colors */}
            {membersList.map((m) => {
              const isSelected = selectedMember.toLowerCase() === m.name.toLowerCase();
              const mColor = getMemberColor(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMember(isSelected ? "All" : m.name)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                  title={`${m.name} (S${m.id})`}
                >
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] transition-all duration-200 ${
                      isSelected ? "scale-105" : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      border: isSelected ? `2px solid ${mColor}` : "2px solid transparent",
                      boxShadow: isSelected ? `0 0 14px ${mColor}40` : undefined,
                    }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10">
                      <Image
                        src={m.image.startsWith("http") ? m.image : `https://i.imgur.com/${m.image}`}
                        alt={`${m.name} (S${m.id}) avatar`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div
                      className="absolute bottom-0 right-0 px-1 py-0.2 rounded-full text-[8px] font-mono font-bold text-white bg-black/85 border border-white/20 shadow-sm"
                      style={{ color: mColor === "#FFFFFF" ? "#FFFFFF" : mColor }}
                    >
                      S{m.id < 10 ? `0${m.id}` : m.id}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono tracking-tight truncate max-w-[56px] text-center transition-colors ${
                      isSelected
                        ? "text-zinc-950 dark:text-white font-bold"
                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                    }`}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. Unified Curator Control Bar (Filter Suite) ── */}
        <div className="mb-8 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-3 relative z-20">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Season Dropdown */}
            <SeasonDropdown
              selectedSeason={selectedSeason}
              seasons={availableSeasons}
              onSelectSeason={(s) => setSelectedSeason(s)}
              className="w-full sm:w-auto flex-1 min-w-[140px]"
            />

            {/* Class Filter */}
            <CustomDropdown
              label="Class"
              value={selectedClass}
              options={classOptions}
              onChange={(c) => setSelectedClass(c)}
              className="w-[calc(50%-0.375rem)] sm:w-auto flex-1 min-w-[110px]"
            />

            {/* Format Filter */}
            <CustomDropdown
              label="Format"
              value={selectedOnOffline}
              options={typeOptions}
              onChange={(t) => setSelectedOnOffline(t)}
              className="w-[calc(50%-0.375rem)] sm:w-auto flex-1 min-w-[110px]"
            />

            {/* Sort Dropdown */}
            <CustomDropdown<SortOption>
              label="Sort"
              value={sortBy}
              options={SORT_OPTIONS}
              onChange={(s) => setSortBy(s)}
              className="w-full sm:w-auto flex-1 min-w-[140px]"
            />

            {/* Search Input */}
            <div className="relative w-full sm:flex-1 min-w-[180px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search collection No. / member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-black dark:hover:text-white p-1"
                  aria-label="Clear search input"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips & Clear Action */}
          {hasActiveFilters && (
            <div className="pt-2.5 border-t border-zinc-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1">
                  Active Filters:
                </span>
                {selectedMember !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    Member: {selectedMember}
                    <button onClick={() => setSelectedMember("All")} className="hover:text-black dark:hover:text-white ml-1">✕</button>
                  </span>
                )}
                {selectedSeason !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    Season: {selectedSeason}
                    <button onClick={() => setSelectedSeason("All")} className="hover:text-black dark:hover:text-white ml-1">✕</button>
                  </span>
                )}
                {selectedClass !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    Class: {selectedClass}
                    <button onClick={() => setSelectedClass("All")} className="hover:text-black dark:hover:text-white ml-1">✕</button>
                  </span>
                )}
                {selectedOnOffline !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    Format: {selectedOnOffline}
                    <button onClick={() => setSelectedOnOffline("All")} className="hover:text-black dark:hover:text-white ml-1">✕</button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    Query: &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")} className="hover:text-black dark:hover:text-white ml-1">✕</button>
                  </span>
                )}
                {sortBy !== "newest" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                    Sort: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                    <button onClick={() => setSortBy("newest")} className="hover:text-black dark:hover:text-white ml-1">✕</button>
                  </span>
                )}
              </div>

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-zinc-500 hover:text-black dark:hover:text-white underline underline-offset-2 ml-auto"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset all ({activeFilterCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 4. Main Objekts Grid (3-cols Mobile, 5-cols Desktop) ── */}
        {loading ? (
          /* Loading Skeletons with official tripleS logo */
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5 md:gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="group relative aspect-[1/1.55] rounded-xl sm:rounded-2xl md:rounded-3xl bg-zinc-100 dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/5 overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 select-none shadow-sm"
                >
                  {/* Subtle top hairline rim bevel highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent pointer-events-none" />

                  {/* Soft radial glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-white/[0.02] to-transparent pointer-events-none" />

                  {/* Official tripleS ribbon logo with gentle breathing pulse */}
                  <div className="relative text-zinc-300 dark:text-zinc-800 animate-pulse">
                    <TriplesLogo
                      width={44}
                      height={44}
                      strokeWidth={170}
                      strokeColor="currentColor"
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11"
                    />
                  </div>

                  {/* Subtle bottom placeholder metadata notches */}
                  <div className="absolute bottom-2.5 sm:bottom-3.5 inset-x-3 sm:inset-x-4 flex items-center justify-between opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="h-1 sm:h-1.5 w-6 sm:w-8 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                    <div className="h-1 sm:h-1.5 w-4 sm:w-5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-[#D4FF00] animate-ping" />
              <span>Indexing 11,400+ digital photocards...</span>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10">
            <p className="font-mono text-sm text-rose-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-zinc-950 text-white hover:bg-black dark:bg-[#D4FF00] dark:text-black dark:hover:bg-[#E2FF33] text-xs font-mono font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredObjekts.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#0D0D12] border border-zinc-200/80 dark:border-white/10 shadow-sm">
            <SearchX className="h-8 w-8 text-zinc-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
              No Objekts Found
            </h3>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              No photocards match the selected criteria. Try adjusting season, member, or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 btn-magnetic inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-zinc-950 text-white hover:bg-black dark:bg-[#D4FF00] dark:text-black dark:hover:bg-[#E2FF33] text-xs font-mono font-bold"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          /* Loaded Photocard Grid (Preserved Cards Intact) */
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5 md:gap-4">
              {paginatedObjekts.map((objekt, idx) => (
                <ObjektCard
                  key={objekt.id || `${objekt.slug}-${idx}`}
                  objekt={objekt}
                  onSelect={(o) => setSelectedObjekt(o)}
                  priority={idx < 6}
                />
              ))}
            </div>

            {/* ── 5. Pagination Bar ── */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200/80 dark:border-white/10">
                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Page <span className="font-bold text-zinc-950 dark:text-white">{currentPage}</span> of{" "}
                  <span className="font-bold text-zinc-950 dark:text-white">{totalPages}</span> ({filteredObjekts.length.toLocaleString()} total items)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-400 dark:hover:border-white/30 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs px-2 text-zinc-500 dark:text-zinc-400">
                    <span>{currentPage}</span>
                    <span>/</span>
                    <span>{totalPages}</span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white dark:bg-[#0D0D12] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-400 dark:hover:border-white/30 transition-colors shadow-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 6. High-Res Flip Modal Preview ── */}
      {selectedObjekt && (
        <ObjektModal
          objekt={selectedObjekt}
          onClose={() => setSelectedObjekt(null)}
        />
      )}
    </div>
  );
}
