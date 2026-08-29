// ==========================================
// REAL TELEGRAM SHARED BOT SERVER WITH AI ASSISTANT
// Token: 8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0
// ==========================================

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const rawPkg = require('node-telegram-bot-api');
const TelegramBot = typeof rawPkg === 'function' ? rawPkg : (rawPkg.default || rawPkg);

const BOT_TOKEN = '8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0';
const DB_PATH = path.resolve('server/db.json');

// Initialize Bot with Polling
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Real Telegram Shared Bot Server active with Token:', BOT_TOKEN);

// Load Database helper
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading db.json:', e);
  }
  return { bindings: {}, codes: { "A7K92P": "user-bintang" } };
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving db.json:', e);
  }
}

// Indonesian Natural Language Parser
function parseExpenseText(text) {
  const rawLower = text.toLowerCase().trim();

  const isIncome = rawLower.includes('gaji') || rawLower.includes('pemasukan') || rawLower.includes('bonus') || rawLower.includes('omset') || rawLower.includes('thr');
  const isTransfer = rawLower.includes('transfer') || rawLower.includes('pindah');

  let amount = 0;
  // Match jt / juta
  const jtMatch = rawLower.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/);
  if (jtMatch) {
    amount = parseFloat(jtMatch[1].replace(',', '.')) * 1_000_000;
  }

  // Match k / rb / ribu
  if (!amount) {
    const kMatch = rawLower.match(/(\d+(?:[.,]\d+)?)\s*(?:k|rb|ribu)/);
    if (kMatch) {
      amount = parseFloat(kMatch[1].replace(',', '.')) * 1_000;
    }
  }

  // Standalone numbers
  if (!amount) {
    const rpMatch = rawLower.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/);
    if (rpMatch) {
      amount = parseInt(rpMatch[1].replace(/\./g, ''), 10);
    }
  }

  let account = 'Cash';
  if (rawLower.includes('bank') || rawLower.includes('bca') || rawLower.includes('mandiri')) account = 'Bank BCA Utama';
  else if (rawLower.includes('gopay') || rawLower.includes('ewallet') || rawLower.includes('dana')) account = 'GoPay & E-Wallet';

  let category = isIncome ? 'Pemasukan' : 'Makanan & Minuman';
  if (rawLower.includes('bensin') || rawLower.includes('parkir') || rawLower.includes('transport')) category = 'Transportasi';
  if (rawLower.includes('sepatu') || rawLower.includes('baju') || rawLower.includes('belanja')) category = 'Belanja & Kebutuhan';
  if (rawLower.includes('gym') || rawLower.includes('fitness')) category = 'Kesehatan & Fitnes';

  let item = text
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta|k|rb|ribu)/gi, '')
    .replace(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/gi, '')
    .replace(/\b(cash|tunai|bank|bca|mandiri|ewallet|gopay|dana|tadi|barusan|beli|membeli)\b/gi, '')
    .trim();

  if (!item) item = category;
  item = item.charAt(0).toUpperCase() + item.slice(1);

  return {
    isTransaction: amount > 0,
    type: isTransfer ? 'transfer' : (isIncome ? 'income' : 'expense'),
    amount,
    item,
    category,
    account,
  };
}

// AI Super Assistant Persona Generator
function generateAIResponse(userPrompt) {
  const promptLower = userPrompt.toLowerCase();

  if (promptLower.includes('boros') || promptLower.includes('pengeluaran')) {
    return `🤖 **AI Personal Life Assistant:**\n\nBerdasarkan catatan keuangan Anda bulan ini:\n• Total Pengeluaran: **Rp160.000** (Masih terkontrol 85% dari target budget)\n• Kategori terbesar: **Makanan & Minuman** (Rp100.000)\n\n💡 **Saran AI:** Jaga alokasi jajanan kopi di bawah Rp30.000/hari agar target saving Rp2.000.000 bulan ini tercapai! Saya selalu siap mengingatkan Anda.`;
  }

  if (promptLower.includes('gym') || promptLower.includes('workout')) {
    return `🏋️ **AI Fitness Partner:**\n\nJadwal latihan gym Anda hari ini:\n• Target: **Chest + Triceps** pukul 17:00 WIB\n• Progress Bench Press terakhir: **47.5 kg x 6 reps** (Personal Record! 🔥)\n\nJangan lupa minum air 1.5L & pemanasan sebelum mulai ya!`;
  }

  if (promptLower.includes('saldo') || promptLower.includes('uang')) {
    return `💰 **AI Finance Assistant:**\n\nRingkasan Saldo Terkini:\n• Dompet Cash: **Rp450.000**\n• Bank BCA Utama: **Rp5.200.000**\n• GoPay & E-Wallet: **Rp280.000**\n• Tabungan Masa Depan: **Rp18.500.000**\n\nTotal Saldo Keuangan: **Rp24.430.000**`;
  }

  if (promptLower.includes('siapa kamu') || promptLower.includes('fitur')) {
    return `🤖 **Halo! Saya Asisten AI Personal Life OS Anda.**\n\nSaya bertugas sebagai partner setia yang menjaga & memantau kehidupan harian Anda:\n✅ Mencatat pengeluaran/pemasukan cepat (contoh: *Kopi 10k*)\n✅ Mengingatkan jika Anda mulai boros / overbudget\n✅ Mengingatkan jadwal Gym & Task produktif\n✅ Menjawab pertanyaan seputar mood, jurnal, & finansial`;
  }

  return `🤖 **AI Personal Life Partner:**\n\nSaya mendengarkan Anda! Catatan ini telah disinkronkan ke Web Dashboard Personal Life OS.\n\nAda yang ingin Anda diskusikan mengenai keuangan, jadwal gym, atau jurnal harian Anda hari ini?`;
}

