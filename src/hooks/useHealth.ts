"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getHealth } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";

export function useHealth(pollIntervalMs = 15000) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async () => {
    try {
      const data = await getHealth();
      setHealth(data);
      setIsOnline(true);
      setError(null);
    } catch (err) {
      setIsOnline(false);
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }, []);

  useEffect(() => {
    check();
    intervalRef.current = setInterval(check, pollIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [check, pollIntervalMs]);

  return { health, isOnline, error, refresh: check };
}
