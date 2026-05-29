import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { HashtagsBanner } from "@/components/hashtags-banner"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { subjectsData } from "@/lib/subjects"
import { getQuestionsBySubtopic } from "@/lib/queries/questions"
import { QuestionCard } from "@/components/question-card"
import headerBg from "@/public/Category.png"
import justiceBg from "@/public/Category.png" // Mocking the lady justice background with existing bg

const CHAIRPERSONS: Record<number | string, string> = {
  2019: "Justice Estela M. Perlas-Bernabe",
  2020: "Justice Marvic M.V.F. Leonen",
  2021: "Justice Marvic M.V.F. Leonen",
  2022: "Justice Alfredo Benjamin S. Caguioa",
  2023: "Justice Ramon Paul L. Hernando",
  2024: "Justice Mario V. Lopez",
  2025: "Justice Amy C. Lazaro-Javier",
  2026: "Justice Samuel H. Gaerlan",
}

export default async function QuestionsPage(props: {
  params: Promise<{ slug: string; subtopics: string; subtopic_slug: string }>
}) {
  const params = await props.params
  const { slug, subtopics: topicSlug, subtopic_slug: subtopicSlug } = params

  const subject = subjectsData[slug]
  if (!subject) notFound()

  const topic = subject.topics.find(
    (t) =>
      t.slug === topicSlug ||
      t.title.toLowerCase().replace(/\s+/g, "-") === topicSlug
  )

  if (!topic) notFound()

  const subtopic = topic.subtopics?.find(
    (s) =>
      s.slug === subtopicSlug ||
      s.title.toLowerCase().replace(/\s+/g, "-") === subtopicSlug
  )

  if (!subtopic) notFound()
  
  // Fetch real questions from MongoDB!
  const questions = await getQuestionsBySubtopic(
    subtopic.slug || subtopicSlug,
    topic.slug || topicSlug,
    slug
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section (Subject Level) */}
      <section className="relative flex min-h-[500px] flex-col overflow-hidden bg-navy pt-24 pb-12">
        {/* Background Graphic */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={subject.image || headerBg}
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
            <h1 className="mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-gold md:text-6xl lg:text-7xl uppercase">
              {subject.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-light text-white/90 md:text-xl">
              {subject.description}
            </p>
          </div>
        </div>
      </section>

      {/* Hashtags Banner */}
      <HashtagsBanner />

      {/* Main Content Area */}
      <section className="flex-1 bg-white px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Topic Banner Card */}
          <Card className="relative overflow-hidden rounded-md bg-navy shadow-lg border-none">
            <div className="absolute inset-0 z-0">
              <Image
                src={justiceBg}
                alt="Topic Background"
                fill
                className="object-cover opacity-30 grayscale mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/90 to-transparent" />
            </div>
            
            <CardHeader className="relative z-10 flex flex-col items-start justify-between p-8 md:flex-row md:p-12 space-y-0">
              <div className="max-w-2xl space-y-4">
                <CardTitle className="text-4xl font-black tracking-tight text-gold uppercase">
                  {topic.title}
                </CardTitle>
                <CardDescription className="text-[15px] leading-relaxed font-light text-white/80">
                  {topic.description}
                </CardDescription>
              </div>
              
              <div className="mt-6 md:mt-0">
                <Badge
                  variant="outline"
                  className="rounded-full border-gold/50 px-6 py-1.5 text-xs font-medium tracking-wide text-gold"
                >
                  {topic.difficulty}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="mb-4 pt-4">
             <h3 className="text-xl font-bold text-navy uppercase border-b-2 border-gold/30 pb-2 inline-block mb-4">
               {subtopic.title} Questions ({questions.length})
             </h3>
          </div>

          {/* Questions List */}
          <div className="flex flex-col gap-6">
            {questions.length > 0 ? (
              questions.map((q) => (
                <QuestionCard
                  key={q.unique_id}
                  year={q.year.toString()}
                  examType="BAR EXAM"
                  questionText={q.question_text}
                  suggestedAnswers={q.suggested_answers || []}
                  chair={CHAIRPERSONS[q.year] || "SUPREME COURT"}
                />
              ))
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-16 text-center">
                <p className="mb-2 text-2xl font-light text-muted-foreground">
                  No questions found for this subtopic.
                </p>
                <p className="text-base text-muted-foreground/60">
                  Our AI is still processing historical data. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
