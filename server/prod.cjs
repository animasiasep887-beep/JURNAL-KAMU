// ==========================================
// PRODUCTION HTTP SERVER FOR RAILWAY & CLOUD HOSTING
// Serves Vite dist/ static assets + Handles /api/* endpoints + Runs Telegram Bot
// ==========================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DIST_DIR = path.resolve('dist');
const DB_PATH = path.resolve('server/db.json');

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

// Start Telegram Bot in background
console.log('🤖 Starting Telegram Bot AI Daemon in production...');
const botProcess = spawn('node', ['server/bot.cjs'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env },
});

botProcess.on('error', (err) => {
  console.error('Telegram bot process error:', err);
});

// Master Request Handler
function handleRequest(req, res) {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    // Health check endpoint for Railway & Load Balancers
    if (pathname === '/health' || pathname === '/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));
    }

    // 1. API: /api/db (Read/Sync shared db.json)
    if (pathname === '/api/db') {
      if (req.method === 'GET') {
        try {
          if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(data);
          }
        } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ bindings: {}, transactions: [], journals: [], tasks: [], workouts: [] }));
      }
    }

    // 2. API: /api/sync-user-summary
    if (pathname === '/api/sync-user-summary' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.userId && fs.existsSync(DB_PATH)) {
            const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            if (!db.userSummaries) db.userSummaries = {};
            db.userSummaries[parsed.userId] = parsed;
            fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
          }
        } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      });
      return;
    }

    // 3. Static Files from dist/
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html'); // SPA fallback
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><title>Jurnal Kamu - Loading</title></head><body style="background:#0f172a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><h2>🚀 Life OS & Bot Server is Initializing...</h2></body></html>`);
    }
  } catch (err) {
    console.error('Request handler error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

// Bind to multiple ports to ensure Railway routing always matches
const ports = Array.from(new Set([
  parseInt(process.env.PORT || '3000', 10),
  3000,
  8080
])).filter(p => !isNaN(p) && p > 0);

ports.forEach(port => {
  try {
    const s = http.createServer(handleRequest);
    s.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Production Life OS Server Running on Port ${port} (0.0.0.0:${port})`);
    });
    s.on('error', (err) => {
      if (err.code !== 'EADDRINUSE') {
        console.warn(`Server port ${port} warning:`, err.message);
      }
    });
  } catch (e) {}
});

console.log('🤖 Telegram Bot AI Active & Synchronized');

// Cleanup on exit
function shutdown() {
  console.log('Shutting down server and bot process...');
  try { botProcess.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