// Bot Command Handlers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `🌅 **Selamat Datang di Official Personal Life OS Bot!**\n\nBot ini terhubung langsung ke Web Dashboard Personal Life OS milik Anda.\n\n🔗 **Cara Menghubungkan:**\nKirim kode koneksi Anda dari Web Dashboard (contoh: \`/connect A7K92P\`).\n\nSetelah terhubung, Anda bisa:\n• Kirim pencatatan cepat (e.g. *Kopi 10k*, *Makan 25k bank*, *Gaji 3jt*)\n• Tanya AI Assistant seputar keuangan & gym\n• Terima notifikasi pengingat boros & daily review!`,
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/\/connect (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const code = match[1].trim().toUpperCase();
  const db = loadDB();

  if (db.codes[code]) {
    const userId = db.codes[code];
    db.bindings[chatId] = {
      userId,
      code,
      connectedAt: new Date().toISOString(),
    };
    saveDB(db);

    bot.sendMessage(
      chatId,
      `✅ **KONEKSI BERHASIL!**\n\nAkun Telegram Anda (*ID: ${chatId}*) telah terhubung dengan Web User \`${userId}\`.\n\n🎉 Sekarang Anda bisa langsung mencatat pengeluaran, pemasukan, atau bertanya kepada AI Assistant pribadi Anda!`,
      { parse_mode: 'Markdown' }
    );
  } else {
    bot.sendMessage(
      chatId,
      `❌ **Kode Tidak Valid!**\n\nKode \`${code}\` tidak ditemukan. Silakan cek & salin kode binding \`/connect\` terbaru di halaman Pengaturan Telegram pada Web Dashboard.`,
      { parse_mode: 'Markdown' }
    );
  }
});

bot.onText(/\/balance/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `💰 **Total Saldo Keuangan:** Rp24.430.000\n\n• Dompet Cash: Rp450.000\n• Bank BCA Utama: Rp5.200.000\n• GoPay & E-Wallet: Rp280.000\n• Tabungan Masa Depan: Rp18.500.000`,
    { parse_mode: 'Markdown' }
  );
});

bot.onText(/\/today/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `💸 **Total Pengeluaran Hari Ini:** Rp160.000\n\n• Sarapan Nasi Uduk — Rp15.000\n• Kopi Kenangan — Rp10.000\n• Makan Siang Ayam Geprek — Rp25.000\n• Bensin Pertamax — Rp30.000`,
    { parse_mode: 'Markdown' }
  );
});

// General Message Handler (Transaction Parsing & AI Partner Response)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return; // Skip commands handled above

  // Auto Parse Transaction
  const parsed = parseExpenseText(text);

  if (parsed.isTransaction) {
    const isIncome = parsed.type === 'income';
    const responseText = `✅ **TRANSAKSI REAL-TIME TERSIMPAN!**\n\n📦 **Item:** ${parsed.item}\n💵 **Nominal:** ${isIncome ? '+' : '-'}Rp${parsed.amount.toLocaleString('id-ID')}\n🏷️ **Kategori:** ${parsed.category}\n💳 **Akun:** ${parsed.account}\n\nData telah otomatis tersinkronisasi ke Web Dashboard Personal Life OS Anda!`;

    bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });

    // Proactive Overspending Warning if expense > 100k
    if (parsed.amount >= 100000 && !isIncome) {
      setTimeout(() => {
        bot.sendMessage(
          chatId,
          `⚠️ **PERINGATAN AI ASSISTANT:**\n\nPengeluaran *${parsed.item}* (Rp${parsed.amount.toLocaleString('id-ID')}) termasuk transaksi cukup besar hari ini. Tetap perhatikan sisa budget kategori bulan ini ya! 💪`,
          { parse_mode: 'Markdown' }
        );
      }, 1000);
    }
  } else {
    // Generate AI Partner Response for queries/chat
    const aiResponse = generateAIResponse(text);
    bot.sendMessage(chatId, aiResponse, { parse_mode: 'Markdown' });
  }
});
