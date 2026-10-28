import React from 'react';
import { AgentState, BackendHealth } from '../types';
import { Cpu, Terminal, ShieldCheck, Database, Layers, Zap } from 'lucide-react';

interface TelemetryBarProps {
  agent: AgentState | null;
  health: BackendHealth | null;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ agent, health }) => {
  const contextTokens = agent?.context_tokens_used || 28450;
  const maxTokens = agent?.context_tokens_max || 128000;
  const contextPercent = Math.min(100, Math.round((contextTokens / maxTokens) * 100));

  return (
    <div className="bg-[#111827]/70 backdrop-blur-sm border-b border-white/[0.06] px-4 lg:px-6 py-2 text-xs font-mono">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[#94A3B8]">
        
        {/* Left: Engine Model & Python Runtime */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#CBD5E1]">
            <Zap className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span className="text-white font-medium">{agent?.model_version || 'DevPilot Engine v3'}</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/[0.08] pl-3">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">Runtime:</span>
            <span className="text-[#38BDF8] bg-[#0EA5E9]/10 px-1.5 py-0.5 rounded border border-[#0EA5E9]/20">
              Python {health?.python_version || '3.10.12'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 border-l border-white/[0.08] pl-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>AST Validation: Active</span>
          </div>
        </div>

        {/* Right: Context Window & Task Metrics */}
        <div className="flex items-center gap-4 flex-wrap">
          
          {/* Context Window Utilization */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">Context:</span>
            <div className="w-20 sm:w-28 h-1.5 bg-[#1E293B] rounded-full overflow-hidden border border-white/[0.05]">
              <div 
                className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] transition-all duration-500 rounded-full"
                style={{ width: `${contextPercent}%` }}
              />
            </div>
            <span className="text-[#CBD5E1]">
              {(contextTokens / 1000).toFixed(1)}k / {(maxTokens / 1000).toFixed(0)}k ({contextPercent}%)
            </span>
          </div>

          {/* Tasks & Patches Stats */}
          <div className="hidden md:flex items-center gap-3 border-l border-white/[0.08] pl-3">
            <span className="flex items-center gap-1">
              <span className="text-[#10B981] font-semibold">{agent?.patches_applied || 0}</span>
              <span className="text-[#94A3B8]">patches merged</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#38BDF8] font-semibold">{agent?.tasks_completed || 0}</span>
              <span className="text-[#94A3B8]">tasks resolved</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
