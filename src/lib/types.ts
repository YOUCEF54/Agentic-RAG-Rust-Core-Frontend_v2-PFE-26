// ─── API Request / Response Types ─────────────────────────────────────────────

export type IndexRequest = {
  rebuild?: boolean;
  max_pages?: number | null;
  run_hardware_test?: boolean;
  save_hardware_config?: boolean;
  hardware_quick_test?: boolean;
  hardware_max_runtime_seconds?: number;
};

export type QueryRequest = {
  question: string;
  top_k?: number;
  chat_model?: string | null;
  use_llm?: boolean;
  mode?: "agentic" | "naive";
  return_trace?: boolean;
  min_score?: number;
  max_attempts?: number;
};

export type RetrievedItem = {
  text: string;
  distance: number;
  source: string;
  page: number;
};

export type QueryResponse = {
  answer: string | null;
  model_used: string | null;
  retrieved: RetrievedItem[];
  mode?: string | null;
  refined_query?: string | null;
  score?: number | null;
  attempts?: number | null;
  trace?: Record<string, unknown>[] | null;
  models?: Record<string, string | null> | null;
};

export type DocumentMeta = {
  filename: string;
  size_bytes: number;
  uploaded_at?: string | null;
  updated_at?: string | null;
  sha256?: string | null;
  indexed_sha256?: string | null;
  pages?: number | null;
};

// ─── Backend Responses ────────────────────────────────────────────────────────

export type HealthResponse = {
  status: string;
  chunking: string;
  embed_batch_size: number;
  hardware_config_mtime: number;
};

export type UploadResponse = {
  saved: string[];
  needs_reindex: boolean;
};

export type DocumentsListResponse = {
  files: string[];
  documents: DocumentMeta[];
};

export type DeleteResponse = {
  deleted: string;
  index_ready: boolean;
  index_cleared?: boolean;
  needs_reindex?: boolean;
  index?: IndexBuildInfo;
};

export type IndexBuildInfo = {
  pages: number;
  chunks: number;
  rebuild: boolean;
  chunking: string;
  embed_batch_size: number;
  build_ms: number;
  hardware_calibration?: Record<string, unknown>;
};

export type IndexStatusResponse = {
  status: "idle" | "building" | "ready" | "stale" | "error";
  ready: boolean;
  info: {
    last_build_at: string | null;
    last_build_ms: number | null;
    pages: number | null;
    chunks: number | null;
    last_error: string | null;
    chunking: string | null;
    embed_batch_size: number | null;
    embed_engine: string | null;
    hardware_config_mtime: number | null;
  };
};

export type HardwareConfigResponse = {
  config: Record<string, unknown>;
  active_embed_batch_size: number;
  config_path: string;
  hardware_config_mtime: number;
};

export type CalibrateResponse = {
  hardware_calibration: Record<string, unknown>;
  active_embed_batch_size: number;
  hardware_config_mtime: number;
};

// ─── SSE Event Types ──────────────────────────────────────────────────────────

export type SSEStatusEvent = { state: string };
export type SSERetrievedEvent = { items: RetrievedItem[] };
export type SSEAnswerEvent = { answer: string | null; model_used: string | null };
export type SSEEvaluationEvent = {
  score: number | null;
  summary: string | null;
  should_retry: boolean;
  attempts: number;
};
export type SSERetryEvent = { attempts: number; score: number | null };
export type SSEFinalEvent = QueryResponse;

export type SSEEvent =
  | { type: "status"; data: SSEStatusEvent }
  | { type: "retrieved"; data: SSERetrievedEvent }
  | { type: "trace"; data: Record<string, unknown> }
  | { type: "answer"; data: SSEAnswerEvent }
  | { type: "evaluation"; data: SSEEvaluationEvent }
  | { type: "retry"; data: SSERetryEvent }
  | { type: "final"; data: SSEFinalEvent };

// ─── UI State Types ───────────────────────────────────────────────────────────

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string | null;
  timestamp: Date;
  retrieved?: RetrievedItem[];
  trace?: Record<string, unknown>[];
  evaluation?: SSEEvaluationEvent | null;
  mode?: string | null;
  model_used?: string | null;
  refined_query?: string | null;
  score?: number | null;
  attempts?: number | null;
  isStreaming?: boolean;
};

export type StreamState =
  | "idle"
  | "connecting"
  | "started"
  | "retrieving"
  | "tracing"
  | "answering"
  | "evaluating"
  | "retrying"
  | "done"
  | "error";

export type QuerySettings = {
  mode: "agentic" | "naive";
  use_llm: boolean;
  top_k: number;
  min_score: number;
  max_attempts: number;
  chat_model: string | null;
  return_trace: boolean;
};
