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

export function CTASection() {
  const { ref, visible } = useScrollReveal(0.15)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-[400px] w-full overflow-hidden bg-[#b51f2a] md:min-h-[450px] lg:min-h-[500px]"
    >
      {/* Background — completely static, never animated */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/graduation-bg.png"
          alt="Graduation ceremony"
          fill
          className="object-cover opacity-70"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[#b51f2a]/34" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8f1523]/20 via-[#b51f2a]/0 to-[#8f1523]/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-100 w-full max-w-6xl items-center px-6 md:min-h-112.5 md:px-12 lg:min-h-125 lg:px-0">
        <div className="w-full max-w-4xl py-16 lg:w-[62%]">

          <FadeItem visible={visible} index={0}>
            <h2 className="ss text-2xl md:text-4xl lg:text-6xl leading-[1.05] font-black tracking-tight text-gold">
              SECURE YOUR FUTURE
            </h2>
          </FadeItem>

          {/* "IN THE CHAMBERS." (index 1) */}
          <FadeItem visible={visible} index={1}>
            <h2 className="mb-5 md:mb-8 text-2xl md:text-4xl lg:text-6xl leading-[1.05] font-black tracking-tight text-white uppercase">
              IN THE CHAMBERS.
            </h2>
          </FadeItem>

          {/* Subtext block (index 2) */}
          <FadeItem visible={visible} index={2} className="flex max-w-xl flex-col gap-4">
            <p className="text-base md:text-lg lg:text-2xl font-bold text-gold">
              &quot;Pass the Bar with Confidence!&quot;
            </p>
            <p className="text-sm md:text-base lg:text-xl leading-relaxed font-light text-white/90">
              Your ultimate review hub—practice, learn, and master the law
              anytime, anywhere. Hard work starts here, success follows.
            </p>
          </FadeItem>

        </div>

        {/* Gavel image — animates in as its own unit (index 3) */}
        <FadeItem
          visible={visible}
          index={3}
          className="pointer-events-none absolute bottom-[-14%] right-[-18%] top-[-14%] z-20 hidden md:block w-[78%] md:right-[-8%] md:w-[55%] lg:right-[-10%] lg:w-[48%]"
        >
          <Image
            src="/cta-gavel.png"
            alt="Gavel"
            fill
            className="object-contain object-right drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            sizes="(max-width: 768px) 80vw, 48vw"
          />
        </FadeItem>

      </div>
    </section>
  )
}
