import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { HashtagsBanner } from "@/components/hashtags-banner"
import { AnimatedList } from "@/components/animated-list"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@workspace/ui/components/card"
import { subjectsData } from "@/lib/subjects"

export default async function SubjectDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = params.slug
  const data = subjectsData[slug]

  if (!data) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-0 md:min-h-[500px] flex-col overflow-hidden bg-navy pt-16 md:pt-24 pb-6 md:pb-12">
        {/* Background Graphic */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-0 w-full md:w-[65%] lg:w-[55%]">
          <Image
            src={data.image}
            alt={`${data.title} Background`}
            fill
            className="object-cover object-right opacity-80"
            priority
          />
          {/* Soft gradient mask to blend the image seamlessly into the solid navy background */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
        </div>

        <div className="z-10 flex flex-1 flex-col justify-center px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl pt-8 md:pt-20 pb-6 md:pb-10">
            <h1 className="animate-slide-up-fade-in mb-6 text-3xl md:text-5xl leading-[1.1] font-bold tracking-tight text-gold md:text-6xl lg:text-7xl">
              {data.title}
            </h1>
            <p className="animate-slide-up-fade-in max-w-2xl text-sm md:text-lg leading-relaxed font-light text-white/90 md:text-xl" style={{ animationDelay: "120ms" }}>
              {data.description}
            </p>
          </div>
        </div>
      </section>

      {/* Hashtags Banner */}
      <HashtagsBanner />

      {/* Topics Section */}
      <section className="flex-1 bg-white px-6 py-8 md:py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Section Header */}
          <header className="mb-10">
            <h2 className="mb-2 text-2xl md:text-4xl font-black tracking-tight text-navy uppercase">
              TOPICS
            </h2>
            <p className="text-sm md:text-lg font-light text-black">
              Select a topic to view historical questions or open the topic&apos;s{" "}
              <Link
                href={data.syllabusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-4 transition-colors hover:text-navy"
              >
                syllabus
              </Link>
              .
            </p>
          </header>

          {/* Topics List */}
          {data.topics.length > 0 ? (
            <AnimatedList>
              {data.topics.map((topic, index) => {
                const topicSlug = topic.slug || topic.title.toLowerCase().replace(/\s+/g, "-")
                return (
                  <Link
                    key={index}
                    href={`/subjects/${slug}/${topicSlug}`}
                    className="group block"
                  >
                    <Card className="relative min-h-0 rounded-lg border-none bg-navy py-0 shadow-md transition-all duration-300">
                      {/* Subtle Background Styling per User Instructions (No image) */}
                      <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-navy via-navy/95 to-navy/90" />

                      <CardHeader className="relative z-10 flex flex-col gap-3 p-5 md:flex-row md:items-center md:space-y-0 md:p-8 xl:px-12">
                        <div className="flex-1 space-y-2">
                          <CardTitle className="text-base md:text-[28px] leading-tight font-black tracking-tight text-gold uppercase transition-colors group-hover:text-gold/90">
                            {topic.title}
                          </CardTitle>
                          <CardDescription className="max-w-4xl text-xs md:text-[15px] leading-relaxed font-light text-white/70">
                            {topic.description}
                          </CardDescription>
                        </div>

                        <CardAction className="relative z-10 flex flex-col items-start justify-center self-start md:self-center md:w-64 md:items-end">
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
                  </Link>
                )
              })}
            </AnimatedList>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-16 text-center">
              <p className="mb-2 text-2xl font-light text-muted-foreground">
                Topics are being prepared for {data.title}.
              </p>
              <p className="text-base text-muted-foreground/60">
                Check back later for updates on this subject.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
