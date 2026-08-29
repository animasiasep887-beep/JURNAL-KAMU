const { spawn } = require('child_process');

console.log('🚀 Menjalankan Web Dashboard & Telegram Bot Server secara bersamaan...\n');

// 1. Jalankan Vite
const vite = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

// 2. Jalankan Telegram Bot
const bot = spawn('node', ['server/bot.cjs'], { stdio: 'inherit', shell: true });

function cleanup() {
  console.log('\n🛑 Menghentikan semua service...');
  try { vite.kill(); } catch (e) {}
  try { bot.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
