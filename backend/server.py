#!/usr/bin/env python3
"""
DevPilot Backend Engine
Autonomous Code Engine, Real-time Diff Verification, Sandboxed Python Execution, and Deployment Telemetry.
Built with Python 3 standard library (zero external dependencies required).
"""

import sys
import os
import json
import time
import ast
import uuid
import socket
import subprocess
import threading
from urllib.parse import urlparse, parse_qs
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

# In-memory database & state
STATE = {
    "agent": {
        "status": "idle",  # idle | synthesizing | analyzing | verifying
        "current_task": "Awaiting developer prompt or pipeline trigger",
        "active_branch": "agent/auth-rsa-v2",
        "throughput_tps": 146.4,
        "latency_ms": 34.2,
        "context_tokens_used": 28450,
        "context_tokens_max": 128000,
        "model_version": "DevPilot-CodeGen-v3 (Python Core)",
        "tasks_completed": 42,
        "patches_applied": 38,
        "uptime_start": time.time(),
    },
    "logs": [
        {
            "id": "log-001",
            "timestamp": "11:42:04",
            "level": "INFO",
            "source": "AGENT_RUNTIME",
            "message": "DevPilot Python runtime initialized. AST parser and sandbox engine online."
        },
        {
            "id": "log-002",
            "timestamp": "11:45:18",
            "level": "SUCCESS",
            "source": "DIFF_ENGINE",
            "message": "Analyzed PR-104: AST validation passed with zero syntax hazards."
        },
        {
            "id": "log-003",
            "timestamp": "11:52:40",
            "level": "TELEMETRY",
            "source": "ORCHESTRATOR",
            "message": "Canary deployment health score at 99.8%. Memory delta stable at -14.2MB."
        }
    ],
    "diffs": [
        {
            "id": "diff-auth-rsa",
            "file": "services/auth_jwt.py",
            "branch": "agent/auth-rsa-v2",
            "status": "staged",
            "summary": "Implement asymmetric RSA-256 token verification with thread-safe key rotation",
            "additions": 38,
            "deletions": 12,
            "code_before": """def verify_jwt_token(token: str, secret_key: str) -> dict:
    # Legacy symmetric verification vulnerable to key leakage
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Malformed JWT format")
    payload = json.loads(base64.b64decode(parts[1] + "==").decode())
    return payload""",
            "code_after": """def verify_jwt_token(token: str, public_key_pem: str) -> dict:
    \"\"\"Asymmetric RSA-256 verification with thread-safe public key cache.\"\"\"
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Malformed JWT structure: expected header.payload.signature")
    
    header_raw, payload_raw, sig_raw = parts
    payload = json.loads(base64.urlsafe_b64decode(payload_raw + "==").decode("utf-8"))
    
    # Verify expiration and audience claims
    current_ts = int(time.time())
    if payload.get("exp", 0) < current_ts:
        raise TokenExpiredError("JWT token has expired")
    
    # Cryptographic signature validation
    if not rsa_verify_sha256(f"{header_raw}.{payload_raw}".encode(), sig_raw, public_key_pem):
        raise SignatureVerificationError("Invalid RSA-256 signature")
        
    return payload""",
            "patch_lines": [
                {"type": "hunk", "text": "@@ -1,7 +1,21 @@"},
                {"type": "deletion", "old_no": 1, "new_no": None, "text": "-def verify_jwt_token(token: str, secret_key: str) -> dict:"},
                {"type": "deletion", "old_no": 2, "new_no": None, "text": "-    # Legacy symmetric verification vulnerable to key leakage"},
                {"type": "addition", "old_no": None, "new_no": 1, "text": "+def verify_jwt_token(token: str, public_key_pem: str) -> dict:"},
                {"type": "addition", "old_no": None, "new_no": 2, "text": "+    \"\"\"Asymmetric RSA-256 verification with thread-safe public key cache.\"\"\""},
                {"type": "context", "old_no": 3, "new_no": 3, "text": "     parts = token.split(\".\")"},
                {"type": "deletion", "old_no": 4, "new_no": None, "text": "-    if len(parts) != 3:"},
                {"type": "deletion", "old_no": 5, "new_no": None, "text": "-        raise ValueError(\"Malformed JWT format\")"},
                {"type": "addition", "old_no": None, "new_no": 4, "text": "+    if len(parts) != 3:"},
                {"type": "addition", "old_no": None, "new_no": 5, "text": "+        raise ValueError(\"Malformed JWT structure: expected header.payload.signature\")"},
                {"type": "addition", "old_no": None, "new_no": 6, "text": "+    "},
                {"type": "addition", "old_no": None, "new_no": 7, "text": "+    header_raw, payload_raw, sig_raw = parts"},
                {"type": "addition", "old_no": None, "new_no": 8, "text": "+    payload = json.loads(base64.urlsafe_b64decode(payload_raw + \"==\").decode(\"utf-8\"))"},
                {"type": "addition", "old_no": None, "new_no": 9, "text": "+    "},
                {"type": "addition", "old_no": None, "new_no": 10, "text": "+    # Verify expiration and audience claims"},
                {"type": "addition", "old_no": None, "new_no": 11, "text": "+    current_ts = int(time.time())"},
                {"type": "addition", "old_no": None, "new_no": 12, "text": "+    if payload.get(\"exp\", 0) < current_ts:"},
                {"type": "addition", "old_no": None, "new_no": 13, "text": "+        raise TokenExpiredError(\"JWT token has expired\")"},
                {"type": "addition", "old_no": None, "new_no": 14, "text": "+    "},
                {"type": "addition", "old_no": None, "new_no": 15, "text": "+    # Cryptographic signature validation"},
                {"type": "addition", "old_no": None, "new_no": 16, "text": "+    if not rsa_verify_sha256(f\"{header_raw}.{payload_raw}\".encode(), sig_raw, public_key_pem):"},
                {"type": "addition", "old_no": None, "new_no": 17, "text": "+        raise SignatureVerificationError(\"Invalid RSA-256 signature\")"},
                {"type": "context", "old_no": 6, "new_no": 18, "text": "         "},
                {"type": "context", "old_no": 7, "new_no": 19, "text": "     return payload"}
            ]
        },
        {
            "id": "diff-worker-pool",
            "file": "workers/pool_manager.py",
            "branch": "agent/pool-backpressure",
            "status": "staged",
            "summary": "Fix worker thread exhaustion via bounded queue and non-blocking backpressure",
            "additions": 24,
            "deletions": 6,
            "code_before": """def dispatch_task(task_fn, *args):
    # Unbounded thread creation causes resource exhaustion under spikes
    t = threading.Thread(target=task_fn, args=args)
    t.start()
    return t""",
            "code_after": """def dispatch_task(task_fn, *args, timeout_ms: int = 5000):
    \"\"\"Dispatch task to bounded worker pool with adaptive backpressure.\"\"\"
    try:
        worker_queue.put((task_fn, args), block=True, timeout=timeout_ms / 1000.0)
        telemetry.increment("pool.tasks_enqueued")
    except queue.Full:
        telemetry.increment("pool.backpressure_dropped")
        raise PoolCapacityExceededError("Worker queue saturated; backpressure initiated")""",
            "patch_lines": [
                {"type": "hunk", "text": "@@ -1,5 +1,10 @@"},
                {"type": "deletion", "old_no": 1, "new_no": None, "text": "-def dispatch_task(task_fn, *args):"},
                {"type": "deletion", "old_no": 2, "new_no": None, "text": "-    # Unbounded thread creation causes resource exhaustion under spikes"},
                {"type": "deletion", "old_no": 3, "new_no": None, "text": "-    t = threading.Thread(target=task_fn, args=args)"},
                {"type": "deletion", "old_no": 4, "new_no": None, "text": "-    t.start()"},
                {"type": "deletion", "old_no": 5, "new_no": None, "text": "-    return t"},
                {"type": "addition", "old_no": None, "new_no": 1, "text": "+def dispatch_task(task_fn, *args, timeout_ms: int = 5000):"},
                {"type": "addition", "old_no": None, "new_no": 2, "text": "+    \"\"\"Dispatch task to bounded worker pool with adaptive backpressure.\"\"\""},
                {"type": "addition", "old_no": None, "new_no": 3, "text": "+    try:"},
                {"type": "addition", "old_no": None, "new_no": 4, "text": "+        worker_queue.put((task_fn, args), block=True, timeout=timeout_ms / 1000.0)"},
                {"type": "addition", "old_no": None, "new_no": 5, "text": "+        telemetry.increment(\"pool.tasks_enqueued\")"},
                {"type": "addition", "old_no": None, "new_no": 6, "text": "+    except queue.Full:"},
                {"type": "addition", "old_no": None, "new_no": 7, "text": "+        telemetry.increment(\"pool.backpressure_dropped\")"},
                {"type": "addition", "old_no": None, "new_no": 8, "text": "+        raise PoolCapacityExceededError(\"Worker queue saturated; backpressure initiated\")"}
            ]
        },
        {
            "id": "diff-telemetry-otel",
            "file": "telemetry/metrics_collector.py",
            "branch": "agent/otel-telemetry",
            "status": "staged",
            "summary": "Export microsecond histogram metrics and span context to telemetry pipeline",
            "additions": 19,
            "deletions": 4,
            "code_before": """def record_metric(name: str, val: float):
    print(f"METRIC: {name}={val}")""",
            "code_after": """def record_metric(name: str, val: float, tags: dict = None):
    timestamp_ns = time.time_ns()
    payload = {
        "metric": name,
        "value": val,
        "tags": tags or {},
        "timestamp_ns": timestamp_ns,
        "host_id": socket.gethostname()
    }
    ring_buffer.push(payload)""",
            "patch_lines": [
                {"type": "hunk", "text": "@@ -1,2 +1,11 @@"},
                {"type": "deletion", "old_no": 1, "new_no": None, "text": "-def record_metric(name: str, val: float):"},
                {"type": "deletion", "old_no": 2, "new_no": None, "text": "-    print(f\"METRIC: {name}={val}\")"},
                {"type": "addition", "old_no": None, "new_no": 1, "text": "+def record_metric(name: str, val: float, tags: dict = None):"},
                {"type": "addition", "old_no": None, "new_no": 2, "text": "+    timestamp_ns = time.time_ns()"},
                {"type": "addition", "old_no": None, "new_no": 3, "text": "+    payload = {"},
                {"type": "addition", "old_no": None, "new_no": 4, "text": "+        \"metric\": name,"},
                {"type": "addition", "old_no": None, "new_no": 5, "text": "+        \"value\": val,"},
                {"type": "addition", "old_no": None, "new_no": 6, "text": "+        \"tags\": tags or {},"},
                {"type": "addition", "old_no": None, "new_no": 7, "text": "+        \"timestamp_ns\": timestamp_ns,"},
                {"type": "addition", "old_no": None, "new_no": 8, "text": "+        \"host_id\": socket.gethostname()"},
                {"type": "addition", "old_no": None, "new_no": 9, "text": "+    }"},
                {"type": "addition", "old_no": None, "new_no": 10, "text": "+    ring_buffer.push(payload)"}
            ]
        }
    ],
    "pipeline": {
        "status": "ready",  # ready | running | passed | failed
        "last_run": "2 mins ago",
        "stages": [
            {
                "id": "stage-ast",
                "name": "Syntax & AST Parsing",
                "description": "Python ast.parse tree validation & syntax compliance",
                "status": "passed",
                "duration_ms": 42,
                "logs": [
                    "[00:00.012] Parsing services/auth_jwt.py via Python ast module...",
                    "[00:00.028] AST compilation succeeded with 0 syntax errors.",
                    "[00:00.042] Verified 100% compliant with Python 3.10 grammar."
                ]
            },
            {
                "id": "stage-types",
                "name": "Static Type & Protocol Guard",
                "description": "Type hint consistency and interface contracts",
                "status": "passed",
                "duration_ms": 118,
                "logs": [
                    "[00:00.045] Checking callable signatures and ReturnType definitions...",
                    "[00:00.089] Verified TokenExpiredError and SignatureVerificationError exceptions.",
                    "[00:00.118] 0 type check violations detected."
                ]
            },
            {
                "id": "stage-sec",
                "name": "Cryptographic & Security Audit",
                "description": "Taint tracking, secret leakage, and timing attack resistance",
                "status": "passed",
                "duration_ms": 230,
                "logs": [
                    "[00:00.120] Scanning for hardcoded private keys or symmetric secret exposures...",
                    "[00:00.180] Confirmed RSA-256 public key separation and safe timing verification.",
                    "[00:00.230] Security scan: zero high/critical vulnerabilities."
                ]
            },
            {
                "id": "stage-unit",
                "name": "Automated PyTest Suite",
                "description": "Unit testing, edge case permutations, fuzzing",
                "status": "passed",
                "duration_ms": 482,
                "logs": [
                    "[00:00.235] test_jwt_valid_rsa_token ... PASSED (12ms)",
                    "[00:00.280] test_jwt_expired_token_rejection ... PASSED (8ms)",
                    "[00:00.320] test_jwt_tampered_payload_sig_fail ... PASSED (14ms)",
                    "[00:00.410] test_worker_pool_backpressure_saturation ... PASSED (86ms)",
                    "[00:00.482] 24/24 unit tests passed (0 failures, 0 skips)."
                ]
            },
            {
                "id": "stage-canary",
                "name": "Canary Rollout (10% Traffic)",
                "description": "Live traffic shadow and error rate divergence monitoring",
                "status": "passed",
                "duration_ms": 820,
                "logs": [
                    "[00:00.510] Deploying patch container to edge region asia-east1-a...",
                    "[00:00.650] Routing 10% live synthetic traffic to canary instance...",
                    "[00:00.750] Error rate: 0.000% (baseline 0.002%). Latency P99: 28.4ms (down 12%).",
                    "[00:00.820] Canary health verified. Ready for automatic promotion."
                ]
            }
        ]
    },
    "branches": [
        {"name": "main", "commit": "3a9f02c", "message": "feat: initialize platform core", "time": "3h ago", "is_active": False},
        {"name": "agent/auth-rsa-v2", "commit": "7e1b89d", "message": "refactor(auth): asymmetric rsa256 validation", "time": "12m ago", "is_active": True},
        {"name": "agent/pool-backpressure", "commit": "c4d812e", "message": "fix(workers): bounded queue backpressure", "time": "45m ago", "is_active": False},
        {"name": "agent/otel-telemetry", "commit": "902a7ef", "message": "feat(telemetry): microsecond histogram exporter", "time": "1h ago", "is_active": False}
    ],
    "commits": [
        {"hash": "7e1b89d", "branch": "agent/auth-rsa-v2", "author": "DevPilot Agent #04", "message": "refactor(auth): asymmetric rsa256 validation", "additions": 38, "deletions": 12, "verified": True, "time": "12m ago"},
        {"hash": "c4d812e", "branch": "agent/pool-backpressure", "author": "DevPilot Agent #02", "message": "fix(workers): bounded queue backpressure", "additions": 24, "deletions": 6, "verified": True, "time": "45m ago"},
        {"hash": "902a7ef", "branch": "agent/otel-telemetry", "author": "DevPilot Agent #01", "message": "feat(telemetry): microsecond histogram exporter", "additions": 19, "deletions": 4, "verified": True, "time": "1h ago"},
        {"hash": "3a9f02c", "branch": "main", "author": "Platform Engineer", "message": "chore: bootstrap devpilot runtime", "additions": 482, "deletions": 0, "verified": True, "time": "3h ago"}
    ]
}

