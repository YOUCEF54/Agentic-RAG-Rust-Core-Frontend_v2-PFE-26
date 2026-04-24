"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { StatusBar } from "@/components/StatusBar";
import { useHealth } from "@/hooks/useHealth";
import { useDocuments } from "@/hooks/useDocuments";
import { useIndex } from "@/hooks/useIndex";
import { useChat } from "@/hooks/useChat";

export default function HomePage() {
  const health = useHealth();
  const docs = useDocuments();
  const index = useIndex();
  const chat = useChat();

  // Resizable layout
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setSidebarWidth(Math.max(280, Math.min(x, 500)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Load documents and index status on mount
  useEffect(() => {
    docs.refresh();
    index.checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuild = useCallback(async () => {
    try {
      await index.build({ rebuild: true });
      docs.setNeedsReindex(false);
    } catch {
      // Error handled in hook
    }
  }, [index, docs]);

  const indexReady = index.status?.ready ?? false;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main body */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          style={{ width: sidebarWidth, minWidth: sidebarWidth }}
          className="shrink-0 h-full overflow-hidden"
        >
          <Sidebar
            documents={docs.documents}
            isUploading={docs.isUploading}
            isDeleting={docs.isDeleting}
            docError={docs.error}
            onUpload={docs.upload}
            onDelete={docs.remove}
            indexStatus={index.status}
            isBuilding={index.isBuilding}
            lastBuild={index.lastBuild}
            indexError={index.error}
            needsReindex={docs.needsReindex}
            onBuildIndex={handleBuild}
            settings={chat.settings}
            onSettingsChange={chat.setSettings}
            isStreaming={chat.isStreaming}
          />
        </div>

        {/* Resizer */}
        <div
          onMouseDown={onMouseDown}
          className="w-[3px] cursor-col-resize hover:bg-foreground/[0.15] active:bg-foreground/[0.25] transition-colors shrink-0"
        />

        {/* Chat Panel */}
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <ChatPanel
            messages={chat.messages}
            streamState={chat.streamState}
            isStreaming={chat.isStreaming}
            indexReady={indexReady}
            onSend={chat.sendQuery}
            onCancel={chat.cancelStream}
            onClear={chat.clearChat}
          />
        </div>
      </div>

      {/* Status bar */}
      <StatusBar
        health={health.health}
        isOnline={health.isOnline}
        indexStatus={index.status}
      />
    </div>
  );
}
