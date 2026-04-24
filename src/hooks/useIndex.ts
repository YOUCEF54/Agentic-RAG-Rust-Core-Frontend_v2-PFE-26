"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { buildIndex, getIndexStatus } from "@/lib/api";
import type { IndexRequest, IndexStatusResponse, IndexBuildInfo } from "@/lib/types";

export function useIndex() {
  const [status, setStatus] = useState<IndexStatusResponse | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [lastBuild, setLastBuild] = useState<IndexBuildInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const data = await getIndexStatus();
      setStatus(data);
      if (data.status === "building") {
        setIsBuilding(true);
      } else {
        setIsBuilding(false);
      }
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check index status");
      return null;
    }
  }, []);

  const build = useCallback(async (options?: IndexRequest) => {
    setIsBuilding(true);
    setError(null);
    try {
      const result = await buildIndex(options);
      setLastBuild(result);
      await checkStatus();
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Build failed";
      setError(msg);
      throw err;
    } finally {
      setIsBuilding(false);
    }
  }, [checkStatus]);

  // Poll while building
  useEffect(() => {
    if (isBuilding) {
      pollRef.current = setInterval(checkStatus, 2000);
    } else if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isBuilding, checkStatus]);

  return {
    status,
    isBuilding,
    lastBuild,
    error,
    build,
    checkStatus,
  };
}