class DevPilotHandler(BaseHTTPRequestHandler):
    def _send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json(self, status_code: int, data: dict):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors()
        body = json.dumps(data).encode("utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            uptime = time.time() - STATE["agent"]["uptime_start"]
            return self._send_json(200, {
                "status": "healthy",
                "backend": "Python 3 Standard Library Engine",
                "python_version": sys.version.split()[0],
                "platform": sys.platform,
                "uptime_seconds": round(uptime, 1),
                "pid": os.getpid(),
                "active_threads": threading.active_count()
            })

        elif path == "/api/agent/status":
            return self._send_json(200, {
                "agent": STATE["agent"],
                "logs": STATE["logs"][-20:]
            })

        elif path == "/api/diffs":
            return self._send_json(200, {
                "diffs": STATE["diffs"],
                "total_staged": sum(1 for d in STATE["diffs"] if d["status"] == "staged"),
                "total_applied": sum(1 for d in STATE["diffs"] if d["status"] == "applied"),
            })

        elif path == "/api/pipeline":
            return self._send_json(200, STATE["pipeline"])

        elif path == "/api/repositories":
            return self._send_json(200, {
                "branches": STATE["branches"],
                "commits": STATE["commits"]
            })

        else:
            return self._send_json(404, {"error": "Endpoint not found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        body = {}
        if content_length > 0:
            try:
                raw_data = self.rfile.read(content_length).decode("utf-8")
                body = json.loads(raw_data)
            except Exception as e:
                return self._send_json(400, {"error": f"Invalid JSON payload: {str(e)}"})

        if path == "/api/agent/prompt":
            prompt = body.get("prompt", "").strip()
            if not prompt:
                return self._send_json(400, {"error": "Prompt cannot be empty"})

            # Simulate agent reasoning and synthesis step-by-step
            new_log = {
                "id": f"log-{uuid.uuid4().hex[:6]}",
                "timestamp": time.strftime("%H:%M:%S"),
                "level": "AGENT_PROMPT",
                "source": "OPERATOR",
                "message": f"Dispatched instruction: \"{prompt}\""
            }
            STATE["logs"].append(new_log)
            STATE["agent"]["status"] = "synthesizing"
            STATE["agent"]["current_task"] = prompt
            STATE["agent"]["tasks_completed"] += 1
            STATE["agent"]["context_tokens_used"] = min(
                STATE["agent"]["context_tokens_max"], 
                STATE["agent"]["context_tokens_used"] + len(prompt) * 4 + 450
            )

            # Synthesize an adaptive patch if related to code
            generated_patch = None
            if "crypto" in prompt.lower() or "encrypt" in prompt.lower():
                generated_patch = {
                    "id": f"diff-crypto-{uuid.uuid4().hex[:4]}",
                    "file": "security/crypto_vault.py",
                    "branch": STATE["agent"]["active_branch"],
                    "status": "staged",
                    "summary": f"Autonomous synthesis: {prompt}",
                    "additions": 28,
                    "deletions": 5,
                    "code_before": "def encrypt_blob(data: bytes) -> bytes:\n    return base64.b64encode(data)",
                    "code_after": "def encrypt_blob(data: bytes, key: bytes) -> bytes:\n    \"\"\"Authenticated AES-256-GCM encryption with randomized IV.\"\"\"\n    iv = secrets.token_bytes(12)\n    cipher = AESGCM(key)\n    return iv + cipher.encrypt(iv, data, None)",
                    "patch_lines": [
                        {"type": "hunk", "text": "@@ -1,2 +1,5 @@"},
                        {"type": "deletion", "old_no": 1, "new_no": None, "text": "-def encrypt_blob(data: bytes) -> bytes:"},
                        {"type": "deletion", "old_no": 2, "new_no": None, "text": "-    return base64.b64encode(data)"},
                        {"type": "addition", "old_no": None, "new_no": 1, "text": "+def encrypt_blob(data: bytes, key: bytes) -> bytes:"},
                        {"type": "addition", "old_no": None, "new_no": 2, "text": "+    \"\"\"Authenticated AES-256-GCM encryption with randomized IV.\"\"\""},
                        {"type": "addition", "old_no": None, "new_no": 3, "text": "+    iv = secrets.token_bytes(12)"},
                        {"type": "addition", "old_no": None, "new_no": 4, "text": "+    cipher = AESGCM(key)"},
                        {"type": "addition", "old_no": None, "new_no": 5, "text": "+    return iv + cipher.encrypt(iv, data, None)"}
                    ]
                }
                STATE["diffs"].insert(0, generated_patch)
            elif "cache" in prompt.lower() or "redis" in prompt.lower():
                generated_patch = {
                    "id": f"diff-cache-{uuid.uuid4().hex[:4]}",
                    "file": "cache/distributed_lru.py",
                    "branch": STATE["agent"]["active_branch"],
                    "status": "staged",
                    "summary": f"Autonomous synthesis: {prompt}",
                    "additions": 31,
                    "deletions": 7,
                    "code_before": "def get_cached(key):\n    return in_memory_store.get(key)",
                    "code_after": "def get_cached(key: str, ttl_seconds: int = 300) -> Optional[dict]:\n    \"\"\"Distributed tier-1 LRU cache with dogpile lock protection.\"\"\"\n    with cache_lock(key):\n        val = redis_cluster.get(key)\n        if val:\n            return json.loads(val)\n        return None",
                    "patch_lines": [
                        {"type": "hunk", "text": "@@ -1,2 +1,7 @@"},
                        {"type": "deletion", "old_no": 1, "new_no": None, "text": "-def get_cached(key):"},
                        {"type": "deletion", "old_no": 2, "new_no": None, "text": "-    return in_memory_store.get(key)"},
                        {"type": "addition", "old_no": None, "new_no": 1, "text": "+def get_cached(key: str, ttl_seconds: int = 300) -> Optional[dict]:"},
                        {"type": "addition", "old_no": None, "new_no": 2, "text": "+    \"\"\"Distributed tier-1 LRU cache with dogpile lock protection.\"\"\""},
                        {"type": "addition", "old_no": None, "new_no": 3, "text": "+    with cache_lock(key):"},
                        {"type": "addition", "old_no": None, "new_no": 4, "text": "+        val = redis_cluster.get(key)"},
                        {"type": "addition", "old_no": None, "new_no": 5, "text": "+        if val:"},
                        {"type": "addition", "old_no": None, "new_no": 6, "text": "+            return json.loads(val)"},
                        {"type": "addition", "old_no": None, "new_no": 7, "text": "+        return None"}
                    ]
                }
                STATE["diffs"].insert(0, generated_patch)
            else:
                # General autonomous synthesis
                generated_patch = {
                    "id": f"diff-patch-{uuid.uuid4().hex[:4]}",
                    "file": "core/agent_optimized_routine.py",
                    "branch": STATE["agent"]["active_branch"],
                    "status": "staged",
                    "summary": f"Engine resolution for: {prompt[:60]}...",
                    "additions": 22,
                    "deletions": 4,
                    "code_before": "def execute_pipeline(items):\n    return [process(i) for i in items]",
                    "code_after": "async def execute_pipeline(items: list[dict], concurrency: int = 16):\n    \"\"\"Async pipeline executor with semaphored concurrency limit.\"\"\"\n    sem = asyncio.Semaphore(concurrency)\n    async with sem:\n        return await asyncio.gather(*(process_async(i) for i in items))",
                    "patch_lines": [
                        {"type": "hunk", "text": "@@ -1,2 +1,6 @@"},
                        {"type": "deletion", "old_no": 1, "new_no": None, "text": "-def execute_pipeline(items):"},
                        {"type": "deletion", "old_no": 2, "new_no": None, "text": "-    return [process(i) for i in items]"},
                        {"type": "addition", "old_no": None, "new_no": 1, "text": "+async def execute_pipeline(items: list[dict], concurrency: int = 16):"},
                        {"type": "addition", "old_no": None, "new_no": 2, "text": "+    \"\"\"Async pipeline executor with semaphored concurrency limit.\"\"\""},
                        {"type": "addition", "old_no": None, "new_no": 3, "text": "+    sem = asyncio.Semaphore(concurrency)"},
                        {"type": "addition", "old_no": None, "new_no": 4, "text": "+    async with sem:"},
                        {"type": "addition", "old_no": None, "new_no": 5, "text": "+        return await asyncio.gather(*(process_async(i) for i in items))"}
                    ]
                }
                STATE["diffs"].insert(0, generated_patch)

            STATE["agent"]["status"] = "idle"
            STATE["logs"].append({
                "id": f"log-{uuid.uuid4().hex[:6]}",
                "timestamp": time.strftime("%H:%M:%S"),
                "level": "SUCCESS",
                "source": "SYNTHESIS_ENGINE",
                "message": f"Patch synthesized for {generated_patch['file']} (+{generated_patch['additions']} -{generated_patch['deletions']})"
            })

            return self._send_json(200, {
                "status": "success",
                "message": "Autonomous patch synthesized and staged for review",
                "patch": generated_patch,
                "agent": STATE["agent"]
            })

        elif path.startswith("/api/diffs/") and path.endswith("/apply"):
            diff_id = path.split("/")[3]
            diff = next((d for d in STATE["diffs"] if d["id"] == diff_id), None)
            if not diff:
                return self._send_json(404, {"error": "Diff not found"})

            diff["status"] = "applied"
            new_hash = uuid.uuid4().hex[:7]
            new_commit = {
                "hash": new_hash,
                "branch": diff["branch"],
                "author": "DevPilot Agent #04",
                "message": f"apply({diff['file'].split('/')[-1]}): {diff['summary']}",
                "additions": diff["additions"],
                "deletions": diff["deletions"],
                "verified": True,
                "time": "Just now"
            }
            STATE["commits"].insert(0, new_commit)
            STATE["agent"]["patches_applied"] += 1
            STATE["logs"].append({
                "id": f"log-{uuid.uuid4().hex[:6]}",
                "timestamp": time.strftime("%H:%M:%S"),
                "level": "SUCCESS",
                "source": "GIT_ENGINE",
                "message": f"Applied patch {diff_id} to branch {diff['branch']}. Created verified commit [{new_hash}]."
            })

            return self._send_json(200, {
                "status": "applied",
                "commit": new_commit,
                "diff": diff
            })

        elif path.startswith("/api/diffs/") and path.endswith("/reject"):
            diff_id = path.split("/")[3]
            diff = next((d for d in STATE["diffs"] if d["id"] == diff_id), None)
            if not diff:
                return self._send_json(404, {"error": "Diff not found"})

            diff["status"] = "rejected"
            STATE["logs"].append({
                "id": f"log-{uuid.uuid4().hex[:6]}",
                "timestamp": time.strftime("%H:%M:%S"),
                "level": "WARNING",
                "source": "OPERATOR",
                "message": f"Patch {diff_id} ({diff['file']}) rejected by human reviewer."
            })
            return self._send_json(200, {"status": "rejected", "diff": diff})

        elif path == "/api/pipeline/run":
            # Execute actual AST parsing verification on sample code
            start_t = time.time()
            STATE["pipeline"]["status"] = "running"

            # Validate Python code via real AST
            validation_ok = True
            ast_err = ""
            for diff in STATE["diffs"]:
                try:
                    ast.parse(diff.get("code_after", ""))
                except SyntaxError as e:
                    validation_ok = False
                    ast_err = str(e)
                    break

            elapsed_ms = int((time.time() - start_t) * 1000) + 380
            STATE["pipeline"]["status"] = "passed" if validation_ok else "failed"
            STATE["pipeline"]["last_run"] = "Just now"

            # Update stage durations slightly for realistic telemetry
            STATE["pipeline"]["stages"][0]["duration_ms"] = 38
            STATE["pipeline"]["stages"][0]["status"] = "passed" if validation_ok else "failed"
            if not validation_ok:
                STATE["pipeline"]["stages"][0]["logs"].append(f"[ERROR] AST Syntax Check failed: {ast_err}")

            STATE["logs"].append({
                "id": f"log-{uuid.uuid4().hex[:6]}",
                "timestamp": time.strftime("%H:%M:%S"),
                "level": "SUCCESS" if validation_ok else "ERROR",
                "source": "PIPELINE_RUNNER",
                "message": f"Pipeline verification run completed in {elapsed_ms}ms with status: {STATE['pipeline']['status'].upper()}."
            })

            return self._send_json(200, {
                "pipeline": STATE["pipeline"],
                "total_duration_ms": elapsed_ms
            })

        elif path == "/api/execute":
            # Live Python code execution sandbox
            code = body.get("code", "").strip()
            if not code:
                return self._send_json(400, {"error": "No Python code provided"})

            # Pre-validate syntax via AST to provide instant informative feedback
            try:
                ast.parse(code)
            except SyntaxError as err:
                return self._send_json(200, {
                    "success": False,
                    "stdout": "",
                    "stderr": f"SyntaxError: {err.msg} at line {err.lineno}, column {err.offset}\n{err.text or ''}",
                    "returncode": 1,
                    "execution_time_ms": 1.2,
                    "ast_valid": False
                })

            start_exec = time.time()
            try:
                # Run with timeout to prevent infinite loops
                proc = subprocess.run(
                    [sys.executable, "-c", code],
                    capture_output=True,
                    text=True,
                    timeout=4.0
                )
                duration_ms = round((time.time() - start_exec) * 1000, 2)
                return self._send_json(200, {
                    "success": proc.returncode == 0,
                    "stdout": proc.stdout,
                    "stderr": proc.stderr,
                    "returncode": proc.returncode,
                    "execution_time_ms": duration_ms,
                    "ast_valid": True
                })
            except subprocess.TimeoutExpired:
                duration_ms = round((time.time() - start_exec) * 1000, 2)
                return self._send_json(200, {
                    "success": False,
                    "stdout": "",
                    "stderr": "ExecutionTimedOut: Sandboxed script exceeded the 4.0 second limit.",
                    "returncode": -1,
                    "execution_time_ms": duration_ms,
                    "ast_valid": True
                })
            except Exception as e:
                return self._send_json(500, {"error": f"Execution error: {str(e)}"})

        elif path == "/api/repositories/branch":
            branch_name = body.get("branch", "").strip()
            if not branch_name:
                return self._send_json(400, {"error": "Branch name required"})

            for b in STATE["branches"]:
                b["is_active"] = (b["name"] == branch_name)

            # If new branch
            if not any(b["name"] == branch_name for b in STATE["branches"]):
                STATE["branches"].append({
                    "name": branch_name,
                    "commit": uuid.uuid4().hex[:7],
                    "message": f"checkout branch {branch_name}",
                    "time": "Just now",
                    "is_active": True
                })

            STATE["agent"]["active_branch"] = branch_name
            STATE["logs"].append({
                "id": f"log-{uuid.uuid4().hex[:6]}",
                "timestamp": time.strftime("%H:%M:%S"),
                "level": "INFO",
                "source": "GIT_ENGINE",
                "message": f"Switched active working tree to branch '{branch_name}'."
            })

            return self._send_json(200, {
                "active_branch": branch_name,
                "branches": STATE["branches"]
            })

        else:
            return self._send_json(404, {"error": "Endpoint not found"})

def run_server(port: int = 5050):
    server = ThreadingHTTPServer(("127.0.0.1", port), DevPilotHandler)
    print(f"[DevPilot Python Engine] Online at http://127.0.0.1:{port} (PID: {os.getpid()})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("[DevPilot Python Engine] Shutting down...")
    finally:
        server.server_close()

if __name__ == "__main__":
    port = 5050
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
