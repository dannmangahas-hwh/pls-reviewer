import Image from "next/image"

export function CTASection() {
  return (
    <section className="relative min-h-[400px] w-full overflow-hidden bg-[#b51f2a] md:min-h-[450px] lg:min-h-[500px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/cta-bg.png"
          alt="Students studying"
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
          <h2 className="ss text-4xl leading-[1.05] font-black tracking-tight text-gold md:text-5xl lg:text-6xl">
            SECURE YOUR FUTURE
          </h2>
          <h2 className="mb-8 text-4xl leading-[1.05] font-black tracking-tight text-white uppercase md:text-5xl lg:text-6xl">
            IN THE CHAMBERS.
          </h2>

          <div className="flex max-w-xl flex-col gap-4">
            <p className="text-lg font-bold text-gold md:text-xl lg:text-2xl">
              &quot;Pass the Bar with Confidence!&quot;
            </p>
            <p className="text-base leading-relaxed font-light text-white/90 md:text-lg lg:text-xl">
              Your ultimate review hub—practice, learn, and master the law
              anytime, anywhere. Hard work starts here, success follows.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-[-14%] right-[-18%] top-[-14%] z-20 w-[78%] md:right-[-8%] md:w-[55%] lg:right-[-10%] lg:w-[48%]">
          <Image
            src="/cta-gavel.png"
            alt="Gavel"
            fill
            className="object-contain object-right drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            sizes="(max-width: 768px) 80vw, 48vw"
          />
        </div>
      </div>
    </section>
  )
}
