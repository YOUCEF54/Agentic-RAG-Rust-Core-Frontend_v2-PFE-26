"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AgentTrace } from "./AgentTrace";
import { SourceCitations } from "./SourceCitations";
import { EvaluationBadge } from "./EvaluationBadge";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`
          shrink-0 h-7 w-7 flex items-center justify-center border
          ${isUser
            ? "border-foreground/20 bg-foreground/10"
            : "border-emerald-500/30 bg-emerald-500/10"
          }
        `}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-foreground/60" />
        ) : (
          <Bot className="h-3.5 w-3.5 text-emerald-400" />
        )}
      </div>

      {/* Content */}
      <div
        className={`
          flex-1 min-w-0 flex flex-col gap-2
          ${isUser ? "items-end" : "items-start"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-foreground/30">
            {isUser ? "YOU" : "ASSISTANT"}
          </span>
          <span className="text-[10px] font-mono text-foreground/15">
            {message.timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.mode && (
            <Badge
              variant="secondary"
              className="text-[8px] font-mono px-1.5 py-0"
            >
              {message.mode.toUpperCase()}
            </Badge>
          )}
          {message.model_used && (
            <Badge
              variant="outline"
              className="text-[8px] font-mono px-1.5 py-0 text-foreground/30 border-foreground/10"
            >
              {message.model_used}
            </Badge>
          )}
        </div>

        {/* Message body */}
        <div
          className={`
            max-w-full p-3 text-sm leading-relaxed
            ${isUser
              ? "bg-foreground/[0.08] border border-foreground/[0.12] text-foreground/90 font-mono text-xs"
              : "bg-foreground/[0.03] border border-foreground/[0.06] text-foreground/80"
            }
          `}
        >
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-foreground/40">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="text-xs font-mono">PROCESSING...</span>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-foreground/[0.03] prose-pre:border prose-pre:border-foreground/[0.06] prose-pre:rounded-none prose-code:font-mono prose-code:bg-foreground/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-headings:font-mono prose-headings:uppercase prose-a:text-emerald-500 hover:prose-a:text-emerald-400 break-words">
              {message.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span className="text-foreground/25 italic">No response generated</span>
              )}
            </div>
          )}
        </div>

        {/* Assistant extras */}
        {!isUser && (
          <div className="flex flex-col gap-2 w-full">
            {/* Evaluation */}
            <EvaluationBadge
              evaluation={message.evaluation ?? null}
              score={message.score}
              attempts={message.attempts}
            />

            {/* Refined query */}
            {message.refined_query && (
              <div className="text-[10px] font-mono text-foreground/30">
                <span className="text-foreground/20">REFINED: </span>
                {message.refined_query}
              </div>
            )}

            {/* Agent trace */}
            <AgentTrace
              trace={message.trace ?? []}
              isStreaming={message.isStreaming}
            />

            {/* Sources */}
            <SourceCitations items={message.retrieved ?? []} />
          </div>
        )}
      </div>
    </div>
  );
}
