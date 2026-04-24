"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Upload,
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { DocumentMeta } from "@/lib/types";

interface DocumentManagerProps {
  documents: DocumentMeta[];
  isUploading: boolean;
  isDeleting: string | null;
  error: string | null;
  onUpload: (files: File[]) => Promise<unknown>;
  onDelete: (filename: string) => Promise<unknown>;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function DocumentManager({
  documents,
  isUploading,
  isDeleting,
  error,
  onUpload,
  onDelete,
}: DocumentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const pdfs = Array.from(fileList).filter(
        (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
      );
      if (pdfs.length > 0) onUpload(pdfs);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-[1.4px] text-foreground/70">
          Documents
        </h3>
        <Badge variant="secondary" className="font-mono text-[10px]">
          {documents.length} FILE{documents.length !== 1 ? "S" : ""}
        </Badge>
      </div>

      {/* Drop Zone */}
      <div
        className={`
          relative border border-dashed transition-all cursor-pointer
          flex flex-col items-center justify-center gap-2 py-6 px-4
          ${isDragOver
            ? "border-foreground/40 bg-foreground/[0.06]"
            : "border-foreground/[0.15] hover:border-foreground/30 hover:bg-foreground/[0.03]"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
        ) : (
          <Upload className="h-5 w-5 text-foreground/40" />
        )}
        <span className="text-xs text-foreground/50 font-mono">
          {isUploading ? "UPLOADING..." : "DROP PDF FILES HERE"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {/* File List */}
      <div className="max-h-[240px] overflow-y-auto">
        <div className="flex flex-col gap-1">
          {documents.map((doc) => (
            <div
              key={doc.filename}
              className="group flex items-center gap-2 py-2 px-2 hover:bg-foreground/[0.04] transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-foreground/80 truncate">
                  {doc.filename}
                </p>
                <p className="text-[10px] text-foreground/30 font-mono">
                  {formatBytes(doc.size_bytes)}
                  {doc.pages != null && ` · ${doc.pages} pg`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doc.filename);
                }}
                disabled={isDeleting === doc.filename}
              >
                {isDeleting === doc.filename ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3 text-foreground/40 hover:text-red-400" />
                )}
              </Button>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-xs text-foreground/25 font-mono text-center py-4">
              NO DOCUMENTS
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
