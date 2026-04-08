import { Hero } from "@/components/hero"
import { Challenges } from "@/components/challenges"
import { CTASection } from "@/components/cta-section"
import { WhatYouGain } from "@/components/what-you-gain";

export default function Page() {
  return (
    <>
      <Hero />
      <Challenges />
      <WhatYouGain />
      <CTASection />
    </>
  )
}
