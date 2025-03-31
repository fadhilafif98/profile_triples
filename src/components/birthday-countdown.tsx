"use client"

import Particles from "react-tsparticles"
import { tsParticles } from "tsparticles-engine"
import { loadConfettiPreset } from "tsparticles-preset-confetti"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, Calendar, Gift, PartyPopper, Star, Heart, RefreshCcw, RefreshCwOff } from "lucide-react"
import type { Member } from "@/utils/members"

interface BirthdayCountdownProps {
  members: Member[]
}

interface MemberWithBirthdayInfo extends Member {
  nextBirthday?: Date
  daysUntil?: number
  isRecentBirthday?: boolean
  daysSinceBirthday?: number
  isTodayBirthday?: boolean
  birthdayMessage?: string
}

// Function to generate a unique birthday message for each member
const generateBirthdayMessage = (member: Member): string => {
  const messages = [
    `Happy Birthday to our amazing ${member.role}, ${member.name}! 🎉 Wishing you a day filled with joy and love!`,
    `Today we celebrate ${member.name}'s special day! 🎂 Thank you for bringing your incredible talent to Stellar 24!`,
    `It's ${member.name}'s birthday! 🎈 Our ${member.role} is one year wiser and even more amazing!`,
    `Happy Birthday, ${member.name}! 💖 Your passion and dedication inspire us all!`,
    `Celebrating the birth of our wonderful ${member.role}, ${member.name}! 🌟 May your day be as bright as your future!`,
    `Sending birthday wishes to ${member.name}! 🥳 Your energy and talent make our group shine brighter!`,
    `Happy Birthday to our beloved ${member.name}! 💝 May your day be as special as you are to us!`,
    `It's time to celebrate ${member.name}'s birthday! 🎊 Thank you for sharing your gifts with the world!`,
    `Wishing a fantastic birthday to ${member.name}! 🌈 Your presence in Stellar 24 brings us so much joy!`,
    `Happy Birthday, ${member.name}! 🎵 May your day be filled with beautiful music and memories!`,
  ]

  // Use the member's ID to select a consistent message for each member
  const messageIndex = member.id % messages.length
  return messages[messageIndex]
}

