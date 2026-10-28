import React, { useState } from 'react';
import { 
  GitBranch as GitBranchIcon, 
  GitCommit as GitCommitIcon, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Network,
  ArrowRight
} from 'lucide-react';
import { GitBranch, GitCommit } from '../types';

interface RepositoryGraphProps {
  branches: GitBranch[];
  commits: GitCommit[];
  activeBranch: string;
  onSwitchBranch: (branch: string) => Promise<void>;
  onCreateBranch: (branch: string) => Promise<void>;
}

export const RepositoryGraph: React.FC<RepositoryGraphProps> = ({
  branches,
  commits,
  activeBranch,
  onSwitchBranch,
  onCreateBranch,
}) => {
  const [newBranchInput, setNewBranchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchInput.trim()) return;
    await onCreateBranch(newBranchInput.trim());
    setNewBranchInput('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Topology Header */}
      <div className="glass-panel rounded-lg p-5 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0EA5E9]/15 text-[#38BDF8] border border-[#0EA5E9]/30 font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#0EA5E9]" />
              GIT TOPOLOGY & AUDIT
            </span>
            <span className="font-mono text-xs text-[#94A3B8]">• Active: {activeBranch}</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-white tracking-tight">
            Branch Topography & Cryptographic Commit Trail
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5 max-w-xl">
            Every autonomous patch synthesized by DevPilot generates an immutable verified commit tied to agent telemetry and AST verification proofs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded bg-[#1E293B] hover:bg-[#334155] border border-white/[0.12] text-xs font-headline font-semibold text-white flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-[#0EA5E9]" />
          <span>New Agent Branch</span>
        </button>
      </div>

      {/* New Branch Modal */}
      {showCreateModal && (
        <div className="p-4 rounded-lg bg-[#1E293B] border border-white/[0.14] shadow-xl space-y-3">
          <div className="text-xs font-headline font-semibold text-white flex items-center justify-between">
            <span>Spawn New Autonomous Branch</span>
            <button onClick={() => setShowCreateModal(false)} className="text-[#94A3B8] hover:text-white text-xs">
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newBranchInput}
              onChange={(e) => setNewBranchInput(e.target.value)}
              placeholder="e.g. agent/distributed-tracing-v1"
              className="flex-1 bg-[#0B0F17] border border-white/[0.1] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#0EA5E9]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-[#0B0F17] font-semibold text-xs"
            >
              Checkout
            </button>
          </form>
        </div>
      )}

      {/* Branch List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {branches.map((b) => {
          const isActive = b.name === activeBranch;
          return (
            <div
              key={b.name}
              onClick={() => onSwitchBranch(b.name)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#1E293B] border-[#0EA5E9]/60 shadow-lg glow-cyan'
                  : 'bg-[#111827] border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs text-white font-medium truncate">
                  <GitBranchIcon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0EA5E9]' : 'text-[#88929B]'}`} />
                  <span className="truncate">{b.name}</span>
                </div>
                {isActive && (
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/40">
                    Active
                  </span>
                )}
              </div>

              <div className="text-[11px] text-[#94A3B8] truncate mb-2">
                {b.message}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#88929B] border-t border-white/[0.04] pt-2">
                <span className="text-[#CBD5E1]">#{b.commit}</span>
                <span>{b.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commit History Timeline */}
      <div className="rounded-lg bg-[#111827] border border-white/[0.08] overflow-hidden">
        <div className="bg-[#181C24] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommitIcon className="w-4 h-4 text-[#0EA5E9]" />
            <span className="font-headline font-semibold text-xs text-white">
              VERIFIED AUDIT LOG & COMMIT GRAPH
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#94A3B8]">
            {commits.length} commits recorded
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {commits.map((commit, idx) => (
            <div key={idx} className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-[#1E293B] text-[#0EA5E9] border border-white/[0.06] mt-0.5">
                  <GitCommitIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {commit.message}
                    </span>
                    {commit.verified && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-mono mt-1">
                    <span className="flex items-center gap-1 text-[#CBD5E1]">
                      <UserCheck className="w-3 h-3 text-[#38BDF8]" />
                      {commit.author}
                    </span>
                    <span>•</span>
                    <span className="text-[#0EA5E9]">{commit.branch}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {commit.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Commit Hash & Line Delta */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#34D399]">+{commit.additions}</span>
                  <span className="text-[#F87171]">-{commit.deletions}</span>
                </div>
                <span className="px-2 py-1 rounded bg-[#0B0F17] text-[#38BDF8] border border-white/[0.08] font-mono text-[11px]">
                  {commit.hash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
