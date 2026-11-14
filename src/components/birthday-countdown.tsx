"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Cake,
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
  const [viewCelebration, setViewCelebration] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const sectionRef = useRef<HTMLElement | null>(null);
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

  const {
    todayMembers,
    currentMonthCelebrants,
    imminentUpcoming,
    pipelineQueue,
  } = useMemo(() => {
    const today = processedMembers.filter((m) => m.isToday);
    const monthCelebrants = processedMembers
      .filter((m) => m.isThisMonth)
      .sort((a, b) => a.birthDay - b.birthDay || a.id - b.id);
    const imminent = processedMembers
      .filter((m) => m.daysUntil > 0 && m.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil || a.id - b.id);

    const queue: MemberBirthdayMeta[] = [...monthCelebrants];
    const seen = new Set(queue.map((item) => item.id));
    for (const item of imminent) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        queue.push(item);
      }
    }

    if (queue.length === 0) {
      queue.push(...processedMembers.slice(0, 4));
    }

    return {
      todayMembers: today,
      currentMonthCelebrants: monthCelebrants,
      imminentUpcoming: imminent,
      pipelineQueue: queue,
    };
  }, [processedMembers]);

  const activeMember = useMemo(() => {
    if (selectedMemberId !== null) {
      const fromQueue = pipelineQueue.find((m) => m.id === selectedMemberId);
      if (fromQueue) return fromQueue;
      const fromAll = processedMembers.find((m) => m.id === selectedMemberId);
      if (fromAll) return fromAll;
    }
    if (todayMembers.length > 0 && viewCelebration) return todayMembers[0];
    if (imminentUpcoming.length > 0) return imminentUpcoming[0];
    if (currentMonthCelebrants.length > 0) return currentMonthCelebrants[0];
    return pipelineQueue[0] ?? processedMembers[0];
  }, [
    selectedMemberId,
    pipelineQueue,
    processedMembers,
    todayMembers,
    viewCelebration,
    imminentUpcoming,
    currentMonthCelebrants,
  ]);

  const activeIndex = useMemo(() => {
    if (!activeMember) return 0;
    const idx = pipelineQueue.findIndex((m) => m.id === activeMember.id);
    return idx >= 0 ? idx : 0;
  }, [activeMember, pipelineQueue]);

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

    if (!activeMember || activeMember.isToday || activeMember.nextBirthday.getTime() <= Date.now()) {
      return;
    }

    let isVisible = true;
    let intervalId: number | null = null;

    const syncInterval = () => {
      const shouldRun = isVisible && !document.hidden;
      if (shouldRun && intervalId === null) {
        updateCountdown();
        intervalId = window.setInterval(updateCountdown, 1000);
      } else if (!shouldRun && intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => syncInterval();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let observer: IntersectionObserver | null = null;
    if (sectionRef.current && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          syncInterval();
        },
        { threshold: 0.05 }
      );
      observer.observe(sectionRef.current);
    }

    syncInterval();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer?.disconnect();
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [updateCountdown, activeMember]);

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

  if (!activeMember || pipelineQueue.length === 0) return null;

  const officialColor = OFFICIAL_MEMBER_COLORS[activeMember.id] || "#18181B";
  const sidebandInk = getContrastingInk(officialColor);
  const sCode = `S${String(activeMember.id).padStart(2, "0")}`;
  const isTodayCelebrating = activeMember.isToday;
  const isThisMonthPassed =
    activeMember.isThisMonth &&
    activeMember.hasPassedThisYear &&
    !activeMember.isToday;
  const isCountdownActive = !isTodayCelebrating && !isThisMonthPassed;

  const stepMember = (delta: number) => {
    const nextIdx =
      (activeIndex + delta + pipelineQueue.length) % pipelineQueue.length;
    setSelectedMemberId(pipelineQueue[nextIdx].id);
    setViewCelebration(false);
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

  const countdownUnits = [
    { value: timeLeft.days, label: "DAYS", highlight: false },
    { value: timeLeft.hours, label: "HRS", highlight: false },
    { value: timeLeft.minutes, label: "MIN", highlight: false },
    { value: timeLeft.seconds, label: "SEC", highlight: true },
  ];

  return (
    <section
      ref={sectionRef}
      id="upcoming-birthdays"
      aria-labelledby="birthday-heading"
      onKeyDown={handleKeyDown}
      className="scroll-mt-16 relative py-16 sm:py-20 lg:py-16 px-4 sm:px-6 lg:px-8 lg:min-h-[calc(100dvh-4rem)] flex items-center border-t border-zinc-200 dark:border-white/10 overflow-x-clip"
    >
      <div className="max-w-7xl w-full mx-auto space-y-10 lg:space-y-12">
        {/* Header Row: Streamlined Title & Roster Directory Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
              Celebrating this month&apos;s birthdays and upcoming milestones
              within the next 30 days.
            </p>
          </div>

          <Link
            href="/members"
            className="nav-draw-link inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-zinc-950 dark:text-zinc-200 pb-0.5 self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
          >
            All 24 Members
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Main 12-Column Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column (5 Cols): Crisp Physical First Class Objekt Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px] aspect-[2/3] group">
              <Link
                href={`/members/${activeMember.slug}`}
                aria-label={`View ${sCode} ${activeMember.name} profile`}
                className="relative block w-full h-full rounded-2xl overflow-hidden shadow-[0_24px_48px_-14px_rgba(9,9,11,0.18)] dark:shadow-[0_28px_56px_-16px_rgba(0,0,0,0.85)] bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00]"
              >
                <Image
                  src={getMemberImageUrl(activeMember)}
                  alt={`${sCode} ${activeMember.name} First Class Objekt portrait`}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
                  className="object-cover object-top origin-top scale-[1.05] group-hover:scale-[1.07] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                />

                {/* Official MODHAUS COSMO Vertical Sideband */}
                <div
                  aria-hidden="true"
                  style={{ backgroundColor: officialColor, color: sidebandInk }}
                  className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-[28px] flex flex-col items-center justify-between py-4 px-0.5 select-none"
                >
                  <span className="font-mono text-[9px] font-bold tracking-tight">
                    {sCode}
                  </span>
                  <span
                    style={{ writingMode: "vertical-rl" }}
                    className="rotate-180 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] truncate max-h-[180px]"
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

          {/* Right Column (7 Cols): Member Dossier, Architectural Countdown & Integrated Pipeline Queue */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-5 lg:gap-6 min-w-0">
            <div className="space-y-2.5 w-full">
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.02] flex flex-wrap items-baseline justify-center lg:justify-start gap-x-3 gap-y-1">
                <span>{activeMember.name}</span>
                {activeMember.hangul ? (
                  <span
                    lang="ko"
                    className="text-xl sm:text-2xl lg:text-3xl font-sans font-normal text-zinc-400 dark:text-zinc-500"
                  >
                    {activeMember.hangul}
                  </span>
                ) : null}
              </h3>

              <p
                suppressHydrationWarning
                className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-1.5"
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
              </p>
            </div>

            {/* Architectural 3-State Countdown / Celebration Block */}
            <div className="min-h-[88px] flex flex-col justify-center py-2 w-full">
              {isTodayCelebrating ? (
                <div className="space-y-1.5">
                  <p className="inline-flex items-center justify-center lg:justify-start gap-2 font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    <Cake
                      className="w-5 h-5 text-zinc-950 dark:text-[#D4FF00] shrink-0"
                      aria-hidden="true"
                    />
                    <span>
                      Happy {getOrdinalSuffix(activeMember.turningAge)} Birthday,{" "}
                      {activeMember.name}
                    </span>
                  </p>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
                    Celebrating {activeMember.name}&apos;s{" "}
                    {getOrdinalSuffix(activeMember.turningAge)} birthday today
                    across the tripleS roster.
                  </p>
                </div>
              ) : isThisMonthPassed ? (
                <div className="space-y-1">
                  <p
                    suppressHydrationWarning
                    className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight"
                  >
                    {currentMonthName} Celebration
                  </p>
                  <p
                    suppressHydrationWarning
                    className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mx-auto lg:mx-0"
                  >
                    Celebrated on {activeMember.formattedDate} &middot; Turned{" "}
                    {activeMember.turningAge} years old.
                  </p>
                </div>
              ) : isCountdownActive ? (
                <div
                  className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-7 font-mono tabular-nums"
                  aria-label={`Countdown to ${activeMember.name}'s next birthday`}
                >
                  {countdownUnits.map((unit, idx) => (
                    <div
                      key={unit.label}
                      className="flex items-center gap-4 sm:gap-6 lg:gap-7"
                    >
                      {idx > 0 ? (
                        <span
                          aria-hidden="true"
                          className="h-10 w-px bg-zinc-200 dark:bg-white/10 shrink-0"
                        />
                      ) : null}
                      <div className="flex flex-col items-center lg:items-start">
                        <span
                          suppressHydrationWarning
                          className={`text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-none ${
                            unit.highlight
                              ? "text-zinc-950 dark:text-[#D4FF00]"
                              : "text-zinc-950 dark:text-white"
                          }`}
                        >
                          {mounted
                            ? String(unit.value).padStart(2, "0")
                            : "00"}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-1.5">
                          {unit.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Single Primary Profile CTA */}
            <div>
              <Link
                href={`/members/${activeMember.slug}`}
                className="btn-primary btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.15em]"
              >
                <span>View {activeMember.name} Profile</span>
                <ArrowUpRight className="btn-arrow w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Integrated Curated Pipeline Queue (Colocated with Right Column) */}
            <div className="w-full pt-6 border-t border-zinc-200 dark:border-white/10 space-y-3 text-left">
              <div className="flex items-center justify-between gap-2 min-h-[28px]">
                <p
                  suppressHydrationWarning
                  className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] sm:tracking-[0.16em] text-zinc-500 dark:text-zinc-400 truncate"
                >
                  {currentMonthName} &amp; Next 30 Days
                </p>

                {todayMembers.length > 0 && !isTodayCelebrating ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMemberId(todayMembers[0].id);
                      setViewCelebration(true);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-950 dark:text-[#D4FF00] hover:border-zinc-950 dark:hover:border-[#D4FF00] transition-[border-color,color] duration-200 text-[11px] font-mono inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none"
                  >
                    <Cake className="w-3 h-3" aria-hidden="true" />
                    <span>Today&apos;s Birthday</span>
                  </button>
                ) : null}
              </div>

              <div
                ref={queueRef}
                role="listbox"
                aria-label="Birthday lineup for this month and the next 30 days"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={endDrag}
                onClickCapture={handleClickCapture}
                className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto snap-x snap-mandatory overscroll-x-contain no-scrollbar py-1 cursor-grab active:cursor-grabbing select-none"
              >
                {pipelineQueue.map((m, idx) => {
                  const isSelected = m.id === activeMember.id;
                  const mColor = OFFICIAL_MEMBER_COLORS[m.id] || "#D4FF00";
                  const mRing = getVisibleSwatch(mColor);
                  const isPassed =
                    m.isThisMonth && m.hasPassedThisYear && !m.isToday;
                  const statusText = m.isToday
                    ? "Today"
                    : isPassed
                      ? "Celebrated"
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
                      aria-label={`${m.name}, ${m.shortDate} (${statusText})`}
                      draggable={false}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setViewCelebration(false);
                      }}
                      className={`snap-start shrink-0 min-h-11 inline-flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-3 sm:pr-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-[background-color,color,border-color] duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-[#D4FF00] motion-reduce:transition-none ${
                        isSelected
                          ? "border border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                          : "border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D0D12] text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/30 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                    >
                      <span
                        className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border-[1.5px] bg-zinc-900"
                        style={{ borderColor: mRing }}
                      >
                        <Image
                          src={getMemberImageUrl(m)}
                          alt=""
                          fill
                          sizes="28px"
                          draggable={false}
                          className="object-cover object-top scale-[1.05] pointer-events-none"
                        />
                      </span>
                      <span className="font-semibold tracking-tight">
                        {m.name}
                      </span>
                      <span
                        suppressHydrationWarning
                        className={`text-[10px] sm:text-[11px] tabular-nums ${
                          isSelected
                            ? "text-zinc-300 dark:text-zinc-600"
                            : "text-zinc-400 dark:text-zinc-500"
                        }`}
                      >
                        {m.shortDate}
                      </span>
                      <span
                        suppressHydrationWarning
                        className={`text-[10px] tabular-nums font-semibold ${
                          isSelected
                            ? "text-[#D4FF00] dark:text-zinc-950"
                            : m.isToday || (m.daysUntil <= 30 && !isPassed)
                              ? "text-zinc-950 dark:text-[#D4FF00]"
                              : "text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {statusText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
