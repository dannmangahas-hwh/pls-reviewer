"use client"

import React, { useLayoutEffect, useMemo, useRef, useState } from "react"
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

const cleanSpacingAnomalies = (text: string): string => {
  if (!text) return ""

  let result = text

  // 1. Fix accidental double newlines that cut a sentence (followed by a lowercase letter that is not a list marker)
  result = result.replace(/\n\s*\n(?=\s*[a-z](?![.)]))/g, "\n")

  // 2. Fix disjointed small common words (e.g. "t he" -> "the", "i t" -> "it")
  const disjointMap: [RegExp, string][] = [
    [/\bt\s+he\b/gi, "the"],
    [/\bth\s+e\b/gi, "the"],
    [/\bi\s+t\b/gi, "it"],
    [/\bo\s+f\b/gi, "of"],
    [/\bt\s+o\b/gi, "to"],
    [/\bi\s+n\b/gi, "in"],
    [/\bo\s+n\b/gi, "on"],
    [/\ba\s+s\b/gi, "as"],
    [/\bb\s+y\b/gi, "by"],
    [/\bo\s+r\b/gi, "or"],
    [/\ba\s+t\b/gi, "at"],
    [/\ba\s+n\b/gi, "an"],
    [/\bb\s+e\b/gi, "be"],
    [/\bw\s+ho\b/gi, "who"],
    [/\bt\s+heir\b/gi, "their"],
    [/\bt\s+hey\b/gi, "they"],
    [/\bt\s+hem\b/gi, "them"],
    [/\bt\s+herefore\b/gi, "therefore"],
    [/\bt\s+here\b/gi, "there"],
    [/\bu\s+pon\b/gi, "upon"],
    [/\bw\s+ith\b/gi, "with"],
    [/\bw\s+ithin\b/gi, "within"],
    [/\bh\s+ave\b/gi, "have"],
    [/\bh\s+as\b/gi, "has"],
    [/\bh\s+is\b/gi, "his"],
    [/\bh\s+er\b/gi, "her"],
    [/\ba\s+nd\b/gi, "and"],
    [/\ba\s+ny\b/gi, "any"],
    [/\ba\s+re\b/gi, "are"],
    [/\bo\s+ut\b/gi, "out"],
    [/\bf\s+or\b/gi, "for"],
    [/\bf\s+rom\b/gi, "from"],
    [/\bb\s+ut\b/gi, "but"],
    [/\bn\s+ot\b/gi, "not"],
    [/\bs\s+uch\b/gi, "such"],
    [/\bs\s+aid\b/gi, "said"],
    [/\bs\s+ame\b/gi, "same"],
    [/\bi\s+ts\b/gi, "its"],
    [/\bt\s+his\b/gi, "this"],
    [/\bth\s+is\b/gi, "this"],
    [/\bth\s+at\b/gi, "that"],
    [/\bt\s+hat\b/gi, "that"],
    [/\bth\s+ese\b/gi, "these"],
    [/\bth\s+ose\b/gi, "those"],
    [/\ba\s+ll\b/gi, "all"],
    [/\bmo\s+re\b/gi, "more"],
    [/\bbe\s+fore\b/gi, "before"],
    [/\bbef\s+ore\b/gi, "before"],
    [/\baf\s+ter\b/gi, "after"],
    [/\bwh\s+ere\b/gi, "where"],
    [/\bwhe\s+n\b/gi, "when"],
    [/\bwh\s+ich\b/gi, "which"],
    [/\bth\s+ereof\b/gi, "thereof"],
    [/\bthe\s+reof\b/gi, "thereof"],
    [/\bt\s+hereof\b/gi, "thereof"],
    [/\bth\s+ereby\b/gi, "thereby"],
    [/\bthe\s+reby\b/gi, "thereby"],
    [/\bsh\s+ould\b/gi, "should"],
    [/\bwo\s+uld\b/gi, "would"],
    [/\bc\s+ould\b/gi, "could"],
    [/\bco\s+urt\b/gi, "court"],
    [/\bcau\s+se\b/gi, "cause"],
    [/\bcon\s+stitution\b/gi, "constitution"],
    [/\bpro\s+vision\b/gi, "provision"],
    [/\bju\s+risdiction\b/gi, "jurisdiction"],
    [/\bcol\s+lection\b/gi, "collection"],
    [/\bpos\s+ition\b/gi, "position"],
    [/\bgov\s+ernment\b/gi, "government"],
    [/\bap\s+pointive\b/gi, "appointive"],
    [/\bap\s+pointment\b/gi, "appointment"],
    [/\belec\s+tive\b/gi, "elective"],
    [/\belec\s+tion\b/gi, "election"],
    [/\bo\s+ffice\b/gi, "office"],
    [/\bof\s+fice\b/gi, "office"],
    [/\bo\s+fficial\b/gi, "official"],
    [/\boff\s+icial\b/gi, "official"],
    [/\bcan\s+didacy\b/gi, "candidacy"],
    [/\bcandi\s+dacy\b/gi, "candidacy"],
    [/\bre\s+signed\b/gi, "resigned"],
    [/\bresig\s+ned\b/gi, "resigned"],
    [/\bde\s+cided\b/gi, "decided"],
    [/\bex\s+ercising\b/gi, "exercising"],
    [/\bdut\s+ies\b/gi, "duties"],
    [/\bcon\s+gressman\b/gi, "congressman"],
    [/\bcon\s+gress\b/gi, "congress"],
    [/\bse\s+nate\b/gi, "senate"],
    [/\bho\s+use\b/gi, "house"],
    [/\brepre\s+sentatives\b/gi, "representatives"],
    [/\bpre\s+sident\b/gi, "president"],
    [/\bcom\s+mittee\b/gi, "committee"],
    [/\bcl\s+aim\b/gi, "claim"],
    [/\bcla\s+im\b/gi, "claim"],
    [/\bde\s+fense\b/gi, "defense"],
    [/\bna\s+tional\b/gi, "national"],
    [/\bunders\s+ecretary\b/gi, "undersecretary"],
    [/\bdi\s+smissed\b/gi, "dismissed"],
    [/\bvio\s+lation\b/gi, "violation"],
    [/\bpe\s+riod\b/gi, "period"],
    [/\bpro\s+ceeding\b/gi, "proceeding"],
    [/\bpro\s+ceedings\b/gi, "proceedings"],
    [/\bini\s+tiated\b/gi, "initiated"],
    [/\binit\s+iated\b/gi, "initiated"],
    [/\bver\s+ified\b/gi, "verified"],
    [/\bcom\s+plaint\b/gi, "complaint"],
    [/\bfil\s+ing\b/gi, "filing"],
    [/\bre\s+ferral\b/gi, "referral"],
    [/\bre\s+ferred\b/gi, "referred"],
    [/\bsup\s+reme\b/gi, "supreme"],
    [/\bju\s+stices\b/gi, "justices"],
    [/\bju\s+stice\b/gi, "justice"],
    [/\bmem\s+ber\b/gi, "member"],
    [/\bci\s+tizen\b/gi, "citizen"],
    [/\bre\s+solution\b/gi, "resolution"],
    [/\ben\s+dorsement\b/gi, "endorsement"],
    [/\bendors\s+ed\b/gi, "endorsed"],
    [/\bcomp\s+laints\b/gi, "complaints"],
    [/\bfrus\s+trate\b/gi, "frustrate"],
    [/\bsu\s+fficient\b/gi, "sufficient"],
    [/\bpr\s+ior\b/gi, "prior"],

    // Additional PDF Extraction spacing anomaly repairs:
    [/\bprovi\s+ncial\b/gi, "provincial"],
    [/\bpro\s+vince\b/gi, "province"],
    [/\bpre\s+liminary\b/gi, "preliminary"],
    [/\bprelimi\s+nary\b/gi, "preliminary"],
    [/\bprelimin\s+ary\b/gi, "preliminary"],
    [/\bsuspic\s+ious\b/gi, "suspicious"],
    [/\bex\s+tension\b/gi, "extension"],
    [/\bextens\s+ion\b/gi, "extension"],
    [/\brespond\s+ent\b/gi, "respondent"],
    [/\bim\s+pression\b/gi, "impression"],
    [/\bamo\s+unt\b/gi, "amount"],
    [/\bwi\s+ll\b/gi, "will"],
    [/\bgr\s+ound\b/gi, "ground"],
    [/\bsha\s+ll\b/gi, "shall"],
    [/\bsep\s+arate\b/gi, "separate"],
    [/\bsepar\s+ation\b/gi, "separation"],
    [/\bsea\s+rch\b/gi, "search"],
    [/\bpr\s+esident\b/gi, "president"],
    [/\bpol\s+icy\b/gi, "policy"],
    [/\bagree\s+ment\b/gi, "agreement"],
    [/\bproper\s+ty\b/gi, "property"],
    [/\bsever\s+al\b/gi, "several"],
    [/\bsev\s+eral\b/gi, "several"],
    [/\bcommen\s+cement\b/gi, "commencement"],
    [/\benfor\s+ce\b/gi, "enforce"],
    [/\benforceme\s+nt\b/gi, "enforcement"],
    [/\bdispla\s+yed\b/gi, "displayed"],
    [/\bma\s+rtial\b/gi, "martial"],
    [/\bbus\s+iness\b/gi, "business"],
    [/\bom\s+nibus\b/gi, "omnibus"],
    [/\bfo\s+llowing\b/gi, "following"],
    [/\bopp\s+ortunity\b/gi, "opportunity"],
    [/\bop\s+portunity\b/gi, "opportunity"],
    [/\both\s+er\b/gi, "other"],
    [/\bex\s+clusive\b/gi, "exclusive"],
    [/\bsu\s+bject\b/gi, "subject"],
    [/\bcancel\s+lation\b/gi, "cancellation"],
    [/\brec\s+onstitution\b/gi, "reconstitution"],
    [/\bherein\s+after\b/gi, "hereinafter"],
    [/\bundivi\s+ded\b/gi, "undivided"],
    [/\brequire\s+ment\b/gi, "requirement"],
    [/\brece\s+ipt\b/gi, "receipt"],
    [/\bdeli\s+berate\b/gi, "deliberate"],
    [/\bfor\s+mer\b/gi, "former"],
    [/\bform\s+er\b/gi, "former"],
    [/\bgu\s+ilty\b/gi, "guilty"],
    [/\binexcus\s+able\b/gi, "inexcusable"],
    [/\bconfiden\s+ce\b/gi, "confidence"],
    [/\bther\s+efore\b/gi, "therefore"],
    [/\bspec\s+ial\b/gi, "special"],
    [/\bphili\s+ppines\b/gi, "philippines"],
    [/\btest\s+ify\b/gi, "testify"],
    [/\bconse\s+nt\b/gi, "consent"],
    [/\bfavor\s+ing\b/gi, "favoring"],
    [/\bex\s+ecuted\b/gi, "executed"],
    [/\bseeki\s+ng\b/gi, "seeking"],
    [/\binternat\s+ional\b/gi, "international"],
    [/\btaxa\s+tion\b/gi, "taxation"],
    [/\bnoth\s+ing\b/gi, "nothing"],
    [/\beviden\s+ce\b/gi, "evidence"],
    [/\bexec\s+ution\b/gi, "execution"],
    [/\bcompli\s+ance\b/gi, "compliance"],
    [/\bassign\s+ed\b/gi, "assigned"],
    [/\besta\s+te\b/gi, "estate"],
    [/\bperp\s+etuate\b/gi, "perpetuate"],
    [/\baf\s+fair\b/gi, "affair"],
    [/\bco\s+ntract\b/gi, "contract"],
    [/\bgratuit\s+ous\b/gi, "gratuitous"],
    [/\bocca\s+sion\b/gi, "occasion"],
    [/\bmot\s+ion\b/gi, "motion"],
    [/\bpermane\s+ntly\b/gi, "permanently"],
    [/\binj\s+ury\b/gi, "injury"],
    [/\bau\s+tomatically\b/gi, "automatically"],
    [/\bpar\s+king\b/gi, "parking"],
    [/\bsu\s+ch\b/gi, "such"],
    [/\bmatt\s+er\b/gi, "matter"],
    [/\bun\s+tenable\b/gi, "untenable"],
    [/\barr\s+est\b/gi, "arrest"],
    [/\bdespi\s+te\b/gi, "despite"],
    [/\bse\s+ptember\b/gi, "september"],
    [/\brep\s+eatedly\b/gi, "repeatedly"],
    [/\bcomp\s+etent\b/gi, "competent"],
    [/\bins\s+tance\b/gi, "instance"],
    [/\bauthori\s+ty\b/gi, "authority"],
    [/\baro\s+use\b/gi, "arouse"],
    [/\bsa\s+id\b/gi, "said"],
    [/\bwithdra\s+wal\b/gi, "withdrawal"],
    [/\bpra\s+ctice\b/gi, "practice"],
    [/\bregiste\s+red\b/gi, "registered"],
    [/\bwaiv\s+er\b/gi, "waiver"],
    [/\binsu\s+red\b/gi, "insured"],
    [/\bpr\s+ejudicial\b/gi, "prejudicial"],
    [/\bsi\s+multaneous\b/gi, "simultaneous"],
    [/\bnegot\s+iable\b/gi, "negotiable"],
    [/\bpursu\s+ant\b/gi, "pursuant"],
    [/\bwo\s+rk\b/gi, "work"],
    [/\bwork\s+ing\b/gi, "working"],
    [/\bsust\s+ained\b/gi, "sustained"],
    [/\bsin\s+ce\b/gi, "since"],
    [/\bindemn\s+ity\b/gi, "indemnity"],
    [/\bwhen\s+ever\b/gi, "whenever"],
    [/\bthrou\s+gh\b/gi, "through"],
    [/\bwr\s+itten\b/gi, "written"],
    [/\bgener\s+al\b/gi, "general"],
    [/\bwheth\s+er\b/gi, "whether"],
    [/\brul\s+ing\b/gi, "ruling"],
    [/\bco\s+untry\b/gi, "country"],
    [/\breq\s+uest\b/gi, "request"],
  ]
  disjointMap.forEach(([pat, rep]) => {
    result = result.replace(pat, rep)
  })

  // 3. Fix spaces around hyphens in words (e.g. "non -payment" or "Du -guil")
  result = result.replace(/\b(\w+)\s+-\s*(\w+)\b/g, "$1-$2")
  result = result.replace(/\b(\w+)\s*-\s+(\w+)\b/g, "$1-$2")

  // 4. Fix spaces before punctuation (comma, semicolon, colon, period, question mark, exclamation mark)
  result = result.replace(/\s+([,;:!?])/g, "$1")

  // Specific fix for "v ." -> "v."
  result = result.replace(/\bv\s+\.\b/gi, "v.")
  result = result.replace(/\bv\s+\./gi, "v.")

  // Fix space before period, excluding ellipsis
  result = result.replace(/\s+\.(?!\.)/g, ".")

  // 5. Collapse multiple spaces into a single space (except newlines)
  result = result.replace(/[^\S\n]+/g, " ")

  // 6. Dynamic Trailing Text Cleanups (Page numbers, separators, END OF PART, Panel of Experts list)
  // Strip ANNEX PANEL OF EXPERTS list (and anything following it) at the very end
  result = result.replace(
    /\n+\s*(?:\d+\s+\n+)?(?:ANNEX\s+\n+)?PANEL\s+OF\s+EXPERTS[\s\S]*$/gi,
    ""
  )

  // Strip END OF PART X lines
  result = result.replace(/\n+\s*END\s+OF\s+PART\s+[0-9IIVX]+\.?,?\s*$/gi, "")

  // Strip trailing separators (like –  –, – –, - -)
  result = result.replace(/\n+\s*[-–—\s]+\s*$/g, "")

  // Strip trailing standalone page numbers
  result = result.replace(/\n+\s*\d+\s*$/g, "")

  return result.trim()
}

