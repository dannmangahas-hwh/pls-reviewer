import Image from "next/image";
import { HashtagsBanner } from "@/components/hashtags-banner";

export function Hero() {
  return (
    <section className="relative flex flex-col bg-navy min-h-[600px] overflow-hidden">
      {/* Background Graphic for Gavel */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[65%] lg:w-[55%] pointer-events-none z-0">
        <Image
          src="/gavel-bg.svg"
          alt="Gavel Background"
          fill
          className="object-cover object-right opacity-80"
          priority
        />
        {/* Soft gradient mask to blend the image seamlessly into the solid navy background */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 z-10">
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
