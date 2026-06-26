import Image from "next/image"
import { HashtagsBanner } from "@/components/hashtags-banner"

export function SubjectsHero() {
  return (
    <section className="relative flex flex-col min-h-[500px] md:min-h-[600px] overflow-hidden w-full">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/subjects-hero-bg.svg"
          alt="Vintage courthouse building background"
          fill
          className="object-cover"
          priority
        />
        {/* Soft overlay mask to ensure text is readable */}
        <div className="absolute inset-0 bg-neutral-950/70" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-1 flex-col justify-center px-6 pt-32 pb-20 md:px-12 lg:px-24 lg:pt-40 lg:pb-32">
        <div className="max-w-full lg:max-w-5xl xl:max-w-6xl">
          <h1 className="animate-slide-up-fade-in text-5xl leading-[1.1] font-black tracking-tight text-gold md:text-6xl lg:text-7xl">
            “Study Smarter, <span className="whitespace-nowrap">Not Harder</span>
            <br />
            Subject by Subject.”
          </h1>
          <p className="animate-slide-up-fade-in mt-8 max-w-5xl text-lg leading-relaxed font-light text-white/90 md:text-xl" style={{ animationDelay: "120ms" }}>
            Your focused guide to mastering every bar exam topic, offering clear explanations, expertly organized subjects, and practice tools designed to build your confidence and ensure you&apos;re fully prepared for exam day.
          </p>
        </div>
      </div>

      {/* Hashtags Banner */}
      <HashtagsBanner />
    </section>
  )
}
