import { ChevronsRight } from "lucide-react"

export function HashtagsBanner() {
  return (
    <div
      data-hashtags-banner
      className="relative z-10 w-full overflow-x-auto border-t border-white/5 bg-[#131A26] px-6 py-4"
    >
      <div className="flex min-w-max items-center justify-center gap-8 px-4 text-sm font-medium md:justify-around">
        <div className="flex items-center gap-8">
          <span className="cursor-default text-gold/80 transition-colors hover:text-gold">
            #BarExamPrep
          </span>
          <ChevronsRight className="h-4 w-4 text-gold" />
        </div>
        <div className="flex items-center gap-8">
          <span className="cursor-default text-white/70 transition-colors hover:text-white">
            #LawStudentLife
          </span>
          <ChevronsRight className="h-4 w-4 text-white/70" />
        </div>
        <div className="flex items-center gap-8">
          <span className="cursor-default text-gold/80 transition-colors hover:text-gold">
            #HardWorkPaysOff
          </span>
          <ChevronsRight className="h-4 w-4 text-gold" />
        </div>
        <div className="flex items-center gap-8">
          <span className="cursor-default text-white/70 transition-colors hover:text-white">
            #StudySmart
          </span>
          <ChevronsRight className="h-4 w-4 text-white/70" />
        </div>
        <div className="flex items-center gap-8">
          <span className="cursor-default text-gold/80 transition-colors hover:text-gold">
            #FutureLawyer
          </span>
        </div>
      </div>
    </div>
  )
}
