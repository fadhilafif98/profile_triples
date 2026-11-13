"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Cake,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { OFFICIAL_MEMBER_COLORS, getMemberImageUrl } from "@/lib/members";
import type { Member } from "@/types/member";

interface BirthdayCountdownProps {
  members: Member[];
}

interface MemberBirthdayMeta extends Member {
  nextBirthday: Date;
  daysUntil: number;
  isToday: boolean;
  turningAge: number;
  formattedDate: string;
  shortDate: string;
  birthMonth: number;
  birthDay: number;
  isThisMonth: boolean;
  hasPassedThisYear: boolean;
}

function getContrastingInk(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#FFFFFF";
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 155 ? "#09090B" : "#FFFFFF";
}

function getVisibleSwatch(hex: string): string {
  const upper = hex.toUpperCase();
  if (upper === "#FFFFFF" || upper === "#FFECF3") return "#A1A1AA";
  return hex;
}

function getOrdinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function computeBirthdayMeta(
  member: Member,
  now: Date
): MemberBirthdayMeta | null {
  if (!member.birthday) return null;
  const [bYear, bMonth, bDay] = member.birthday.split("-").map(Number);
  if (!bYear || !bMonth || !bDay) return null;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const todayMidnight = new Date(currentYear, now.getMonth(), now.getDate());

  const thisYearBirthday = new Date(currentYear, bMonth - 1, bDay);
  const isToday = thisYearBirthday.getTime() === todayMidnight.getTime();
  const hasPassedThisYear = thisYearBirthday < todayMidnight && !isToday;
  const isThisMonth = bMonth === currentMonth;

  const nextBirthday = hasPassedThisYear
    ? new Date(currentYear + 1, bMonth - 1, bDay)
    : thisYearBirthday;

  const daysUntil = isToday
    ? 0
    : Math.round(
        (nextBirthday.getTime() - todayMidnight.getTime()) /
          (1000 * 60 * 60 * 24)
      );

  const displayDate =
    isThisMonth && hasPassedThisYear ? thisYearBirthday : nextBirthday;
  const turningAge = displayDate.getFullYear() - bYear;

  const formattedDate = displayDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const shortDate = displayDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return {
    ...member,
    nextBirthday,
    daysUntil,
    isToday,
    turningAge,
    formattedDate,
    shortDate,
    birthMonth: bMonth,
    birthDay: bDay,
    isThisMonth,
    hasPassedThisYear,
  };
}

