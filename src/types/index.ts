export type AgentStatus = 'idle' | 'synthesizing' | 'analyzing' | 'verifying';

export interface AgentState {
  status: AgentStatus;
  current_task: string;
  active_branch: string;
  throughput_tps: number;
  latency_ms: number;
  context_tokens_used: number;
  context_tokens_max: number;
  model_version: string;
  tasks_completed: number;
  patches_applied: number;
  uptime_start: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'AGENT_PROMPT' | 'TELEMETRY';
  source: string;
  message: string;
}

export interface PatchLine {
  type: 'addition' | 'deletion' | 'context' | 'hunk';
  old_no?: number | null;
  new_no?: number | null;
  text: string;
}

export interface CodeDiff {
  id: string;
  file: string;
  branch: string;
  status: 'staged' | 'applied' | 'rejected';
  summary: string;
  additions: number;
  deletions: number;
  code_before: string;
  code_after: string;
  patch_lines: PatchLine[];
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'running' | 'failed' | 'queued';
  duration_ms: number;
  logs: string[];
}

export interface DeploymentPipeline {
  status: 'ready' | 'running' | 'passed' | 'failed';
  last_run: string;
  stages: PipelineStage[];
}

export interface GitBranch {
  name: string;
  commit: string;
  message: string;
  time: string;
  is_active: boolean;
}

export interface GitCommit {
  hash: string;
  branch: string;
  author: string;
  message: string;
  additions: number;
  deletions: number;
  verified: boolean;
  time: string;
}

export interface PythonExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  returncode: number;
  execution_time_ms: number;
  ast_valid: boolean;
  error?: string;
}

export interface BackendHealth {
  status: string;
  backend: string;
  python_version: string;
  platform: string;
  uptime_seconds: number;
  pid: number;
  active_threads: number;
}
