"use client";

import { useState, useCallback, useRef } from "react";
import { streamQuery } from "@/lib/stream";
import type {
  ChatMessage,
  StreamState,
  QuerySettings,
  SSEEvent,
  RetrievedItem,
  SSEEvaluationEvent,
} from "@/lib/types";

let messageIdCounter = 0;
function genId(): string {
  return `msg-${Date.now()}-${messageIdCounter++}`;
}

const DEFAULT_SETTINGS: QuerySettings = {
  mode: "agentic",
  use_llm: true,
  top_k: 3,
  min_score: 0.7,
  max_attempts: 3,
  chat_model: null,
  return_trace: true,
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamState, setStreamState] = useState<StreamState>("idle");
  const [settings, setSettings] = useState<QuerySettings>(DEFAULT_SETTINGS);
  const abortRef = useRef<AbortController | null>(null);

  const sendQuery = useCallback(
    (question: string) => {
      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        content: question,
        timestamp: new Date(),
      };

      const assistantId = genId();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: null,
        timestamp: new Date(),
        retrieved: [],
        trace: [],
        evaluation: null,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreamState("connecting");

      const updateAssistant = (
        updater: (msg: ChatMessage) => ChatMessage
      ) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? updater(m) : m))
        );
      };

      const controller = streamQuery(
        {
          question,
          top_k: settings.top_k,
          chat_model: settings.chat_model,
          use_llm: settings.use_llm,
          mode: settings.mode,
          return_trace: settings.return_trace,
          min_score: settings.min_score,
          max_attempts: settings.max_attempts,
        },
        (event: SSEEvent) => {
          switch (event.type) {
            case "status":
              setStreamState("started");
              break;
            case "retrieved":
              setStreamState("retrieving");
              updateAssistant((m) => ({
                ...m,
                retrieved: event.data.items as RetrievedItem[],
              }));
              break;
            case "trace":
              setStreamState("tracing");
              updateAssistant((m) => ({
                ...m,
                trace: [...(m.trace ?? []), event.data as Record<string, unknown>],
              }));
              break;
            case "answer":
              setStreamState("answering");
              updateAssistant((m) => ({
                ...m,
                content: event.data.answer ?? m.content,
                model_used: event.data.model_used,
              }));
              break;
            case "evaluation":
              setStreamState("evaluating");
              updateAssistant((m) => ({
                ...m,
                evaluation: event.data as SSEEvaluationEvent,
              }));
              break;
            case "retry":
              setStreamState("retrying");
              updateAssistant((m) => ({
                ...m,
                attempts: event.data.attempts,
                score: event.data.score,
              }));
              break;
            case "final":
              setStreamState("done");
              updateAssistant((m) => ({
                ...m,
                content: event.data.answer ?? m.content,
                model_used: event.data.model_used,
                mode: event.data.mode,
                refined_query: event.data.refined_query,
                score: event.data.score,
                attempts: event.data.attempts,
                retrieved: event.data.retrieved ?? m.retrieved,
                isStreaming: false,
              }));
              break;
          }
        },
        (error: Error) => {
          setStreamState("error");
          updateAssistant((m) => ({
            ...m,
            content: `Error: ${error.message}`,
            isStreaming: false,
          }));
        },
        () => {
          setStreamState("done");
          updateAssistant((m) => ({ ...m, isStreaming: false }));
        }
      );

      abortRef.current = controller;
    },
    [settings]
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setStreamState("idle");
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
  }, []);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamState("idle");
  }, []);

  const isStreaming = streamState !== "idle" && streamState !== "done" && streamState !== "error";

  return {
    messages,
    streamState,
    isStreaming,
    settings,
    setSettings,
    sendQuery,
    cancelStream,
    clearChat,
  };
}
