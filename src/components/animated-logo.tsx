"use client"

import { useEffect, useRef } from "react"
import anime from "animejs"

interface AnimatedLogoProps {
  width?: number | string
  height?: number | string
  className?: string
  strokeWidth?: number
  strokeColor?: string
  loop?: boolean
  duration?: number
}

export default function AnimatedLogo({
  width = 40,
  height = 40,
  className = "",
  strokeWidth = 30,
  strokeColor = "#000000",
  loop = true,
  duration = 2000,
}: AnimatedLogoProps) {
  const logoRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (logoRef.current) {
      // Get all paths in the SVG
      const paths = logoRef.current.querySelectorAll("path")

      // Set up the animation
      anime({
        targets: paths,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: "easeInOutSine",
        duration: duration,
        delay: (el, i) => i * 250,
        direction: "alternate",
        loop: loop,
      })
    }
  }, [duration, loop])

  return (
    <svg ref={logoRef} width={width} height={height} viewBox="0 0 800 800" className={className}>
      <g
        transform="translate(0.000000,800.000000) scale(0.100000,-0.100000)"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      >
        <path
          d="M3950 6776 c-8 -8 -159 -96 -335 -196 -176 -100 -333 -191 -350 -201
        -16 -10 -37 -22 -45 -26 -13 -6 -436 -251 -548 -318 -24 -14 -40 -30 -37 -35
        4 -6 27 -22 53 -35 26 -14 54 -30 62 -35 8 -5 53 -32 100 -58 47 -27 168 -97
        269 -156 101 -58 185 -106 188 -106 3 0 17 -8 31 -18 15 -11 52 -32 82 -49 30
        -16 105 -59 165 -95 61 -35 128 -75 150 -88 22 -12 54 -31 70 -40 69 -40 512
        -294 535 -306 14 -8 31 -14 38 -14 6 0 12 -11 12 -24 0 -19 -13 -31 -67 -60
        -38 -20 -90 -50 -118 -67 -27 -16 -72 -41 -100 -56 -27 -14 -61 -34 -74 -44
        -13 -11 -30 -19 -38 -19 -9 0 -90 44 -182 99 -142 84 -268 158 -396 231 -16 9
        -54 31 -83 49 -29 17 -55 31 -57 31 -2 0 -70 39 -152 86 -193 113 -379 221
        -423 246 -206 118 -327 188 -389 225 -80 48 -132 63 -156 43 -18 -15 -315
        -186 -372 -214 -45 -22 -51 -43 -18 -61 11 -5 65 -37 120 -69 55 -33 145 -85
        200 -116 55 -31 215 -123 355 -205 140 -82 291 -169 335 -193 44 -25 157 -90
        250 -145 247 -144 295 -172 345 -200 25 -13 117 -67 205 -118 298 -173 399
        -229 414 -229 14 0 142 69 271 145 30 18 77 45 103 60 27 15 70 40 95 55 26
        16 63 37 82 46 19 10 46 25 60 34 21 15 118 72 260 153 19 11 55 32 80 46 25
        14 96 55 158 91 63 36 130 75 150 88 20 12 49 27 65 33 52 21 33 41 -125 129
        -177 99 -184 104 -263 151 -33 20 -80 48 -105 61 -25 14 -159 91 -299 172
        -140 80 -256 146 -258 146 -3 0 -17 8 -31 19 -30 21 -44 29 -253 147 -80 45
        -191 110 -247 143 -57 34 -106 61 -111 61 -9 0 -41 33 -41 43 0 4 28 21 63 38
        34 18 85 46 112 63 28 17 75 44 105 60 30 16 62 34 70 41 45 37 59 38 108 7
        26 -16 108 -64 182 -107 74 -42 164 -95 200 -115 165 -97 526 -305 735 -425
        127 -72 307 -176 400 -230 247 -143 215 -133 288 -94 34 18 78 42 97 54 19 12
        62 37 95 55 103 56 205 122 205 131 0 5 -8 13 -17 16 -10 4 -36 18 -58 32 -22
        14 -50 31 -62 38 -50 26 -283 159 -353 201 -124 73 -131 78 -235 137 -55 32
        -113 65 -130 75 -16 10 -149 86 -295 170 -146 84 -269 156 -275 160 -10 7 -55
        33 -165 93 -30 17 -98 56 -150 88 -191 115 -504 289 -520 289 -9 0 -22 -6 -30
        -14z"
        />
        <path
          d="M1557 4398 l2 -783 48 -33 c26 -18 59 -38 73 -46 54 -28 336 -190
        360 -206 25 -18 81 -50 161 -92 24 -13 100 -57 169 -97 159 -94 264 -155 475
        -276 208 -119 207 -119 330 -190 55 -32 109 -63 120 -69 57 -31 55 -21 55
        -268 0 -187 -3 -230 -14 -234 -8 -3 -82 35 -165 85 -83 50 -153 91 -155 91 -3
        0 -41 23 -86 50 -45 28 -83 50 -85 50 -2 0 -69 38 -150 85 -81 47 -149 85
        -150 85 -2 0 -43 24 -92 54 -48 29 -135 81 -193 113 -58 33 -176 101 -264 152
        -87 50 -160 91 -163 91 -2 0 -23 13 -46 29 -23 15 -73 45 -112 66 -38 20 -75
        42 -82 47 -31 25 -34 2 -34 -255 0 -141 3 -261 6 -267 4 -7 224 -140 380 -230
        22 -12 56 -32 75 -43 19 -11 80 -46 135 -77 140 -79 156 -89 280 -162 61 -36
        157 -91 215 -123 58 -32 132 -75 165 -95 98 -60 175 -105 260 -152 44 -25 96
        -54 115 -65 19 -12 78 -45 130 -75 52 -30 151 -88 220 -128 224 -131 261 -151
        270 -145 5 3 9 320 9 779 0 716 -1 775 -17 789 -19 16 -246 153 -332 200 -78
        43 -372 212 -455 262 -68 41 -260 152 -460 265 -55 31 -134 77 -175 101 -41
        25 -133 79 -205 119 -71 40 -134 80 -139 88 -6 10 -11 364 -6 465 0 13 32 7
        58 -12 29 -20 210 -127 302 -178 152 -85 132 -74 360 -208 91 -54 190 -111
        220 -128 30 -17 109 -62 175 -100 200 -116 307 -177 310 -177 2 0 262 -153
        304 -179 18 -12 39 -20 45 -18 8 3 11 82 12 265 1 295 9 268 -86 319 -30 17
        -104 59 -165 95 -60 35 -135 78 -165 95 -30 16 -89 50 -130 75 -123 73 -261
        153 -325 188 -104 57 -138 76 -207 119 -38 23 -128 75 -200 117 -73 42 -149
        86 -168 97 -19 11 -86 49 -147 84 -62 34 -173 98 -245 141 -73 43 -176 103
        -228 132 -52 29 -112 64 -132 77 -21 12 -43 23 -50 23 -10 0 -13 -155 -11
        -782z"
        />
        <path
          d="M6315 5130 c-44 -27 -107 -63 -140 -80 -33 -18 -67 -38 -75 -45 -8
        -6 -42 -27 -75 -45 -33 -19 -105 -61 -160 -93 -55 -33 -149 -88 -210 -122 -60
        -34 -126 -71 -145 -82 -19 -11 -127 -73 -240 -138 -113 -65 -216 -125 -230
        -135 -14 -9 -68 -41 -120 -70 -52 -29 -108 -61 -125 -70 -16 -10 -142 -82
        -280 -160 -137 -78 -273 -157 -301 -175 l-50 -33 2 -754 c1 -467 -2 -760 -8
        -772 -7 -13 -6 -22 4 -31 11 -11 55 11 258 126 135 77 274 157 310 178 226
        133 310 181 347 202 23 13 108 63 190 110 269 156 417 241 512 296 51 29 105
        62 118 73 31 24 49 25 57 4 3 -9 6 -114 6 -233 0 -195 -2 -220 -17 -233 -10
        -9 -72 -46 -138 -83 -66 -38 -133 -77 -150 -87 -32 -20 -194 -114 -509 -295
        -104 -59 -205 -118 -225 -129 -144 -85 -228 -134 -306 -177 -49 -27 -94 -53
        -100 -57 -9 -7 -73 -44 -245 -143 -19 -11 -47 -27 -62 -34 -15 -8 -31 -20 -35
        -26 -11 -17 -11 -527 -1 -533 5 -3 23 3 41 14 17 11 79 47 137 79 114 65 412
        236 665 383 88 51 248 144 355 205 107 62 260 150 340 196 127 75 244 142 344
        199 17 9 56 32 86 50 30 18 75 44 100 57 107 59 180 106 181 117 5 106 -4
        1553 -10 1559 -4 4 -18 -1 -32 -11 -13 -10 -49 -32 -79 -49 -30 -17 -71 -40
        -90 -51 -19 -10 -75 -43 -125 -72 -128 -74 -342 -198 -395 -227 -25 -14 -61
        -35 -80 -48 -31 -20 -205 -120 -420 -241 -80 -46 -205 -118 -230 -133 -8 -6
        -67 -40 -130 -77 -63 -37 -122 -73 -131 -81 -8 -7 -26 -13 -40 -13 l-24 0 2
        232 c1 128 2 236 2 239 1 3 13 12 28 20 15 8 77 43 138 78 60 35 184 106 275
        158 90 52 169 98 175 102 5 5 35 22 65 39 30 16 95 53 143 81 49 28 91 51 93
        51 2 0 44 24 92 53 48 30 125 75 172 102 47 26 148 85 225 130 77 46 187 110
        245 143 58 33 112 70 120 83 13 20 15 64 12 277 -2 188 -6 252 -15 251 -7 0
        -48 -22 -92 -49z"
        />
      </g>
    </svg>
  )
}