const formatPdfText = (text: string): string => {
  if (!text) return ""

  // Clean spacing anomalies before doing line-by-line formatting
  const cleanedText = cleanSpacingAnomalies(text)

  // Split into paragraph blocks by double newlines (or more)
  const blocks = cleanedText.split(/\n\s*\n/)

  const cleanBlocks = blocks.map((block) => {
    const lines = block.split("\n")
    let result = ""

    for (let i = 0; i < lines.length; i++) {
      const lineVal = lines[i]
      const currentLine = lineVal ? lineVal.trim() : ""
      if (!currentLine) continue

      if (result === "") {
        result = currentLine
      } else {
        // If the current line starts with a list marker (e.g. "1.", "(a)", "-", "*")
        // Refined regex to avoid breaking inline parenthesized numbers like (15)
        const isListMarker =
          /^\s*(\d+\.|\([a-z0-9]\)|\([ivx]+\)|[-*•])\s+/i.test(currentLine)

        // If the previous line ended with a colon
        const prevLineVal = lines[i - 1]
        const previousLine = prevLineVal ? prevLineVal.trim() : ""
        const endsWithColon = previousLine.endsWith(":")

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

  return cleanBlocks
    .filter((block) => block.trim() !== "")
    .join("\n\n")
    .trim()
}

const parseAnswer = (ans: string) => {
  let type: "suggested" | "alternative" | "connected-question" | "default" =
    "default"
  let label = "Answer"
  let cleanText = ans.trim()

  // 1. Connected Question
  const connectedMatch = cleanText.match(/^connected\s+question\s*:?/i)
  if (connectedMatch) {
    type = "connected-question"
    label = "Connected Question"
    cleanText = cleanText.substring(connectedMatch[0].length).trim()
    return { type, label, text: cleanText }
  }

  // 2. Alternative Answer (must match before suggested answer to handle "alternative suggested answer")
  const alternativeMatch = cleanText.match(
    /^(alternative\s+suggested\s+answer|alternative\s+answers?)\s*:?/i
  )
  if (alternativeMatch) {
    type = "alternative"
    const matchedStr = (alternativeMatch[1] ?? "").toLowerCase()
    label = "Alternative Answer"
    if (matchedStr.includes("suggested")) {
      label = "Alternative Suggested Answer"
    } else if (matchedStr.includes("answers")) {
      label = "Alternative Answers"
    }
    cleanText = cleanText.substring(alternativeMatch[0].length).trim()
    return { type, label, text: cleanText }
  }

  // 3. Suggested Answer
  const suggestedMatch = cleanText.match(
    /^(primary\s+suggested\s+answer|secondary\s+suggested\s+answer|suggested\s+answers?\s+to\s+the|suggested\s+answers?\s+\d+|suggested\s+answers?)\s*:?/i
  )
  if (suggestedMatch) {
    type = "suggested"
    const matchedStr = (suggestedMatch[1] ?? "").toLowerCase()
    label = "Suggested Answer"
    if (matchedStr.includes("primary")) {
      label = "Primary Suggested Answer"
    } else if (matchedStr.includes("secondary")) {
      label = "Secondary Suggested Answer"
    } else if (matchedStr.includes("answers")) {
      label = "Suggested Answers"
    } else {
      const numMatch = matchedStr.match(/(\d+)/)
      if (numMatch) {
        label = `Suggested Answer ${numMatch[1]}`
      }
    }
    cleanText = cleanText.substring(suggestedMatch[0].length).trim()
    return { type, label, text: cleanText }
  }

  return { type, label, text: cleanText }
}

const buildValidAnswers = (suggestedAnswers: string[]) => {
  const rawAnswers = suggestedAnswers.filter((ans) => ans && ans.trim() !== "")
  const validAnswers: string[] = []

  rawAnswers.forEach((ans) => {
    const trimmed = ans.trim()
    const isContinuation =
      validAnswers.length > 0 &&
      /^[a-z]/i.test(trimmed) &&
      !/^(SUGGESTED|ALTERNATIVE|CONNECTED)/i.test(trimmed) &&
      (trimmed.startsWith("answer") ||
        trimmed.startsWith("answers") ||
        /^[a-z]/.test(ans))

    if (isContinuation) {
      const lastIdx = validAnswers.length - 1
      validAnswers[lastIdx] = validAnswers[lastIdx] + " " + ans
    } else {
      validAnswers.push(ans)
    }
  })

  return validAnswers
}

export function QuestionCard({
  year,
  examType,
  questionText,
  suggestedAnswers = [],
  chair,
}: QuestionCardProps) {
  const [isShowingAnswer, setIsShowingAnswer] = useState(false)
  const [contentHeight, setContentHeight] = useState<number>()
  const questionRef = useRef<HTMLDivElement>(null)
  const answerRef = useRef<HTMLDivElement>(null)
  const validAnswers = useMemo(
    () => buildValidAnswers(suggestedAnswers),
    [suggestedAnswers]
  )

  useLayoutEffect(() => {
    const activeContent = isShowingAnswer
      ? answerRef.current
      : questionRef.current
    if (!activeContent) return

    const updateHeight = () => {
      setContentHeight(activeContent.offsetHeight)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(activeContent)

    return () => resizeObserver.disconnect()
  }, [isShowingAnswer, questionText, validAnswers])

  return (
    <Card className="mb-16 flex w-full flex-col items-stretch gap-4 overflow-visible rounded-none border-none bg-transparent p-0 shadow-none ring-0 md:flex-row md:gap-6">
      {/* Left Sidebar */}
      <Card
        className={cn(
          "flex w-full shrink-0 flex-row items-center justify-between overflow-visible rounded-none border border-gray-200/30 px-6 py-4 shadow-none ring-0 transition-colors duration-300 md:w-[130px] md:flex-col md:justify-start md:px-0 md:py-8",
          isShowingAnswer ? "bg-gold text-navy" : "bg-navy text-gold"
        )}
      >
        <CardContent className="flex flex-row items-center gap-2 overflow-visible border-none bg-transparent p-0 shadow-none ring-0 md:flex-col md:items-start md:gap-1">
          <span className="text-2xl leading-none font-black md:text-3xl">
            {year}
          </span>
          <div className="flex flex-row items-center gap-1.5 md:flex-col md:items-start md:gap-0">
            {examType.split(" ").map((word, i) => (
              <span
                key={i}
                className="text-base leading-none font-light tracking-wide uppercase md:text-3xl md:normal-case"
              >
                {word}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <Card className="flex flex-1 flex-col justify-between gap-4 overflow-visible rounded-none border-none bg-transparent p-0 shadow-none ring-0">
        {/* Text Box Container with Solid Shadow Offset */}
        <Card className="relative block w-full gap-0 overflow-visible rounded-none border-none bg-transparent p-0 pr-4 pb-4 shadow-none ring-0">
          {/* Solid neo-brutalist shadow block */}
          <Card className="absolute top-4 right-0 bottom-0 left-4 z-0 block gap-0 overflow-visible rounded-none border-none bg-navy p-0 shadow-none ring-0" />

          {/* Actual Text Box */}
          <Card className="relative z-10 block gap-0 overflow-hidden rounded-none border border-gray-300 bg-white p-6 shadow-none ring-0 md:p-8">
            <CardContent
              className="relative p-0 transition-[height] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[height]"
              style={contentHeight ? { height: contentHeight } : undefined}
            >
              <div
                ref={questionRef}
                aria-hidden={isShowingAnswer}
                className={cn(
                  "w-full transition-[opacity,filter,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,filter,transform]",
                  isShowingAnswer
                    ? "pointer-events-none absolute inset-x-0 top-0 translate-y-1 opacity-0 blur-md"
                    : "blur-0 relative translate-y-0 opacity-100"
                )}
              >
                <p className="text-base leading-relaxed font-light whitespace-pre-wrap text-navy md:text-[17px]">
                  {formatPdfText(questionText)}
                </p>
              </div>
              <div
                ref={answerRef}
                aria-hidden={!isShowingAnswer}
                className={cn(
                  "w-full transition-[opacity,filter,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,filter,transform]",
                  isShowingAnswer
                    ? "blur-0 relative translate-y-0 opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 -translate-y-1 opacity-0 blur-md"
                )}
              >
                <div
                  className={cn(
                    "flex flex-col gap-6",
                    validAnswers.length > 1 ? "relative pl-8" : ""
                  )}
                >
                  {/* Vertical dotted/dashed timeline line */}
                  {validAnswers.length > 1 && (
                    <div className="absolute top-6 bottom-6 left-3 z-0 w-0.5 border-l-2 border-dashed border-slate-300" />
                  )}
                  {validAnswers.length > 0 ? (
                    validAnswers.map((ans, idx) => {
                      const { type, label, text } = parseAnswer(ans)
                      const cleanText = formatPdfText(text)
                      return (
                        <div key={idx} className="relative">
                          {/* Timeline node dot */}
                          {validAnswers.length > 1 && (
                            <div
                              className={cn(
                                "absolute top-[26px] -left-[25px] z-10 size-3 rounded-full border-2 bg-white",
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
                                ? "border-amber-200/50 bg-amber-50/40 dark:border-amber-900/20 dark:bg-amber-950/5"
                                : type === "alternative"
                                  ? "border-slate-200/50 bg-slate-50/40 dark:border-slate-800/20 dark:bg-slate-900/5"
                                  : type === "connected-question"
                                    ? "border-indigo-200/50 bg-indigo-50/15 dark:border-indigo-900/20 dark:bg-indigo-950/5"
                                    : "border-gray-200/50 bg-gray-50/40 dark:border-gray-800/20 dark:bg-gray-900/5"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                                  type === "suggested"
                                    ? "border-amber-500/30 bg-amber-100/70 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    : type === "alternative"
                                      ? "border-slate-500/30 bg-slate-100/70 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                                      : type === "connected-question"
                                        ? "border-indigo-500/30 bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                        : "border-gray-500/30 bg-gray-100/70 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                )}
                              >
                                {label}
                              </Badge>
                              {validAnswers.length > 1 && (
                                <span className="text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                                  PART {idx + 1}
                                </span>
                              )}
                            </div>
                            <p className="text-base leading-relaxed font-light whitespace-pre-wrap text-navy md:text-[17px]">
                              {cleanText}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-base leading-relaxed font-light text-muted-foreground italic">
                      No suggested answer available.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Card>

        {/* Footer Row */}
        <CardFooter className="flex w-full flex-col items-start justify-between gap-4 overflow-visible p-0 ring-0 sm:flex-row sm:items-stretch sm:gap-0">
          {/* Chair Block */}
          <Card className="flex flex-row items-center gap-3 overflow-visible rounded-none border-none bg-navy px-6 py-5 shadow-none ring-0">
            <Award className="size-5 text-white" fill="white" />
            <CardContent className="flex flex-row items-center gap-1.5 p-0">
              <span className="text-[13px] font-bold tracking-wide text-gold uppercase">
                CHAIR:
              </span>
              <span className="text-[13px] font-light text-white">{chair}</span>
            </CardContent>
          </Card>

          {/* View Answer button */}
          <Button
            variant="default"
            onClick={() => setIsShowingAnswer(!isShowingAnswer)}
            className={cn(
              "flex h-auto w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-none border-none px-8 py-5 text-[11px] font-bold tracking-widest uppercase shadow-none transition-colors duration-300 sm:w-auto md:text-xs",
              isShowingAnswer
                ? "bg-gold text-navy hover:bg-gold/90"
                : "bg-navy text-gold hover:bg-navy/90"
            )}
          >
            <CheckCircle2 className="size-5" />
            {isShowingAnswer ? "VIEW QUESTION" : "VIEW ANSWER"}
          </Button>
        </CardFooter>
      </Card>
    </Card>
  )
}
