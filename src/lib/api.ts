import type {
  HealthResponse,
  UploadResponse,
  DocumentsListResponse,
  DeleteResponse,
  IndexBuildInfo,
  IndexRequest,
  IndexStatusResponse,
  HardwareConfigResponse,
  CalibrateResponse,
  QueryRequest,
  QueryResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body.detail ?? body.message ?? JSON.stringify(body);
    } catch { /* ignore parse failure */ }
    throw new ApiError(res.status, msg);
  }

  return res.json() as Promise<T>;
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function uploadDocuments(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  return request<UploadResponse>("/documents", {
    method: "POST",
    body: formData,
  });
}

export async function listDocuments(): Promise<DocumentsListResponse> {
  return request<DocumentsListResponse>("/documents");
}

export async function deleteDocument(
  filename: string,
  rebuildIndex = true
): Promise<DeleteResponse> {
  return request<DeleteResponse>(
    `/documents/${encodeURIComponent(filename)}?rebuild_index=${rebuildIndex}`
  , { method: "DELETE" });
}

// ─── Index ────────────────────────────────────────────────────────────────────

export async function buildIndex(
  options?: IndexRequest
): Promise<IndexBuildInfo> {
  return request<IndexBuildInfo>("/index", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options ?? {}),
  });
}

export async function getIndexStatus(): Promise<IndexStatusResponse> {
  return request<IndexStatusResponse>("/index/status");
}

// ─── Hardware ─────────────────────────────────────────────────────────────────

export async function getHardwareConfig(): Promise<HardwareConfigResponse> {
  return request<HardwareConfigResponse>("/hardware/config");
}

export async function calibrateHardware(opts?: {
  save_config?: boolean;
  quick_mode?: boolean;
  max_runtime_seconds?: number;
}): Promise<CalibrateResponse> {
  return request<CalibrateResponse>("/hardware/calibrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts ?? {}),
  });
}

// ─── Query (non-streaming) ────────────────────────────────────────────────────

export async function query(req: QueryRequest): Promise<QueryResponse> {
  return request<QueryResponse>("/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
}

export { ApiError, API_BASE };
