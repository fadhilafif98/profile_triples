"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react"
import { useReducedMotion } from "motion/react"

/**
 * Hydration-safe wrapper around Motion's useReducedMotion().
 * Returns false during SSR and initial hydration, then reflects OS preference cleanly.
 */
export function useSafeReducedMotion(): boolean {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted ? Boolean(reduced) : false
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getVisibleFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      (el.offsetParent !== null || getComputedStyle(el).position === "fixed")
  )
}

interface UseDialogA11yOptions {
  lockScroll?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
}

/**
 * Manages modal/drawer dialog focus entry, Tab cycling, Escape closing,
 * optional body scroll locking, and focus restoration on close.
 */
export function useDialogA11y(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  options?: UseDialogA11yOptions
) {
  const lockScroll = options?.lockScroll ?? true
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const onKeyDownRef = useRef(options?.onKeyDown)
  onKeyDownRef.current = options?.onKeyDown
  const previousActiveRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false
        const prev = previousActiveRef.current
        previousActiveRef.current = null
        if (prev && prev.isConnected && typeof prev.focus === "function") {
          prev.focus({ preventScroll: true })
        }
      }
      return
    }

    wasOpenRef.current = true
    previousActiveRef.current = document.activeElement as HTMLElement | null

    const prevOverflow = lockScroll ? document.body.style.overflow : ""
    if (lockScroll) {
      document.body.style.overflow = "hidden"
    }

    const rafId = requestAnimationFrame(() => {
      const container = containerRef.current
      if (!container) return
      if (!container.contains(document.activeElement)) {
        const focusables = getVisibleFocusableElements(container)
        if (focusables.length > 0) {
          focusables[0].focus({ preventScroll: true })
        } else {
          container.focus({ preventScroll: true })
        }
      }
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onCloseRef.current()
        return
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusables = getVisibleFocusableElements(containerRef.current)
        if (focusables.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null

        if (e.shiftKey) {
          if (!active || active === first || !containerRef.current.contains(active)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (!active || active === last || !containerRef.current.contains(active)) {
            e.preventDefault()
            first.focus()
          }
        }
        return
      }

      onKeyDownRef.current?.(e)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("keydown", handleKeyDown)
      if (lockScroll) {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isOpen, containerRef, lockScroll])

  // Restore trigger focus if component unmounts while open
  useEffect(() => {
    return () => {
      if (wasOpenRef.current) {
        const prev = previousActiveRef.current
        if (prev && prev.isConnected && typeof prev.focus === "function") {
          prev.focus({ preventScroll: true })
        }
      }
    }
  }, [])
}

/**
 * Shared accessible state, boundary auto-alignment, outside-click dismissal,
 * and roving keyboard navigation for listbox dropdowns.
 */
export function useListboxA11y(align: "left" | "right" | "auto" = "auto") {
  const [isOpen, setIsOpen] = useState(false)
  const [menuAlign, setMenuAlign] = useState<"left" | "right">("left")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      if (align !== "auto") {
        setMenuAlign(align)
      } else {
        const rect = dropdownRef.current.getBoundingClientRect()
        if (rect.left + 210 > window.innerWidth || rect.left > window.innerWidth / 2) {
          setMenuAlign("right")
        } else {
          setMenuAlign("left")
        }
      }
    }
  }, [isOpen, align])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus({ preventScroll: true })
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleWindowKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleWindowKeyDown)
    }
  }, [isOpen])

  const focusOptionAt = (target: "selected" | "first" | "last") => {
    requestAnimationFrame(() => {
      const menu = menuRef.current
      if (!menu) return
      const options = Array.from(menu.querySelectorAll<HTMLElement>('[role="option"]'))
      if (options.length === 0) return
      if (target === "last") {
        options[options.length - 1].focus()
      } else if (target === "selected") {
        const selected = options.find((el) => el.getAttribute("aria-selected") === "true")
        ;(selected || options[0]).focus()
      } else {
        options[0].focus()
      }
    })
  }

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      setIsOpen(true)
      focusOptionAt(e.key === "ArrowUp" ? "last" : "selected")
    }
  }

  const handleMenuKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current
    if (!menu) return
    const options = Array.from(menu.querySelectorAll<HTMLElement>('[role="option"]'))
    if (options.length === 0) return
    const currentIndex = options.indexOf(document.activeElement as HTMLElement)

    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0
      options[next].focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = currentIndex >= 0 ? (currentIndex - 1 + options.length) % options.length : options.length - 1
      options[prev].focus()
    } else if (e.key === "Home") {
      e.preventDefault()
      options[0].focus()
    } else if (e.key === "End") {
      e.preventDefault()
      options[options.length - 1].focus()
    } else if (e.key === "Tab") {
      setIsOpen(false)
    }
  }

  const closeAndFocusTrigger = () => {
    setIsOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  return {
    isOpen,
    setIsOpen,
    menuAlign,
    dropdownRef,
    triggerRef,
    menuRef,
    listboxId,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    closeAndFocusTrigger,
  }
}
