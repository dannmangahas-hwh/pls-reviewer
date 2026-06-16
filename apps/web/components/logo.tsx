import { Scale } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
}

export function Logo({ className, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="bg-gold p-2 rounded-xl flex items-center justify-center">
        <Scale className="text-white w-8 h-8" />
      </div>
      <div className="flex flex-col">
        <span className={cn("text-white text-2xl font-bold leading-tight", textClassName)}>
          PLS BAR
        </span>
        <span className={cn("text-white text-xs tracking-[0.2em] leading-tight", textClassName)}>
          EXAM REVIEWER
        </span>
      </div>
    </div>
  );
}
