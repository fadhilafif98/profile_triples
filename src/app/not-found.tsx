"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Music, Star, Disc } from "lucide-react"
import { useState, useEffect } from "react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 })

  // Only access window after component has mounted on the client
  useEffect(() => {
    setMounted(true)
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Don't render animations until client-side
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Page Not Found</h2>
        <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
          Oops! Looks like you&apos;ve wandered off the stage. The page you&apos;re looking for has either been moved or doesn&apos;t
          exist.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: 0.1 + Math.random() * 0.5,
            }}
            animate={{
              y: Math.random() * -100,
              opacity: 0.8,
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            <Star
              className={`h-${Math.floor(3 + Math.random() * 4)} w-${Math.floor(3 + Math.random() * 4)} text-purple-${Math.floor(3 + Math.random() * 5)}00`}
            />
          </motion.div>
        ))}

        {/* Animated music notes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`note-${i}`}
            className="absolute"
            initial={{
              x: Math.random() * dimensions.width,
              y: dimensions.height + 100,
              opacity: 0.1 + Math.random() * 0.5,
              rotate: Math.random() * 180 - 90,
            }}
            animate={{
              y: -100,
              opacity: [0.2, 0.8, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: Math.random() * 5,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            <Music
              className={`h-${Math.floor(4 + Math.random() * 6)} w-${Math.floor(4 + Math.random() * 6)} text-pink-${Math.floor(3 + Math.random() * 5)}00`}
            />
          </motion.div>
        ))}

        {/* Animated discs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`disc-${i}`}
            className="absolute opacity-10"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              scale: 0.5 + Math.random() * 1.5,
            }}
            animate={{
              rotate: 360,
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            transition={{
              rotate: {
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              x: {
                duration: 30 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              y: {
                duration: 30 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 5,
              },
            }}
          >
            <Disc className="h-20 w-20 text-gray-400" />
          </motion.div>
        ))}
      </div>

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Page Not Found</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
            Oops! Looks like you&apos;ve wandered off the stage. The page you&apos;re looking for has either been moved or doesn&apos;t
            exist.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-all"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 px-6 py-3 rounded-full text-white font-medium hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-600/30 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </motion.div>
      </div>

      {/* Animated record player */}
      <motion.div
        className="absolute bottom-10 right-10 hidden md:block"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-900"></div>
            </div>
          </motion.div>
          <motion.div
            className="absolute top-0 right-0 w-8 h-24 bg-gray-800 origin-bottom-left rounded-t-lg"
            animate={{ rotate: 5 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            style={{ transformOrigin: "10% 90%" }}
          />
        </div>
      </motion.div>

      {/* Animated equalizer */}
      <motion.div
        className="absolute bottom-10 left-10 hidden md:flex gap-1 items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`eq-${i}`}
            className="w-2 bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-sm"
            animate={{ height: [15, 5 + Math.random() * 40, 15] }}
            transition={{
              duration: 0.8 + Math.random() * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}