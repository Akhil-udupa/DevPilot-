import React, { useState } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Gauge, 
  Activity, 
  Server,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { DeploymentPipeline, PipelineStage } from '../types';

interface PipelineOrchestratorProps {
  pipeline: DeploymentPipeline | null;
  onRunPipeline: () => Promise<void>;
  isRunning: boolean;
}

export const PipelineOrchestrator: React.FC<PipelineOrchestratorProps> = ({
  pipeline,
  onRunPipeline,
  isRunning,
}) => {
  const [expandedStage, setExpandedStage] = useState<string | null>('stage-ast');

  const toggleExpand = (id: string) => {
    setExpandedStage(expandedStage === id ? null : id);
  };

  const getStatusBadge = (status: PipelineStage['status']) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/30 font-mono text-[10px] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Passed
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-mono text-[10px] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
            Running
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#F87171] border border-[#EF4444]/30 font-mono text-[10px] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05] text-[#94A3B8] border border-white/[0.1] font-mono text-[10px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
            Queued
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Header */}
      <div className="glass-panel rounded-lg p-5 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-bold">
              CI/CD AUTOMATION ENGINE
            </span>
            <span className="font-mono text-xs text-[#94A3B8]">• Last Run: {pipeline?.last_run || 'Just now'}</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-white tracking-tight">
            Automated Patch Verification & Canary Pipeline
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5 max-w-xl">
            Executes real Python 3 AST parsing, interface contracts, security scan, regression tests, and canary traffic monitoring before commit promotion.
          </p>
        </div>

        <button
          onClick={onRunPipeline}
          disabled={isRunning}
          className="px-5 py-2.5 rounded bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-[#0B0F17] font-headline font-semibold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shrink-0"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0B0F17]" />
              <span>Verifying Stages...</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 text-[#0B0F17]" />
              <span>Trigger Full Verification</span>
            </>
          )}
        </button>
      </div>

      {/* Canary Health Diagnostics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] rounded-lg p-4 border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] mb-1">Canary Allocation</div>
          <div className="text-xl font-headline font-bold text-[#38BDF8] flex items-center justify-between">
            <span>10.0%</span>
            <Gauge className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Edge node: asia-east1-a</div>
        </div>

        <div className="bg-[#111827] rounded-lg p-4 border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] mb-1">Error Rate Divergence</div>
          <div className="text-xl font-headline font-bold text-[#34D399] flex items-center justify-between">
            <span>0.000%</span>
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Baseline: 0.002% (Healthy)</div>
        </div>

        <div className="bg-[#111827] rounded-lg p-4 border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] mb-1">Latency P99 Delta</div>
          <div className="text-xl font-headline font-bold text-[#38BDF8] flex items-center justify-between">
            <span>-12.4%</span>
            <Activity className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">28.4ms (Speedup from cache)</div>
        </div>

        <div className="bg-[#111827] rounded-lg p-4 border border-white/[0.08]">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] mb-1">AST Tree Grammar</div>
          <div className="text-xl font-headline font-bold text-[#34D399] flex items-center justify-between">
            <span>100% OK</span>
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Python 3.10 Compliance</div>
        </div>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="space-y-3">
        {pipeline?.stages.map((stage, index) => {
          const isExpanded = expandedStage === stage.id;
          return (
            <div
              key={stage.id}
              className="bg-[#111827] rounded-lg border border-white/[0.08] overflow-hidden transition-all hover:border-white/[0.14]"
            >
              <div
                onClick={() => toggleExpand(stage.id)}
                className="px-4 py-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center font-mono text-xs text-[#94A3B8] border border-white/[0.06]">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-headline font-semibold text-white flex items-center gap-2">
                      {stage.name}
                      {getStatusBadge(stage.status)}
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-0.5">{stage.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{stage.duration_ms}ms</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </div>
              </div>

              {/* Expanded Stage Log Console */}
              {isExpanded && (
                <div className="bg-[#0B0F17] p-4 border-t border-white/[0.06] font-mono text-xs">
                  <div className="text-[10px] uppercase text-[#94A3B8] mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>STAGE EXECUTION STREAM</span>
                  </div>
                  <div className="space-y-1 text-[#CBD5E1]">
                    {stage.logs.map((logLine, lIdx) => (
                      <div
                        key={lIdx}
                        className={`leading-relaxed ${
                          logLine.includes('PASSED') || logLine.includes('succeeded') || logLine.includes('verified')
                            ? 'text-[#34D399]'
                            : logLine.includes('ERROR') || logLine.includes('failed')
                            ? 'text-[#F87171]'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {logLine}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
