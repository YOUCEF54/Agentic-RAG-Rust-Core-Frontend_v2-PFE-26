"use client";

import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight, Search, Sparkles, CheckCircle, RefreshCw } from "lucide-react";

interface AgentTraceProps {
  trace: Record<string, unknown>[];
  isStreaming?: boolean;
  isDevMode?: boolean;
}

function getStepIcon(step: Record<string, unknown>) {
  const agent = String(step.agent ?? step.step ?? step.type ?? "").toLowerCase();
  if (agent.includes("refin") || agent.includes("query")) return <Search className="h-3 w-3" />;
  if (agent.includes("retriev") || agent.includes("select")) return <Search className="h-3 w-3" />;
  if (agent.includes("generat")) return <Sparkles className="h-3 w-3" />;
  if (agent.includes("evaluat")) return <CheckCircle className="h-3 w-3" />;
  if (agent.includes("retry")) return <RefreshCw className="h-3 w-3" />;
  return <Brain className="h-3 w-3" />;
}

function getStepLabel(step: Record<string, unknown>): string {
  return String(
    step.agent ?? step.step ?? step.type ?? step.name ?? "Agent Step"
  );
}

export function AgentTrace({ trace, isStreaming, isDevMode = false }: AgentTraceProps) {
  if (!trace || trace.length === 0) return null;

  if (!isDevMode) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-foreground/[0.02] border border-foreground/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-3.5 w-3.5 text-foreground/40" />
          <span className="text-[10px] font-mono uppercase text-foreground/50 tracking-wider">
            Thinking Process
          </span>
          {isStreaming && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse ml-1" />
          )}
        </div>
        <div className="flex flex-col gap-2 ml-1.5 border-l-2 border-foreground/[0.06] pl-3 py-1">
          {trace.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="text-emerald-500/70">{getStepIcon(step)}</div>
              <span className="text-[11px] font-mono text-foreground/70 uppercase">
                {getStepLabel(step)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-foreground/40 hover:text-foreground/60 transition-colors group">
        <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
        <Brain className="h-3 w-3" />
        AGENT TRACE ({trace.length} step{trace.length !== 1 ? "s" : ""})
        {isStreaming && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse ml-1" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 ml-1 border-l border-foreground/[0.08] pl-3 flex flex-col gap-2">
          {trace.map((step, i) => (
            <Collapsible key={i}>
              <CollapsibleTrigger className="flex items-center gap-1.5 text-[10px] font-mono text-foreground/50 hover:text-foreground/70 transition-colors group w-full text-left">
                <ChevronRight className="h-2.5 w-2.5 transition-transform group-data-[state=open]:rotate-90 shrink-0" />
                {getStepIcon(step)}
                <span className="uppercase truncate">{getStepLabel(step)}</span>
                {step.duration_ms != null && (
                  <Badge variant="secondary" className="ml-auto text-[8px] font-mono px-1 py-0">
                    {Number(step.duration_ms).toFixed(0)}ms
                  </Badge>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-1 p-2 text-[10px] font-mono text-foreground/40 bg-foreground/[0.03] border border-foreground/[0.06] overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(step, null, 2)}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
