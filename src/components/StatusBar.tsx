"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Database, Cpu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { HealthResponse, IndexStatusResponse } from "@/lib/types";

interface StatusBarProps {
  health: HealthResponse | null;
  isOnline: boolean;
  indexStatus: IndexStatusResponse | null;
  isDevMode: boolean;
  onDevModeChange: (isDevMode: boolean) => void;
}

export function StatusBar({ health, isOnline, indexStatus, isDevMode, onDevModeChange }: StatusBarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

        {/* Dev Mode Toggle */}
        <div className="flex items-center gap-1.5 ml-2 border-l border-foreground/[0.08] pl-3">
          <span className={`text-[10px] font-mono uppercase ${isDevMode ? "text-emerald-400" : "text-foreground/30"}`}>
            DEV
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-8 text-foreground/40 hover:text-foreground/80 hover:bg-foreground/5 relative"
            onClick={() => onDevModeChange(!isDevMode)}
          >
            <div className={`w-6 h-3 rounded-full border transition-colors ${isDevMode ? "border-emerald-500/50 bg-emerald-500/10" : "border-foreground/20 bg-foreground/5"}`}>
              <div className={`h-2 w-2 rounded-full mt-[1px] transition-all ${isDevMode ? "ml-[13px] bg-emerald-400" : "ml-[1px] bg-foreground/30"}`} />
            </div>
          </Button>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-2 text-foreground/40 hover:text-foreground/80 hover:bg-foreground/5"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {mounted && (
            <>
              <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

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
