"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  delayMs?: number
}

export function AnimatedList({ children, className, delayMs = 90 }: AnimatedListProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasStarted) return

    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        if (rect.top <= window.innerHeight - 50) {
          setHasStarted(true)
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [hasStarted])

  return (
    <>
      <div ref={triggerRef} aria-hidden="true" className="h-px w-full" />
      <div className={cn("flex flex-col gap-6", className)}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child
          return (
            <div
              className={cn(
                "will-change-[opacity,transform]",
                hasStarted
                  ? "animate-slide-up-fade-in"
                  : "translate-y-6 opacity-0"
              )}
              style={{ animationDelay: `${index * delayMs}ms` }}
            >
              {child}
            </div>
          )
        })}
      </div>
    </>
  )
}
