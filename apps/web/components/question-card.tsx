"use client"

import React, { useState } from "react"
import { Award, CheckCircle2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"

interface QuestionCardProps {
  year: string
  examType: string
  questionText: string
  answerText: string
  chair: string
}

export function QuestionCard({
  year,
  examType,
  questionText,
  answerText,
  chair,
}: QuestionCardProps) {
  const [isShowingAnswer, setIsShowingAnswer] = useState(false)

  return (
    <div className="mb-16 flex w-full items-stretch gap-4 md:gap-6">
      {/* Left Sidebar */}
      <Card
        className={cn(
          "flex shrink-0 flex-col items-center justify-between border border-gray-200/30 px-3 py-8 shadow-none transition-colors duration-300 md:w-[130px] rounded-none",
          isShowingAnswer ? "bg-gold text-navy" : "bg-navy text-gold"
        )}
      >
        <span className="text-4xl font-black leading-none">{year}</span>
        {examType.split(" ").map((word, i) => (
          <span key={i} className="text-[22px] font-normal leading-none tracking-wide">
            {word}
          </span>
        ))}
      </Card>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col justify-between gap-4">
        {/* Text Box Container with Solid Shadow Offset */}
        <div className="relative w-full pr-4 pb-4">
          {/* Solid neo-brutalist shadow block */}
          <div className="absolute top-4 right-0 bottom-0 left-4 z-0 bg-navy" />

          {/* Actual Text Box */}
          <Card className="relative z-10 rounded-none border border-gray-300 bg-white p-6 shadow-none md:p-8">
            <CardContent className="p-0">
              {isShowingAnswer ? (
                <p className="text-base md:text-[17px] font-light leading-relaxed text-navy">
                  <strong className="mr-2 font-bold tracking-wide text-gold uppercase">
                    ANSWER:
                  </strong>
                  {answerText}
                </p>
              ) : (
                <p className="text-base md:text-[17px] font-light leading-relaxed text-navy">
                  {questionText}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Row */}
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
          {/* Chair Block */}
          <Card className="flex items-center gap-2.5 rounded-none border-none bg-navy px-4 py-2 shadow-none">
            <Award className="size-5 text-white" fill="white" />
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold tracking-wide text-gold uppercase">
                CHAIR:
              </span>
              <span className="text-[13px] font-light text-white">
                {chair}
              </span>
            </div>
          </Card>

          {/* View Answer button */}
          <Button
            variant="default"
            onClick={() => setIsShowingAnswer(!isShowingAnswer)}
            className={cn(
              "flex h-auto w-full sm:w-auto items-center justify-center gap-3 rounded-none border-none px-8 py-5 text-[11px] md:text-xs font-bold tracking-widest uppercase shadow-none transition-colors duration-300 cursor-pointer",
              isShowingAnswer
                ? "bg-gold text-navy hover:bg-gold/90"
                : "bg-navy text-gold hover:bg-navy/90"
            )}
          >
            <CheckCircle2 className="size-5" />
            VIEW ANSWER
          </Button>
        </div>
      </div>
    </div>
  )
}
