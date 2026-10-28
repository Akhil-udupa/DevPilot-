import React from 'react';
import { 
  Bot, 
  GitCompare, 
  PlayCircle, 
  TerminalSquare, 
  Network,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'agent' | 'diff' | 'pipeline' | 'sandbox' | 'repository';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  stagedDiffsCount: number;
  pipelineStatus: 'ready' | 'running' | 'passed' | 'failed';
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  stagedDiffsCount,
  pipelineStatus,
}) => {
  const tabs = [
    {
      id: 'agent' as ActiveTab,
      label: 'Agent Workspace',
      icon: Bot,
      telemetryBadge: 'AI ✦',
    },
    {
      id: 'diff' as ActiveTab,
      label: 'Diff Inspector',
      icon: GitCompare,
      count: stagedDiffsCount,
    },
    {
      id: 'pipeline' as ActiveTab,
      label: 'Deployment Pipeline',
      icon: PlayCircle,
      statusDot: pipelineStatus,
    },
    {
      id: 'sandbox' as ActiveTab,
      label: 'Python Sandbox',
      icon: TerminalSquare,
      badge: 'PY 3.10',
    },
    {
      id: 'repository' as ActiveTab,
      label: 'Branch & Audit Graph',
      icon: Network,
    },
  ];

  return (
    <nav className="bg-[#0B0F17] border-b border-white/[0.08] px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap relative ${
                isActive
                  ? 'bg-[#1E293B] text-white shadow-sm border border-white/[0.12] glow-cyan'
                  : 'text-[#94A3B8] hover:text-[#DFE2EE] hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0EA5E9]' : 'text-[#88929B]'}`} />
              <span className="font-headline tracking-tight">{tab.label}</span>

              {/* Staged diffs counter badge */}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/40 font-semibold">
                  {tab.count}
                </span>
              )}

              {/* Status indicator dot for pipeline */}
              {tab.statusDot && (
                <span className="flex h-2 w-2 relative">
                  <span
                    className={`rounded-full h-2 w-2 ${
                      tab.statusDot === 'passed'
                        ? 'bg-[#10B981]'
                        : tab.statusDot === 'running'
                        ? 'bg-[#F59E0B] animate-ping'
                        : tab.statusDot === 'failed'
                        ? 'bg-[#EF4444]'
                        : 'bg-[#94A3B8]'
                    }`}
                  />
                </span>
              )}

              {/* Monospace telemetry chip */}
              {tab.badge && (
                <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-white/[0.06] text-[#CBD5E1]">
                  {tab.badge}
                </span>
              )}

              {/* AI prompt sparkle */}
              {tab.telemetryBadge && (
                <span className="font-mono text-[10px] text-[#0EA5E9] font-bold">
                  {tab.telemetryBadge}
                </span>
              )}

              {/* Bottom active indicator line */}
              {isActive && (
                <div className="absolute bottom-[-9px] left-2 right-2 h-[2px] bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] shadow-[0_0_8px_#0EA5E9]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