export default function BirthdayCountdown({ members }: BirthdayCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const queueRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef({
    down: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
  }, []);

  const currentMonthName = useMemo(
    () => now.toLocaleDateString("en-US", { month: "long" }),
    [now]
  );

  const processedMembers = useMemo(() => {
    return members
      .map((m) => computeBirthdayMeta(m, now))
      .filter((m): m is MemberBirthdayMeta => m !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil || a.id - b.id);
  }, [members, now]);

  const { rosterQueue, priorityQueue, defaultMember } = useMemo(() => {
    const todayMembers = processedMembers.filter((m) => m.isToday);
    const sameMonthUpcoming = processedMembers
      .filter((m) => m.isThisMonth && !m.hasPassedThisYear && !m.isToday)
      .sort((a, b) => a.daysUntil - b.daysUntil || a.id - b.id);
    const sameMonthPassed = processedMembers
      .filter((m) => m.isThisMonth && m.hasPassedThisYear && !m.isToday)
      .sort((a, b) => a.birthDay - b.birthDay || a.id - b.id);
    const imminentNext30 = processedMembers
      .filter((m) => !m.isThisMonth && m.daysUntil > 0 && m.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil || a.id - b.id);

    const priority: MemberBirthdayMeta[] = [];
    const seenPriority = new Set<number>();
    const addPriority = (list: MemberBirthdayMeta[]) => {
      for (const item of list) {
        if (!seenPriority.has(item.id)) {
          seenPriority.add(item.id);
          priority.push(item);
        }
      }
    };

    addPriority(todayMembers);
    addPriority(sameMonthUpcoming);
    addPriority(imminentNext30);
    addPriority(sameMonthPassed);
    if (priority.length === 0) {
      addPriority(processedMembers.slice(0, 4));
    }

    const roster: MemberBirthdayMeta[] = [];
    const seenRoster = new Set<number>();
    const addRoster = (list: MemberBirthdayMeta[]) => {
      for (const item of list) {
        if (!seenRoster.has(item.id)) {
          seenRoster.add(item.id);
          roster.push(item);
        }
      }
    };

    addRoster(todayMembers);
    addRoster(sameMonthUpcoming);
    addRoster(imminentNext30);
    addRoster(sameMonthPassed);
    addRoster(processedMembers);

    const fallbackDefault =
      todayMembers[0] ??
      sameMonthUpcoming[0] ??
      imminentNext30[0] ??
      sameMonthPassed[0] ??
      roster[0];

    return {
      rosterQueue: roster,
      priorityQueue: priority,
      defaultMember: fallbackDefault,
    };
  }, [processedMembers]);

  const activeMember = useMemo(() => {
    if (selectedMemberId !== null) {
      const found = rosterQueue.find((m) => m.id === selectedMemberId);
      if (found) return found;
    }
    return defaultMember;
  }, [selectedMemberId, rosterQueue, defaultMember]);

  const activeIndex = useMemo(() => {
    if (!activeMember) return 0;
    const idx = rosterQueue.findIndex((m) => m.id === activeMember.id);
    return idx >= 0 ? idx : 0;
  }, [activeMember, rosterQueue]);

  const updateCountdown = useCallback(() => {
    if (!activeMember) return;
    const current = new Date();
    const diff = activeMember.nextBirthday.getTime() - current.getTime();

    if (diff <= 0 || activeMember.isToday) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    });
  }, [activeMember]);

  useEffect(() => {
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [updateCountdown]);

  useEffect(() => {
    if (!autoRotate || priorityQueue.length <= 1) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setSelectedMemberId((prev) => {
        const currentId = prev ?? activeMember?.id;
        const currentIdx = priorityQueue.findIndex((m) => m.id === currentId);
        const nextIdx = (currentIdx + 1) % priorityQueue.length;
        return priorityQueue[nextIdx]?.id ?? null;
      });
    }, 8000);

    return () => window.clearInterval(timer);
  }, [autoRotate, priorityQueue, activeMember]);

  useEffect(() => {
    const container = queueRef.current;
    const item = itemRefs.current[activeIndex];
    if (!container || !item) return;

    const targetLeft =
      item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const clampedLeft = Math.max(0, Math.min(targetLeft, maxScroll));

    if (Math.abs(container.scrollLeft - clampedLeft) < 2) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    container.scrollTo({
      left: clampedLeft,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [activeIndex]);

  if (!activeMember || rosterQueue.length === 0) return null;

  const officialColor = OFFICIAL_MEMBER_COLORS[activeMember.id] || "#18181B";
  const sidebandInk = getContrastingInk(officialColor);
  const sCode = `S${String(activeMember.id).padStart(2, "0")}`;
  const isTodayCelebrating = activeMember.isToday;
  const isThisMonthPassed =
    activeMember.isThisMonth &&
    activeMember.hasPassedThisYear &&
    !activeMember.isToday;

  const stepMember = (delta: number) => {
    const nextIdx =
      (activeIndex + delta + rosterQueue.length) % rosterQueue.length;
    setSelectedMemberId(rosterQueue[nextIdx].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepMember(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stepMember(1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    const el = queueRef.current;
    if (!el) return;

    drag.current = {
      down: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    const el = queueRef.current;
    if (!el) return;

    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 5) {
      drag.current.moved = true;
    }
    if (drag.current.moved) {
      el.scrollLeft = drag.current.scrollLeft - delta;
    }
  };

  const endDrag = () => {
    drag.current.down = false;
    if (drag.current.moved) {
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 0);
    }
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section
      id="upcoming-birthdays"
      aria-labelledby="birthday-heading"
      onKeyDown={handleKeyDown}
      className="relative flex flex-col justify-between lg:min-h-[calc(100dvh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 gap-6 lg:gap-8 border-t border-zinc-200 dark:border-white/10 overflow-x-clip"
    >
      {/* Top Row: Asymmetrical Editorial Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2
            id="birthday-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]"
          >
            Upcoming{" "}
            <span className="font-accent text-4xl sm:text-5xl lg:text-6xl font-normal text-zinc-950 dark:text-[#D4FF00] inline-block px-1">
              Birthdays
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
            Count down to the next member birthday across the 24-member roster.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <span
            aria-live="polite"
            suppressHydrationWarning
            className="font-mono text-xs tabular-nums tracking-[0.14em] text-zinc-500 dark:text-zinc-400 mr-1"
          >
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(rosterQueue.length).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => stepMember(-1)}
              aria-label="Previous member birthday"
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-[#D4FF00] transition-[border-color,color] duration-200 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => stepMember(1)}
              aria-label="Next member birthday"
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-[#D4FF00] transition-[border-color,color] duration-200 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              aria-label={
                autoRotate ? "Pause queue rotation" : "Play queue rotation"
              }
              title={
                autoRotate ? "Pause queue rotation" : "Play queue rotation"
              }
              className="w-9 h-9 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-950 dark:text-white hover:border-zinc-950 dark:hover:border-[#D4FF00] transition-[border-color,color] duration-200 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none"
            >
              {autoRotate ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <Link
            href="/members"
            className="nav-draw-link inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-zinc-950 dark:text-zinc-200 pb-0.5 ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
          >
            All 24 Members
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Middle Row: 12-Column Unboxed Objekt + Monochrome Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-1">
        {/* Left: Unboxed Physical First Class Objekt Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[260px] aspect-[2/3] group">
            {/* Subtle tight portrait ambient blur */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5 rounded-3xl opacity-25 dark:opacity-20 blur-2xl overflow-hidden"
            >
              <Image
                src={getMemberImageUrl(activeMember)}
                alt=""
                fill
                sizes="260px"
                className="object-cover object-top scale-125"
              />
            </div>

            {/* Single-Declaration Shadow Frame */}
            <Link
              href={`/members/${activeMember.slug}`}
              aria-label={`View ${sCode} ${activeMember.name} profile`}
              className="relative z-10 block w-full h-full rounded-2xl overflow-hidden shadow-[0_24px_48px_-18px_rgba(9,9,11,0.45)] dark:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.85)] bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
            >
              <Image
                src={getMemberImageUrl(activeMember)}
                alt={`${sCode} ${activeMember.name} First Class Objekt portrait`}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 250px, 260px"
                className="object-cover object-top origin-top scale-[1.05] group-hover:scale-[1.07] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
              />

              {/* Official MODHAUS COSMO Vertical Sideband */}
              <div
                aria-hidden="true"
                style={{ backgroundColor: officialColor, color: sidebandInk }}
                className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-[26px] flex flex-col items-center justify-between py-4 px-0.5 select-none"
              >
                <span className="font-mono text-[9px] font-bold tracking-tight">
                  {sCode}
                </span>
                <span
                  style={{ writingMode: "vertical-rl" }}
                  className="rotate-180 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] truncate max-h-[160px]"
                >
                  {activeMember.name}
                </span>
                <span
                  style={{ writingMode: "vertical-rl" }}
                  className="rotate-180 font-mono text-[7px] uppercase tracking-[0.2em] opacity-80"
                >
                  COSMO
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Borderless Typographic Display (Zero Eyebrow Above H3) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 lg:gap-5">
          <h3 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.04] flex flex-wrap items-baseline justify-center lg:justify-start gap-x-3 gap-y-1">
            <span>{activeMember.name}</span>
            {activeMember.hangul ? (
              <span
                lang="ko"
                className="text-xl sm:text-2xl font-sans font-normal text-zinc-400 dark:text-zinc-500"
              >
                {activeMember.hangul}
              </span>
            ) : null}
          </h3>

          <p
            suppressHydrationWarning
            className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1"
          >
            <span className="inline-flex items-center gap-1.5 text-zinc-950 dark:text-zinc-200 font-medium">
              <span
                className="w-2 h-2 rounded-full border border-black/15 dark:border-white/20 shrink-0"
                style={{ backgroundColor: officialColor }}
                aria-hidden="true"
              />
              {sCode}
            </span>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-950 dark:text-zinc-200 font-medium">
              {activeMember.formattedDate}
            </span>
            <span aria-hidden="true">/</span>
            <span>
              {isThisMonthPassed ? "Turned" : "Turning"}{" "}
              {activeMember.turningAge}
            </span>
            <span aria-hidden="true">/</span>
            <span>{activeMember.birthplace || activeMember.nationality}</span>
            <span aria-hidden="true">/</span>
            {isTodayCelebrating ? (
              <span className="inline-flex items-center gap-1 text-zinc-950 dark:text-[#D4FF00] font-semibold">
                <Cake className="w-3.5 h-3.5" aria-hidden="true" />
                Birthday Today
              </span>
            ) : isThisMonthPassed ? (
              <span className="text-zinc-950 dark:text-[#D4FF00] font-semibold">
                {currentMonthName} Celebrant
              </span>
            ) : (
              <span className="tabular-nums text-zinc-950 dark:text-[#D4FF00] font-semibold">
                D-{activeMember.daysUntil}
              </span>
            )}
          </p>

          {/* Monochrome Typographic Countdown Stream / Unboxed Celebration */}
          <div className="py-1">
            {isTodayCelebrating ? (
              <div className="space-y-1.5">
                <p className="inline-flex items-center gap-2 font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  <Cake
                    className="w-5 h-5 text-zinc-950 dark:text-[#D4FF00]"
                    aria-hidden="true"
                  />
                  <span>
                    Happy {getOrdinalSuffix(activeMember.turningAge)} Birthday,{" "}
                    {activeMember.name}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                  Celebrating {activeMember.name}&apos;s{" "}
                  {getOrdinalSuffix(activeMember.turningAge)} birthday today
                  across the tripleS roster.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  className="flex items-baseline justify-center lg:justify-start gap-3 sm:gap-5 font-mono tabular-nums"
                  aria-label={`Countdown to ${activeMember.name}'s next birthday`}
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      suppressHydrationWarning
                      className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-tight"
                    >
                      {mounted ? String(timeLeft.days).padStart(2, "0") : "00"}
                    </span>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">
                      d
                    </span>
                  </div>
                  <span
                    className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700"
                    aria-hidden="true"
                  >
                    &middot;
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      suppressHydrationWarning
                      className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-tight"
                    >
                      {mounted ? String(timeLeft.hours).padStart(2, "0") : "00"}
                    </span>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">
                      h
                    </span>
                  </div>
                  <span
                    className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700"
                    aria-hidden="true"
                  >
                    &middot;
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      suppressHydrationWarning
                      className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white tracking-tight"
                    >
                      {mounted
                        ? String(timeLeft.minutes).padStart(2, "0")
                        : "00"}
                    </span>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">
                      m
                    </span>
                  </div>
                  <span
                    className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700"
                    aria-hidden="true"
                  >
                    &middot;
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      suppressHydrationWarning
                      className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 dark:text-[#D4FF00]"
                    >
                      {mounted
                        ? String(timeLeft.seconds).padStart(2, "0")
                        : "00"}
                    </span>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">
                      s
                    </span>
                  </div>
                </div>

                {isThisMonthPassed ? (
                  <p
                    suppressHydrationWarning
                    className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Celebrated this month on {activeMember.shortDate} &middot;
                    counting down to next year
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {/* Distilled Single Primary CTA */}
          <div className="pt-1">
            <Link
              href={`/members/${activeMember.slug}`}
              className="btn-primary btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.15em]"
            >
              <span>View {activeMember.name} Profile</span>
              <ArrowUpRight className="btn-arrow w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Horizontal Draggable 24-Member Birthday Lineup Strip */}
      <div className="w-full">
        <div
          ref={queueRef}
          role="listbox"
          aria-label="Birthday lineup across all 24 members"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={handleClickCapture}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing select-none"
        >
          {rosterQueue.map((m, idx) => {
            const isSelected = m.id === activeMember.id;
            const mColor = OFFICIAL_MEMBER_COLORS[m.id] || "#D4FF00";
            const mRing = getVisibleSwatch(mColor);
            const isPassed = m.isThisMonth && m.hasPassedThisYear && !m.isToday;
            const statusText = m.isToday
              ? "Today"
              : isPassed
                ? m.shortDate
                : `D-${m.daysUntil}`;

            return (
              <button
                key={m.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-label={`${m.name} (${statusText})`}
                draggable={false}
                onClick={() => setSelectedMemberId(m.id)}
                className={`shrink-0 inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-mono transition-[background-color,color,border-color] duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none ${
                  isSelected
                    ? "ring-2 ring-zinc-950 dark:ring-[#D4FF00] bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/30 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <span
                  className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border-[1.5px] bg-zinc-900"
                  style={{ borderColor: mRing }}
                >
                  <Image
                    src={getMemberImageUrl(m)}
                    alt=""
                    fill
                    sizes="24px"
                    draggable={false}
                    className="object-cover object-top scale-[1.05] pointer-events-none"
                  />
                </span>
                <span className="font-semibold tracking-tight">{m.name}</span>
                <span
                  suppressHydrationWarning
                  className={`text-[10px] tabular-nums ${
                    isSelected
                      ? "text-zinc-300 dark:text-zinc-600"
                      : m.isToday || (m.daysUntil <= 30 && !isPassed)
                        ? "text-zinc-950 dark:text-[#D4FF00] font-semibold"
                        : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {statusText}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
