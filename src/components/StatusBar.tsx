"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Database, Cpu } from "lucide-react";
import type { HealthResponse, IndexStatusResponse } from "@/lib/types";

interface StatusBarProps {
  health: HealthResponse | null;
  isOnline: boolean;
  indexStatus: IndexStatusResponse | null;
}

export function StatusBar({ health, isOnline, indexStatus }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-foreground/[0.06] bg-foreground/[0.02] shrink-0">
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <Wifi className="h-3 w-3 text-emerald-400" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-400" />
          )}
          <span
            className={`text-[10px] font-mono uppercase ${
              isOnline ? "text-emerald-400/70" : "text-red-400/70"
            }`}
          >
            {isOnline ? "CONNECTED" : "OFFLINE"}
          </span>
        </div>

        {/* Index status */}
        {indexStatus && (
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3 text-foreground/20" />
            <span className="text-[10px] font-mono text-foreground/30 uppercase">
              INDEX: {indexStatus.status}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Embed engine */}
        {health && (
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-foreground/15" />
            <span className="text-[10px] font-mono text-foreground/20">
              {health.chunking}
            </span>
          </div>
        )}

        {/* Version badge */}
        <Badge
          variant="outline"
          className="text-[8px] font-mono px-1.5 py-0 text-foreground/15 border-foreground/[0.06]"
        >
          v1.0
        </Badge>
      </div>
    </div>
  );
}
