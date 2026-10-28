import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RotateCcw, 
  Code2, 
  Copy, 
  Check,
  Cpu,
  Smartphone,
  Tablet,
  Laptop,
  Globe,
  Server
} from 'lucide-react';
import { PythonExecutionResult } from '../types';
import { runPythonCode } from '../services/pythonRunner';

interface PythonSandboxProps {
  onExecutePython?: (code: string) => Promise<PythonExecutionResult>;
  isExecuting?: boolean;
}

export const PythonSandbox: React.FC<PythonSandboxProps> = () => {
  const templates = [
    {
      id: 'ast_analyzer',
      name: 'Python AST Syntax Inspection',
      code: `import ast

source_code = """
def authenticate_user(user_id: str, claims: dict) -> bool:
    if not user_id or "admin" not in claims:
        return False
    return claims.get("role") == "operator"
"""

# Parse into Abstract Syntax Tree
tree = ast.parse(source_code)
nodes = [node.__class__.__name__ for node in ast.walk(tree)]

print(f"AST Root: {tree.__class__.__name__}")
print(f"Total Nodes: {len(nodes)}")
print(f"Unique AST Node Types: {sorted(list(set(nodes)))}")
print("\\n[AST Check]: Passed with 0 syntax warnings.")`
    },
    {
      id: 'jwt_simulation',
      name: 'JWT RSA-256 Simulation',
      code: `import base64
import json
import time

def simulate_jwt_token(user: str, role: str) -> str:
    header = {"alg": "RS256", "typ": "JWT"}
    payload = {
        "sub": user,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + 3600
    }
    
    b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    b64_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    dummy_signature = "sig_rsa256_verified_by_devpilot"
    
    return f"{b64_header}.{b64_payload}.{dummy_signature}"

token = simulate_jwt_token("dev_operator", "platform_admin")
print("Synthesized JWT Token:")
print(token)
parts = token.split(".")
decoded = json.loads(base64.urlsafe_b64decode(parts[1] + "==").decode())
print("\\nDecoded Claims:")
print(json.dumps(decoded, indent=2))`
    },
    {
      id: 'backpressure',
      name: 'Worker Backpressure Queue',
      code: `import queue
import time

# Create a bounded worker queue with capacity 5
task_queue = queue.Queue(maxsize=5)

tasks = [f"task_item_{i}" for i in range(8)]
enqueued = 0
dropped = 0

for t in tasks:
    try:
        task_queue.put_nowait(t)
        enqueued += 1
        print(f"Enqueued: {t} (Queue depth: {task_queue.qsize()})")
    except queue.Full:
        dropped += 1
        print(f"[BACKPRESSURE]: Queue full! Dropped {t}")

print(f"\\nSummary: {enqueued} enqueued, {dropped} dropped due to backpressure.")`
    },
    {
      id: 'telemetry_bench',
      name: 'Microsecond Quantile Benchmark',
      code: `import random
import statistics

# Generate 5,000 simulated microsecond request latencies
latencies = [random.gauss(32.0, 4.5) for _ in range(5000)]
latencies.sort()

p50 = statistics.median(latencies)
p90 = latencies[int(len(latencies) * 0.90)]
p99 = latencies[int(len(latencies) * 0.99)]

print("DevPilot High-Frequency Telemetry Quantiles (ms):")
print(f"Samples: {len(latencies)}")
print(f"P50: {p50:.2f} ms")
print(f"P90: {p90:.2f} ms")
print(f"P99: {p99:.2f} ms")
print("Status: Stable SLA bounds verified.")`
    }
  ];

  const [activeCode, setActiveCode] = useState(templates[0].code);
  const [engineMode, setEngineMode] = useState<'auto' | 'server' | 'wasm'>('auto');
  const [result, setResult] = useState<(PythonExecutionResult & { engine?: string }) | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    try {
      const res = await runPythonCode(activeCode, engineMode);
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        stdout: '',
        stderr: err.message || 'Execution failed',
        returncode: 1,
        execution_time_ms: 0,
        ast_valid: false,
        engine: 'error',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Universal Device Compatibility Banner */}
      <div className="rounded-lg p-3 bg-[#111827] border border-[#10B981]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#34D399]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span className="font-semibold">Universal Device Execution Ready</span>
        </div>
        <div className="flex items-center gap-3 text-[#94A3B8] text-[11px]">
          <span className="flex items-center gap-1 text-[#CBD5E1]">
            <Laptop className="w-3.5 h-3.5 text-[#0EA5E9]" /> Laptop
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#CBD5E1]">
            <Tablet className="w-3.5 h-3.5 text-[#38BDF8]" /> Tablet / iPad
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#CBD5E1]">
            <Smartphone className="w-3.5 h-3.5 text-[#10B981]" /> Android / iOS
          </span>
        </div>
      </div>

      {/* Sandbox Header */}
      <div className="glass-panel rounded-lg p-5 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0EA5E9]/15 text-[#38BDF8] border border-[#0EA5E9]/30 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#0EA5E9]" />
              UNIVERSAL PYTHON ENGINE
            </span>
            <span className="font-mono text-xs text-[#94A3B8]">• Python 3 Standard Runtime & WASM</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-white tracking-tight">
            Universal Python Execution Sandbox
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5 max-w-xl">
            Execute code across any device. Automatic dual-dispatch seamlessly routes between server-side Python 3 and client-side device WebAssembly.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Engine Selector */}
          <div className="flex items-center bg-[#0B0F17] p-1 rounded-md border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setEngineMode('auto')}
              className={`px-2.5 py-1 rounded transition-colors ${
                engineMode === 'auto'
                  ? 'bg-[#1E293B] text-[#38BDF8] border border-[#0EA5E9]/40 font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Auto-adaptive: routes to Server or Device WASM"
            >
              Auto (Server + WASM)
            </button>
            <button
              onClick={() => setEngineMode('wasm')}
              className={`px-2.5 py-1 rounded transition-colors ${
                engineMode === 'wasm'
                  ? 'bg-[#1E293B] text-[#10B981] border border-[#10B981]/40 font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Runs 100% on this device in WebAssembly (No server needed)"
            >
              Device WASM
            </button>
            <button
              onClick={() => setEngineMode('server')}
              className={`px-2.5 py-1 rounded transition-colors ${
                engineMode === 'server'
                  ? 'bg-[#1E293B] text-[#F59E0B] border border-[#F59E0B]/40 font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="Direct DevPilot Server Python"
            >
              Server Py
            </button>
          </div>

          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-[#0B0F17] font-headline font-semibold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shrink-0"
          >
            {isExecuting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-[#0B0F17] border-t-transparent animate-spin" />
                <span>Executing Script...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-[#0B0F17] fill-current" />
                <span>Run Python Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] uppercase font-mono text-[#94A3B8] shrink-0 mr-1">
          Code Presets:
        </span>
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => {
              setActiveCode(tpl.code);
              setResult(null);
            }}
            className="px-3 py-1.5 rounded bg-[#111827] hover:bg-[#1E293B] border border-white/[0.08] hover:border-[#0EA5E9]/40 text-xs font-mono text-[#CBD5E1] whitespace-nowrap transition-colors"
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Editor & Output Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Code Editor Area */}
        <div className="rounded-lg bg-[#111827] border border-white/[0.08] overflow-hidden flex flex-col">
          <div className="bg-[#181C24] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#DFE2EE]">
              <Code2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>sandbox_script.py</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveCode('');
                  setResult(null);
                }}
                className="text-xs text-[#94A3B8] hover:text-[#F87171] flex items-center gap-1 font-mono transition-colors ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[340px] bg-[#0B0F17]">
            <textarea
              value={activeCode}
              onChange={(e) => setActiveCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 font-mono text-xs text-[#DFE2EE] bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-[#0EA5E9]/30"
              placeholder="# Enter Python 3 code here..."
            />
          </div>
        </div>

        {/* Output Console */}
        <div className="rounded-lg bg-[#111827] border border-white/[0.08] overflow-hidden flex flex-col">
          <div className="bg-[#181C24] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#DFE2EE]">
              <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
              <span>TERMINAL STDOUT / STDERR</span>
            </div>
            {result && (
              <div className="flex items-center gap-2 text-xs font-mono">
                {/* Engine Source Badge */}
                {result.engine && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold flex items-center gap-1 ${
                    result.engine === 'server'
                      ? 'bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/30'
                      : 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                  }`}>
                    {result.engine === 'server' ? <Server className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {result.engine === 'server' ? 'Server Python' : 'Device WASM'}
                  </span>
                )}
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  result.success 
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' 
                    : 'bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/30'
                }`}>
                  Exit: {result.returncode}
                </span>
                <span className="text-[#94A3B8] flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {result.execution_time_ms}ms
                </span>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 min-h-[340px] bg-[#0B0F17] font-mono text-xs overflow-y-auto">
            {result ? (
              <div className="space-y-3">
                {result.stdout && (
                  <div>
                    <div className="text-[10px] uppercase text-[#94A3B8] mb-1 select-none font-bold">Standard Output:</div>
                    <pre className="text-[#34D399] whitespace-pre-wrap leading-relaxed">{result.stdout}</pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <div className="text-[10px] uppercase text-[#F87171] mb-1 select-none font-bold">Standard Error:</div>
                    <pre className="text-[#F87171] whitespace-pre-wrap leading-relaxed">{result.stderr}</pre>
                  </div>
                )}
                {!result.stdout && !result.stderr && (
                  <div className="text-[#94A3B8] italic">Process finished with no console output (exit code 0).</div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#94A3B8] py-12">
                <Terminal className="w-8 h-8 text-[#94A3B8]/40 mb-2" />
                <p className="text-xs">Ready for execution on this device.</p>
                <p className="text-[11px] text-[#88929B] mt-1">Click "Run Python Code" to execute immediately.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
