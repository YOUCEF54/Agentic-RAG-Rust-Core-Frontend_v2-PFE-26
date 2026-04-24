"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight } from "lucide-react";
import type { RetrievedItem } from "@/lib/types";

interface SourceCitationsProps {
  items: RetrievedItem[];
}

function scoreColor(distance: number): string {
  if (distance < 0.3) return "text-emerald-400";
  if (distance < 0.6) return "text-amber-400";
  return "text-red-400";
}

export function SourceCitations({ items }: SourceCitationsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-foreground/40 hover:text-foreground/60 transition-colors group">
        <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
        <FileText className="h-3 w-3" />
        SOURCES ({items.length} chunk{items.length !== 1 ? "s" : ""})
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-foreground/[0.08] bg-foreground/[0.02] p-2.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-foreground/30" />
                  <span className="text-[10px] font-mono text-foreground/50 truncate max-w-[160px]">
                    {item.source}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[8px] font-mono px-1 py-0"
                  >
                    p.{item.page}
                  </Badge>
                </div>
                <span
                  className={`text-[10px] font-mono font-semibold ${scoreColor(
                    item.distance
                  )}`}
                >
                  {(1 - item.distance).toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-foreground/50 font-mono leading-relaxed line-clamp-4">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
