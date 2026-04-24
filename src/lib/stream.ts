import type { QueryRequest, SSEEvent } from "./types";
import { API_BASE } from "./api";

/**
 * Streams a POST /query/stream SSE response.
 * Calls the `onEvent` callback for each parsed event.
 * Returns an AbortController so the caller can cancel the stream.
 */
export function streamQuery(
  req: QueryRequest,
  onEvent: (event: SSEEvent) => void,
  onError: (error: Error) => void,
  onDone: () => void
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/query/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controller.signal,
      });

      if (!res.ok) {
        let msg = res.statusText;
        try {
          const body = await res.json();
          msg = body.detail ?? body.message ?? JSON.stringify(body);
        } catch { /* ignore */ }
        throw new Error(`Stream error ${res.status}: ${msg}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE lines
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let currentEventType: string | null = null;

        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEventType = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            const dataStr = line.slice(5).trim();
            if (dataStr && currentEventType) {
              try {
                const data = JSON.parse(dataStr);
                onEvent({
                  type: currentEventType as SSEEvent["type"],
                  data,
                } as SSEEvent);
              } catch {
                // skip malformed JSON
              }
              currentEventType = null;
            }
          } else if (line.trim() === "") {
            currentEventType = null;
          }
        }
      }

      onDone();
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        onError(err as Error);
      }
    }
  })();

  return controller;
}
