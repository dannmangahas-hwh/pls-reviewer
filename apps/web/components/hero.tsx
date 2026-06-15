import Image from "next/image";
import { HashtagsBanner } from "@/components/hashtags-banner";

export function Hero() {
  return (
    <section className="relative flex min-h-[600px] flex-col overflow-hidden bg-[#06194b]">
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

      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 w-full md:w-[68%] lg:w-[58%]">
        <Image
          src="/gavel-bg.svg"
          alt="Gavel Background"
          fill
          className="object-cover object-right opacity-95 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06194b] via-[#06194b]/40 to-transparent" />
      </div>

      <div className="z-10 flex flex-1 flex-col justify-center px-6 py-20 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gold tracking-tight leading-[1.1]">
            Master the Bar.
            <br />
            Own Your Future.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl font-light">
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
