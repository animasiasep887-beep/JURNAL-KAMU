// ==========================================
// PRODUCTION HTTP SERVER FOR RAILWAY & CLOUD HOSTING
// Serves Vite dist/ static assets + Handles /api/* endpoints + Runs Telegram Bot
// ==========================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
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
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
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

// Create HTTP Web Server
const server = http.createServer((req, res) => {
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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found - Please run "npm run build" first.');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==========================================`);
  console.log(`🚀 Production Life OS Server Running on Port ${PORT}`);
  console.log(`🌐 Accessible at http://0.0.0.0:${PORT}`);
  console.log(`🤖 Telegram Bot Active & Synchronized`);
  console.log(`==========================================\n`);
});

// Cleanup on exit
function shutdown() {
  console.log('Shutting down server and bot process...');
  try { botProcess.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
