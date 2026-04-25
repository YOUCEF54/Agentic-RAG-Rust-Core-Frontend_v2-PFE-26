"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuerySettings } from "@/lib/types";

interface QuerySettingsProps {
  settings: QuerySettings;
  onChange: (settings: QuerySettings) => void;
  disabled?: boolean;
}

export function QuerySettingsPanel({
  settings,
  onChange,
  disabled,
}: QuerySettingsProps) {
  const update = <K extends keyof QuerySettings>(
    key: K,
    value: QuerySettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-mono uppercase tracking-[1.4px] text-foreground/70">
        Query Settings
      </h3>



      {/* Use LLM toggle */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono uppercase text-foreground/40 tracking-wide">
          Use LLM
        </label>
        <Switch
          checked={settings.use_llm}
          onCheckedChange={(v) => update("use_llm", v)}
          disabled={disabled}
        />
      </div>

      {/* Top K */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase text-foreground/40 tracking-wide">
            Top K Results
          </label>
          <span className="text-xs font-mono text-foreground/60">
            {settings.top_k}
          </span>
        </div>
        <Slider
          value={[settings.top_k]}
          onValueChange={(v) => update("top_k", Array.isArray(v) ? v[0] : v)}
          min={1}
          max={10}
          step={1}
          disabled={disabled}
        />
      </div>

      {/* Min Score */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono uppercase text-foreground/40 tracking-wide">
              Min Score
            </label>
            <span className="text-xs font-mono text-foreground/60">
              {settings.min_score.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[settings.min_score]}
            onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v; update("min_score", Math.round(val * 10) / 10); }}
            min={0}
            max={1}
            step={0.1}
            disabled={disabled}
          />
        </div>


      {/* Max Attempts */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono uppercase text-foreground/40 tracking-wide">
              Max Attempts
            </label>
            <span className="text-xs font-mono text-foreground/60">
              {settings.max_attempts}
            </span>
          </div>
          <Slider
            value={[settings.max_attempts]}
            onValueChange={(v) => update("max_attempts", Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            disabled={disabled}
          />
        </div>


      {/* Return Trace toggle */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono uppercase text-foreground/40 tracking-wide">
          Return Trace
        </label>
        <Switch
          checked={settings.return_trace}
          onCheckedChange={(v) => update("return_trace", v)}
          disabled={disabled}
        />
      </div>


    </div>
  );
}
