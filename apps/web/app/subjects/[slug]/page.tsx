import React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const title = slug.replace(/-/g, " ").toUpperCase()

  return (
    <div className="flex flex-col min-h-screen bg-background pt-16 pb-32">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <Link href="/subjects" className="inline-block mb-12">
          <Button variant="ghost" className="text-muted-foreground hover:text-navy p-0 flex items-center gap-2 font-bold tracking-widest text-xs">
            <ChevronLeft className="size-4" />
            BACK TO SUBJECTS
          </Button>
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy tracking-tight uppercase leading-[1.1]">
            {title}
          </h1>
          <div className="h-2 w-24 bg-gold mt-6" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-10 shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold text-navy mb-6 uppercase tracking-tight">Overview</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                This section will contain detailed study materials, historical exam frequency, 
                and key topics for {title}. You are currently viewing the review hub for this subject.
              </p>
            </section>

            <section className="bg-white rounded-3xl p-10 shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold text-navy mb-6 uppercase tracking-tight">Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Core Principles", "Historical Context", "Frequent Exam Questions", "Case Studies"].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="size-2 rounded-full bg-gold" />
                    <span className="font-medium text-navy">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-navy rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-gold">Progress</h3>
              <p className="text-white/60 text-sm mb-6">Complete your profile to track your progress in this subject.</p>
              <Button className="w-full bg-gold text-navy font-bold hover:bg-gold/90">START QUIZ</Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
