import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import https from 'https'

const BOT_TOKEN = '8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-db-sync',
      configureServer(server) {
        // 1. /api/db endpoint
        server.middlewares.use('/api/db', (_req, res) => {
          try {
            const dbPath = path.resolve('server/db.json');
            if (fs.existsSync(dbPath)) {
              const data = fs.readFileSync(dbPath, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
              return;
            }
          } catch (e) {}
          res.end(JSON.stringify({ transactions: [], journals: [], bindings: {} }));
        });

        // 2. /api/test-notification endpoint (Triggers real HTTPS Telegram push message)
        server.middlewares.use('/api/test-notification', (req, res) => {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const chatId = parsed.chatId || '6356373334';
              const code = parsed.code || 'AD990X';
              const name = parsed.name || 'Pengguna Life OS';

              const text = `🔔 **TEST NOTIFIKASI TELEGRAM BERHASIL!** 🚀\n\nHalo **${name}**! Akun Personal Life OS Anda (Kode: \`${code}\`) resmi terhubung 100% secara real-time!\n\n✨ **Fitur Aktif:**\n• Catat Pengeluaran (*Kopi 15k*)\n• Catat Pemasukan (*Gaji 5jt bank*)\n• Tulis Jurnal Harian (*jurnaling: ...*)\n• Cek Saldo & Keborosan (*cek keuangan*)\n\nSemua data Anda aman, privat, dan terpisah untuk akun Anda sendiri! 🎉💪`;

              const postData = JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'Markdown'
              });

              const tgReq = https.request(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(postData)
                }
              }, (tgRes) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, statusCode: tgRes.statusCode }));
              });

              tgReq.on('error', (err) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              });

              tgReq.write(postData);
              tgReq.end();
            } catch (e) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false }));
            }
          });
        });

        // 3. /api/sync-user-summary endpoint (Syncs real-time balances, accounts, and tasks per user)
        server.middlewares.use('/api/sync-user-summary', (req, res) => {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const summary = JSON.parse(body || '{}');
              const dbPath = path.resolve('server/db.json');
              let dbData: any = { bindings: {}, codes: {}, userSummaries: {} };
              if (fs.existsSync(dbPath)) {
                dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
              }
              if (!dbData.userSummaries) dbData.userSummaries = {};
              
              if (summary.code) {
                dbData.userSummaries[summary.code] = summary;
              }
              if (summary.userId) {
                dbData.userSummaries[summary.userId] = summary;
              }

              fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false }));
            }
          });
        });
      }
    }
  ],
  server: {
    watch: {
      ignored: ['**/server/**', '**/server/db.json', '**/node_modules/**', '**/.git/**']
    }
  }
})