export default function BirthdayCountdown({ members }: BirthdayCountdownProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<MemberWithBirthdayInfo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isBirthdayMode, setIsBirthdayMode] = useState(false)
  const [celebrationIndex, setCelebrationIndex] = useState(0)
  const [viewingUpcoming, setViewingUpcoming] = useState(false)
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true)

  // Function to calculate upcoming birthdays and check for recent birthdays
  const calculateUpcomingBirthdays = useCallback(() => {
    const today = new Date()
    const currentYear = today.getFullYear()

    // Create a list of members with their upcoming birthday dates
    const membersWithBirthdayDates = members
      .filter((member) => member.birthday) // Filter out members without birthday
      .map((member) => {
        const birthdateComponents = member.birthday.split("-")
        const birthdateMonth = Number.parseInt(birthdateComponents[1]) - 1 // Month is 0-indexed in JS Date
        const birthdateDay = Number.parseInt(birthdateComponents[2])

        // Create this year's birthday date
        let nextBirthday = new Date(currentYear, birthdateMonth, birthdateDay)

        // Check if today is their birthday
        const isTodayBirthday =
          nextBirthday.getDate() === today.getDate() &&
          nextBirthday.getMonth() === today.getMonth() &&
          nextBirthday.getFullYear() === today.getFullYear()

        // If the birthday has already passed this year, use next year's date
        if (nextBirthday < today && !isTodayBirthday) {
          nextBirthday = new Date(currentYear + 1, birthdateMonth, birthdateDay)
        }

        // Calculate days until birthday
        const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        // Check if today is within 7 days after their birthday
        const lastBirthday = new Date(nextBirthday)
        if (!isTodayBirthday) {
          lastBirthday.setFullYear(lastBirthday.getFullYear() - 1)
        }

        const daysSinceBirthday = Math.ceil((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24))
        const isRecentBirthday = (daysSinceBirthday >= 0 && daysSinceBirthday <= 7) || isTodayBirthday

        // Generate a unique birthday message for this member
        const birthdayMessage = generateBirthdayMessage(member)

        return {
          ...member,
          nextBirthday,
          daysUntil,
          isRecentBirthday,
          isTodayBirthday,
          daysSinceBirthday: isRecentBirthday ? daysSinceBirthday : -1,
          birthdayMessage,
        }
      })

    // First, check if any member has had a birthday within the last 7 days
    const recentBirthdays = membersWithBirthdayDates.filter((member) => member.isRecentBirthday)

    // Sort recent birthdays by how recent they are (most recent first)
    // Today's birthdays should be first
    recentBirthdays.sort((a, b) => {
      if (a.isTodayBirthday && !b.isTodayBirthday) return -1
      if (!a.isTodayBirthday && b.isTodayBirthday) return 1
      return a.daysSinceBirthday! - b.daysSinceBirthday!
    })

    // Sort upcoming birthdays
    const upcomingBirthdaysOnly = membersWithBirthdayDates
      .filter((m) => !m.isRecentBirthday)
      .sort((a, b) => a.daysUntil! - b.daysUntil!)

    if (recentBirthdays.length > 0) {
      // If there are recent birthdays, set birthday mode
      setIsBirthdayMode(true)
      setCelebrationIndex(0)

      // Return the recent birthdays first, then the upcoming ones
      return [...recentBirthdays, ...upcomingBirthdaysOnly]
    } else {
      // If no recent birthdays, turn off birthday mode
      setIsBirthdayMode(false)
      setViewingUpcoming(false)

      // Return upcoming birthdays
      return upcomingBirthdaysOnly
    }
  }, [members])

  // Calculate countdown to the next birthday
  const calculateTimeLeft = useCallback(() => {
    if (upcomingBirthdays.length === 0) return

    const now = new Date()
    const currentMember = upcomingBirthdays[currentIndex]

    // If we're in birthday mode and not viewing upcoming, don't update the countdown
    if (isBirthdayMode && !viewingUpcoming && currentMember.isRecentBirthday) {
      // Show confetti only once when entering birthday mode
      if (!showConfetti && currentMember.isTodayBirthday) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000) // Confetti for 5 seconds
      }
      return
    }

    const birthday = new Date(currentMember.nextBirthday ?? "")
    const difference = birthday.getTime() - now.getTime()

    if (difference <= 0) {
      // It's their birthday! Show confetti and recalculate
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000) // Confetti for 5 seconds

      // Set birthday mode and message
      setIsBirthdayMode(true)
      setViewingUpcoming(false)

      // Recalculate upcoming birthdays
      setUpcomingBirthdays(calculateUpcomingBirthdays())
      return
    }

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    })
  }, [upcomingBirthdays, currentIndex, calculateUpcomingBirthdays, isBirthdayMode, showConfetti, viewingUpcoming])

  // Initialize upcoming birthdays
  useEffect(() => {
    const birthdays = calculateUpcomingBirthdays()
    setUpcomingBirthdays(birthdays)

    // If there's a birthday celebration, set the current index to the first non-celebration member
    if (birthdays.some((member) => member.isRecentBirthday)) {
      const celebrationMembers = birthdays.filter((member) => member.isRecentBirthday)
      const firstUpcomingIndex = birthdays.findIndex((member) => !member.isRecentBirthday)

      if (firstUpcomingIndex !== -1) {
        setCurrentIndex(firstUpcomingIndex)
      }

      setCelebrationIndex(0) // Start with the first celebration member

      // If any member has a birthday today, show confetti
      if (celebrationMembers.some((member) => member.isTodayBirthday)) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000) // Confetti for 5 seconds
      }
    }
  }, [calculateUpcomingBirthdays])

  // Initialize tsParticles
  useEffect(() => {
    loadConfettiPreset(tsParticles)
  }, [])

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft()
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  // Auto-advance slider for members with same birthday
  useEffect(() => {
    if (upcomingBirthdays.length <= 1 || !autoRotateEnabled) return

    // If in birthday mode and not viewing upcoming, auto-advance between celebration members
    if (isBirthdayMode && !viewingUpcoming) {
      const celebrationMembers = upcomingBirthdays.filter((member) => member.isRecentBirthday)

      if (celebrationMembers.length > 1) {
        const timer = setInterval(() => {
          setCelebrationIndex((prevIndex) => {
            const nextIndex = prevIndex + 1
            return nextIndex < celebrationMembers.length ? nextIndex : 0
          })
        }, 7000) // Longer time to read the birthday messages

        return () => clearInterval(timer)
      }

      return
    }

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
  }, [upcomingBirthdays, currentIndex, isBirthdayMode, viewingUpcoming, autoRotateEnabled])

  // Recalculate birthdays every day to check for new birthdays
  useEffect(() => {
    const checkForNewBirthdays = () => {
      setUpcomingBirthdays(calculateUpcomingBirthdays())
    }

    // Check at midnight every day
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const midnightTimer = setTimeout(checkForNewBirthdays, timeUntilMidnight)

    return () => clearTimeout(midnightTimer)
  }, [calculateUpcomingBirthdays])

  // Function to navigate to upcoming birthdays
  const showUpcomingBirthdays = () => {
    setViewingUpcoming(true)
  }

  // Function to return to celebration mode
  const showCelebration = () => {
    setViewingUpcoming(false)
  }

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setAutoRotateEnabled(!autoRotateEnabled)
  }

  // Handle edge case: no birthdays
  if (upcomingBirthdays.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">No Birthdays Available</h2>
          <p className="text-gray-300">Please add member birthdays to see the countdown.</p>
        </div>
      </div>
    )
  }

  // Get the current member to display
  let displayMember: MemberWithBirthdayInfo

  if (isBirthdayMode && !viewingUpcoming) {
    // In celebration mode, show the celebrating member
    const celebrationMembers = upcomingBirthdays.filter((member) => member.isRecentBirthday)
    displayMember = celebrationMembers[celebrationIndex]
  } else {
    // Show the upcoming birthday member
    displayMember = upcomingBirthdays[currentIndex]
  }

  // Handle edge case: invalid member
  if (!displayMember) {
    // Fallback to the first member if something went wrong
    displayMember = upcomingBirthdays[0]
    if (isBirthdayMode && !viewingUpcoming) {
      setCelebrationIndex(0)
    } else {
      setCurrentIndex(0)
    }
  }

  // Format birthday date
  const birthday = new Date(displayMember.nextBirthday!)
  const formattedDate = birthday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Calculate age on next birthday
  const birthYear = Number.parseInt(displayMember.birthday.split("-")[0])
  const nextAge = birthday.getFullYear() - birthYear

  // Check if there are multiple members with the same birthday
  const sameDayMembers = upcomingBirthdays.filter(
    (member) => member.nextBirthday?.toDateString() === displayMember.nextBirthday?.toDateString(),
  )
  const hasSameDayMembers = sameDayMembers.length > 1

  // Count how many celebration birthdays we have
  const celebrationCount = upcomingBirthdays.filter((member) => member.isRecentBirthday).length

  // Get the birthday message for the current member
  const currentBirthdayMessage = displayMember.birthdayMessage || generateBirthdayMessage(displayMember)

  // Calculate days since birthday for celebration mode
  const daysSinceBirthdayText = displayMember.isTodayBirthday
    ? "Today"
    : displayMember.daysSinceBirthday === 1
      ? "Yesterday"
      : `${displayMember.daysSinceBirthday} days ago`

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-black to-gray-900">
      <div className="relative z-10 px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Mode switcher - only show if in birthday mode */}
          {isBirthdayMode && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={showCelebration}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    !viewingUpcoming ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  aria-current={!viewingUpcoming ? "page" : undefined}
                >
                  <Cake className="inline-block w-4 h-4 mr-2" />
                  Birthday Celebration
                </button>
                <button
                  onClick={showUpcomingBirthdays}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    viewingUpcoming ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  aria-current={viewingUpcoming ? "page" : undefined}
                >
                  <Calendar className="inline-block w-4 h-4 mr-2" />
                  Upcoming Birthdays
                </button>
              </div>

              <button
                onClick={toggleAutoRotate}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                  autoRotateEnabled ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span>{autoRotateEnabled ? <RefreshCcw className="inline-block w-4 h-4" /> : <RefreshCwOff className="inline-block w-4 h-4" />}</span>
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 justify-center">
            {/* Member image */}
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-sm overflow-hidden border-4 border-pink-500 shadow-lg shadow-purple-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              key={`${displayMember.id}-${isBirthdayMode ? "celebration" : "upcoming"}-${isBirthdayMode && !viewingUpcoming ? celebrationIndex : currentIndex}`}
            >
              <Image
                src={`https://i.imgur.com/${displayMember.image}`}
                alt={displayMember.name}
                fill
                className="object-cover"
              />

              {/* Birthday decorations when in birthday mode and showing celebration */}
              {isBirthdayMode && !viewingUpcoming && (
                <>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-2 left-2 transform -rotate-12">
                      <PartyPopper className="h-8 w-8 text-yellow-400" />
                    </div>
                    <div className="absolute top-2 right-2 transform rotate-12">
                      <Gift className="h-8 w-8 text-pink-400" />
                    </div>
                    <div className="absolute bottom-2 left-2 transform rotate-12">
                      <Star className="h-8 w-8 text-yellow-400" />
                    </div>
                    <div className="absolute bottom-2 right-2 transform -rotate-12">
                      <Heart className="h-8 w-8 text-pink-400" />
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Countdown and info */}
            <div className="flex-1 max-w-2xl text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                key={`${displayMember.id}-info-${isBirthdayMode ? "celebration" : "upcoming"}-${isBirthdayMode && !viewingUpcoming ? celebrationIndex : currentIndex}`}
              >
                {isBirthdayMode && !viewingUpcoming ? (
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                    <Cake className="h-6 w-6 text-pink-400" />
                    {displayMember.isTodayBirthday ? "Happy Birthday Today!" : "Birthday Celebration!"}
                  </h2>
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                    <Cake className="h-6 w-6 text-pink-400" />
                    Upcoming Birthday
                  </h2>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${displayMember.id}-content-${isBirthdayMode ? "celebration" : "upcoming"}-${isBirthdayMode && !viewingUpcoming ? celebrationIndex : currentIndex}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                      {displayMember.name}
                    </h3>

                    <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                      <Calendar className="h-5 w-5 text-pink-400" />
                      <p className="text-lg text-gray-300">
                        {formattedDate} <span className="text-pink-400">({nextAge} International age)</span>
                        {isBirthdayMode && !viewingUpcoming && !displayMember.isTodayBirthday && (
                          <span className="ml-2 text-yellow-400">({daysSinceBirthdayText})</span>
                        )}
                      </p>
                    </div>

                    <p className="text-gray-300 mb-6 max-w-xl mx-auto md:mx-0">{displayMember.role}</p>

                    {/* Birthday message or countdown */}
                    {isBirthdayMode && !viewingUpcoming ? (
                      <motion.div
                        className="max-w-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-pink-500/30 mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-xl text-white">{currentBirthdayMessage}</p>
                      </motion.div>
                    ) : (
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
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-center mt-8 gap-4">
            {/* Navigation for celebration mode */}
            {isBirthdayMode && !viewingUpcoming && (
              <div className="flex items-center gap-4">
                {celebrationCount > 1 ? 
                  <>
                    <div className="flex gap-2">
                      {upcomingBirthdays
                        .filter((member) => member.isRecentBirthday)
                        .map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCelebrationIndex(index)}
                            className={`w-2 h-2 rounded-full ${celebrationIndex === index ? "bg-pink-500" : "bg-gray-600"}`}
                            aria-label={`Go to celebrating member ${index + 1}`}
                          />
                        ))}
                    </div>
                  </> : 
                  <>
                    <div className="flex gap-2 w-2 h-2"/>
                  </>
                }
              </div>
            )}

            {/* Navigation for upcoming birthdays */}
            {(!isBirthdayMode || viewingUpcoming) && (
              <div className="flex items-center gap-4">
                {/* Dots for same-day members */}
                {hasSameDayMembers ? 
                  <div className="flex gap-2">
                    {sameDayMembers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(upcomingBirthdays.indexOf(sameDayMembers[index]))}
                        className={`w-2 h-2 rounded-full ${
                          upcomingBirthdays.indexOf(sameDayMembers[index]) === currentIndex
                            ? "bg-pink-500"
                            : "bg-gray-600"
                        }`}
                        aria-label={`Go to member ${index + 1}`}
                      />
                    ))}
                  </div> :
                  <div className="flex gap-2 w-2 h-2"/>
                }
              </div>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex justify-center mt-6">
            <div className="text-sm text-gray-400">
              {isBirthdayMode && !viewingUpcoming ? (
                <span>
                  Showing {celebrationIndex + 1} of {celebrationCount} celebration{celebrationCount > 1 ? "s" : ""}
                </span>
              ) : (
                <span>
                  Showing upcoming birthday
                  {upcomingBirthdays.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confetti effect */}
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