import Image from "next/image";

export function WhatYouGain() {
  return (
    <section className="relative flex min-h-[570px] w-full items-center overflow-hidden bg-[#1B2644] py-16 md:h-[570px] md:py-0">
      <div className="absolute inset-0 z-0">
        <Image
          src="/students-studying.png"
          alt="Students studying in a library"
          fill
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1B2644]/64" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2644]/30 via-[#1B2644]/10 to-[#1B2644]/35" />
      </div>
      <div className="pointer-events-none absolute -left-[28%] top-1/2 z-[1] hidden h-[118%] w-[56%] -translate-y-1/2 md:block">
        <Image
          src="/sampaguita-1.png"
          alt=""
          fill
          className="object-contain object-left opacity-20"
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
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] items-center justify-center px-6">
        <div className="flex w-full max-w-[1120px] flex-col items-center gap-8 md:gap-12">
          <div className="flex w-full flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-8">
            <h3 className="font-alexandria text-center md:text-left text-3xl sm:text-4xl md:text-[50px] font-extrabold uppercase text-[#D4A53B] leading-none">
              WHAT YOU GAIN?
            </h3>
            <p className="max-w-[520px] text-center md:text-left text-sm md:text-[15px] leading-relaxed text-white">
              Build the skills, discipline, and confidence needed to succeed—not
              just in the bar exam, but in your future legal career.
            </p>
          </div>
          <ul className="mx-auto flex w-full md:w-fit flex-col items-start gap-4 md:gap-5 text-lg sm:text-xl md:text-2xl lg:text-[30px] leading-snug font-bold">
            <li className="grid grid-cols-[20px_auto] sm:grid-cols-[28px_auto] items-start gap-3 sm:gap-4 text-white w-full">
              <span className="text-[#D4A53B]">○</span>
              <span>
                <strong className="text-[#D4A53B]">STRONGER FOUNDATION</strong> in key legal principles
              </span>
            </li>
            <li className="grid grid-cols-[20px_auto] sm:grid-cols-[28px_auto] items-start gap-3 sm:gap-4 text-white w-full">
              <span className="text-[#D4A53B]">○</span>
              <span>
                <strong className="text-[#D4A53B]">INCREASED CONFIDENCE</strong> in answering exam questions
              </span>
            </li>
            <li className="grid grid-cols-[20px_auto] sm:grid-cols-[28px_auto] items-start gap-3 sm:gap-4 text-white w-full">
              <span className="text-[#D4A53B]">○</span>
              <span>
                <strong className="text-[#D4A53B]">BETTER TIME MANAGEMENT</strong> and <strong className="text-[#D4A53B]">STUDY EFFICIENCY</strong>
              </span>
            </li>
            <li className="grid grid-cols-[20px_auto] sm:grid-cols-[28px_auto] items-start gap-3 sm:gap-4 text-white w-full">
              <span className="text-[#D4A53B]">○</span>
              <span>
                <strong className="text-[#D4A53B]">CONTINUOUS PROGRESS</strong> through consistent practice
              </span>
            </li>
            <li className="grid grid-cols-[20px_auto] sm:grid-cols-[28px_auto] items-start gap-3 sm:gap-4 text-white w-full">
              <span className="text-[#D4A53B]">○</span>
              <span>
                <strong className="text-[#D4A53B]">HIGHER CHANCES</strong> of passing the bar exam
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
