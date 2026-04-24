"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Target, RotateCw } from "lucide-react";
import type { SSEEvaluationEvent } from "@/lib/types";

interface EvaluationBadgeProps {
  evaluation: SSEEvaluationEvent | null;
  score?: number | null;
  attempts?: number | null;
}

export function EvaluationBadge({
  evaluation,
  score: directScore,
  attempts: directAttempts,
}: EvaluationBadgeProps) {
  const s = evaluation?.score ?? directScore;
  const a = evaluation?.attempts ?? directAttempts;

  if (s == null && a == null) return null;

  const scoreColor =
    s != null
      ? s >= 0.8
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : s >= 0.5
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-red-400 bg-red-500/10 border-red-500/20"
      : "text-foreground/40 bg-foreground/5 border-foreground/10";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {s != null && (
        <Badge
          variant="outline"
          className={`font-mono text-[10px] gap-1 px-2 py-0.5 ${scoreColor}`}
        >
          <Target className="h-3 w-3" />
          SCORE: {s.toFixed(2)}
        </Badge>
      )}
      {a != null && a > 1 && (
        <Badge
          variant="outline"
          className="font-mono text-[10px] gap-1 px-2 py-0.5 text-foreground/40 border-foreground/10"
        >
          <RotateCw className="h-3 w-3" />
          {a} ATTEMPT{a !== 1 ? "S" : ""}
        </Badge>
      )}
      {evaluation?.summary && (
        <span className="text-[10px] font-mono text-foreground/30 truncate max-w-[200px]">
          {evaluation.summary}
        </span>
      )}
    </div>
  );
}
