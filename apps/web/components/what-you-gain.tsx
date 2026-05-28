import Image from "next/image";

export function WhatYouGain() {
  return (
    <section className="relative min-h-[570px] md:h-[570px] w-full overflow-hidden bg-[#101727] py-16 md:py-0 flex items-center">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-full">
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
