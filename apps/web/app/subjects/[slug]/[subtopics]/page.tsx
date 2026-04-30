import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { HashtagsBanner } from "@/components/hashtags-banner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import headerBg from "@/public/Category.png"
import { subjectsData } from "@/lib/subjects"

export default async function SubtopicsPage(props: {
  params: Promise<{ slug: string; subtopics: string }>
}) {
  const params = await props.params
  const { slug, subtopics: topicSlug } = params

  const subject = subjectsData[slug]
  if (!subject) notFound()

  const topic = subject.topics.find(
    (t: any) =>
      t.slug === topicSlug ||
      t.title.toLowerCase().replace(/\s+/g, "-") === topicSlug
  )

  if (!topic) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[500px] flex-col overflow-hidden bg-navy pt-24 pb-12">
        {/* Background Graphic */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={headerBg}
            alt="Hero Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-navy/60" />
          <div className="absolute inset-0 bg-linear-to-b from-navy/20 via-transparent to-navy" />
        </div>

        <div className="z-10 flex flex-1 flex-col justify-center px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl pt-20 pb-10">
            <h1 className="mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-gold md:text-6xl lg:text-7xl">
              {topic.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-light text-white/90 md:text-xl">
              {topic.description}
            </p>
          </div>
        </div>
      </section>

      {/* Hashtags Banner */}
      <HashtagsBanner />

      {/* Subtopics Section */}
      <section className="flex-1 bg-white px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Section Header */}
          <header className="mb-10">
            <h2 className="mb-2 text-4xl font-black tracking-tight text-navy uppercase">
              SUBTOPICS
            </h2>
            <p className="text-lg font-light text-muted-foreground">
              Select a sub-topic to view historical questions
            </p>
          </header>

          {/* Subtopics List */}
          <div className="flex flex-col gap-6">
            {topic.subtopics && topic.subtopics.length > 0 ? (
              topic.subtopics.map((sub: any, index: number) => (
                <Card
                  key={index}
                  className="group relative min-h-[140px] overflow-hidden rounded-lg border-none bg-navy py-0 shadow-md transition-all duration-300"
                >
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={headerBg}
                      alt="Card Background"
                      fill
                      className="object-cover opacity-20 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-30 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/95 to-navy/90" />
                  </div>

                  <CardHeader className="relative z-10 items-center space-y-0 p-8 xl:px-12">
                    <div className="flex-1 space-y-3">
                      <CardTitle className="text-[28px] leading-none font-black tracking-tight text-gold uppercase transition-colors group-hover:text-gold/90">
                        {sub.title}
                      </CardTitle>
                      <CardDescription className="max-w-4xl text-[15px] leading-relaxed font-light text-white/70">
                        {sub.description}
                      </CardDescription>
                    </div>

                    <CardAction className="relative z-10 mt-4 flex flex-col items-start justify-center self-center md:mt-0 md:w-64 md:items-end">
                      <Badge
                        variant="outline"
                        className="mb-6 border-gold/50 text-[10px] font-bold tracking-widest text-gold uppercase"
                      >
                        {sub.difficulty}
                      </Badge>
                      <div className="group/btn flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-gold uppercase transition-colors hover:text-gold/80">
                        START REVIEWING
                        <div className="flex items-center -space-x-1.5 opacity-90 transition-transform group-hover/btn:translate-x-1">
                          <ChevronRight className="size-4" />
                          <ChevronRight className="size-4" />
                        </div>
                      </div>
                    </CardAction>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-16 text-center">
                <p className="mb-2 text-2xl font-light text-muted-foreground">
                  Subtopics are being prepared for {topic.title}.
                </p>
                <p className="text-base text-muted-foreground/60">
                  Check back later for updates on this topic.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
