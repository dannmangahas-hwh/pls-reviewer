import { ChevronsRight } from "lucide-react";

export function HashtagsBanner() {
  return (
    <div className="bg-[#131A26] border-t border-white/5 py-4 px-6 relative z-10 w-full overflow-x-auto">
      <div className="flex items-center justify-center md:justify-around min-w-max gap-8 px-4 text-sm font-medium">
        <div className="flex items-center gap-8">
          <span className="text-gold/80 hover:text-gold transition-colors cursor-default">#BarExamPrep</span>
          <ChevronsRight className="w-4 h-4 text-gold" />
        </div>
        <div className="flex items-center gap-8">
          <span className="text-white/70 hover:text-white transition-colors cursor-default">#LawStudentLife</span>
          <ChevronsRight className="w-4 h-4 text-white/70" />
        </div>
        <div className="flex items-center gap-8">
          <span className="text-gold/80 hover:text-gold transition-colors cursor-default">#HardWorkPaysOff</span>
          <ChevronsRight className="w-4 h-4 text-gold" />
        </div>
        <div className="flex items-center gap-8">
          <span className="text-white/70 hover:text-white transition-colors cursor-default">#StudySmart</span>
          <ChevronsRight className="w-4 h-4 text-white/70" />
        </div>
        <div className="flex items-center gap-8">
          <span className="text-gold/80 hover:text-gold transition-colors cursor-default">#FutureLawyer</span>
        </div>
      </div>
    </div>
  );
}
