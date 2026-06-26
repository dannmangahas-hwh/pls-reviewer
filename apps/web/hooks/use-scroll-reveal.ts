"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Returns `true` once the attached `ref` element enters the viewport.
 * Uses IntersectionObserver so each section triggers independently.
 *
 * @param threshold  0–1, fraction of the element that must be visible (default 0.15)
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
