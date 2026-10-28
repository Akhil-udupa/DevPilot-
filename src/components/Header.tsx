import React, { useState } from 'react';
import { 
  Cpu, 
  GitBranch as GitBranchIcon, 
  Activity, 
  Terminal, 
  ChevronDown, 
  CheckCircle2, 
  Flame, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { AgentState, GitBranch, BackendHealth } from '../types';

interface HeaderProps {
  agent: AgentState | null;
  health: BackendHealth | null;
  branches: GitBranch[];
  onSelectBranch: (branch: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  agent,
  health,
  branches,
  onSelectBranch,
  onRefresh,
  isRefreshing
}) => {
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const statusColor = agent?.status === 'synthesizing' 
    ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20'
    : agent?.status === 'verifying'
    ? 'text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/20'
    : 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';

  const dotColor = agent?.status === 'synthesizing' 
    ? 'bg-[#F59E0B] animate-ping'
    : agent?.status === 'verifying'
    ? 'bg-[#0EA5E9] animate-pulse'
    : 'bg-[#10B981]';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-6 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-[#0B0F17] shadow-lg shadow-[#0EA5E9]/20 font-bold">
            <Cpu className="w-5 h-5 text-[#0B0F17]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                DEVPILOT
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#0EA5E9]/15 text-[#38BDF8] border border-[#0EA5E9]/30 tracking-wider">
                  PY-CORE
                </span>
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] hidden sm:block">Autonomous Code Engine & Deployment Telemetry</p>
          </div>
        </div>

        {/* Mid Diagnostics & Branch Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Active Branch Pill */}
          <div className="relative">
            <button
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#111827] border border-white/[0.08] hover:border-[#0EA5E9]/50 text-xs font-mono text-[#CBD5E1] transition-colors"
            >
              <GitBranchIcon className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">
                {agent?.active_branch || 'main'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {branchDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#1E293B] border border-white/[0.12] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] px-2 py-1 mb-1 border-b border-white/[0.06]">
                  Active Working Branches
                </div>
                {branches.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      onSelectBranch(b.name);
                      setBranchDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left text-xs font-mono transition-colors ${
                      b.name === agent?.active_branch
                        ? 'bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/30'
                        : 'text-[#CBD5E1] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {b.name === agent?.active_branch && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Engine Status Pill */}
          <div className={`hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${statusColor}`}>
            <span className="relative flex h-2 w-2">
              <span className={`rounded-full h-2 w-2 ${dotColor}`}></span>
            </span>
            <span>{agent?.status || 'HEALTHY'}</span>
          </div>

          {/* Telemetry Metrics */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono border-l border-white/[0.08] pl-3">
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <Activity className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{agent?.latency_ms ?? 34.2}ms</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <Flame className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{agent?.throughput_tps ?? 146.4} t/s</span>
            </div>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Sync telemetry from Python backend"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-[#1E293B] border border-white/[0.08] hover:border-white/[0.18] text-[#94A3B8] hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
};
