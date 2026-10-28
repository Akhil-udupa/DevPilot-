import express, { Request, Response } from 'express';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const PYTHON_PORT = 5050;

let pythonProcess: ChildProcess | null = null;

// Start Python Backend Daemon
function startPythonBackend() {
  console.log(`[DevPilot Bridge] Spawning Python Backend on port ${PYTHON_PORT}...`);
  pythonProcess = spawn('python3', [path.join(__dirname, 'backend', 'server.py'), String(PYTHON_PORT)], {
    stdio: 'inherit',
  });

  pythonProcess.on('error', (err) => {
    console.error('[DevPilot Bridge] Failed to spawn Python backend:', err);
  });

  pythonProcess.on('exit', (code, signal) => {
    console.log(`[DevPilot Bridge] Python backend exited with code ${code}, signal ${signal}`);
  });
}

async function createServer() {
  startPythonBackend();

  const app = express();
  app.use(express.json());

  // Proxy /api/* to Python Backend
  app.all('/api/*', async (req: Request, res: Response) => {
    const targetUrl = `http://127.0.0.1:${PYTHON_PORT}${req.originalUrl}`;
    try {
      const init: RequestInit = {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        },
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        init.body = JSON.stringify(req.body);
      }

      const pyResponse = await fetch(targetUrl, init);
      const data = await pyResponse.text();

      res.status(pyResponse.status);
      res.setHeader('Content-Type', pyResponse.headers.get('content-type') || 'application/json');
      res.send(data);
    } catch (err: any) {
      console.error(`[DevPilot Proxy Error] ${req.method} ${req.originalUrl}:`, err.message);
      res.status(502).json({
        error: 'DevPilot Python Engine unavailable or starting up',
        details: err.message,
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DevPilot Control Plane] Online at http://0.0.0.0:${PORT}`);
  });

  const shutdown = () => {
    console.log('[DevPilot] Graceful shutdown initiated...');
    if (pythonProcess) {
      pythonProcess.kill('SIGTERM');
    }
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

createServer().catch((err) => {
  console.error('[DevPilot] Failed to start server:', err);
  process.exit(1);
});
