"use client"

import React, { useState } from "react"
import { Award, CheckCircle2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

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
    <div className="flex flex-col gap-6 md:flex-row mb-8">
      {/* Left Column (Year & Exam Type) */}
      <div className="flex h-fit shrink-0 flex-col items-center justify-center bg-navy px-6 py-8 shadow-sm md:w-[140px]">
        <span className="mb-1 text-3xl font-black text-gold leading-none">
          {year}
        </span>
        {examType.split(" ").map((word, i) => (
          <span key={i} className="text-xl font-light text-gold leading-tight">
            {word}
          </span>
        ))}
      </div>

      {/* Right Column */}
      <div className="flex flex-1 flex-col shadow-sm">
        {/* Question/Answer Box */}
        <div
          className={cn(
            "flex-1 bg-white p-8 text-[16px] leading-relaxed text-navy border-t border-x transition-colors duration-300",
            isShowingAnswer ? "border-gold/50" : "border-gray-200"
          )}
        >
          {isShowingAnswer ? (
            <span>
              <strong className="font-bold text-gold uppercase tracking-wide">
                ANSWER:{" "}
              </strong>
              {answerText}
            </span>
          ) : (
            <span>{questionText}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row border-b border-x border-gray-200 sm:border-none">
          {/* Chair info */}
          <div className="flex flex-1 items-center gap-3 bg-navy px-6 py-4 text-white">
            <Award className="size-5 text-white/80" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold">
                CHAIR:
              </span>
              <span className="text-[13px] font-medium text-white/90">
                {chair}
              </span>
            </div>
          </div>

          {/* View Answer button */}
          <button
            onClick={() => setIsShowingAnswer(!isShowingAnswer)}
            className={cn(
              "flex items-center justify-center gap-2 px-8 py-4 text-[12px] font-black uppercase tracking-widest transition-all duration-300",
              isShowingAnswer
                ? "bg-gold text-navy hover:bg-gold/90"
                : "bg-navy text-gold hover:bg-navy/90 sm:border-l sm:border-white/10 border-t border-white/10 sm:border-t-0"
            )}
          >
            <CheckCircle2 className="size-4" />
            VIEW ANSWER
          </button>
        </div>
      </div>
    </div>
  )
}
