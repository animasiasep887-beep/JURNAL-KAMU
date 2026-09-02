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

    // 1.5 API: /api/sync (Bidirectional Web <-> Telegram Bot Sync)
    if (pathname === '/api/sync') {
      if (req.method === 'GET') {
        try {
          const userId = parsedUrl.searchParams.get('userId');
          if (fs.existsSync(DB_PATH)) {
            const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
            let resData = db;
            if (userId) {
              resData = {
                transactions: (db.transactions || []).filter(t => t.userId === userId || !t.userId),
                journals: (db.journals || []).filter(j => j.userId === userId || !j.userId),
                tasks: (db.tasks || []).filter(t => t.userId === userId || !t.userId),
                workouts: (db.workouts || []).filter(w => w.userId === userId || !w.userId),
                bindings: db.bindings || {},
                codes: db.codes || {}
              };
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, data: resData }));
          }
        } catch (e) {
          console.error('Error in GET /api/sync:', e);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, data: { transactions: [], journals: [], tasks: [], workouts: [] } }));
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const clientData = JSON.parse(body || '{}');
            if (fs.existsSync(DB_PATH)) {
              const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
              
              // Helper to merge arrays by unique 'id'
              const mergeById = (existingArr = [], newArr = []) => {
                const map = new Map();
                existingArr.forEach(item => { if (item && item.id) map.set(item.id, item); });
                newArr.forEach(item => { if (item && item.id) map.set(item.id, item); });
                return Array.from(map.values());
              };

              if (Array.isArray(clientData.transactions)) {
                db.transactions = mergeById(db.transactions, clientData.transactions);
              }
              if (Array.isArray(clientData.journals)) {
                db.journals = mergeById(db.journals, clientData.journals);
              }
              if (Array.isArray(clientData.tasks)) {
                db.tasks = mergeById(db.tasks, clientData.tasks);
              }
              if (Array.isArray(clientData.workouts)) {
                db.workouts = mergeById(db.workouts, clientData.workouts);
              }
              if (clientData.userSummaries && clientData.userId) {
                if (!db.userSummaries) db.userSummaries = {};
                db.userSummaries[clientData.userId] = clientData.userSummaries;
              }

              fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({
                success: true,
                merged: {
                  transactions: db.transactions,
                  journals: db.journals,
                  tasks: db.tasks,
                  workouts: db.workouts
                }
              }));
            }
          } catch (e) {
            console.error('Error in POST /api/sync:', e);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Sync failed' }));
        });
        return;
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

    // 2.5 API: /api/test-notification
    if (pathname === '/api/test-notification' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const chatId = parsed.chatId || '6356373334';
          const code = parsed.code || 'A7K92P';
          const name = parsed.name || 'Pengguna Life OS';
          const BOT_TOKEN = process.env.BOT_TOKEN || '8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0';

          const text = `🔔 **TEST NOTIFIKASI TELEGRAM BERHASIL!** 🚀\n\nHalo **${name}**! Akun Personal Life OS Anda (Kode: \`${code}\`) resmi terhubung 100% secara real-time!\n\n✨ **Fitur Aktif:**\n• Catat Pengeluaran (*Kopi 15k*)\n• Catat Pemasukan (*Gaji 5jt bank*)\n• Tulis Jurnal Harian (*jurnaling: ...*)\n• Cek Saldo & Keborosan (*cek keuangan*)\n\nSemua data Anda aman, privat, dan terpisah untuk akun Anda sendiri! 🎉💪`;

          const postData = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' });
          const tgReq = https.request(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
            }
          }, (tgRes) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, statusCode: tgRes.statusCode }));
          });
          tgReq.on('error', (err) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          });
          tgReq.write(postData);
          tgReq.end();
        } catch (e) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
        }
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
