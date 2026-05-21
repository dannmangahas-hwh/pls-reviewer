"use client"

import React, { useState } from "react"
import { Award, CheckCircle2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

interface QuestionCardProps {
  year: string
  examType: string
  questionText: string
  suggestedAnswers: string[]
  chair: string
}

const formatPdfText = (text: string): string => {
  if (!text) return ""
  
  // Split into paragraph blocks by double newlines (or more)
  const blocks = text.split(/\n\s*\n/)
  
  const cleanBlocks = blocks.map(block => {
    const lines = block.split('\n')
    let result = ""
    
    for (let i = 0; i < lines.length; i++) {
      const lineVal = lines[i]
      const currentLine = lineVal ? lineVal.trim() : ""
      if (!currentLine) continue
      
      if (result === "") {
        result = currentLine
      } else {
        // If the current line starts with a list marker (e.g. "1.", "(a)", "-", "*")
        const isListMarker = /^\s*(\d+\.|\([a-z0-9]+\)|[-*•])\s+/i.test(currentLine)
        
        // If the previous line ended with a colon
        const prevLineVal = lines[i - 1]
        const previousLine = prevLineVal ? prevLineVal.trim() : ""
        const endsWithColon = previousLine.endsWith(':')
        
        if (isListMarker || endsWithColon) {
          result += "\n" + currentLine
        } else {
          // Merge with a single space
          result += (result.endsWith(" ") ? "" : " ") + currentLine
        }
      }
    }
    return result
  })
  
  return cleanBlocks.join("\n\n")
}

const parseAnswer = (ans: string) => {
  const suggestedPrefix = "SUGGESTED ANSWER:"
  const alternativePrefix = "Alternative Answer:"
  const connectedPrefix = "CONNECTED QUESTION:"
  
  let type: "suggested" | "alternative" | "connected-question" | "default" = "default"
  let cleanText = ans.trim()
  
  if (cleanText.toLowerCase().startsWith(suggestedPrefix.toLowerCase())) {
    type = "suggested"
    cleanText = cleanText.substring(suggestedPrefix.length).trim()
  } else if (cleanText.toLowerCase().startsWith(alternativePrefix.toLowerCase())) {
    type = "alternative"
    cleanText = cleanText.substring(alternativePrefix.length).trim()
  } else if (cleanText.toLowerCase().startsWith(connectedPrefix.toLowerCase())) {
    type = "connected-question"
    cleanText = cleanText.substring(connectedPrefix.length).trim()
  }
  
  return { type, text: cleanText }
}

export function QuestionCard({
  year,
  examType,
  questionText,
  suggestedAnswers = [],
  chair,
}: QuestionCardProps) {
  const [isShowingAnswer, setIsShowingAnswer] = useState(false)

  return (
    <Card className="mb-16 flex flex-row w-full items-stretch gap-4 md:gap-6 rounded-none border-none bg-transparent p-0 shadow-none ring-0 overflow-visible">
      {/* Left Sidebar */}
      <Card
        className={cn(
          "flex shrink-0 flex-col items-center justify-start border border-gray-200/30 py-8 shadow-none transition-colors duration-300 md:w-[130px] rounded-none ring-0 overflow-visible",
          isShowingAnswer ? "bg-gold text-navy" : "bg-navy text-gold"
        )}
      >
        <CardContent className="flex flex-col items-start gap-1 p-0 border-none bg-transparent shadow-none ring-0 overflow-visible">
          <span className="text-3xl font-black leading-none">{year}</span>
          {examType.split(" ").map((word, i) => (
            <span key={i} className="text-3xl font-light leading-none tracking-wide">
              {word}
            </span>
          ))}
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <Card className="flex flex-1 flex-col justify-between gap-4 rounded-none border-none bg-transparent p-0 shadow-none ring-0 overflow-visible">
        {/* Text Box Container with Solid Shadow Offset */}
        <Card className="block relative w-full rounded-none border-none bg-transparent p-0 pb-4 pr-4 shadow-none ring-0 overflow-visible gap-0">
          {/* Solid neo-brutalist shadow block */}
          <Card className="block absolute bottom-0 left-4 right-0 top-4 z-0 rounded-none border-none bg-navy p-0 shadow-none ring-0 overflow-visible gap-0" />

          {/* Actual Text Box */}
          <Card className="block relative z-10 rounded-none border border-gray-300 bg-white p-6 shadow-none md:p-8 ring-0 overflow-visible gap-0">
            <CardContent className="p-0">
              {isShowingAnswer ? (
                <div className={cn("flex flex-col gap-6", suggestedAnswers.length > 1 ? "relative pl-8" : "")}>
                  {/* Vertical dotted/dashed timeline line */}
                  {suggestedAnswers.length > 1 && (
                    <div className="absolute left-3 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-300 z-0" />
                  )}
                  {suggestedAnswers && suggestedAnswers.length > 0 ? (
                    suggestedAnswers.map((ans, idx) => {
                      const { type, text } = parseAnswer(ans)
                      const cleanText = formatPdfText(text)
                      return (
                        <div 
                          key={idx} 
                          className="relative"
                        >
                          {/* Timeline node dot */}
                          {suggestedAnswers.length > 1 && (
                            <div 
                              className={cn(
                                "absolute -left-[25px] top-[26px] z-10 size-3 rounded-full border-2 bg-white",
                                type === "connected-question"
                                  ? "border-indigo-500 bg-indigo-50"
                                  : type === "suggested"
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-slate-400 bg-slate-50"
                              )}
                            />
                          )}
                          <div 
                            className={cn(
                              "flex flex-col gap-3 rounded-none border p-5 transition-all duration-300",
                              type === "suggested" 
                                ? "bg-amber-50/40 border-amber-200/50 dark:bg-amber-950/5 dark:border-amber-900/20" 
                                : type === "alternative"
                                ? "bg-slate-50/40 border-slate-200/50 dark:bg-slate-900/5 dark:border-slate-800/20"
                                : type === "connected-question"
                                ? "bg-indigo-50/15 border-indigo-200/50 dark:bg-indigo-950/5 dark:border-indigo-900/20"
                                : "bg-gray-50/40 border-gray-200/50 dark:bg-gray-900/5 dark:border-gray-800/20"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                  type === "suggested"
                                    ? "border-amber-500/30 bg-amber-100/70 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    : type === "alternative"
                                    ? "border-slate-500/30 bg-slate-100/70 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                                    : type === "connected-question"
                                    ? "border-indigo-500/30 bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                    : "border-gray-500/30 bg-gray-100/70 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                )}
                              >
                                {type === "suggested" 
                                  ? "Suggested Answer" 
                                  : type === "alternative" 
                                  ? "Alternative Answer" 
                                  : type === "connected-question"
                                  ? "Connected Question"
                                  : "Answer"}
                              </Badge>
                              {suggestedAnswers.length > 1 && (
                                <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                  PART {idx + 1}
                                </span>
                              )}
                            </div>
                            <p className="whitespace-pre-wrap text-base font-light leading-relaxed text-navy md:text-[17px]">
                              {cleanText}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-base font-light leading-relaxed text-muted-foreground italic">
                      No suggested answer available.
                    </p>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-base font-light leading-relaxed text-navy md:text-[17px]">
                  {formatPdfText(questionText)}
                </p>
              )}
            </CardContent>
          </Card>
        </Card>

        {/* Footer Row */}
        <CardFooter className="flex w-full flex-col items-start justify-between gap-4 p-0 sm:flex-row sm:items-stretch sm:gap-0 ring-0 overflow-visible">
          {/* Chair Block */}
          <Card className="flex flex-row items-center gap-3 rounded-none border-none bg-navy px-6 py-5 shadow-none ring-0 overflow-visible">
            <Award className="size-5 text-white" fill="white" />
            <CardContent className="flex flex-row items-center gap-1.5 p-0">
              <span className="text-[13px] font-bold tracking-wide text-gold uppercase">
                CHAIR:
              </span>
              <span className="text-[13px] font-light text-white">
                {chair}
              </span>
            </CardContent>
          </Card>

          {/* View Answer button */}
          <Button
            variant="default"
            onClick={() => setIsShowingAnswer(!isShowingAnswer)}
            className={cn(
              "flex h-auto w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-none border-none px-8 py-5 text-[11px] font-bold uppercase tracking-widest shadow-none transition-colors duration-300 sm:w-auto md:text-xs",
              isShowingAnswer
                ? "bg-gold text-navy hover:bg-gold/90"
                : "bg-navy text-gold hover:bg-navy/90"
            )}
          >
            <CheckCircle2 className="size-5" />
            VIEW ANSWER
          </Button>
        </CardFooter>
      </Card>
    </Card>
  )
}
