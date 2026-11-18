"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react"
import { useReducedMotion } from "motion/react"

const emptySubscribe = () => () => {}

/**
 * Hydration-safe wrapper around Motion's useReducedMotion().
 * Returns false during SSR and initial hydration, then reflects OS preference cleanly.
 */
export function useSafeReducedMotion(): boolean {
  const reduced = useReducedMotion()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  return mounted ? Boolean(reduced) : false
}

interface UseDialogA11yOptions {
  onKeyDown?: (e: KeyboardEvent) => void
  lightDismiss?: boolean
}

/**
 * Coordinates native modal <dialog> lifecycle (showModal/close), close event sync,
 * Safari light-dismiss fallback for closedby="any", and optional keyboard handlers.
 */
export function useDialogA11y(
  isOpen: boolean,
  dialogRef: RefObject<HTMLDialogElement | null>,
  onClose: () => void,
  options?: UseDialogA11yOptions
) {
  const lightDismiss = options?.lightDismiss ?? true
  const onCloseRef = useRef(onClose)
  const onKeyDownRef = useRef(options?.onKeyDown)
  useEffect(() => {
    onCloseRef.current = onClose
    onKeyDownRef.current = options?.onKeyDown
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!isOpen) {
      if (dialog.open) {
        dialog.returnValue = ""
        dialog.close()
      }
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }

    const handleClose = () => {
      dialog.returnValue = ""
      onCloseRef.current()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDownRef.current?.(e)
    }

    dialog.addEventListener("close", handleClose)
    dialog.addEventListener("keydown", handleKeyDown)

    let removeLightDismiss: (() => void) | undefined
    if (lightDismiss && !("closedBy" in HTMLDialogElement.prototype)) {
      let pressedOutside = false
      const isOutside = (e: PointerEvent) => {
        if (e.target !== dialog) return false
        const r = dialog.getBoundingClientRect()
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
      }
      const handlePointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e)
      }
      const handlePointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close()
        }
        pressedOutside = false
      }
      dialog.addEventListener("pointerdown", handlePointerDown)
      dialog.addEventListener("pointerup", handlePointerUp)
      removeLightDismiss = () => {
        dialog.removeEventListener("pointerdown", handlePointerDown)
        dialog.removeEventListener("pointerup", handlePointerUp)
      }
    }

    return () => {
      dialog.removeEventListener("close", handleClose)
      dialog.removeEventListener("keydown", handleKeyDown)
      removeLightDismiss?.()
      if (dialog.open) {
        dialog.returnValue = ""
        dialog.close()
      }
    }
  }, [isOpen, dialogRef, lightDismiss])
}

/**
 * Shared accessible state, top-layer Popover API integration, progressive CSS Anchor Positioning
 * (with viewport-aware fixed fallback for browsers without position-area), and roving keyboard
 * navigation for listbox dropdowns.
 */
export function useListboxA11y(align: "left" | "right" | "auto" = "auto") {
  const [isOpen, setIsOpen] = useState(false)
  const [menuAlign, setMenuAlign] = useState<"left" | "right">("left")
  const [fallbackStyle, setFallbackStyle] = useState<React.CSSProperties | undefined>(undefined)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const rawId = useId()
  const listboxId = `listbox-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  const anchorName = `--anchor-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent
      const nextOpen = toggleEvent.newState === "open"
      setIsOpen(nextOpen)
    }

    menu.addEventListener("toggle", handleToggle)
    return () => menu.removeEventListener("toggle", handleToggle)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const supportsAnchorPositioning =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("position-area", "block-end")

    const updatePosition = () => {
      const trigger = triggerRef.current ?? dropdownRef.current
      const menu = menuRef.current
      if (!trigger || !menu) return

      const triggerRect = trigger.getBoundingClientRect()
      const menuWidth = Math.max(210, menu.offsetWidth || 0)

      let nextAlign: "left" | "right" = "left"
      if (align !== "auto") {
        nextAlign = align
      } else if (
        triggerRect.left + menuWidth > window.innerWidth - 16 ||
        triggerRect.left > window.innerWidth / 2
      ) {
        nextAlign = "right"
      }
      setMenuAlign(nextAlign)

      if (supportsAnchorPositioning) {
        setFallbackStyle(undefined)
        return
      }

      const desiredHeight = Math.min(menu.scrollHeight || 340, 340)
      const spaceBelow = window.innerHeight - triggerRect.bottom - 16
      const spaceAbove = triggerRect.top - 16
      const flipTop = spaceBelow < desiredHeight && spaceAbove > spaceBelow
      const availableSpace = flipTop ? spaceAbove : spaceBelow
      const maxHeight = Math.max(160, Math.floor(Math.min(340, availableSpace)))

      const nextStyle: React.CSSProperties = {
        position: "fixed",
        inset: "auto",
        margin: 0,
        maxHeight: `${maxHeight}px`,
        minWidth: `${Math.max(200, Math.round(triggerRect.width))}px`,
      }

      if (flipTop) {
        nextStyle.bottom = `${Math.round(window.innerHeight - triggerRect.top + 8)}px`
      } else {
        nextStyle.top = `${Math.round(triggerRect.bottom + 8)}px`
      }

      if (nextAlign === "right") {
        nextStyle.right = `${Math.max(16, Math.round(window.innerWidth - triggerRect.right))}px`
      } else {
        nextStyle.left = `${Math.max(16, Math.round(triggerRect.left))}px`
      }

      setFallbackStyle(nextStyle)
    }

    const rafId = requestAnimationFrame(updatePosition)
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [isOpen, align])

  useEffect(() => {
    if (!isOpen) return
    const supportsPopover =
      typeof HTMLElement !== "undefined" && "popover" in HTMLElement.prototype
    if (supportsPopover) return

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

  const openMenu = () => {
    const menu = menuRef.current
    if (menu && typeof menu.showPopover === "function") {
      try {
        if (!menu.matches(":popover-open")) {
          menu.showPopover()
        }
      } catch {
        setIsOpen(true)
      }
    } else {
      setIsOpen(true)
    }
  }

  const closeMenu = () => {
    const menu = menuRef.current
    if (menu && typeof menu.hidePopover === "function") {
      try {
        if (menu.matches(":popover-open")) {
          menu.hidePopover()
        }
      } catch {
        setIsOpen(false)
      }
    } else {
      setIsOpen(false)
    }
  }

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

  const handleTriggerClick = () => {
    const menu = menuRef.current
    if (!menu || typeof menu.showPopover !== "function") {
      setIsOpen((prev) => !prev)
    }
  }

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      openMenu()
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
      closeMenu()
    }
  }

  const closeAndFocusTrigger = () => {
    closeMenu()
    triggerRef.current?.focus({ preventScroll: true })
  }

  return {
    isOpen,
    setIsOpen,
    menuAlign,
    anchorName,
    fallbackStyle,
    dropdownRef,
    triggerRef,
    menuRef,
    listboxId,
    handleTriggerClick,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    closeAndFocusTrigger,
  }
}
