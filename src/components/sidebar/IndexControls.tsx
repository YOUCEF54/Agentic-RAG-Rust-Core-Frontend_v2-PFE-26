"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import type { IndexStatusResponse, IndexBuildInfo } from "@/lib/types";

interface IndexControlsProps {
  status: IndexStatusResponse | null;
  isBuilding: boolean;
  lastBuild: IndexBuildInfo | null;
  error: string | null;
  needsReindex: boolean;
  onBuild: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  idle: {
    label: "IDLE",
    color: "bg-foreground/10 text-foreground/50",
    icon: <Clock className="h-3 w-3" />,
  },
  building: {
    label: "BUILDING",
    color: "bg-amber-500/20 text-amber-400",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  ready: {
    label: "READY",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  stale: {
    label: "STALE",
    color: "bg-amber-500/20 text-amber-400",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  error: {
    label: "ERROR",
    color: "bg-red-500/20 text-red-400",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

export function IndexControls({
  status,
  isBuilding,
  lastBuild,
  error,
  needsReindex,
  onBuild,
}: IndexControlsProps) {
  const statusKey = status?.status ?? "idle";
  const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.idle;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-[1.4px] text-foreground/70">
          Vector Index
        </h3>
        <Badge className={`font-mono text-[10px] gap-1 ${config.color}`}>
          {config.icon}
          {config.label}
        </Badge>
      </div>

      {/* Build stats */}
      {status?.info && (status.info.pages || status.info.chunks) && (
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center py-2 border border-foreground/[0.08] bg-foreground/[0.02]">
            <p className="text-lg font-mono font-semibold text-foreground/90">
              {status.info.pages ?? 0}
            </p>
            <p className="text-[10px] font-mono text-foreground/30 uppercase">
              Pages
            </p>
          </div>
          <div className="text-center py-2 border border-foreground/[0.08] bg-foreground/[0.02]">
            <p className="text-lg font-mono font-semibold text-foreground/90">
              {status.info.chunks ?? 0}
            </p>
            <p className="text-[10px] font-mono text-foreground/30 uppercase">
              Chunks
            </p>
          </div>
          <div className="text-center py-2 border border-foreground/[0.08] bg-foreground/[0.02]">
            <p className="text-lg font-mono font-semibold text-foreground/90">
              {status.info.last_build_ms
                ? (status.info.last_build_ms / 1000).toFixed(1) + "s"
                : "—"}
            </p>
            <p className="text-[10px] font-mono text-foreground/30 uppercase">
              Build
            </p>
          </div>
        </div>
      )}

      {/* Embed engine info */}
      {status?.info?.embed_engine && (
        <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/30">
          <Zap className="h-3 w-3" />
          <span>ENGINE: {status.info.embed_engine.toUpperCase()}</span>
          {status.info.embed_batch_size && (
            <span>· BATCH: {status.info.embed_batch_size}</span>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {needsReindex && statusKey !== "building" && (
        <div className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
          ⚡ DOCUMENTS CHANGED — REBUILD REQUIRED
        </div>
      )}

      <Button
        onClick={onBuild}
        disabled={isBuilding}
        className="w-full font-mono uppercase tracking-[1.4px] text-xs h-9"
      >
        {isBuilding ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
            BUILDING INDEX...
          </>
        ) : (
          <>
            <Database className="h-3.5 w-3.5 mr-2" />
            {needsReindex ? "REBUILD INDEX" : "BUILD INDEX"}
          </>
        )}
      </Button>

      {lastBuild && (
        <div className="text-[10px] font-mono text-foreground/25">
          LAST: {lastBuild.pages} pages, {lastBuild.chunks} chunks in{" "}
          {(lastBuild.build_ms / 1000).toFixed(1)}s ({lastBuild.chunking})
        </div>
      )}
    </div>
  );
}
