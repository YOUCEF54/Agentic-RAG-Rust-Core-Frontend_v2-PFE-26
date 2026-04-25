"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Trash2, MessageSquare } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import type { ChatMessage, StreamState } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  streamState: StreamState;
  isStreaming: boolean;
  indexReady: boolean;
  isDevMode: boolean;
  onSend: (message: string) => void;
  onCancel: () => void;
  onClear: () => void;
}

const STATE_LABELS: Partial<Record<StreamState, string>> = {
  connecting: "CONNECTING...",
  started: "STARTED",
  retrieving: "RETRIEVING CHUNKS...",
  tracing: "AGENT THINKING...",
  answering: "GENERATING ANSWER...",
  evaluating: "EVALUATING...",
  retrying: "RETRYING...",
};

export function ChatPanel({
  messages,
  streamState,
  isStreaming,
  indexReady,
  isDevMode,
  onSend,
  onCancel,
  onClear,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  // Only auto-scroll when user sends a new message (not during agent traces)
  useEffect(() => {
    if (streamState === "connecting") {
      userScrolledUp.current = false;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamState]);

  // Scroll to bottom when a final answer arrives
  useEffect(() => {
    if (streamState === "done" && !userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamState]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.08]">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-4 w-4 text-foreground/40" />
          <h2 className="text-sm font-mono uppercase tracking-[2px] text-foreground/80">
            Chat
          </h2>
          {isStreaming && (
            <Badge className="font-mono text-[9px] bg-amber-500/20 text-amber-400 gap-1 animate-pulse">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
              {STATE_LABELS[streamState] ?? "PROCESSING"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={isStreaming}
              className="text-[10px] font-mono uppercase tracking-wider text-foreground/30 hover:text-foreground/60 h-7 px-2"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              CLEAR
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        ref={scrollAreaRef}
        onScroll={() => {
          // Detect if user scrolled up
          const el = scrollAreaRef.current;
          if (el) {
            const { scrollTop, scrollHeight, clientHeight } = el;
            userScrolledUp.current =
              scrollHeight - scrollTop - clientHeight > 100;
          }
        }}
      >
        <div className="flex flex-col gap-6 p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-16 w-16 border border-foreground/[0.08] flex items-center justify-center bg-foreground/[0.02]">
                <MessageSquare className="h-8 w-8 text-foreground/[0.12]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-mono text-foreground/30 uppercase tracking-wider">
                  No messages yet
                </p>
                <p className="text-xs text-foreground/15 mt-1">
                  Upload documents, build the index, and ask a question
                </p>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isDevMode={isDevMode} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSend}
        onCancel={onCancel}
        isStreaming={isStreaming}
        disabled={!indexReady}
      />
    </div>
  );
}
