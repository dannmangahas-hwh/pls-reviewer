"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

// Helper: fade-in-up wrapper with a per-item delay
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
        "will-change-[opacity,transform] transition-none",
        visible ? "animate-slide-up-fade-in" : "opacity-0 translate-y-6",
        className
      )}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {children}
    </div>
  )
}

export function Challenges() {
  const { ref, visible } = useScrollReveal(0.15)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-white py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        {/* Top Row: Decorations & Title */}
        <div className="flex w-full items-center justify-between relative">

          {/* Left Decoration: animate as one unit (index 0) */}
          <FadeItem visible={visible} index={0} className="hidden lg:block relative h-32 w-56 shrink-0">
            {/* Vertical line: top half navy, bottom half red */}
            <div className="absolute top-0 left-0 w-[2px] h-full flex flex-col">
              <div className="h-1/2 bg-[#1B2644]"></div>
              <div className="h-1/2 bg-[#A8201A]"></div>
            </div>

            {/* Horizontal gold line */}
            <div className="absolute top-[60%] left-0 w-full h-[2px] bg-[#D6A95B]"></div>

            {/* Carabao (Kalabaw) Image */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 w-40 h-24">
              <Image
                src="/kalabaw.png"
                alt="Kalabaw Icon"
                fill
                className="object-contain"
                priority
              />
            </div>
          </FadeItem>

          {/* Center Title (index 1) */}
          <FadeItem visible={visible} index={1} className="flex-1 lg:px-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black uppercase leading-tight tracking-tight">
              Bar Exam Challenges And <br className="hidden lg:block" />
              Smarter Solutions
            </h2>
          </FadeItem>

          {/* Right Decoration: Stacked Squares (index 2) */}
          <FadeItem visible={visible} index={2} className="hidden lg:block relative w-32 h-32 shrink-0">
            {/* Gold square (back, top-right) */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D6A95B]"></div>
            {/* Navy square (front, bottom-left) */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1B2644]"></div>
          </FadeItem>
        </div>

        {/* Bottom Row: Image & Text */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left Side: Main Image (index 3) */}
          <FadeItem visible={visible} index={3} className="w-full lg:w-[55%] relative flex-shrink-0">
            <div className="w-full aspect-[16/10] bg-neutral-200 border border-neutral-300 rounded-sm overflow-hidden relative">
              <Image
                src="/students.svg"
                alt="Law students studying together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
            </div>
          </FadeItem>

          {/* Right Side: Paragraph Text (index 4) */}
          <FadeItem visible={visible} index={4} className="w-full lg:w-[45%] flex flex-col justify-start pt-2 relative">
            <p className="text-gray-600 text-lg md:text-[1.1rem] leading-[1.8] font-light">
              Preparing for the bar can be overwhelming—
              but with the right tools, success becomes
              achievable. Our platform simplifies your review
              process by providing structured subjects, real
              past exams, and reliable resources designed
              to strengthen your legal foundation. Study
              efficiently, stay organized, and build the
              confidence you need to pass and excel.
            </p>

            {/* Bottom accent line under text (navy on left, red on right) */}
            <div className="w-64 h-[2px] mt-10 flex">
              <div className="w-1/2 h-full bg-[#1B2644]"></div>
              <div className="w-1/2 h-full bg-[#A8201A]"></div>
            </div>

            {/* Bahay Kubo (Nipa Hut) Image (index 5) */}
            <div className="self-end mt-4 w-32 h-32 relative">
              <Image
                src="/bahay-kubo.png"
                alt="Bahay Kubo Icon"
                fill
                className="object-contain"
              />
            </div>
          </FadeItem>

        </div>

      </div>
    </section>
  )
}
