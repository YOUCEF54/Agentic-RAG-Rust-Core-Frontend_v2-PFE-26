import { useState, useCallback } from "react";
import { getHardwareConfig, calibrateHardware } from "@/lib/api";
import type { HardwareConfigResponse, CalibrateResponse } from "@/lib/types";

export function useHardware() {
  const [config, setConfig] = useState<HardwareConfigResponse | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCalibration, setLastCalibration] = useState<CalibrateResponse | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await getHardwareConfig();
      setConfig(res);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch hardware config:", err);
      // Don't show error to user since config might just not exist yet
    }
  }, []);

  const runCalibration = useCallback(async (opts?: {
    save_config?: boolean;
    quick_mode?: boolean;
    max_runtime_seconds?: number;
  }) => {
    setIsCalibrating(true);
    setError(null);
    try {
      const res = await calibrateHardware(opts);
      setLastCalibration(res);
      await fetchConfig();
    } catch (err: any) {
      setError(err.message || "Failed to run calibration");
    } finally {
      setIsCalibrating(false);
    }
  }, [fetchConfig]);

  return {
    config,
    isCalibrating,
    error,
    lastCalibration,
    fetchConfig,
    runCalibration,
  };
}
