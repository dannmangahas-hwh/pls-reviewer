import Image from "next/image"

export function CTASection() {
  return (
    <section className="relative min-h-[400px] w-full overflow-hidden bg-[#1B2644] md:min-h-[450px] lg:min-h-[500px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cta-bg.png"
          alt="Students studying"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-[#1B2644]/60" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex h-full min-h-100 w-full md:min-h-112.5 lg:min-h-125">
        {/* Left Side: Text Content */}
        <div className="flex flex-7 flex-col justify-center px-6 py-16 md:px-12 lg:flex-6 lg:pl-24">
          <div className="max-w-4xl">
            <h2 className="ss text-4xl leading-[1.05] font-black tracking-tight text-gold md:text-5xl lg:text-6xl">
              SECURE YOUR FUTURE
            </h2>
            <h2 className="mb-8 text-4xl leading-[1.05] font-black tracking-tight text-white uppercase md:text-5xl lg:text-6xl">
              IN THE CHAMBERS.
            </h2>

            <div className="max-w-xl space-y-4">
              <p className="text-lg font-bold text-gold md:text-xl lg:text-2xl">
                &quot;Pass the Bar with Confidence!&quot;
              </p>
              <p className="text-base leading-relaxed font-light text-white/90 md:text-lg lg:text-xl">
                Your ultimate review hub—practice, learn, and master the law
                anytime, anywhere. Hard work starts here, success follows.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Gavel and Gold Bar */}
        <div className="relative flex flex-3 items-center justify-end lg:flex-4">
          {/* Gavel Image - Overlaps both content and gold bar */}
          <div className="pointer-events-none absolute right-[5%] z-20 h-[130%] w-[130%] md:right-[10%] lg:right-[15%]">
            <Image
              src="/cta-gavel.png"
              alt="Gavel"
              fill
              className="scale-110 object-contain object-right drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:scale-125"
            />
          </div>

          {/* Gold vertical bar on the far right */}
          <div className="z-10 h-full w-12 shrink-0 bg-gold md:w-24 lg:w-32" />
        </div>
      </div>
    </section>
  )
}
