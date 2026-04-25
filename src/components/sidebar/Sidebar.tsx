"use client";

import React from "react";

import { Separator } from "@/components/ui/separator";
import { DocumentManager } from "./DocumentManager";
import { IndexControls } from "./IndexControls";
import { QuerySettingsPanel } from "./QuerySettings";
import { HardwareSettings } from "./HardwareSettings";
import type { DocumentMeta, IndexStatusResponse, IndexBuildInfo, QuerySettings } from "@/lib/types";

interface SidebarProps {
  // Documents
  documents: DocumentMeta[];
  isUploading: boolean;
  isDeleting: string | null;
  docError: string | null;
  onUpload: (files: File[]) => Promise<unknown>;
  onDelete: (filename: string) => Promise<unknown>;
  // Index
  indexStatus: IndexStatusResponse | null;
  isBuilding: boolean;
  lastBuild: IndexBuildInfo | null;
  indexError: string | null;
  needsReindex: boolean;
  onBuildIndex: () => void;
  // Settings
  settings: QuerySettings;
  onSettingsChange: (settings: QuerySettings) => void;
  isStreaming: boolean;
}

export function Sidebar({
  documents,
  isUploading,
  isDeleting,
  docError,
  onUpload,
  onDelete,
  indexStatus,
  isBuilding,
  lastBuild,
  indexError,
  needsReindex,
  onBuildIndex,
  settings,
  onSettingsChange,
  isStreaming,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full border-r border-foreground/[0.08] bg-foreground/[0.02]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-foreground/[0.08]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <h2 className="text-sm font-mono uppercase tracking-[2px] text-foreground/80">
            RAG Engine
          </h2>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-4">
          <DocumentManager
            documents={documents}
            isUploading={isUploading}
            isDeleting={isDeleting}
            error={docError}
            onUpload={onUpload}
            onDelete={onDelete}
          />

          <Separator className="my-3 bg-foreground/[0.08]" />

          <IndexControls
            status={indexStatus}
            isBuilding={isBuilding}
            lastBuild={lastBuild}
            error={indexError}
            needsReindex={needsReindex}
            onBuild={onBuildIndex}
          />

          <Separator className="my-3 bg-foreground/[0.08]" />

          <HardwareSettings />

          <Separator className="my-3 bg-foreground/[0.08]" />

          <QuerySettingsPanel
            settings={settings}
            onChange={onSettingsChange}
            disabled={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
