"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Calendar,
} from "lucide-react";
import { Objekt } from "@/types/objekt";
import { membersList } from "@/lib/members";
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

type SortOption =
  | "newest"
  | "oldest"
  | "collectionNoAsc"
  | "collectionNoDesc"
  | "memberAsc"
  | "memberDesc";

const SORT_OPTIONS: DropdownOption<SortOption>[] = [
  { value: "newest", label: "Newest", subLabel: "received recently" },
  { value: "oldest", label: "Oldest", subLabel: "first received" },
  { value: "collectionNoAsc", label: "Lowest No.", subLabel: "collection 101 →" },
  { value: "collectionNoDesc", label: "Highest No.", subLabel: "collection 999 →" },
  { value: "memberAsc", label: "First Member", subLabel: "debut order →" },
  { value: "memberDesc", label: "Last Member", subLabel: "reverse order →" },
];

const ITEMS_PER_PAGE = 30; // Divisible by 3 (mobile 10 rows) and 5 (desktop 6 rows) - zero empty slots

export default function ObjektsClient() {
  const searchParams = useSearchParams();
  const [objekts, setObjekts] = useState<Objekt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    { value: "All", label: "all", subLabel: "online & physical scans" },
    { value: "online", label: "online", subLabel: "COSMO app digital cards" },
    { value: "offline", label: "offline", subLabel: "physical event photocards" },
  ];

  // Filters State (initialized with search params if present)
  const [selectedSeason, setSelectedSeason] = useState(searchParams?.get("season") || "All");
  const [selectedMember, setSelectedMember] = useState(searchParams?.get("member") || "All");
  const [selectedClass, setSelectedClass] = useState(searchParams?.get("class") || "All");
  const [selectedOnOffline, setSelectedOnOffline] = useState(searchParams?.get("format") || "All");
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Pagination & Modal State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedObjekt, setSelectedObjekt] = useState<Objekt | null>(null);

  // Fetch Objekts JSON from Hugging Face dataset
  useEffect(() => {
    let isMounted = true;
    const loadObjekts = async () => {
      try {
        setLoading(true);
        // Check cache in sessionStorage for fast back-navigation
        const cached = sessionStorage.getItem("triples_all_objekts");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isMounted) {
            setObjekts(parsed);
            setLoading(false);
          }
          return;
        }

        const res = await fetch(ALL_OBJEKTS_JSON_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Objekts`);
        const data: Objekt[] = await res.json();
        
        if (isMounted) {
          setObjekts(data);
          setLoading(false);
          try {
            sessionStorage.setItem("triples_all_objekts", JSON.stringify(data));
          } catch {
            // Storage quota exceeded fallback
          }
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
          return (b.createdAt || 0) - (a.createdAt || 0);
        }
        if (sortBy === "oldest") {
          return (a.createdAt || 0) - (b.createdAt || 0);
        }
        if (sortBy === "collectionNoAsc") {
          const numA = parseInt(a.collectionNo || "0", 10);
          const numB = parseInt(b.collectionNo || "0", 10);
          return numA - numB;
        }
        if (sortBy === "collectionNoDesc") {
          const numA = parseInt(a.collectionNo || "0", 10);
          const numB = parseInt(b.collectionNo || "0", 10);
          return numB - numA;
        }
        if (sortBy === "memberAsc") {
          return (
            (a.memberSortOrder || 0) - (b.memberSortOrder || 0) ||
            (a.member || "").localeCompare(b.member || "")
          );
        }
        if (sortBy === "memberDesc") {
          return (
            (b.memberSortOrder || 0) - (a.memberSortOrder || 0) ||
            (b.member || "").localeCompare(a.member || "")
          );
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
    searchQuery.trim() !== "";

  const activeFilterCount = [
    selectedSeason !== "All",
    selectedMember !== "All",
    selectedClass !== "All",
    selectedOnOffline !== "All",
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  return (
    <div className="bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-white pt-24 pb-28 min-h-screen selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono">
              [ COSMO DIGITAL OBJEKTS ARCHIVE ]
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-pretendard text-zinc-900 dark:text-white">
                Objekts Vault
              </h1>
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-3xl leading-relaxed">
                Complete tripleS digital photocard archive. Explore official front &amp; back photocard scans across all seasons, editions, and member dimensions.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-2xl shrink-0">
              <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                <Grid3X3 className="h-4 w-4 text-zinc-500" />
                <span>
                  {loading ? "..." : `${filteredObjekts.length.toLocaleString()} Cards`}
                </span>
              </div>
              <div className="h-3 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>Updated: Aug 15, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Member Story Avatar Strip (Direct Member Filter) ── */}
        <div className="mb-6 py-3 px-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* OT24 / ALL Story Bubble */}
            <button
              type="button"
              onClick={() => setSelectedMember("All")}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] transition-all duration-200 ${
                  selectedMember === "All"
                    ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 scale-105 shadow-[0_0_14px_rgba(168,85,247,0.45)]"
                    : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-[#121216] flex items-center justify-center font-mono font-extrabold text-[11px] sm:text-xs text-zinc-900 dark:text-white">
                  0T24
                </div>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-mono tracking-tight transition-colors ${
                  selectedMember === "All"
                    ? "text-zinc-900 dark:text-white font-bold"
                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                }`}
              >
                ALL
              </span>
            </button>

            {/* 24 Member Story Bubbles */}
            {membersList.map((m) => {
              const isSelected = selectedMember.toLowerCase() === m.name.toLowerCase();
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
                      isSelected
                        ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 scale-105 shadow-[0_0_14px_rgba(168,85,247,0.45)]"
                        : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-black">
                      <Image
                        src={m.image.startsWith("http") ? m.image : `https://i.imgur.com/${m.image}`}
                        alt={m.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 px-1 rounded-full bg-black/80 text-[8px] font-mono text-white border border-white/10 shadow-sm">
                      S{m.id}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono tracking-tight truncate max-w-[56px] text-center transition-colors ${
                      isSelected
                        ? "text-zinc-900 dark:text-white font-bold"
                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                    }`}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. Filters & Control Toolbar ── */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 relative z-20">
            {/* Season Dropdown */}
            <SeasonDropdown
              selectedSeason={selectedSeason}
              seasons={availableSeasons}
              onSelectSeason={(s) => setSelectedSeason(s)}
              className="w-full sm:w-auto flex-1 min-w-[140px]"
            />

            {/* Type Filter */}
            <CustomDropdown
              label="Type"
              value={selectedOnOffline}
              options={typeOptions}
              onChange={(t) => setSelectedOnOffline(t)}
              className="w-[calc(50%-0.375rem)] sm:w-auto flex-1 min-w-[110px]"
            />

            {/* Class Dropdown */}
            <CustomDropdown
              label="Class"
              value={selectedClass}
              options={classOptions}
              onChange={(c) => setSelectedClass(c)}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/90 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 shadow-sm transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Reset Filters inline trigger */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors shrink-0"
              >
                <span>✕ RESET FILTERS ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* ── 4. Main Objekts Grid (Clean Edge-to-Edge Cards) ── */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5 md:gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[1/1.55] rounded-xl sm:rounded-2xl md:rounded-3xl bg-zinc-200/60 dark:bg-zinc-900/60 animate-pulse border border-zinc-200/60 dark:border-zinc-800/60"
              />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-12 text-center rounded-3xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <p className="font-mono text-sm text-rose-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-mono font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredObjekts.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center rounded-3xl bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
            <Sparkles className="h-8 w-8 text-zinc-400 mx-auto mb-3 opacity-60" />
            <h3 className="font-pretendard text-lg font-bold text-zinc-800 dark:text-zinc-200">
              No Objekts Found
            </h3>
            <p className="text-xs font-mono text-zinc-500 mt-1 max-w-md mx-auto">
              No photocards match the selected filter combination. Try adjusting season, member, or search criteria.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-mono font-bold transition-transform hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Loaded Clean Cards Grid (3-cols on mobile, 5-cols on desktop) */
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

            {/* ── 5. Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Page <span className="font-bold text-zinc-900 dark:text-white">{currentPage}</span> of{" "}
                  <span className="font-bold text-zinc-900 dark:text-white">{totalPages}</span> ({filteredObjekts.length.toLocaleString()} total items)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs px-2 text-zinc-500">
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
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm"
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
