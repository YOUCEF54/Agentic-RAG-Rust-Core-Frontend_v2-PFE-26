"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Cpu, Loader2, Play, AlertCircle } from "lucide-react";
import { useHardware } from "@/hooks/useHardware";

export function HardwareSettings() {
  const hardware = useHardware();

  useEffect(() => {
    hardware.fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-[1.4px] text-foreground/70">
          Hardware Calibration
        </h3>
        {hardware.config?.active_embed_batch_size && (
          <Badge variant="outline" className="font-mono text-[10px] bg-foreground/5 border-foreground/10">
            BATCH: {hardware.config.active_embed_batch_size}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 p-3 border border-foreground/[0.08] bg-foreground/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-foreground/40" />
            <span className="text-[10px] font-mono text-foreground/60 uppercase">Run Calibration</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={hardware.isCalibrating}
            onClick={() => hardware.runCalibration({ save_config: true, quick_mode: true })}
            className="h-7 text-[10px] font-mono uppercase px-2"
          >
            {hardware.isCalibrating ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
            ) : (
              <Play className="h-3 w-3 mr-1.5" />
            )}
            {hardware.isCalibrating ? "Testing..." : "Test"}
          </Button>
        </div>

        {hardware.error && (
          <div className="flex items-center gap-2 text-xs text-red-400 font-mono mt-1">
            <AlertCircle className="h-3 w-3" />
            {hardware.error}
          </div>
        )}

        {hardware.lastCalibration?.hardware_calibration && (
          <div className="mt-2 pt-2 border-t border-foreground/[0.06] flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">Last Result</span>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-foreground/50">Optimal Batch Size:</span>
              <span className="text-emerald-400">{hardware.lastCalibration.hardware_calibration.optimal_batch_size as number}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-foreground/50">Throughput:</span>
              <span className="text-foreground/80">
                {Number(hardware.lastCalibration.hardware_calibration.throughput_measured).toFixed(2)} items/s
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
