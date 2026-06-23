"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { SubjectsHero } from "@/components/subjects-hero"
import {
  Landmark,
  Briefcase,
  Users,
  Gavel,
  Building2,
  FileText,
  ChevronRight,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card"

import { subjectsData } from "@/lib/subjects"

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "political-law": Landmark,
  "labor-law": Briefcase,
  "civil-law": Users,
  "criminal-law": Gavel,
  "commercial-law": Building2,
  "remedial-law": FileText,
}

function SubjectsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background pb-32">
      <SubjectsHero />

      {/* Grid Section */}
      <section className="container mx-auto mt-20 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(subjectsData).map(([slug, subject], index) => {
            const Icon = iconMap[slug] || FileText
            const delay = `${index * 90}ms`

            // Split title for styling: e.g., "POLITICAL LAW" -> "POLITICAL" "LAW"
            const parts = subject.title.split(" ")
            const suffix = parts.pop() || ""
            const name = parts.join(" ")

            return (
              <Link
                key={slug}
                href={`/subjects/${slug}`}
                className="group block"
              >
                <Card
                  className={`relative flex aspect-square flex-col overflow-hidden rounded-2xl border-none bg-navy text-white transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_rgba(0,31,63,0.3)] ${isMounted ? "animate-slide-up-fade-in" : "opacity-0 translate-y-6"}`}
                  style={{ animationDelay: delay }}
                >
                  <CardHeader className="flex-none px-6 pb-2">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-xl bg-gold/10 p-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-gold/20">
                        <Icon
                          className="size-6 text-gold"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl leading-none font-black tracking-tighter uppercase">
                      <span className="mb-1 block text-gold transition-colors group-hover:text-gold/90">
                        {name}
                      </span>
                      <span className="font-bold text-white">
                        {suffix}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-6 pb-4">
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed font-light text-white/60 transition-colors group-hover:text-white/80">
                      {subject.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="mt-auto flex-none px-6 pt-0 pb-8">
                    <div className="group/btn flex items-center gap-1 p-0 text-[10px] font-black tracking-[0.25em] text-gold uppercase">
                      START REVIEWING
                      <div className="ml-2 flex items-center -space-x-1.5">
                        <ChevronRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        <ChevronRight className="size-4 transition-transform delay-75 duration-300 group-hover/btn:translate-x-1" />
                      </div>
                    </div>
                  </CardFooter>

                  {/* Subtle background glow on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default SubjectsPage
