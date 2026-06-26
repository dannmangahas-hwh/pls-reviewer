import Image from "next/image";
import { HashtagsBanner } from "@/components/hashtags-banner";

export function Hero() {
  return (
    <section className="relative flex min-h-0 md:min-h-[600px] flex-col overflow-hidden bg-[#06194b]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/master-the-bar.png"
          alt="Philippine flag"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06194b]/90 via-[#06194b]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 hidden md:block w-full md:w-[68%] lg:w-[58%]">
        <Image
          src="/gavel-hero.png"
          alt="Gavel Background"
          fill
          className="object-contain object-right opacity-95"
        />
      </div>

      <div className="z-10 flex flex-1 flex-col justify-center px-6 py-10 md:py-20 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <h1 className="animate-slide-up-fade-in text-3xl md:text-5xl lg:text-7xl font-bold text-gold tracking-tight leading-[1.1]">
            Master the Bar.
            <br />
            Own Your Future.
          </h1>
          <p className="animate-slide-up-fade-in mt-4 md:mt-6 text-sm md:text-lg text-white/90 max-w-xl font-light" style={{ animationDelay: "120ms" }}>
            Your all-in-one exam reviewer designed to sharpen your legal knowledge
            and boost your confidence—equipping you with expertly curated subjects,
            real past exams, and the tools you need to succeed.
          </p>
        </div>
      </div>

      {/* Hashtags Banner */}
      <HashtagsBanner />
    </section>
  );
}
