"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Square, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onCancel, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [value]);

  return (
    <div className="border-t border-foreground/[0.08] p-3 bg-background">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "INDEX NOT READY" : "ASK A QUESTION..."}
          rows={1}
          disabled={isStreaming || disabled}
          className="flex-1 resize-none bg-foreground/[0.03] border border-foreground/[0.1] px-3 py-2.5 text-sm font-mono text-foreground/90 placeholder:text-foreground/20 focus:outline-none focus:border-foreground/[0.25] transition-colors disabled:opacity-40"
        />
        {isStreaming ? (
          <Button
            onClick={onCancel}
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
