"use client"
import Particles from "react-tsparticles"
import { tsParticles } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti"
import { useRef } from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, Calendar } from "lucide-react"
import type { Member } from "@/utils/members"


interface BirthdayCountdownProps {
  members: Member[]
}

export default function BirthdayCountdown({ members }: BirthdayCountdownProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const particlesRef = useRef<any>(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Member[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Function to calculate upcoming birthdays
  const calculateUpcomingBirthdays = useCallback(() => {
    const today = new Date()
    const currentYear = today.getFullYear()

    // Create a list of members with their upcoming birthday dates
    const membersWithBirthdayDates = members
      .filter((member) => member.birthday) // Filter out members without birthday
      .map((member) => {
        const birthdayComponents = member.birthday.split("-")
        const birthdayMonth = Number.parseInt(birthdayComponents[1]) - 1 // Month is 0-indexed in JS Date
        const birthdayDay = Number.parseInt(birthdayComponents[2])

        // Create this year's birthday date
        let nextBirthday = new Date(currentYear, birthdayMonth, birthdayDay)

        // If the birthday has already passed this year, use next year's date
        if (nextBirthday < today) {
          nextBirthday = new Date(currentYear + 1, birthdayMonth, birthdayDay)
        }

        // Calculate days until birthday
        const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        return {
          ...member,
          nextBirthday,
          daysUntil,
        }
      })

    // Sort by closest upcoming birthday
    const sortedMembers = membersWithBirthdayDates.sort((a, b) => a.daysUntil - b.daysUntil)

    // Group members with the same birthday
    const groupedByDate: { [key: string]: typeof sortedMembers } = {}

    sortedMembers.forEach((member) => {
      const dateKey = member.nextBirthday.toDateString()
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = []
      }
      groupedByDate[dateKey].push(member)
    })

    // Flatten the grouped members, keeping the order
    const result: typeof sortedMembers = []
    Object.values(groupedByDate).forEach((group) => {
      result.push(...group)
    })

    // Take the first few upcoming birthdays
    return result.slice(0, 5)
  }, [members])

  // Calculate countdown to the next birthday
  const calculateTimeLeft = useCallback(() => {
    if (upcomingBirthdays.length === 0) return

    const now = new Date()
    const birthday = new Date(upcomingBirthdays[currentIndex].nextBirthday ?? '');
    const difference = birthday.getTime() - now.getTime()

    if (difference <= 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Confetti selama 5 detik
      setUpcomingBirthdays(calculateUpcomingBirthdays());
      return;
    }    

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    })
  }, [upcomingBirthdays, currentIndex, calculateUpcomingBirthdays])

  // Initialize upcoming birthdays
  useEffect(() => {
    setUpcomingBirthdays(calculateUpcomingBirthdays())
  }, [calculateUpcomingBirthdays])

  useEffect(() => {
    loadConfettiPreset(tsParticles);
  }, []);  

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft()
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  // Handle slider navigation
  const nextSlide = () => {
    if (upcomingBirthdays.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex === upcomingBirthdays.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    if (upcomingBirthdays.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? upcomingBirthdays.length - 1 : prevIndex - 1))
  }

  // Auto-advance slider for members with same birthday
  useEffect(() => {
    if (upcomingBirthdays.length <= 1) return

    // Check if there are multiple members with the same birthday
    const currentBirthday = upcomingBirthdays[currentIndex]?.nextBirthday?.toDateString()
    const sameDay = upcomingBirthdays.filter((member) => member.nextBirthday?.toDateString() === currentBirthday)

    if (sameDay.length > 1) {
      const timer = setInterval(() => {
        // Only advance within the same birthday group
        const nextIndex = currentIndex + 1
        if (
          nextIndex < upcomingBirthdays.length &&
          upcomingBirthdays[nextIndex].nextBirthday?.toDateString() === currentBirthday
        ) {
          setCurrentIndex(nextIndex)
        } else {
          // Find the first member with this birthday
          const firstIndex = upcomingBirthdays.findIndex(
            (member) => member.nextBirthday?.toDateString() === currentBirthday,
          )
          setCurrentIndex(firstIndex)
        }
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [upcomingBirthdays, currentIndex])

  if (upcomingBirthdays.length === 0) {
    return null
  }

  const currentMember = upcomingBirthdays[currentIndex]
  if (!currentMember) return null

  // Format birthday date
  const birthday = new Date(currentMember.nextBirthday!);

  const formattedDate = birthday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Calculate age on next birthday
  const birthYear = Number.parseInt(currentMember.birthday.split("-")[0])
  const nextAge = birthday.getFullYear() - birthYear

  // Check if there are multiple members with the same birthday
  const sameDayMembers = upcomingBirthdays.filter(
    (member) => member.nextBirthday?.toDateString() === currentMember.nextBirthday?.toDateString(),
  )
  const hasSameDayMembers = sameDayMembers.length > 1

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Member image */}
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-sm overflow-hidden border-4 border-pink-500 shadow-lg shadow-purple-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={`https://i.imgur.com/${currentMember.image}`}
                alt={currentMember.name}
                width={500} 
                height={800}
                className="object-cover"
              />
            </motion.div>

            {/* Countdown and info */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Cake className="h-6 w-6 text-pink-400" />
                  Upcoming Birthday
                </h2>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMember.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                      {currentMember.name}
                    </h3>

                    <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                      <Calendar className="h-5 w-5 text-pink-400" />
                      <p className="text-lg text-gray-300">
                        {formattedDate} <span className="text-pink-400">({nextAge} International age)</span>
                      </p>
                    </div>

                    <p className="text-gray-300 mb-6 max-w-xl mx-auto md:mx-0">{currentMember.role}</p>
                  </motion.div>
                </AnimatePresence>

                {/* Countdown timer */}
                <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto md:mx-0">
                  <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.days}</div>
                    <div className="text-xs text-gray-400">Days</div>
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.hours}</div>
                    <div className="text-xs text-gray-400">Hours</div>
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.minutes}</div>
                    <div className="text-xs text-gray-400">Minutes</div>
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-purple-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.seconds}</div>
                    <div className="text-xs text-gray-400">Seconds</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation arrows - only show if there are multiple members with the same birthday */}
          {hasSameDayMembers && (
            <div className="flex justify-center mt-8 gap-4">
              <div className="flex gap-2">
                {sameDayMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(upcomingBirthdays.indexOf(sameDayMembers[index]))}
                    className={`w-2 h-2 rounded-full ${
                      upcomingBirthdays.indexOf(sameDayMembers[index]) === currentIndex ? "bg-pink-500" : "bg-gray-600"
                    }`}
                    aria-label={`Go to member ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {showConfetti && (
        <Particles
          options={{
            preset: "confetti",
            fullScreen: { enable: true },
          }}
        />
      )}
    </div>
  )
}