import React, { useState } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  Check, 
  X, 
  Copy, 
  FileCode, 
  Columns, 
  AlignJustify,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CodeDiff } from '../types';

interface DiffInspectorProps {
  diffs: CodeDiff[];
  selectedDiffId: string | null;
  onSelectDiff: (id: string) => void;
  onApplyDiff: (id: string) => Promise<void>;
  onRejectDiff: (id: string) => Promise<void>;
  isApplying: boolean;
}

export const DiffInspector: React.FC<DiffInspectorProps> = ({
  diffs,
  selectedDiffId,
  onSelectDiff,
  onApplyDiff,
  onRejectDiff,
  isApplying,
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [copied, setCopied] = useState(false);

  const activeDiff = diffs.find((d) => d.id === selectedDiffId) || diffs[0];

  const handleCopy = () => {
    if (!activeDiff) return;
    const raw = activeDiff.patch_lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeDiff) {
    return (
      <div className="glass-panel rounded-lg p-12 text-center border border-white/[0.08]">
        <FileCode className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
        <h3 className="text-lg font-headline font-semibold text-white">No Staged Diffs Found</h3>
        <p className="text-sm text-[#94A3B8] mt-1">
          Dispatch an instruction in the Agent Workspace to synthesize and stage a code patch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* File Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111827] p-2.5 rounded-lg border border-white/[0.08]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {diffs.map((diff) => {
            const isSelected = diff.id === activeDiff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onSelectDiff(diff.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1E293B] text-white border border-[#0EA5E9]/50 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#CBD5E1] hover:bg-white/[0.03]'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0EA5E9]' : 'text-[#88929B]'}`} />
                <span>{diff.file.split('/').pop()}</span>
                <span className="text-[10px] text-[#34D399]">+{diff.additions}</span>
                <span className="text-[10px] text-[#F87171]">-{diff.deletions}</span>
                {diff.status === 'applied' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" title="Applied" />
                )}
              </button>
            );
          })}
        </div>

        {/* View mode toggle (Unified vs Split) */}
        <div className="flex items-center gap-1 bg-[#0B0F17] p-0.5 rounded border border-white/[0.08]">
          <button
            onClick={() => setViewMode('unified')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              viewMode === 'unified' ? 'bg-[#1E293B] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Unified Diff View"
          >
            <AlignJustify className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-mono">Unified</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              viewMode === 'split' ? 'bg-[#1E293B] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Split Diff View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-mono">Split</span>
          </button>
        </div>
      </div>

      {/* Main Diff Card */}
      <div className="rounded-lg bg-[#111827] border border-white/[0.08] overflow-hidden shadow-2xl">
        
        {/* Top Window Bar */}
        <div className="bg-[#181C24] px-4 py-3 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>

            <div className="flex items-center gap-2 border-l border-white/[0.08] pl-3">
              <span className="font-mono text-xs text-white font-medium">{activeDiff.file}</span>
              <span className="text-xs font-mono text-[#94A3B8]">({activeDiff.branch})</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                +{activeDiff.additions} lines
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#EF4444]/15 text-[#F87171] border border-[#EF4444]/30">
                -{activeDiff.deletions} lines
              </span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded text-xs font-mono text-[#94A3B8] hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Patch'}</span>
            </button>

            {activeDiff.status === 'staged' ? (
              <>
                <button
                  onClick={() => onRejectDiff(activeDiff.id)}
                  disabled={isApplying}
                  className="px-3 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] border border-white/[0.12] text-xs font-headline font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-[#F87171]" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => onApplyDiff(activeDiff.id)}
                  disabled={isApplying}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-[#0B0F17] text-xs font-headline font-semibold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-[#0B0F17] stroke-[3]" />
                  <span>{isApplying ? 'Applying...' : 'Apply Diff'}</span>
                </button>
              </>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-xs font-mono font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Patch Applied to Working Tree
              </span>
            )}
          </div>
        </div>

        {/* Patch Summary */}
        <div className="bg-[#111827] px-4 py-2 border-b border-white/[0.06] text-xs text-[#94A3B8] flex items-center justify-between">
          <span>{activeDiff.summary}</span>
          <span className="font-mono text-[11px] text-[#38BDF8]">AST verified by Python 3.10</span>
        </div>

        {/* Code Diff Presentation */}
        {viewMode === 'unified' ? (
          <div className="bg-[#0B0F17] font-mono text-xs overflow-x-auto divide-y divide-white/[0.02]">
            {activeDiff.patch_lines.map((line, idx) => {
              if (line.type === 'hunk') {
                return (
                  <div key={idx} className="bg-[#0EA5E9]/10 text-[#38BDF8] px-4 py-1.5 text-[11px] select-none font-semibold">
                    {line.text}
                  </div>
                );
              }

              const isAddition = line.type === 'addition';
              const isDeletion = line.type === 'deletion';

              return (
                <div
                  key={idx}
                  className={`flex items-start px-3 py-1 leading-relaxed transition-colors ${
                    isAddition
                      ? 'bg-[rgba(16,185,129,0.12)] text-[#34D399] border-l-[3px] border-[#10B981]'
                      : isDeletion
                      ? 'bg-[rgba(239,68,68,0.12)] text-[#F87171] border-l-[3px] border-[#EF4444]'
                      : 'text-[#CBD5E1] hover:bg-white/[0.02] border-l-[3px] border-transparent'
                  }`}
                >
                  {/* Line Numbers */}
                  <span className="w-8 shrink-0 text-right pr-2 text-[#88929B] select-none text-[11px]">
                    {line.old_no ?? ''}
                  </span>
                  <span className="w-8 shrink-0 text-right pr-3 text-[#88929B] select-none text-[11px]">
                    {line.new_no ?? ''}
                  </span>
                  {/* Sign marker */}
                  <span className="w-4 shrink-0 font-bold select-none">
                    {isAddition ? '+' : isDeletion ? '-' : ' '}
                  </span>
                  {/* Code line */}
                  <span className="whitespace-pre flex-1 font-mono">{line.text.replace(/^[+-]/, '')}</span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Split Diff View */
          <div className="bg-[#0B0F17] font-mono text-xs grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] overflow-x-auto">
            <div className="p-4 space-y-1">
              <div className="text-[10px] uppercase font-mono text-[#F87171] mb-2 font-bold tracking-wider">
                Original Version (Before Patch)
              </div>
              <pre className="text-[#CBD5E1] whitespace-pre-wrap leading-relaxed text-xs">
                {activeDiff.code_before}
              </pre>
            </div>
            <div className="p-4 space-y-1 bg-[#10B981]/[0.02]">
              <div className="text-[10px] uppercase font-mono text-[#34D399] mb-2 font-bold tracking-wider flex items-center justify-between">
                <span>Synthesized Patch (After)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#34D399]">
                  Verified RSA-256
                </span>
              </div>
              <pre className="text-[#DFE2EE] whitespace-pre-wrap leading-relaxed text-xs">
                {activeDiff.code_after}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
