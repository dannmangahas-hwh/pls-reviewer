"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

function FadeItem({
  children,
  visible,
  index,
  className,
}: {
  children: React.ReactNode
  visible: boolean
  index: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "will-change-[opacity,transform]",
        visible ? "animate-slide-up-fade-in" : "opacity-0 translate-y-6",
        className
      )}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {children}
    </div>
  )
}

export function WhatYouGain() {
  const { ref, visible } = useScrollReveal(0.15)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative flex min-h-[570px] w-full items-center overflow-hidden bg-[#1B2644] py-16 md:h-[570px] md:py-0"
    >
      {/* Background images — these stay fixed and are NOT animated */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-[1] hidden h-[118%] w-[56%] -translate-x-1/2 -translate-y-1/2 md:block">
        <Image
          src="/sampaguita-1.png"
          alt=""
          fill
          className="object-contain opacity-20"
          sizes="50vw"
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-[1] h-full">
        <Image
          src="/what-you-gain-image.png"
          alt="What you gain illustration"
          width={1280}
          height={570}
          className="h-full w-auto max-w-none object-contain object-right scale-x-[-1] opacity-20 md:opacity-30"
        />
      </div>

      {/* Foreground content — each child staggered */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] items-center justify-center px-6">
        <div className="flex w-full max-w-[1120px] flex-col items-center gap-8 md:gap-12">

          {/* Header row (index 0) */}
          <FadeItem
            visible={visible}
            index={0}
            className="flex w-full flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-8"
          >
            <h3 className="font-alexandria text-center md:text-left text-3xl sm:text-4xl md:text-[50px] font-extrabold uppercase text-[#D4A53B] leading-none">
              WHAT YOU GAIN?
            </h3>
            <p className="max-w-[520px] text-center md:text-left text-sm md:text-[15px] leading-relaxed text-white">
              Build the skills, discipline, and confidence needed to succeed—not
              just in the bar exam, but in your future legal career.
            </p>
          </FadeItem>

          {/* List items — each one staggered (indices 1–5) */}
          <ul className="mx-auto flex w-full md:w-fit flex-col items-start gap-4 md:gap-5 text-lg sm:text-xl md:text-2xl lg:text-[30px] leading-snug font-bold">
            {[
              { label: "STRONGER FOUNDATION", suffix: " in key legal principles" },
              { label: "INCREASED CONFIDENCE", suffix: " in answering exam questions" },
              { label: "BETTER TIME MANAGEMENT", suffix: " and ", extra: "STUDY EFFICIENCY" },
              { label: "CONTINUOUS PROGRESS", suffix: " through consistent practice" },
              { label: "HIGHER CHANCES", suffix: " of passing the bar exam" },
            ].map((item, i) => (
              <FadeItem key={i} visible={visible} index={i + 1} className="w-full">
                <li className="grid grid-cols-[20px_auto] sm:grid-cols-[28px_auto] items-start gap-3 sm:gap-4 text-white w-full">
                  <span className="text-[#D4A53B]">○</span>
                  <span>
                    <strong className="text-[#D4A53B]">{item.label}</strong>
                    {item.suffix}
                    {item.extra && (
                      <strong className="text-[#D4A53B]">{item.extra}</strong>
                    )}
                  </span>
                </li>
              </FadeItem>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
