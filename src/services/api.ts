import {
  AgentState,
  TelemetryLog,
  CodeDiff,
  DeploymentPipeline,
  GitBranch,
  GitCommit,
  PythonExecutionResult,
  BackendHealth
} from '../types';

export const api = {
  async getHealth(): Promise<BackendHealth> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getAgentStatus(): Promise<{ agent: AgentState; logs: TelemetryLog[] }> {
    const res = await fetch('/api/agent/status');
    if (!res.ok) throw new Error('Failed to fetch agent status');
    return res.json();
  },

  async submitPrompt(prompt: string): Promise<{
    status: string;
    message: string;
    patch: CodeDiff;
    agent: AgentState;
  }> {
    const res = await fetch('/api/agent/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Prompt dispatch failed' }));
      throw new Error(err.error || 'Failed to dispatch prompt');
    }
    return res.json();
  },

  async getDiffs(): Promise<{ diffs: CodeDiff[]; total_staged: number; total_applied: number }> {
    const res = await fetch('/api/diffs');
    if (!res.ok) throw new Error('Failed to fetch diffs');
    return res.json();
  },

  async applyDiff(diffId: string): Promise<{ status: string; commit: GitCommit; diff: CodeDiff }> {
    const res = await fetch(`/api/diffs/${diffId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to apply diff');
    return res.json();
  },

  async rejectDiff(diffId: string): Promise<{ status: string; diff: CodeDiff }> {
    const res = await fetch(`/api/diffs/${diffId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to reject diff');
    return res.json();
  },

  async getPipeline(): Promise<DeploymentPipeline> {
    const res = await fetch('/api/pipeline');
    if (!res.ok) throw new Error('Failed to fetch pipeline');
    return res.json();
  },

  async runPipeline(): Promise<{ pipeline: DeploymentPipeline; total_duration_ms: number }> {
    const res = await fetch('/api/pipeline/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to trigger pipeline verification');
    return res.json();
  },

  async executePython(code: string): Promise<PythonExecutionResult> {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Execution request failed' }));
      throw new Error(err.error || 'Execution failed');
    }
    return res.json();
  },

  async getRepositories(): Promise<{ branches: GitBranch[]; commits: GitCommit[] }> {
    const res = await fetch('/api/repositories');
    if (!res.ok) throw new Error('Failed to fetch repository information');
    return res.json();
  },

  async switchBranch(branch: string): Promise<{ active_branch: string; branches: GitBranch[] }> {
    const res = await fetch('/api/repositories/branch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch }),
    });
    if (!res.ok) throw new Error('Failed to switch branch');
    return res.json();
  },
};
