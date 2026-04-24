"use client";

import { useState, useCallback } from "react";
import { uploadDocuments, listDocuments, deleteDocument } from "@/lib/api";
import type { DocumentMeta } from "@/lib/types";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsReindex, setNeedsReindex] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await listDocuments();
      setDocuments(data.documents);
      setFiles(data.files);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list documents");
    }
  }, []);

  const upload = useCallback(async (newFiles: File[]) => {
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadDocuments(newFiles);
      setNeedsReindex(res.needs_reindex);
      await refresh();
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [refresh]);

  const remove = useCallback(async (filename: string, rebuild = true) => {
    setIsDeleting(filename);
    setError(null);
    try {
      const res = await deleteDocument(filename, rebuild);
      if (res.needs_reindex) setNeedsReindex(true);
      await refresh();
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setError(msg);
      throw err;
    } finally {
      setIsDeleting(null);
    }
  }, [refresh]);

  return {
    documents,
    files,
    isUploading,
    isDeleting,
    error,
    needsReindex,
    upload,
    remove,
    refresh,
    setNeedsReindex,
  };
}
