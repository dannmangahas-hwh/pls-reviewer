import Image from "next/image";

export function WhatYouGain() {
  return (
    <section className="relative h-[570px] w-full overflow-hidden bg-[#101727]">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-full">
        <Image
          src="/what-you-gain-image.png"
          alt="What you gain illustration"
          width={1280}
          height={570}
          className="h-full w-auto max-w-none object-contain object-right scale-x-[-1] opacity-30"
        />
      </div>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] items-center justify-center px-6">
        <div className="flex w-full max-w-[1120px] flex-col items-center gap-12">
          <div className="flex w-full items-start justify-center gap-8">
            <h3 className="font-alexandria whitespace-nowrap text-[50px] font-extrabold uppercase text-[#D4A53B]">
              WHAT YOU GAIN?
            </h3>
            <p className="max-w-[520px] pt-2 text-left text-[15px] leading-relaxed text-white">
              Build the skills, discipline, and confidence needed to succeed—not
              <br />
              just in the bar exam, but in your future legal career.
            </p>
          </div>
          <ul className="mx-auto flex w-fit flex-col items-start gap-5 text-[30px] leading-tight font-bold">
            <li className="grid grid-cols-[28px_auto] items-start gap-4 text-white">
              <span className="text-[#D4A53B]">○</span>
              <span className="whitespace-nowrap">
                <strong className="text-[#D4A53B]">STRONGER FOUNDATION</strong> in key legal principles
              </span>
            </li>
            <li className="grid grid-cols-[28px_auto] items-start gap-4 text-white">
              <span className="text-[#D4A53B]">○</span>
              <span className="whitespace-nowrap">
                <strong className="text-[#D4A53B]">INCREASEED CONFIDENCE</strong> in answering exam questions
              </span>
            </li>
            <li className="grid grid-cols-[28px_auto] items-start gap-4 text-white">
              <span className="text-[#D4A53B]">○</span>
              <span className="whitespace-nowrap">
                <strong className="text-[#D4A53B]">BETTER TIME MANAGEMENT</strong> and <strong className="text-[#D4A53B]">STUDY EFFICIENCY</strong>
              </span>
            </li>
            <li className="grid grid-cols-[28px_auto] items-start gap-4 text-white">
              <span className="text-[#D4A53B]">○</span>
              <span className="whitespace-nowrap">
                <strong className="text-[#D4A53B]">CONTINUOUS PROGRESS</strong> through consistent practice
              </span>
            </li>
            <li className="grid grid-cols-[28px_auto] items-start gap-4 text-white">
              <span className="text-[#D4A53B]">○</span>
              <span className="whitespace-nowrap">
                <strong className="text-[#D4A53B]">HIGHER CHANCES</strong> of passing the bar exam
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
