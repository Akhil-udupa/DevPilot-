import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  ArrowRight,
  GitBranch,
  Flame,
  Zap,
  Clock
} from 'lucide-react';
import { AgentState, TelemetryLog, CodeDiff } from '../types';

interface AgentWorkspaceProps {
  agent: AgentState | null;
  logs: TelemetryLog[];
  onDispatchPrompt: (prompt: string) => Promise<CodeDiff | void>;
  onInspectDiff: (diffId: string) => void;
  isDispatching: boolean;
}

export const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({
  agent,
  logs,
  onDispatchPrompt,
  onInspectDiff,
  isDispatching,
}) => {
  const [prompt, setPrompt] = useState('');
  const [lastSynthesizedPatch, setLastSynthesizedPatch] = useState<CodeDiff | null>(null);

  const quickPrompts = [
    {
      label: 'Asymmetric RSA-256 Auth',
      prompt: 'Refactor auth middleware in services/auth_jwt.py to asymmetric RSA-256 with thread-safe public key cache and expiration verification.',
      tag: 'SECURITY'
    },
    {
      label: 'Worker Pool Backpressure',
      prompt: 'Mitigate worker thread saturation in workers/pool_manager.py using a bounded task queue and non-blocking backpressure drops.',
      tag: 'PERFORMANCE'
    },
    {
      label: 'Microsecond Telemetry Span',
      prompt: 'Export microsecond histogram metrics and span context to telemetry/metrics_collector.py with socket host identification.',
      tag: 'OBSERVABILITY'
    },
    {
      label: 'Distributed LRU Cache',
      prompt: 'Implement distributed tier-1 LRU cache with dogpile lock protection in cache/distributed_lru.py.',
      tag: 'ARCHITECTURE'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isDispatching) return;
    const patch = await onDispatchPrompt(prompt);
    if (patch) {
      setLastSynthesizedPatch(patch);
    }
    setPrompt('');
  };

  const handleQuickClick = async (p: string) => {
    setPrompt(p);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Autonomous Engine Status */}
      <div className="glass-panel rounded-lg p-5 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30 font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
                AUTONOMOUS SYNTHESIS CORE
              </span>
              <span className="font-mono text-xs text-[#94A3B8]">• Branch:</span>
              <span className="font-mono text-xs text-white bg-[#1E293B] px-2 py-0.5 rounded border border-white/[0.06]">
                {agent?.active_branch}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-headline font-bold text-white tracking-tight">
              Direct Agent Dispatch Plane
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-2xl">
              Instruct the DevPilot autonomous code engine to refactor modules, synthesize unified diffs, run AST validation, and stage patches for reviewer approval.
            </p>
          </div>

          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-3 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">Throughput</div>
              <div className="text-lg font-mono font-bold text-[#38BDF8] flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#0EA5E9]" />
                {agent?.throughput_tps} <span className="text-xs text-[#94A3B8] font-normal">t/s</span>
              </div>
            </div>
            <div className="border-l border-white/[0.08] pl-4">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">Latency P95</div>
              <div className="text-lg font-mono font-bold text-[#10B981] flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#10B981]" />
                {agent?.latency_ms} <span className="text-xs text-[#94A3B8] font-normal">ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Command Input */}
      <div className="glass-panel rounded-lg p-5 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#0EA5E9]" />
            <span className="font-mono text-xs text-[#DFE2EE] font-semibold tracking-wide">
              AGENT INSTRUCTION TERMINAL
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            Press Enter or click Run to trigger AST synthesis
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            <span className="absolute left-3.5 font-mono text-sm font-bold text-[#0EA5E9] select-none flex items-center gap-1">
              AI <span className="text-xs">✦</span>
            </span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Refactor auth middleware to verify RSA-256 signatures with caching..."
              disabled={isDispatching}
              className="w-full bg-[#0B0F17] border border-white/[0.1] rounded-md pl-14 pr-28 py-3 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] font-mono transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isDispatching || !prompt.trim()}
              className="absolute right-2 px-4 py-2 rounded bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-[#0B0F17] font-headline font-semibold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDispatching ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-[#0B0F17] border-t-transparent animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#0B0F17]" />
                  <span>Dispatch</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Trigger Chips */}
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] mb-2">
            Preset Operational Scenarios:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickClick(q.prompt)}
                className="flex items-start gap-2.5 p-2.5 rounded bg-[#181C24] hover:bg-[#1E293B] border border-white/[0.06] hover:border-[#0EA5E9]/40 text-left transition-colors group"
              >
                <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.05] text-[#38BDF8] border border-white/[0.08] shrink-0 mt-0.5">
                  {q.tag}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-headline font-semibold text-[#CBD5E1] group-hover:text-white truncate">
                    {q.label}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                    {q.prompt}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synthesized Patch Callout if available */}
      {lastSynthesizedPatch && (
        <div className="rounded-lg p-4 bg-[#111827] border border-[#10B981]/40 shadow-lg glow-emerald flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white">{lastSynthesizedPatch.file}</span>
                <span className="font-mono text-[10px] text-[#34D399]">+{lastSynthesizedPatch.additions}</span>
                <span className="font-mono text-[10px] text-[#F87171]">-{lastSynthesizedPatch.deletions}</span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">{lastSynthesizedPatch.summary}</p>
            </div>
          </div>

          <button
            onClick={() => onInspectDiff(lastSynthesizedPatch.id)}
            className="px-3.5 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] border border-white/[0.12] text-xs font-headline font-semibold text-white flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Review Staged Diff</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0EA5E9]" />
          </button>
        </div>
      )}

      {/* Real-time Agent Reasoning Stream */}
      <div className="glass-panel rounded-lg p-5 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <h3 className="font-headline font-semibold text-sm text-white tracking-tight">
              Autonomous Agent Telemetry & Reasoning Log
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            Engine: Python 3 AST & Synthesizer
          </span>
        </div>

        <div className="bg-[#0B0F17] rounded-md border border-white/[0.06] p-3 font-mono text-xs space-y-2 max-h-[360px] overflow-y-auto">
          {logs.map((log) => {
            const levelStyle =
              log.level === 'SUCCESS'
                ? 'text-[#34D399] bg-[#10B981]/10 border-[#10B981]/30'
                : log.level === 'WARNING'
                ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30'
                : log.level === 'ERROR'
                ? 'text-[#F87171] bg-[#EF4444]/10 border-[#EF4444]/30'
                : log.level === 'AGENT_PROMPT'
                ? 'text-[#38BDF8] bg-[#0EA5E9]/15 border-[#0EA5E9]/40'
                : 'text-[#94A3B8] bg-white/[0.05] border-white/[0.08]';

            return (
              <div key={log.id} className="flex items-start gap-2.5 py-1 hover:bg-white/[0.02] rounded px-1.5 transition-colors">
                <span className="text-[#88929B] text-[11px] shrink-0">{log.timestamp}</span>
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-semibold tracking-wider shrink-0 ${levelStyle}`}>
                  {log.source}
                </span>
                <span className="text-[#DFE2EE] break-words">{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
