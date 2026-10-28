/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TelemetryBar } from './components/TelemetryBar';
import { Navigation, ActiveTab } from './components/Navigation';
import { AgentWorkspace } from './components/AgentWorkspace';
import { DiffInspector } from './components/DiffInspector';
import { PipelineOrchestrator } from './components/PipelineOrchestrator';
import { PythonSandbox } from './components/PythonSandbox';
import { RepositoryGraph } from './components/RepositoryGraph';
import { api } from './services/api';
import { 
  AgentState, 
  TelemetryLog, 
  CodeDiff, 
  DeploymentPipeline, 
  GitBranch, 
  GitCommit, 
  BackendHealth,
  PythonExecutionResult 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('agent');
  const [agent, setAgent] = useState<AgentState | null>(null);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [diffs, setDiffs] = useState<CodeDiff[]>([]);
  const [selectedDiffId, setSelectedDiffId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<DeploymentPipeline | null>(null);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [health, setHealth] = useState<BackendHealth | null>(null);

  // Loading flags
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [isExecutingPython, setIsExecutingPython] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Fetch all backend telemetry
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [healthData, agentData, diffsData, pipelineData, repoData] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getAgentStatus().catch(() => null),
        api.getDiffs().catch(() => null),
        api.getPipeline().catch(() => null),
        api.getRepositories().catch(() => null),
      ]);

      if (healthData) setHealth(healthData);
      if (agentData) {
        setAgent(agentData.agent);
        setLogs(agentData.logs);
      }
      if (diffsData) {
        setDiffs(diffsData.diffs);
        if (!selectedDiffId && diffsData.diffs.length > 0) {
          setSelectedDiffId(diffsData.diffs[0].id);
        }
      }
      if (pipelineData) setPipeline(pipelineData);
      if (repoData) {
        setBranches(repoData.branches);
        setCommits(repoData.commits);
      }
    } catch (err: any) {
      console.error('Failed to sync telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDiffId]);

  // Initial load
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Handlers
  const handleDispatchPrompt = async (prompt: string) => {
    setIsDispatching(true);
    try {
      const res = await api.submitPrompt(prompt);
      setAgent(res.agent);
      await refreshData();
      showNotification(`Patch synthesized: ${res.patch.file}`, 'success');
      return res.patch;
    } catch (err: any) {
      showNotification(err.message || 'Prompt failed', 'error');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleApplyDiff = async (diffId: string) => {
    setIsApplying(true);
    try {
      const res = await api.applyDiff(diffId);
      await refreshData();
      showNotification(`Applied patch to ${res.commit.branch} [#${res.commit.hash}]`, 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to apply diff', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRejectDiff = async (diffId: string) => {
    setIsApplying(true);
    try {
      await api.rejectDiff(diffId);
      await refreshData();
      showNotification('Patch rejected and archived', 'info');
    } catch (err: any) {
      showNotification(err.message || 'Failed to reject diff', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const res = await api.runPipeline();
      setPipeline(res.pipeline);
      await refreshData();
      showNotification(`Pipeline passed in ${res.total_duration_ms}ms!`, 'success');
    } catch (err: any) {
      showNotification(err.message || 'Pipeline verification failed', 'error');
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleExecutePython = async (code: string): Promise<PythonExecutionResult> => {
    setIsExecutingPython(true);
    try {
      const res = await api.executePython(code);
      return res;
    } catch (err: any) {
      return {
        success: false,
        stdout: '',
        stderr: err.message || 'Execution failed',
        returncode: -1,
        execution_time_ms: 0,
        ast_valid: false,
      };
    } finally {
      setIsExecutingPython(false);
    }
  };

  const handleSwitchBranch = async (branch: string) => {
    try {
      const res = await api.switchBranch(branch);
      setBranches(res.branches);
      if (agent) {
        setAgent({ ...agent, active_branch: res.active_branch });
      }
      showNotification(`Switched working branch to ${res.active_branch}`, 'info');
    } catch (err: any) {
      showNotification(err.message || 'Failed to switch branch', 'error');
    }
  };

  const handleInspectDiff = (diffId: string) => {
    setSelectedDiffId(diffId);
    setActiveTab('diff');
  };

  const stagedCount = diffs.filter((d) => d.status === 'staged').length;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#DFE2EE] flex flex-col font-body bg-grid-mesh">
      
      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-2.5 rounded-lg border text-xs font-mono shadow-2xl flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-[#111827] text-[#34D399] border-[#10B981]/50 glow-emerald'
                : notification.type === 'error'
                ? 'bg-[#111827] text-[#F87171] border-[#EF4444]/50 glow-ruby'
                : 'bg-[#111827] text-[#38BDF8] border-[#0EA5E9]/50 glow-cyan'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header
        agent={agent}
        health={health}
        branches={branches}
        onSelectBranch={handleSwitchBranch}
        onRefresh={refreshData}
        isRefreshing={isRefreshing}
      />

      {/* Diagnostics & Context Telemetry */}
      <TelemetryBar agent={agent} health={health} />

      {/* Primary Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stagedDiffsCount={stagedCount}
        pipelineStatus={pipeline?.status || 'ready'}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'agent' && (
          <AgentWorkspace
            agent={agent}
            logs={logs}
            onDispatchPrompt={handleDispatchPrompt}
            onInspectDiff={handleInspectDiff}
            isDispatching={isDispatching}
          />
        )}

        {activeTab === 'diff' && (
          <DiffInspector
            diffs={diffs}
            selectedDiffId={selectedDiffId}
            onSelectDiff={setSelectedDiffId}
            onApplyDiff={handleApplyDiff}
            onRejectDiff={handleRejectDiff}
            isApplying={isApplying}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineOrchestrator
            pipeline={pipeline}
            onRunPipeline={handleRunPipeline}
            isRunning={isRunningPipeline}
          />
        )}

        {activeTab === 'sandbox' && (
          <PythonSandbox
            onExecutePython={handleExecutePython}
            isExecuting={isExecutingPython}
          />
        )}

        {activeTab === 'repository' && (
          <RepositoryGraph
            branches={branches}
            commits={commits}
            activeBranch={agent?.active_branch || 'main'}
            onSwitchBranch={handleSwitchBranch}
            onCreateBranch={handleSwitchBranch}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0B0F17]/80 py-3 px-4 lg:px-6 text-[11px] font-mono text-[#88929B]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>DevPilot Autonomous Control Plane</span>
            <span>•</span>
            <span>Python 3.10 Backend (Standard Library Engine)</span>
          </div>
          <div>
            <span>Precision Developer Modernism & Functional Glassmorphism</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
