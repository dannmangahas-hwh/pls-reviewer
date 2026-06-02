"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface QuestionsListProps {
  children: React.ReactNode
}

export function QuestionsList({ children }: QuestionsListProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasStarted) return

    const handleScroll = () => {
      const trigger =
        document.querySelector("[data-hashtags-banner]") ?? triggerRef.current
      if (!trigger) return

      if (trigger.getBoundingClientRect().bottom <= 0) {
        setHasStarted(true)
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
      <div className="flex flex-col gap-6">
        {React.Children.map(children, (child, index) => (
          <div
            className={cn(
              "will-change-[opacity,transform]",
              hasStarted
                ? "animate-slide-up-fade-in"
                : "translate-y-6 opacity-0"
            )}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  )
}
