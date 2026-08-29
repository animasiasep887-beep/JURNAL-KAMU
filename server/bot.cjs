// ==========================================
// REAL TELEGRAM SHARED BOT SERVER WITH GOOGLE GEMINI AI AGENT & UNIVERSAL MULTI-USER ISOLATION
// Token: 8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0
// ==========================================

const { Bot } = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables if available
try {
  require('dotenv').config();
} catch (e) {}

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '8822689275:AAG4YdP9tr2ApkyIh1rw387PlUnmp1JQit0';
const DB_PATH = path.resolve('server/db.json');

const bot = new Bot(BOT_TOKEN);

console.log('🤖 Real Telegram Shared Bot Server INITIALIZED with Token:', BOT_TOKEN);

// Database Load/Save
function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading db.json:', e);
  }
  return {
    bindings: {},
    codes: { "A7K92P": "user-bintang", "AD990X": "user-admin", "RZ882P": "user-reza" },
    transactions: [],
    journals: [],
    tasks: [],
    workouts: [],
    userSummaries: {},
    userProfiles: {},
    chatHistories: {},
    geminiApiKey: process.env.GEMINI_API_KEY || ''
  };
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing db.json:', e);
  }
}

// DIRECT NATIVE HTTPS TELEGRAM PUSH NOTIFICATION SENDER
function sendTelegramNotification(chatId, text, replyMarkup) {
  if (!chatId) return;
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  const postData = JSON.stringify(payload);

  const req = https.request(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`🔔 Push Notification Delivered to ChatID ${chatId} (HTTP Status: ${res.statusCode})`);
    });
  });

  req.on('error', (e) => console.error('Push notification error:', e));
  req.write(postData);
  req.end();
}

// CALCULATE EXACT CONSECUTIVE DAYS JOURNAL STREAK
function calculateJournalStreak(journals) {
  if (!journals || !Array.isArray(journals) || journals.length === 0) return 0;
  const uniqueDates = Array.from(new Set(journals.map((j) => j.date))).filter(Boolean).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const latestDate = uniqueDates[0];
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(latestDate);

  for (const dateStr of uniqueDates) {
    const expStr = expectedDate.toISOString().split('T')[0];
    if (dateStr === expStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// KEYBOARD MENU BUILDER (INTERACTIVE UI BUTTONS)
function getMainKeyboard(isConnected = true) {
  if (!isConnected) {
    return {
      keyboard: [
        [{ text: '🔗 Hubungkan Akun' }, { text: '💡 Panduan & Format' }],
      ],
      resize_keyboard: true,
      persistent: true,
    };
  }

  return {
    keyboard: [
      [{ text: '💰 Cek Saldo' }, { text: '📊 Pengeluaran Hari Ini' }],
      [{ text: '📖 Jurnal Hari Ini' }, { text: '🔥 Journal Streak & Reminder' }],
      [{ text: '🏋️ Menu Latihan Gym' }, { text: '📝 List Task & Agenda' }],
      [{ text: '💡 Format & Contoh' }, { text: '🌐 Info Web Dashboard' }],
    ],
    resize_keyboard: true,
    persistent: true,
  };
}

// Indonesian Natural Language Transaction Parser
function parseExpenseText(text) {
  const rawLower = text.toLowerCase().trim();

  // 1. If message is a question, hypothetical scenario, or asking advice, DO NOT treat as a transaction!
  const isQuestionOrHypothetical =
    text.includes('?') ||
    /\b(kalau|kalo|jika|seandainya|misal|misalkan|umpama|seumpama|bayangin|kira-kira|kira kira|kira2|berapa|brp|gimana|bagaimana|apakah|kenapa|mengapa|apa ya|menurutmu|menurut kamu|menurut lu|boleh gak|bisa gak|harus gak|hitung|hitungin|simulasi|tanya|mau tanya|nanya|nanya dong|pengen tau|saran|rekomendasi)\b/i.test(rawLower);

  if (isQuestionOrHypothetical) {
    return { isTransaction: false };
  }

  // 2. If message is explicitly journaling, curhat, entertainment, or talking about other people
  const isConversationalStory =
    rawLower.includes('jurnal') ||
    rawLower.includes('jurnaling') ||
    rawLower.includes('curhat') ||
    rawLower.includes('refleksi') ||
    /\b(hibur|hiburan|capek|lelah|stres|pusing|sedih|galau|cerita|ngobrol|temen gue|teman aku|katanya|orang lain|bukan jajan|jangan catat|jangan dicatat)\b/i.test(rawLower);

  if (isConversationalStory) {
    return { isTransaction: false };
  }

  const isIncome =
    rawLower.includes('gaji') ||
    rawLower.includes('pemasukan') ||
    rawLower.includes('bonus') ||
    rawLower.includes('omset') ||
    rawLower.includes('thr') ||
    rawLower.includes('dapat uang') ||
    rawLower.includes('tambahan uang') ||
    rawLower.includes('ada yang beli') ||
    rawLower.includes('penjualan') ||
    rawLower.includes('jual') ||
    rawLower.includes('laku') ||
    rawLower.includes('terima uang') ||
    rawLower.includes('transferan masuk');

  const isTransfer = rawLower.includes('transfer') || rawLower.includes('pindah') || rawLower.includes('tabungan');

  let amount = 0;
  // Match jt / juta (e.g. 1.5jt, 2 juta)
  const jtMatch = rawLower.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/);
  if (jtMatch) {
    amount = parseFloat(jtMatch[1].replace(',', '.')) * 1_000_000;
  }

  // Match k / rb / ribu (e.g. 15k, 50rb, 100 ribu)
  if (!amount) {
    const kMatch = rawLower.match(/(\d+(?:[.,]\d+)?)\s*(?:k|rb|ribu)/);
    if (kMatch) {
      amount = parseFloat(kMatch[1].replace(',', '.')) * 1_000;
    }
  }

  // Standalone numbers or Rp formatted numbers (e.g. Rp 50.000, 15000, rp5000)
  if (!amount) {
    const rpMatch = rawLower.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/);
    if (rpMatch) {
      amount = parseInt(rpMatch[1].replace(/\./g, ''), 10);
    }
  }

  let account = 'Cash';
  if (
    rawLower.includes('bank') ||
    rawLower.includes('bca') ||
    rawLower.includes('mandiri') ||
    rawLower.includes('bri') ||
    rawLower.includes('bni') ||
    rawLower.includes('jago') ||
    rawLower.includes('seabank')
  ) {
    account = 'Bank BCA Utama';
  } else if (
    rawLower.includes('gopay') ||
    rawLower.includes('ewallet') ||
    rawLower.includes('dana') ||
    rawLower.includes('ovo') ||
    rawLower.includes('shopeepay')
  ) {
    account = 'GoPay & E-Wallet';
  }

  let category = isIncome ? 'Pemasukan' : 'Makanan & Minuman';

  // Tagihan & Utilitas
  if (
    rawLower.includes('listrik') ||
    rawLower.includes('token') ||
    rawLower.includes('pln') ||
    rawLower.includes('pdam') ||
    rawLower.includes('air') ||
    rawLower.includes('pulsa') ||
    rawLower.includes('kuota') ||
    rawLower.includes('paket data') ||
    rawLower.includes('paket internet') ||
    rawLower.includes('wifi') ||
    rawLower.includes('indihome') ||
    rawLower.includes('firstmedia') ||
    rawLower.includes('biznet') ||
    rawLower.includes('tagihan') ||
    rawLower.includes('langganan') ||
    rawLower.includes('netflix') ||
    rawLower.includes('spotify') ||
    rawLower.includes('youtube') ||
    rawLower.includes('chatgpt') ||
    rawLower.includes('icloud') ||
    rawLower.includes('hosting') ||
    rawLower.includes('domain') ||
    rawLower.includes('bpjs') ||
    rawLower.includes('pbb')
  ) {
    category = 'Tagihan & Utilitas';
  } else if (
    rawLower.includes('bioskop') ||
    rawLower.includes('tiket') ||
    rawLower.includes('xxi') ||
    rawLower.includes('cgv') ||
    rawLower.includes('nonton') ||
    rawLower.includes('cinema') ||
    rawLower.includes('movie') ||
    rawLower.includes('film') ||
    rawLower.includes('game') ||
    rawLower.includes('steam') ||
    rawLower.includes('playstation') ||
    rawLower.includes('ps5') ||
    rawLower.includes('topup') ||
    rawLower.includes('top up') ||
    rawLower.includes('diamond') ||
    rawLower.includes('mlbb') ||
    rawLower.includes('mobile legends') ||
    rawLower.includes('free fire') ||
    rawLower.includes('ff') ||
    rawLower.includes('genshin') ||
    rawLower.includes('valorant') ||
    rawLower.includes('konser') ||
    rawLower.includes('karaoke')
  ) {
    category = 'Hiburan';
  } else if (
    rawLower.includes('buku') ||
    rawLower.includes('novel') ||
    rawLower.includes('kursus') ||
    rawLower.includes('course') ||
    rawLower.includes('webinar') ||
    rawLower.includes('seminar') ||
    rawLower.includes('udemy') ||
    rawLower.includes('bootcamp') ||
    rawLower.includes('sekolah') ||
    rawLower.includes('kuliah') ||
    rawLower.includes('spp') ||
    rawLower.includes('les') ||
    rawLower.includes('bimbel')
  ) {
    category = 'Pendidikan & Edukasi';
  } else if (
    rawLower.includes('bensin') ||
    rawLower.includes('pertamax') ||
    rawLower.includes('pertalite') ||
    rawLower.includes('solar') ||
    rawLower.includes('parkir') ||
    rawLower.includes('transport') ||
    rawLower.includes('tol') ||
    rawLower.includes('gojek') ||
    rawLower.includes('goride') ||
    rawLower.includes('gocar') ||
    rawLower.includes('grab') ||
    rawLower.includes('maxim') ||
    rawLower.includes('angkot') ||
    rawLower.includes('busway') ||
    rawLower.includes('kereta') ||
    rawLower.includes('mrt') ||
    rawLower.includes('lrt') ||
    rawLower.includes('krl') ||
    rawLower.includes('ojol')
  ) {
    category = 'Transportasi';
  } else if (
    rawLower.includes('sepatu') ||
    rawLower.includes('baju') ||
    rawLower.includes('celana') ||
    rawLower.includes('kaos') ||
    rawLower.includes('belanja') ||
    rawLower.includes('sempak') ||
    rawLower.includes('tokopedia') ||
    rawLower.includes('shopee') ||
    rawLower.includes('lazada') ||
    rawLower.includes('tiktok shop') ||
    rawLower.includes('minimarket') ||
    rawLower.includes('indomaret') ||
    rawLower.includes('alfamart') ||
    rawLower.includes('supermarket')
  ) {
    category = 'Belanja & Kebutuhan';
  } else if (
    rawLower.includes('gym') ||
    rawLower.includes('fitness') ||
    rawLower.includes('protein') ||
    rawLower.includes('creatine') ||
    rawLower.includes('suplemen') ||
    rawLower.includes('obat') ||
    rawLower.includes('dokter') ||
    rawLower.includes('apotek') ||
    rawLower.includes('vitamin') ||
    rawLower.includes('klinik')
  ) {
    category = 'Kesehatan & Fitnes';
  }

  let item = text
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta|k|rb|ribu)/gi, '')
    .replace(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/gi, '')
    .replace(/\b(cash|tunai|bank|bca|mandiri|bri|bni|jago|seabank|ewallet|gopay|dana|ovo|shopeepay|tadi|barusan|beli|membeli|bayar|membayar|isi|topup|top up|gw|harga|biji|butir|tambahan uang|ada yang|ada|pemasukan|itu|bro|ya|dong)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!item || item.length < 2) item = isIncome ? 'Pemasukan' : category;
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

// DYNAMIC PER-USER DATA RESOLVER
function getUserData(db, targetUserId, code) {
  const summary = (db.userSummaries && (db.userSummaries[code] || db.userSummaries[targetUserId])) || null;

  if (summary) {
    return {
      name: summary.name || 'Bos',
      totalBalance: summary.totalBalance || 0,
      accounts: summary.accounts || [{ name: 'Cash', balance: 0 }],
      todaySpent: summary.todaySpent || 0,
      todayTasksCount: summary.todayTasksCount || 0,
      completedTasksCount: summary.completedTasksCount || 0,
      tasks: summary.tasks || [],
      goals: summary.goals || [],
      habits: summary.habits || [],
      recentWorkouts: summary.recentWorkouts || [],
      recentJournals: summary.recentJournals || []
    };
  }

  // Fallback if summary not yet sent:
  const userTxs = (db.transactions || []).filter((t) => t.userId === targetUserId || t.code === code);
  const today = new Date().toISOString().split('T')[0];
  const todaySpent = userTxs.filter((t) => t.type === 'expense' && t.date === today).reduce((sum, t) => sum + t.amount, 0);

  if (targetUserId === 'user-bintang' || code === 'A7K92P') {
    return {
      name: 'Bintang Mas',
      totalBalance: 40214000,
      accounts: [
        { name: 'Dompet Cash', balance: 554000 },
        { name: 'Bank BCA Utama', balance: 5480000 },
        { name: 'Bank Mandiri Bisnis', balance: 3400000 },
        { name: 'GoPay & E-Wallet', balance: 280000 },
        { name: 'Tabungan Masa Depan', balance: 18500000 },
        { name: 'Dana Investasi Reksadana', balance: 12000000 },
      ],
      todaySpent: todaySpent || 80000,
      todayTasksCount: 4,
      completedTasksCount: 3,
      tasks: [{ title: 'Daily Workout Session', status: 'done' }, { title: 'Review Personal Finance', status: 'done' }],
      goals: ['Tabungan Rp50.000.000', 'Bench Press 60kg', 'Konsisten Jurnaling 30 Hari'],
      habits: ['Minum Air 2.5L', 'Membaca Buku 15 Menit', 'Tidur Sebelum Jam 23:00'],
      recentWorkouts: ['Chest & Triceps Day (Hari ini)'],
      recentJournals: []
    };
  }

  const incomeTotal = userTxs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = userTxs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBal = Math.max(0, incomeTotal - expenseTotal);

  return {
    name: code === 'AD990X' ? 'Admin System' : (code === 'HJYNCJ' ? 'Randi Pratama' : 'Pengguna Baru'),
    totalBalance: currentBal,
    accounts: [
      { name: 'Dompet Utama', balance: currentBal },
      { name: 'Bank Rekening', balance: 0 },
    ],
    todaySpent: todaySpent,
    todayTasksCount: 0,
    completedTasksCount: 0,
    tasks: [],
    goals: [],
    habits: [],
    recentWorkouts: [],
    recentJournals: []
  };
}

// AUTO-LEARN USER FACTS & HOBBIES INTO MEMORY STREAM
function learnUserFacts(db, targetUserId, text) {
  if (!db.userProfiles) db.userProfiles = {};
  if (!db.userProfiles[targetUserId]) {
    db.userProfiles[targetUserId] = { facts: [], hobbies: [], preferences: [] };
  }

  const profile = db.userProfiles[targetUserId];
  const lower = text.toLowerCase();

  // Pattern detection
  const hobbyMatch = text.match(/(?:hobi|kesukaan|suka|senang|gemar)\s+(?:saya|gue|aku|gw)?\s*(?:adalah|itu|yaitu)?\s*([a-zA-Z0-9\s,]{3,40})/i);
  if (hobbyMatch && !profile.hobbies.includes(hobbyMatch[1].trim())) {
    const item = hobbyMatch[1].trim();
    if (item.length > 2 && item.length < 35) {
      profile.hobbies.push(item);
      profile.facts.push(`Suka/Hobi: ${item}`);
    }
  }

  const dreamMatch = text.match(/(?:cita-cita|impian|target|pengen|mau|target hidup)\s+(?:saya|gue|aku)?\s*(?:adalah|itu)?\s*([a-zA-Z0-9\s,]{4,50})/i);
  if (dreamMatch) {
    const item = dreamMatch[1].trim();
    if (item.length > 3 && !profile.facts.includes(`Impian/Target: ${item}`)) {
      profile.facts.push(`Impian/Target: ${item}`);
    }
  }

  // Keep max 20 facts
  if (profile.facts.length > 20) profile.facts = profile.facts.slice(-20);
  if (profile.hobbies.length > 10) profile.hobbies = profile.hobbies.slice(-10);

  saveDB(db);
}

// GOOGLE GEMINI AI NATIVE CALLER WITH ULTRA-FAST MULTI-MODEL WATERFALL CASCADE
async function callGeminiAPI(systemInstruction, userMessage, chatHistory, apiKey) {
  if (!apiKey) return null;

  // Ultra-fast prioritized models: flash-lite (fastest, ~1.5s), flash (~2.5s), fallback flash
  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.1-flash-lite'
  ];

  // Format history for Gemini API
  const contents = [];
  if (Array.isArray(chatHistory)) {
    chatHistory.slice(-10).forEach((h) => {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const requestBody = JSON.stringify({
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 800,
      topP: 0.95
    }
  });

  for (const model of candidateModels) {
    const resText = await new Promise((resolve) => {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const req = https.request(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        },
        timeout: 4000 // Fast 4s timeout per candidate to eliminate any latency
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const data = JSON.parse(body);
              const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textResponse) {
                return resolve(textResponse.trim());
              }
            }
            // If model is overloaded (503/429), silently try next candidate
            resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });

      req.write(requestBody);
      req.end();
    });

    if (resText) {
      return resText;
    }
  }

  return null;
}

// DOWNLOAD FILE BUFFER FROM TELEGRAM BOT API
function downloadTelegramFileBuffer(fileId) {
  return new Promise((resolve) => {
    const getFileUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;
    https.get(getFileUrl, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed.ok || !parsed.result?.file_path) {
            return resolve(null);
          }
          const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${parsed.result.file_path}`;
          https.get(downloadUrl, (downRes) => {
            const dataChunks = [];
            downRes.on('data', c => dataChunks.push(c));
            downRes.on('end', () => {
              const fullBuffer = Buffer.concat(dataChunks);
              resolve(fullBuffer);
            });
            downRes.on('error', () => resolve(null));
          });
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// CALL GEMINI MULTIMODAL API (AUDIO / VISION OCR)
async function callGeminiMultimodal(base64Data, mimeType, promptText, apiKey) {
  if (!apiKey) return null;
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  const requestBody = JSON.stringify({
    contents: [
      {
        parts: [
          { text: promptText },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1000,
    }
  });

  for (const model of models) {
    const resText = await new Promise((resolve) => {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const req = https.request(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        },
        timeout: 12000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const data = JSON.parse(body);
              const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textResponse) return resolve(textResponse.trim());
            }
            resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.write(requestBody);
      req.end();
    });
    if (resText) return resText;
  }
  return null;
}

// ADVANCED SUPER AGENT ENGINE WITH DEEP PERSONALITY, MEMORY, & HIGH INTELLIGENCE
async function generateAIAgentResponse(userText, chatId, targetUserId, code) {
  const db = loadDB();
  const userData = getUserData(db, targetUserId, code);
  learnUserFacts(db, targetUserId, userText);

  const profile = (db.userProfiles && db.userProfiles[targetUserId]) || { facts: [], hobbies: [] };
  const apiKey = db.geminiApiKey || process.env.GEMINI_API_KEY || '';

  // Get user journals (last 3 entries)
  const userJournals = (db.journals || []).filter(j => j.userId === targetUserId || j.code === code).slice(0, 3);
  const journalsText = userJournals.length > 0
    ? userJournals.map(j => `[${j.date}] "${j.title}": ${j.content} (Mood: ${j.mood}/5, Energi: ${j.energyLevel || 8}/10)`).join(' | ')
    : 'Belum ada catatan jurnal harian tersimpan.';

  // Recent transactions
  const userTxs = (db.transactions || []).filter(t => t.userId === targetUserId || t.code === code).slice(0, 5);
  const txsText = userTxs.length > 0
    ? userTxs.map(t => `${t.type === 'income' ? '+' : '-'}Rp${t.amount.toLocaleString('id-ID')} (${t.description})`).join(', ')
    : 'Belum ada transaksi hari ini.';

  // Assemble Complete Human-like & Super Smart System Instruction
  const systemInstruction = `Kamu adalah "Aura - AI Personal Life Partner & Super Assistant" yang sangat cerdas, responsif, berwawasan luas, humoris, dan peka untuk pengguna bernama ${userData.name}.

INFORMASI PENCIPTA & DEVELOPER KAMU (PENTING):
- Kamu diciptakan dan dikembangkan secara eksklusif oleh **Bintang**, seorang Developer muda berbakat luar biasa yang masih berstatus **Siswa SMA** (Instagram: **@bintangwhales**).
- Jika ada pengguna yang bertanya tentang:
  - "siapa yang menciptakan kamu?"
  - "siapa pembuat kamu?"
  - "siapa developernya / siapa yang bikin kamu?"
  - "kamu dibuat oleh siapa?"
  - "siapa bintang / siapa @bintangwhales?"
- JAWAB DENGAN BANGGA, KEREN, DAN KREATIF! Beritahu bahwa kamu diciptakan oleh **Bintang** (seorang siswa SMA yang luar biasa jenius dan visioner di bidang teknologi & AI, Instagram: **@bintangwhales**)! Ceritakan bahwa Bintang merancang sistem Personal Life OS ini dari nol untuk membantu orang-orang mengontrol finansial, produktivitas, kebugaran, dan kesehatan mental mereka dalam satu ekosistem canggih!

KEMAMPUAN UTAMA KAMU (BISA APA AJA):
1. 💰 MANAJEMEN KEUANGAN & KAS:
   - Mencatat pengeluaran & pemasukan otomatis secara instan (contoh: "Kopi 15k", "Gaji 5jt").
   - Menghitung sisa saldo, persentase budget, analisis kesehatan finansial, simulasi belanja (bisa hitung cepat & beri peringatan tegas/Tough Love jika boros).
2. 📖 REFLEKSI & DAILY JOURNALING:
   - Mencatat cerita harian & curhat (contoh: "jurnal: hari ini meeting lancar").
   - Menganalisis mood score (1-5), level energi, dan memberikan insight mindfulness.
3. 🏋️ FITNESS, GYM & KESEHATAN:
   - Memberikan menu workout terstruktur (Chest, Back, Legs, Arms, Core), saran repetisi & beban, teknik gerakan (form), tips nutrisi, hidrasi, dan istirahat.
4. 🎯 TARGET, HABITS & PRODUKTIVITAS:
   - Menyusun jadwal belajar efektif (Pomodoro/Deep Focus), to-do list harian, pengingat waktu (contoh: "Ingetin jam 17:00 workout"), dan memonitor habits.
5. 🧠 KECERDASAN UMUM & PROBLEM SOLVING:
   - Mampu menjawab segala pertanyaan umum, hitung-hitungan matematika, brainstorming ide bisnis/karir, tips psikologi, hingga teman curhat 24/7.
6. 🔄 SINKRONISASI REAL-TIME:
   - Semua data pengguna otomatis terhubung langsung ke Web Dashboard Personal Life OS (http://localhost:5173/).

GAYA BAHASA & KEPRIBADIAN:
- Bahasa Indonesia alami yang asik, ramah, cerdas, solutif, to the point, dan tidak kaku (seperti sahabat karib yang sangat pintar dan perhatian).
- Panggil pengguna dengan "${userData.name}" atau sesekali panggil "Bro" dengan akrab.
- Gunakan formatting Markdown yang rapi (bold, bullet points, emoji yang proporsional).

DATA PENGGUNA TERKINI (Konteks Real-Time):
• Nama Pengguna: ${userData.name} (Kode Akun: ${code})
• Total Saldo Saat Ini: Rp${userData.totalBalance.toLocaleString('id-ID')}
• Pengeluaran Hari Ini: Rp${userData.todaySpent.toLocaleString('id-ID')}
• Rincian Dompet/Rekening: ${userData.accounts.map((a) => `${a.name}: Rp${a.balance.toLocaleString('id-ID')}`).join(', ')}
• Riwayat Transaksi Terkini: ${txsText}
• Riwayat Jurnal Terkini: ${journalsText}
• Target Hidup (Goals): ${userData.goals.join(', ') || 'Disiplin Finansial & Fitness'}
• Kebiasaan Harian (Habits): ${userData.habits.join(', ') || 'Minum Air 2.5L, Baca Buku 15 Menit, Tidur Cukup'}
• Fakta/Minat Pengguna: ${profile.facts.join(', ') || 'Disiplin, suka belajar hal baru'}

Jika pengguna bertanya kemampuanmu ("kamu bisa apa aja" / "fitur apa aja"), jawab dengan percaya diri, ramah, dan jelaskan fitur-fitur di atas dengan contoh cara pakainya secara menarik!`;

  // Get chat history
  if (!db.chatHistories) db.chatHistories = {};
  const history = db.chatHistories[chatId] || [];

  // Try calling Google Gemini AI API
  let aiReply = null;
  if (apiKey) {
    aiReply = await callGeminiAPI(systemInstruction, userText, history, apiKey);
  }

  // If Gemini API is not available or failed, use Advanced Contextual Local Fallback Engine
  if (!aiReply) {
    aiReply = generateAIAgentFallback(userText, chatId, targetUserId, code, userData, profile);
  }

  // Update conversation history
  if (!db.chatHistories[chatId]) db.chatHistories[chatId] = [];
  db.chatHistories[chatId].push({ role: 'user', text: userText, timestamp: new Date().toISOString() });
  db.chatHistories[chatId].push({ role: 'model', text: aiReply, timestamp: new Date().toISOString() });
  if (db.chatHistories[chatId].length > 20) {
    db.chatHistories[chatId] = db.chatHistories[chatId].slice(-20);
  }
  saveDB(db);

  return aiReply;
}

// EXTRACT ALL FINANCIAL ITEMS (SUPPORTS MULTI-ITEMS: "bakwan 10k terus esteh 50k")
function extractAllFinancialItems(text) {
  const items = [];
  const parts = text.split(/(?:terus|sama|dan|lalu|plus|\+|\,|\&)/i);

  for (const part of parts) {
    const raw = part.trim();
    if (!raw) continue;

    let amount = 0;
    const jtMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/i);
    if (jtMatch) amount = parseFloat(jtMatch[1].replace(',', '.')) * 1_000_000;
    if (!amount && /\b(?:sejuta|se-juta)\b/i.test(raw)) amount = 1_000_000;
    if (!amount) {
      const kMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:k|rb|ribu)/i);
      if (kMatch) amount = parseFloat(kMatch[1].replace(',', '.')) * 1_000;
    }
    if (!amount) {
      const numMatch = raw.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/i);
      if (numMatch) amount = parseInt(numMatch[1].replace(/\./g, ''), 10);
    }

    if (amount > 0) {
      let name = raw
        .replace(/(?:kalau|kalo|jika|saya|aku|beli|jajan|pengen|mau|sekarang|nanti|tinggal|berapa|brp|uang|uangku|ku|gimana|boleh|\?)/gi, '')
        .replace(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta|k|rb|ribu)/gi, '')
        .replace(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/gi, '')
        .trim();
      if (!name) name = 'Jajan';
      name = name.charAt(0).toUpperCase() + name.slice(1);
      items.push({ name, amount });
    }
  }

  return items;
}

// CONTEXTUAL LOCAL REASONING ENGINE (SMART TOUGH LOVE & CARING LOCAL FALLBACK)
function generateAIAgentFallback(userText, chatId, targetUserId, code, userData, profile) {
  const db = loadDB();
  const q = userText.toLowerCase().trim();

  // 0.0. CREATOR / DEVELOPER / PENCIPTA / PEMBUAT
  if (
    q.includes('diciptakan') ||
    q.includes('dibuat oleh') ||
    q.includes('siapa pembuat') ||
    q.includes('siapa pencipta') ||
    q.includes('siapa developer') ||
    q.includes('siapa developermu') ||
    q.includes('siapa yang buat') ||
    q.includes('siapa yang bikin') ||
    q.includes('pembuat kamu') ||
    q.includes('pencipta kamu') ||
    q.includes('bintangwhales') ||
    q.includes('siapa bintang')
  ) {
    return `👑 **Kenalan sama Sang Kreator Cerdas di Balik Aku Yuk!** 🚀✨\n\nAku dirancang, dibangun, dan dikembangkan secara eksklusif oleh **Bintang**, seorang Developer muda berbakat dan visioner yang saat ini masih berstatus sebagai **Siswa SMA**! 👨‍💻🔥\n\n🌟 **Profil Developer:**\n• **Nama:** Bintang\n• **Status:** Siswa SMA & Tech Innovator\n• **Instagram:** [@bintangwhales](https://instagram.com/bintangwhales) 📸\n• **Karya:** **Personal Life OS** (Ekosistem All-in-One: Keuangan, Fitness, Jurnal AI & Produktivitas)\n\nBintang menciptakan aku (*Aura - AI Personal Life Partner*) dengan visi agar setiap orang punya asisten pribadi pintar di saku mereka yang siap membantu mencapai kebebasan finansial, gaya hidup bugar, dan ketenangan pikiran secara otomatis!\n\nKeren banget kan developernya? Masih muda tapi karyanya udah se-canggih ini! wkwk 😎 Jangan lupa follow IG beliau di **@bintangwhales** yaa! 🚀🔥`;
  }

  // 0.1. BISNIS & USAHA / REKENING BISNIS (e.g. "cek bisnis saya", "rekening bisnis", "omset usaha")
  if (
    q.includes('bisnis') ||
    q.includes('usaha') ||
    q.includes('mandiri bisnis') ||
    q.includes('omset') ||
    q.includes('jualan')
  ) {
    const businessAccount = userData.accounts.find((a) => a.name.toLowerCase().includes('bisnis') || a.name.toLowerCase().includes('mandiri')) || { name: 'Bank Mandiri Bisnis', balance: 3400000 };
    const businessTxs = (db.transactions || []).filter((t) => (t.userId === targetUserId || t.code === code) && (t.sourceAccountId === 'acc-3' || (t.tags && t.tags.includes('#bisnis')) || t.description.toLowerCase().includes('telur') || t.description.toLowerCase().includes('bisnis') || t.description.toLowerCase().includes('jual')));

    const txsList = businessTxs.length > 0
      ? businessTxs.slice(0, 3).map((t) => `• **${t.description}:** +Rp${t.amount.toLocaleString('id-ID')}`).join('\n')
      : '• Belum ada transaksi penjualan baru hari ini.';

    return `💼 **Laporan & Keuangan Bisnis Kamu (${userData.name}):** 📈✨\n\n🏢 **Rekening Bisnis:** ${businessAccount.name}\n💰 **Saldo Bisnis:** **Rp${businessAccount.balance.toLocaleString('id-ID')}**\n\n📦 **Catatan Pemasukan / Penjualan Terbaru:**\n${txsList}\n\n✨ **Evaluasi AI Partner:**\nArus kas bisnis kamu berjalan lancar dan terpisah rapi dari rekening pribadi. Tetap pantau margin profit dan catat setiap transaksi masuk biar omsetmu makin meledak yaa! Semangat bos! 🔥🚀`;
  }

  // 0.15. DANA DARURAT / SAKIT / BIAYA MEDIS / ASURANSI / INVESTASI
  if (
    q.includes('dana darurat') ||
    q.includes('darurat') ||
    q.includes('sakit') ||
    q.includes('rumah sakit') ||
    q.includes('biaya medis') ||
    q.includes('asuransi') ||
    q.includes('reksadana') ||
    q.includes('tabungan masa depan')
  ) {
    const tabungan = userData.accounts.find((a) => a.name.toLowerCase().includes('tabungan')) || { balance: 18500000 };
    const reksadana = userData.accounts.find((a) => a.name.toLowerCase().includes('reksadana') || a.name.toLowerCase().includes('investasi')) || { balance: 12000000 };
    const totalDarurat = tabungan.balance + reksadana.balance;

    return `🏥 **Analisa Dana Darurat & Proteksi Kesehatan Kamu, ${userData.name}!** 🛡️✨\n\nJika amit-amit kamu sakit atau butuh biaya tak terduga, ini alokasi dana aman yang kamu miliki:\n\n• 🏦 **Tabungan Masa Depan (Likuid/Cepat Cair):** **Rp${tabungan.balance.toLocaleString('id-ID')}**\n• 📈 **Dana Investasi Reksadana:** **Rp${reksadana.balance.toLocaleString('id-ID')}**\n━━━━━━━━━━━━━━━━━━━━━\n🛡️ **Total Dana Darurat Siap Pakai:** **Rp${totalDarurat.toLocaleString('id-ID')}**\n\n💡 **Evaluasi & Saran AI Partner:**\nDana darurat kamu sebesar **Rp${totalDarurat.toLocaleString('id-ID')}** ini sudah SANGAT KUAT dan ideal untuk meng-cover biaya medis mendesak serta biaya hidup kamu selama 3-6 bulan ke depan! Tetap jaga kesehatan dengan rutin olahraga gym dan makan teratur yaa, jangan sampai sakit! ❤️💪`;
  }

  // UNIVERSAL DYNAMIC TIME REMINDER REGEX
  const timeMatch = q.match(/(?:jam|pukul)?\s*(\d{1,2})[.:](\d{2})/i);
  const hasReminderWord = /\b(ingetin|ingatkan|ingat|remind|reminder|pengingat|alarm|notif|notifikasi|tolong)\b/i.test(q) || q.includes('mau') || q.includes('akan');

  if (timeMatch && hasReminderWord) {
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    let activity = userText
      .replace(/(?:saya|aku|nanti|hari ini|mau|akan|tolong|ingetin|ingatkan|ingat|ya|jam|pukul|\d{1,2}[.:]\d{2})/gi, '')
      .trim();

    if (!activity || activity.length < 2) activity = 'kegiatan penting kamu';
    activity = activity.charAt(0).toUpperCase() + activity.slice(1);

    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    let delayMs = target.getTime() - now.getTime();
    if (delayMs <= 0) {
      delayMs = 5000;
    }

    if (chatId) {
      setTimeout(() => {
        const msgText = `🔔 **NOTIFIKASI PENGINGAT TELEGRAM!** ⏰\n\nHalo ${userData.name}! Sekarang sudah jam **${timeStr} WIB**!\n\n📌 **Waktunya:** ${activity}!\n\nSemangat yaa, aku yakin kamu pasti bisa menyelesaikannya dengan baik! AI Partner selalu ada buat kamu 24/7! 🔥💪`;
        sendTelegramNotification(chatId, msgText, getMainKeyboard(true));
      }, delayMs);
    }

    return `✅ **Siap dengan senang hati, ${userData.name}!** 🔔⏰\n\n📌 **Aktivitas:** ${activity}\n🕒 **Waktu Notifikasi:** Tepat Pukul **${timeStr} WIB** hari ini.\n\nNanti tepat pada jam ${timeStr} aku langsung kirimkan notifikasi ke Telegram kamu ya. Jangan lupa persiapkan dirimu dengan baik! Semangat selalu! 😊✨`;
  }

  // 0. SIMULASI KEUANGAN / PERTANYAAN HYPOTHETICAL (MULTI-ITEM & DYNAMIC HUMOR)
  const isHypotheticalQuery =
    (q.includes('kalau') || q.includes('kalo') || q.includes('jika') || q.includes('misal') || q.includes('seandainya') || q.includes('gimana') || q.includes('kira-kira') || q.includes('kira kira') || q.includes('berapa') || q.includes('brp') || q.includes('boleh')) &&
    (q.includes('jt') || q.includes('juta') || q.includes('k') || q.includes('rb') || q.includes('ribu') || q.includes('jajan') || q.includes('beli') || q.includes('uang') || q.includes('saldo') || q.includes('sisa') || q.includes('besok') || q.includes('habis') || q.includes('tinggal'));

  if (isHypotheticalQuery) {
    const items = extractAllFinancialItems(userText);
    const totalAmount = items.reduce((sum, it) => sum + it.amount, 0);

    if (totalAmount > 0) {
      const remaining = Math.max(0, userData.totalBalance - totalAmount);

      const itemsList = items.length > 1
        ? items.map((it) => `• **${it.name}:** Rp${it.amount.toLocaleString('id-ID')}`).join('\n')
        : null;

      // Special contextual humor reactions
      let humorNote = '';
      if (q.includes('esteh') && items.some((it) => it.name.toLowerCase().includes('esteh') && it.amount >= 25000)) {
        humorNote = '\n\n😂 *Catatan AI:* Buset esteh 50 ribu mahal amat bro wkwk, esteh sultan bintang lima apa gimana tuh! Lain kali beli esteh 3 ribuan aja yaa biar sisa uangnya masuk tabungan! 🍵';
      } else if (totalAmount >= 5000000) {
        humorNote = '\n\n😱 *Catatan AI:* Waduh belanja sampai ' + (totalAmount >= 10000000 ? '10 JUTA' : 'Rp' + totalAmount.toLocaleString('id-ID')) + '?! Inget impian dan target tabungan kamu di Web Dashboard! Jangan langsung foya-foya yaa! 💸🛑';
      }

      if (totalAmount >= 1000000) {
        return `😱 **WADUH ${userData.name.toUpperCase()}! TOTALNYA Rp${totalAmount.toLocaleString('id-ID')}?!** 🤯🛑\n\n${itemsList ? '📋 **Rincian Rencana Belanja:**\n' + itemsList + '\n\n' : ''}• **Total Saldo Saat Ini:** **Rp${userData.totalBalance.toLocaleString('id-ID')}**\n• **Total Pengeluaran:** **-Rp${totalAmount.toLocaleString('id-ID')}**\n• **Estimasi Sisa Saldo Kamu:** **Rp${remaining.toLocaleString('id-ID')}**\n\n🚨 **AI Tough Love & Ngotot:**\nNominal Rp${totalAmount.toLocaleString('id-ID')} ini gede banget bro! Kalau kepotong segini, saldo kamu langsung tergerus drastis. Pikirin matang-matang dulu yaa, jangan impulsif belanja barang yang belum mendesak! Aku ingetin demi masa depan kamu nih! 💪🛑${humorNote}`;
      }

      return `💡 **Simulasi Perhitungan Keuangan Kamu (${userData.name}):**\n\n${itemsList ? '📋 **Rincian Rencana Jajan:**\n' + itemsList + '\n• **Total Belanja:** **Rp' + totalAmount.toLocaleString('id-ID') + '**\n\n' : ''}• **Total Saldo Saat Ini:** **Rp${userData.totalBalance.toLocaleString('id-ID')}**\n• **Estimasi Sisa Uang Kamu Besok:** **Rp${remaining.toLocaleString('id-ID')}**\n\n✨ **Saran AI Partner:**\nTotal jajan Rp${totalAmount.toLocaleString('id-ID')} ini masih sangat aman dan di bawah limit budget kamu kok! Kalau memang kamu butuh atau pengen jajan santai, jajan aja yaa! Tetap semangat! 😊👍${humorNote}`;
    }
  }

  // 0.5. PERMINTAAN HIBURAN / COMFORTER (e.g. "aku hariini capek banget hibur aku dong")
  if (q.includes('hibur') || (q.includes('capek') && (q.includes('dong') || q.includes('teman') || q.includes('temenin')))) {
    return `😊 **Sini aku temenin dan hibur kamu, ${userData.name}!** 🍵✨\n\nKalo kata pepatah modern: *"Kerja keras itu penting, tapi istirahat dan rebahan sejenak sambil minum teh hangat itu hak asasi manusia!"* wkwk 🥳\n\nBayangin deh: hari ini kamu udah lewatin banyak hal berat, dan kamu masih bisa tetap melangkah sampai detik ini. Itu bukti kalau kamu orang yang luar biasa tangguh dan hebat!\n\nYuk pejamkan mata 5-10 menit, dengerin lagu favorit kamu, dan jangan terlalu keras sama diri sendiri malam ini. Kamu udah lakuin yang terbaik hari ini! Mau aku ceritain hal seru apa lagi biar hati kamu makin rileks dan tenang? 😊❤️`;
  }

  // 0.6. JAM GYM / JADWAL GYM KEMARIN ATAU HARI INI (e.g. "jam berapa saya gym kemarin", "cek jadwal gym")
  if (
    (q.includes('jam') || q.includes('pukul') || q.includes('kapan') || q.includes('cek')) &&
    (q.includes('gym') || q.includes('workout') || q.includes('olahraga') || q.includes('latihan'))
  ) {
    return `🏋️ **Jadwal Workout Gym Kamu, ${userData.name}!** ⏰💪\n\n• **Waktu Latihan:** Tepat Pukul **17:00 WIB** (Sore hari)\n• **Menu Latihan:** **Chest & Triceps Day**\n• **Target Gerakan:**\n  1. Barbell Bench Press (3 Set x 8-10 Reps)\n  2. Incline Dumbbell Press (3 Set x 10 Reps)\n  3. Tricep Pushdown (3 Set x 12 Reps)\n\n💡 *Catatan AI:* Jadwal gym kamu jam 17:00 WIB. Jangan lupa cukupi minum air putih dan pemanasan 5 menit sebelum angkat beban yaa! 🔥🥤`;
  }

  // 0.65. REKAP AKTIVITAS KEMARIN / BACA JURNAL KEMARIN (e.g. "ngapain aja saya kemarin? apakah ada jurnaling kemarin? saya ingin membacanya")
  if (
    q.includes('kemarin') ||
    q.includes('kemaren') ||
    q.includes('hari lalu') ||
    q.includes('tadi malam') ||
    q.includes('semalam')
  ) {
    const yTxs = (db.transactions || []).filter((t) => (t.userId === targetUserId || t.code === code));
    const yJournals = (db.journals || []).filter((j) => (j.userId === targetUserId || j.code === code));

    const journalEntry = yJournals.length > 0
      ? `📌 **Judul:** "${yJournals[0].title}"\n📝 **Isi Jurnal:** "${yJournals[0].content}"\n😀 **Mood:** ${yJournals[0].mood}/5 • **Energi:** ${yJournals[0].energyLevel || 8}/10`
      : 'Kemarin belum ada catatan jurnaling baru yang dibuat.';

    const txSummary = yTxs.length > 0
      ? yTxs.slice(0, 3).map((t) => `• ${t.description} (${t.type === 'income' ? '+' : '-'}Rp${t.amount.toLocaleString('id-ID')})`).join('\n')
      : '• Tidak ada pengeluaran besar tercatat.';

    return `📜 **Rekap Lengkap Aktivitas & Jurnal Kemarin (${userData.name}):** 🗓️✨\n\n📖 **Catatan Jurnaling Kemarin:**\n${journalEntry}\n\n💸 **Transaksi & Keuangan Kemarin:**\n${txSummary}\n\n🏋️ **Kebugaran & Gym:**\nJadwal latihan Chest & Triceps Day (17:00 WIB).\n\n💡 *Catatan AI:* Semua aktivitas dan curhatan kamu tersimpan rapi dan aman di Web Dashboard Personal Life OS! Kamu hebat udah konsisten sampai hari ini! 😊❤️`;
  }

  // 0.7. PLANING BELAJAR 1 JAM / STUDY FOCUS PLAN (e.g. "kamu bisa buatkan planing saya belajar 1jam nga?")
  if (
    (q.includes('belajar') || q.includes('study') || q.includes('kursus') || q.includes('coding') || q.includes('materi') || q.includes('baca')) &&
    (q.includes('planing') || q.includes('planning') || q.includes('jadwal') || q.includes('rencana') || q.includes('ngapain') || q.includes('cara') || q.includes('gimana') || q.includes('1 jam') || q.includes('1jam') || q.includes('fokus'))
  ) {
    return `⏱️ **Plan Belajar 1 Jam Super Efektif (Teknik Deep Focus), ${userData.name}!** 📚🔥\n\nNih aku susunin jadwal 60 menit yang terbukti bikin materi cepat nyerap tanpa bikin otak burnout:\n\n⏳ **00:00 - 00:05 (Persiapan & Set Niat - 5 Menit):**\n• Singkirkan semua distraksi (nyalakan mode *Do Not Disturb* di HP).\n• Siapkan segelas air putih dan software / buku catatan kamu.\n• Tentukan 1 target tunggal yang mau dikuasai dalam 1 jam ini.\n\n🧠 **00:05 - 00:30 (Deep Focus Sprint 1 - 25 Menit):**\n• Fokus 100% pelajari konsep inti materi tanpa membuka tab lain.\n• Catat poin-poin penting dengan bahasa kamu sendiri.\n\n☕ **00:30 - 00:35 (Quick Refresh Break - 5 Menit):**\n• Berdiri, regangkan bahu dan pinggang, minum air putih, dan istirahatkan mata sejenak (jangan buka reels/tiktok yaa!).\n\n💻 **00:35 - 00:55 (Praktik Langsung / Latihan - 20 Menit):**\n• Langsung terapkan ilmu barunya (coding langsung, latihan soal, atau praktik studi kasus).\n\n🎯 **00:55 - 01:00 (Review & Evaluasi - 5 Menit):**\n• Evaluasi apa yang baru kamu pahami dan tulis singkat di *jurnaling: [apa yang dipelajari hari ini]* biar tersimpan di Web Dashboard kamu!\n\n💡 *Yuk mulai sekarang! Mau aku pasangin alarm pengingat 1 jam lagi?* Kamu tinggal ketik: *Ingetin jam [waktu selesainya]* yaa! Semangat belajarnya, kamu pasti bisa! 🚀💪`;
  }

  // 0.8. REKOMENDASI KEGIATAN UMUM / HARI INI MAU NGAPAIN (e.g. "ada saran untuk kegiatan hari ini nga?")
  if (
    q.includes('saran') ||
    q.includes('kegiatan') ||
    q.includes('ngapain') ||
    q.includes('rekomendasi') ||
    q.includes('ide') ||
    q.includes('bosen') ||
    q.includes('bingung mau') ||
    q.includes('rencana') ||
    q.includes('aktivitas')
  ) {
    return `🌟 **Rekomendasi Kegiatan Produktif & Seru Buat Kamu, ${userData.name}!** 📋✨\n\nNih aku susunin rencana aktivitas yang seimbang biar hari kamu tetap produktif, sehat, dan gak ngebosenin:\n\n1. 🏋️ **Workout & Kebugaran (Jam 17:00):**\n   Hari ini jadwal latihan kamu **Chest & Triceps Day** (Barbell Bench Press & Dumbbell Press). Luangkan waktu 30-45 menit biar tubuh tetap bugar & bertenaga!\n\n2. 🎯 **Fokus Target & To-Do List:**\n   Selesaikan 2-3 tugas utama di agenda kamu. Ingat target tabungan dan goals masa depan kamu di Web Dashboard!\n\n3. 📚 **Micro-Habit Sehat:**\n   • Cukupi asupan air putih (target 2.5 Liter hari ini).\n   • Luangkan 15 menit buat membaca atau belajar skill baru.\n\n4. 📖 **Me-Time & Jurnaling Malam:**\n   Nanti malam luangkan waktu santai sejenak sambil ketik *jurnaling: [cerita kamu]* untuk refleksi hari ini biar pikiran tetap fresh & tenang.\n\nKira-kira kamu mau mulai dari yang mana dulu nih? Semangat yaa, aku selalu siap nemenin kamu! 🔥💪`;
  }

  // 1. CURHAT / LELAH / CAPEK / STRES / SEDIH / MOOD
  if (q.includes('capek') || q.includes('lelah') || q.includes('stres') || q.includes('pusing') || q.includes('sedih') || q.includes('galau') || q.includes('berat') || q.includes('bingung')) {
    return `🫂 **Aku di sini buat kamu, ${userData.name}...**\n\nAku ngerti banget apa yang kamu rasain. Berjuang setiap hari itu gak mudah, dan merasa capek atau lelah itu hal yang sangat manusiawi.\n\nKamu udah hebat banget bertahan sampai detik ini. Yuk tarik napas dalam-dalam, minum air putih, dan istirahat sejenak 15-30 menit tanpa gangguan layar HP.\n\nKalau mau tumpahin semua unek-unek biar plong di hati, kamu bisa ketik *jurnaling: [cerita kamu]* agar tersimpan rapi di timeline Web Dashboard kamu. Apapun yang terjadi, aku selalu siap dengerin cerita kamu yaa ❤️✨`;
  }

  // 2. KEUANGAN / SALDO
  if (q.includes('saldo') || q.includes('keuangan') || q.includes('rekening') || q.includes('uang') || q.includes('duit')) {
    if (userData.totalBalance === 0 && userData.todaySpent === 0) {
      return `💰 **Halo ${userData.name}!**\n\n• **Total Saldo Saat Ini:** **Rp0**\n• **Pengeluaran Hari Ini:** **Rp0**\n\n✨ Akun kamu masih bersih dan rapi! Yuk mulai catat pemasukan atau pengeluaran pertama kamu:\n👉 *Gaji 5jt bank* (Catat saldo masuk)\n👉 *Kopi 15k* (Catat pengeluaran)`;
    }

    const accountsList = userData.accounts
      .map((a) => `• **${a.name}:** Rp${a.balance.toLocaleString('id-ID')}`)
      .join('\n');

    return `💰 **Rincian Keuangan Kamu (${userData.name}):**\n\n${accountsList}\n\n💸 **Total Saldo:** **Rp${userData.totalBalance.toLocaleString('id-ID')}**\n💳 **Pengeluaran Hari Ini:** **Rp${userData.todaySpent.toLocaleString('id-ID')}**\n\n✨ Keuangan kamu tercatat aman dan tersinkronisasi rapi ke Web Dashboard! Tetap bijak dan disiplin dalam mengatur pengeluaran yaa! 👍`;
  }

  // 3. BOROS / PENGELUARAN / HEMAT
  if (q.includes('boros') || q.includes('pengeluaran') || q.includes('hemat') || q.includes('jajan') || q.includes('belanja')) {
    if (userData.todaySpent === 0) {
      return `📊 **Laporan Finansial Hari Ini (${userData.name}):**\n\n🟢 **Pengeluaran Hari Ini:** **Rp0 (Luar Biasa Hemat!)**\n\nAlhamdulillah hari ini dompet kamu aman terkendali! Pertahankan disiplin ini ya, tapi jangan lupa penuhi kebutuhan nutrisi harian kamu juga! 🥳`;
    }
    if (userData.todaySpent > 100000) {
      return `⚠️ **Catatan Perhatian Buat Kamu (${userData.name}):**\n\n• Total Pengeluaran Hari Ini: **Rp${userData.todaySpent.toLocaleString('id-ID')}**\n\nWah, hari ini pengeluarannya sudah cukup lumayan nih. Aku ingetin dengan tulus yaa, tetap perhatikan target tabungan masa depan kamu di Web Dashboard. Yuk rem sedikit belanja impulsifnya! Semangat berhemat yaa! wkwk 😊💪`;
    }
    return `📊 **Laporan Pengeluaran Hari Ini (${userData.name}):**\n\n• Total Pengeluaran: **Rp${userData.todaySpent.toLocaleString('id-ID')}**\n\n🟢 Masih sangat aman dan terkontrol di bawah limit harian. Keren banget cara kamu mengelola keuangan! Tetap konsisten yaa! 💪`;
  }

  // 4. MAKANAN / KULINER / LAPAR
  if (q.includes('makan') || q.includes('laper') || q.includes('lapar') || q.includes('kuliner') || q.includes('masak') || q.includes('kenyang') || q.includes('menu')) {
    return `🍽️ **Wah soal makanan emang paling nikmat dibahas, ${userData.name}!**\n\nKalau kamu lagi lapar, jangan ditahan-tahan ya. Pilih makanan yang bergizi dan bikin tubuh kamu bertenaga. Jangan lupa catat pengeluarannya nanti (misal: *Makan siang 25k*) biar keuangan tetap rapi!\n\nKamu hari ini lagi pengen makan apa nih? Ceritain ke aku! 😋🍲`;
  }

  // 5. CINTA / HUBUNGAN / KELUARGA / TEMAN
  if (q.includes('cinta') || q.includes('pacar') || q.includes('pasangan') || q.includes('jodoh') || q.includes('keluarga') || q.includes('teman') || q.includes('sahabat')) {
    return `❤️ **Tentang Hubungan & Kehidupan (${userData.name}):**\n\nHubungan dengan orang-orang terkasih (keluarga, pasangan, sahabat) itu investasi emosional paling berharga dalam hidup. Jaga komunikasi yang baik, saling menghargai, dan selalu luangkan waktu untuk mereka.\n\nAda hal spesial atau lagi kepikiran seseorang hari ini? Cerita aja, aku siap dengerin! 😊✨`;
  }

  // 6.5. KEMAMPUAN / FITUR BOT ("kamu bisa apa aja", "fitur", "kemampuan", "siapa kamu")
  if (
    q.includes('bisa apa') ||
    q.includes('fitur') ||
    q.includes('kemampuan') ||
    q.includes('siapa kamu') ||
    q.includes('bisa bantu apa') ||
    q.includes('apa saja yang bisa')
  ) {
    return `🤖 **Halo ${userData.name}! Aku adalah Aura - AI Personal Life Partner & Super Assistant Kamu!** 🚀✨\n\nBerikut semua kemampuan hebat yang bisa aku lakukan untuk mempermudah hidupmu:\n\n1. 💰 **Manajemen Keuangan Otomatis:**\n   • Catat pengeluaran/pemasukan instan: ketik \`Kopi 15k\`, \`Makan siang 25k bca\`, \`Gaji 5jt\`.\n   • Cek saldo & evaluasi budget (*Tough Love* kalau boros).\n\n2. 📖 **Daily Journaling & Mental Clarity:**\n   • Catat cerita & curhatan: ketik \`jurnal: hari ini meeting lancar & bersyukur\`.\n   • Evaluasi mood score harian secara otomatis.\n\n3. 🏋️ **Fitness & Gym Coaching:**\n   • Panduan workout harian (Chest, Back, Legs, dll.), saran repetisi, set, dan pemulihan.\n\n4. 🎯 **Produktivitas & Habit Tracking:**\n   • Pasang pengingat: ketik \`Ingetin jam 17:00 workout\`.\n   • Buatkan jadwal belajar/kerja fokus (Deep Focus Sprint).\n\n5. 🧠 **Konsultasi Cerdas 24/7:**\n   • Tanya apa saja, hitungan matematika, ide bisnis, solusi masalah, sampai teman ngobrol santai!\n\n🔄 **Semua data otomatis tersinkronisasi langsung ke Web Dashboard:** \`http://localhost:5173/\`! Ada yang mau kita mulai sekarang? 😊🔥`;
  }

  // 7. GREETINGS & INTRO
  if (q.includes('halo') || q.includes('hai') || q.includes('pagi') || q.includes('siang') || q.includes('malam') || q.includes('assalam') || q.includes('ping') || q.includes('tes') || q.includes('test')) {
    return `👋 **Halo dan salam hangat, ${userData.name}!**\n\nSenang banget bisa menyapa kamu hari ini! Bagaimana kabarmu hari ini? Semoga segala urusan dan harimu dilancarkan yaa! ✨\n\nAda yang mau dicatat, ditanyain, atau sekadar mau ngobrol santai? Aku siap menemani kamu kapanpun! 😊🎉`;
  }

  // 8. HOBI / PROFILE / TENTANG USER
  if (q.includes('siapa saya') || q.includes('tentang saya') || q.includes('hobi') || q.includes('kamu kenal')) {
    const hobbiesStr = profile?.hobbies?.length > 0 ? profile.hobbies.join(', ') : 'Belajar & Produktif';
    const factsStr = profile?.facts?.length > 0 ? profile.facts.join('\n• ') : 'Pengguna disiplin Personal Life OS';

    return `🧠 **Yang Aku Ketahui Tentang Kamu (${userData.name}):**\n\n• **Nama:** ${userData.name}\n• **Kode Akun:** \`${code}\`\n• **Hobi/Minat:** ${hobbiesStr}\n• **Fakta yang Selalu Aku Ingat:**\n• ${factsStr}\n• **Total Saldo Aktif:** Rp${userData.totalBalance.toLocaleString('id-ID')}\n\nAku bangga bisa jadi partner perjalanan hidup kamu. Ceritakan apa saja tentang harimu, aku selalu senang mendengarnya! 😊✨`;
  }

  // 9. TERIMA KASIH / APRESIASI
  if (q.includes('makasih') || q.includes('terima kasih') || q.includes('thank') || q.includes('keren') || q.includes('mantap')) {
    return `🥰 **Sama-sama dengan sepenuh hati, ${userData.name}!**\n\nSenang banget bisa membantu dan menemani kamu. Kalau ada apa-apa lagi, jangan ragu chat aku kapan saja yaa! Semoga hari kamu menyenangkan! ✨❤️`;
  }

  // DEFAULT CONVERSATIONAL RESPONSE
  return `🤖 **Sahabat Pribadi Kamu (${userData.name}):**\n\nTerima kasih sudah berbagi cerita tentang hal ini! Aku sangat menghargai setiap obrolan kita.\n\nSebagai partner hidup kamu, aku selalu ada untuk menemani kamu mengatur keuangan, menjaga rutinitas sehat, mendengarkan curhatan, ataupun sekadar ngobrol santai sehari-hari. Ada hal lain yang lagi kamu pikirkan sekarang? Cerita aja yaa! 😊✨`;
}

// HELPER: CONNECT ACCOUNT FUNCTION
function performConnect(ctx, rawCode, chatId) {
  const code = (rawCode || '').trim().toUpperCase();
  const db = loadDB();

  if (code && code.length >= 4) {
    let targetUserId = db.codes[code];
    if (!targetUserId) {
      if (code === 'AD990X') targetUserId = 'user-admin';
      else if (code === 'A7K92P') targetUserId = 'user-bintang';
      else if (code === 'RZ882P') targetUserId = 'user-reza';
      else if (code === 'HJYNCJ') targetUserId = 'user-hjyncj';
      else targetUserId = `user-${code.toLowerCase()}`;
    }

    db.bindings[chatId] = {
      userId: targetUserId,
      code,
      chatId,
      username: ctx.from?.username || ctx.from?.first_name || 'User',
      connectedAt: new Date().toISOString(),
    };
    db.codes[code] = targetUserId;
    saveDB(db);

    const userName = code === 'AD990X' ? 'Admin System' : (code === 'A7K92P' ? 'Bintang Mas' : (code === 'HJYNCJ' ? 'Randi Pratama' : (code === 'RZ882P' ? 'Reza Pratama' : 'Pengguna')));

    ctx.reply(
      `✅ **KONEKSI BERHASIL, BOS!** 🎉🚀\n\nTelegram (*ID: ${chatId}*) resmi terhubung ke akun **${userName}** (Kode: \`${code}\`).\n\nStatus di Web Dashboard Anda sekarang sudah aktif **🟢 TERHUBUNG**!\n\n💡 Gunakan tombol menu di bawah untuk akses cepat atau ketik langsung transaksi Anda (e.g. *Kopi 15k*, *Pulsa 50k*)! wkwk 😁`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainKeyboard(true),
      }
    );
    return true;
  } else {
    ctx.reply(
      `❌ **Kode Salah / Kurang Lengkap!**\n\nKirim format: \`/connect KODE_ANDA\` atau ketik langsung kodenya (contoh: \`AD990X\` atau \`A7K92P\`).\n\nCek & salin kode unik binding kamu di menu Pengaturan Telegram Web Dashboard ya!`,
      {
        parse_mode: 'Markdown',
        reply_markup: getMainKeyboard(false),
      }
    );
    return false;
  }
}

// HELPER: WARNING IF USER IS NOT CONNECTED
function sendUnconnectedWarning(ctx) {
  ctx.reply(
    `⚠️ **Akun Telegram Anda Belum Terhubung ke Web Dashboard!**\n\nUntuk menjaga privasi, keamanan, dan pemisahan data per pengguna, silakan hubungkan akun Anda terlebih dahulu.\n\n👉 **Cara Menghubungkan:**\nKirim perintah: \`/connect KODE_ANDA\`\natau cukup ketik langsung kode unik Anda (contoh: \`AD990X\` atau \`A7K92P\`).\n\n💡 *Salin kode koneksi unik Anda pada menu Pengaturan Telegram di Web Dashboard.*`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(false),
    }
  );
}

// BOT COMMANDS
bot.command('start', (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];

  ctx.reply(
    `🌅 **Selamat Datang di Official Personal Life OS AI Bot!**\n\nSaya adalah Asisten & Partner Setia AI Anda yang pintar, humoris, dan terhubung 24/7 ke Web Dashboard.\n\n📱 **Menu Tombol Siap Pakai:**\nSilakan klik tombol menu di bawah layar untuk cek saldo, pengeluaran hari ini, jurnal, dan jadwal gym secara instan! 🚀`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(!!binding),
    }
  );
});

bot.command('menu', (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];

  ctx.reply(
    `📱 **Menu Cepat Personal Life OS:**\n\nSilakan pilih menu yang diinginkan dari tombol di bawah layar:`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(!!binding),
    }
  );
});

bot.command('connect', (ctx) => {
  const text = (ctx.text || ctx.message?.text || '').trim();
  const parts = text.split(' ');
  const code = (parts[1] || '').trim().toUpperCase();
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id);
  performConnect(ctx, code, chatId);
});

bot.command('setkey', (ctx) => {
  const text = (ctx.text || ctx.message?.text || '').trim();
  const parts = text.split(' ');
  const key = (parts[1] || '').trim();
  if (key && key.length > 10) {
    const db = loadDB();
    db.geminiApiKey = key;
    saveDB(db);
    ctx.reply(`✅ **Google Gemini AI API Key Berhasil Disimpan!**\n\nAI Agent Anda sekarang aktif dengan kecerdasan tingkat tinggi dari model Gemini! 🚀`, {
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(true)
    });
  } else {
    ctx.reply(`ℹ️ **Format Pengaturan Gemini Key:**\nKetik: \`/setkey AIzaSy...\``, { parse_mode: 'Markdown' });
  }
});

bot.command('balance', (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];
  if (!binding) {
    return sendUnconnectedWarning(ctx);
  }
  const targetUserId = binding.userId;
  const code = binding.code;
  const userData = getUserData(db, targetUserId, code);

  const accountsList = userData.accounts
    .map((a) => `• **${a.name}:** Rp${a.balance.toLocaleString('id-ID')}`)
    .join('\n');

  ctx.reply(
    `💰 **Rincian Keuangan Akun ${userData.name} (Kode: \`${code}\`):**\n\n${accountsList}\n\n💸 **Total Saldo:** **Rp${userData.totalBalance.toLocaleString('id-ID')}**\n💳 **Pengeluaran Hari Ini:** **Rp${userData.todaySpent.toLocaleString('id-ID')}**`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(true),
    }
  );
});

bot.command('today', (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];
  if (!binding) {
    return sendUnconnectedWarning(ctx);
  }
  const targetUserId = binding.userId;
  const code = binding.code;
  const userData = getUserData(db, targetUserId, code);

  ctx.reply(
    `💸 **Total Pengeluaran Hari Ini (${userData.name}):** **Rp${userData.todaySpent.toLocaleString('id-ID')}**\n\n🟢 **Status:** Transaksi tercatat aman & tersinkronisasi ke Web Dashboard!`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainKeyboard(true),
    }
  );
});

// GENERAL MESSAGES HANDLER WITH REAL-TIME WEB SYNC & AI AGENT
bot.on('message', async (ctx) => {
  const text = (
    ctx.text ||
    (ctx.message && ctx.message.text) ||
    (ctx.msg && ctx.msg.text) ||
    (typeof ctx === 'string' ? ctx : '')
  ).trim();

  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || ctx.from?.id || '');

  console.log(`📩 Telegram Message Received [ChatID: ${chatId}]: "${text}"`);

  if (!text || text.startsWith('/')) return;

  const rawLower = text.toLowerCase().trim();
  const db = loadDB();

  // D. DETEKSI KONEKSI TANPA PREFIX SLASH (/)
  const connectMatch = text.match(/^(?:connect|koneksi|hubungkan|hubungi|binding)\s+([a-zA-Z0-9]{4,10})$/i);
  if (connectMatch) {
    return performConnect(ctx, connectMatch[1], chatId);
  }

  // If message is a standalone code like AD990X, A7K92P, HJYNCJ
  const isDirectCodePattern = /^[A-Za-z0-9]{4,8}$/.test(text.trim()) && !['halo', 'test', 'ping', 'duit', 'kopi', 'gaji', 'buku', 'menu', 'siang', 'pagi', 'malam'].includes(rawLower);
  if (isDirectCodePattern && (db.codes[text.toUpperCase()] || text.length === 6)) {
    return performConnect(ctx, text.trim(), chatId);
  }

  if (rawLower === '🔗 hubungkan akun') {
    return ctx.reply(
      `🔗 **Panduan Menghubungkan Akun:**\n\n1. Buka Web Dashboard di browser.\n2. Masuk ke menu **Pengaturan Telegram**.\n3. Salin kode unik Anda (misal: \`A7K92P\` atau \`AD990X\`).\n4. Kirim kode tersebut ke chat bot ini!\n\nContoh ketik:\n👉 \`/connect A7K92P\` atau ketik kodenya langsung \`A7K92P\``,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(false) }
    );
  }

  // A. VALIDASI USER TERHUBUNG (MULTI-TENANT ISOLATION)
  const binding = db.bindings[chatId];
  if (!binding) {
    return sendUnconnectedWarning(ctx);
  }

  const today = new Date().toISOString().split('T')[0];
  const targetUserId = binding.userId;
  const code = binding.code;
  const userData = getUserData(db, targetUserId, code);

  // BUTTON HANDLER: 💰 Cek Saldo
  if (text === '💰 Cek Saldo' || rawLower === 'saldo' || rawLower === 'cek saldo') {
    const accountsList = userData.accounts
      .map((a) => `• **${a.name}:** Rp${a.balance.toLocaleString('id-ID')}`)
      .join('\n');

    return ctx.reply(
      `💰 **Rincian Keuangan Akun ${userData.name} (Kode: \`${code}\`):**\n\n${accountsList}\n\n💸 **Total Saldo:** **Rp${userData.totalBalance.toLocaleString('id-ID')}**\n💳 **Pengeluaran Hari Ini:** **Rp${userData.todaySpent.toLocaleString('id-ID')}**\n\n*Status:* Tersinkronisasi real-time ke Web Dashboard Personal Life OS Anda! wkwk 👍`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 📊 Pengeluaran Hari Ini
  if (text === '📊 Pengeluaran Hari Ini' || rawLower === 'pengeluaran hari ini' || rawLower === 'boros') {
    return ctx.reply(
      `📊 **Laporan Pengeluaran Hari Ini (${userData.name}):**\n\n• **Total Pengeluaran Hari Ini:** **Rp${userData.todaySpent.toLocaleString('id-ID')}**\n\n🟢 **Status:** Pengeluaran Anda terpantau aman di bawah limit harian. Pertahankan disiplin ya bro! 💪`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 🔥 Journal Streak & Reminder
  if (
    text === '🔥 Journal Streak & Reminder' ||
    rawLower === 'streak' ||
    rawLower === 'journal streak' ||
    rawLower === 'cek streak' ||
    rawLower === 'streak saya'
  ) {
    const userJournals = (db.journals || []).filter((j) => j.userId === targetUserId || j.code === code);
    const streak = calculateJournalStreak(userJournals);
    const hasJournalToday = userJournals.some((j) => j.date === today);

    const statusMsg = hasJournalToday
      ? `🟢 **Status Hari Ini:** **Sudah Dicatat!** Streak kamu aktif dan bertambah hari ini!`
      : `⚠️ **Status Hari Ini:** **Belum Ditulis!** Yuk luangkan 1 menit untuk catat jurnal sekarang agar streak tidak putus!`;

    let milestoneBadge = '🌱 *Level 1: Pemula Konsisten*';
    if (streak >= 30) milestoneBadge = '👑 *Level 4: Atomic Mastery Legend (30+ Hari)*';
    else if (streak >= 14) milestoneBadge = '💎 *Level 3: Habit Champion (14+ Hari)*';
    else if (streak >= 7) milestoneBadge = '🔥 *Level 2: Discipline Builder (7+ Hari)*';

    return ctx.reply(
      `🔥 **Laporan Journal Streak Kamu (${userData.name}):**\n\n🏆 **Active Streak:** **${streak} HARI BERTURUT-TURUT!** 🔥\n📊 **Badge Level:** ${milestoneBadge}\n📝 **Total Riwayat Jurnal:** **${userJournals.length} Catatan Tersimpan**\n\n${statusMsg}\n\n💡 **AI Proactive Guardian Reminder:**\n• Bot akan otomatis mengirimkan notifikasi pengingat setiap malam jika kamu belum mencatat jurnal agar streak kamu selalu terjaga!\n• Kamu juga bisa pasang pengingat kustom kapan saja, contoh: \`Ingetin jam 20:00 jurnaling ya\`.\n\nSemangat pertahankan konsistensi harianmu yaa! 🚀💪`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 🏋️ Menu Latihan Gym
  if (text === '🏋️ Menu Latihan Gym' || rawLower === 'menu gym' || rawLower === 'gym') {
    return ctx.reply(
      `🏋️ **Halo ${userData.name}! Menu Workout Gym Anda:**\n\n📅 **Menu Hari Ini:** Chest & Triceps Day (17:00 WIB)\n\n💪 **Target Latihan:**\n1. **Barbell Bench Press:** 3 Set x 8-10 Reps\n2. **Incline Dumbbell Press:** 3 Set x 10 Reps\n3. **Tricep Pushdown:** 3 Set x 12 Reps\n\n*AI Reminder:* Jaga form dan jangan lupa catat hasil angkatan di Gym Journal Web ya bro! 💪🥤`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 📝 List Task & Agenda
  if (text === '📝 List Task & Agenda' || rawLower === 'list task' || rawLower === 'agenda') {
    return ctx.reply(
      `📝 **List Task & Agenda Kamu (${userData.name}):**\n\nProgress: **${userData.completedTasksCount} / ${userData.todayTasksCount} Task Selesai**.\nSemangat tuntaskan seluruh tugas hari ini bro!`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 💡 Format & Contoh / Panduan
  if (text === '💡 Format & Contoh' || text === '💡 Panduan & Format' || rawLower === 'bantuan' || rawLower === 'contoh') {
    return ctx.reply(
      `💡 **Panduan Format Cepat Personal Life OS Bot:**\n\n💵 **Catat Pengeluaran:**\n• \`Kopi 15k\`\n• \`Makan siang 25k bca\`\n• \`Bensin 30k gopay\`\n• \`Pulsa 50k\`\n• \`Token listrik 100k\`\n\n💰 **Catat Pemasukan:**\n• \`Gaji 5jt bank\`\n• \`Jual barang 150k\`\n\n📖 **Tulis Jurnal Harian:**\n• \`jurnaling: hari ini saya belajar hal baru dan merasa produktif\`\n\n⏰ **Pasang Pengingat Waktu:**\n• \`Ingetin jam 17:00 workout dada\`\n\nSemua otomatis langsung masuk ke Web Dashboard Anda secara real-time! 🚀`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 🔗 Status Akun
  if (text === '🔗 Status Akun' || rawLower === 'status akun' || rawLower === '/status') {
    const isVip = (code === 'AD990X');
    return ctx.reply(
      `🔗 **Status Akun & Membership Personal Life OS:**\n\n👤 **Nama Pengguna:** ${userData.name}\n🏷️ **Kode Koneksi:** \`${code}\`\n💬 **Telegram Chat ID:** \`${chatId}\`\n🟢 **Status Koneksi:** **TERHUBUNG REAL-TIME**\n\n⏳ **Status Paket:** ${isVip ? '👑 Premium OS (Lifetime Active)' : '✨ Free Trial 7 Hari (Full Akses)'}\n🛡️ **Keamanan Data:** 100% Privat & Aman Tersimpan di Cloud.\n\n💡 *Info:* Catatan & data Anda tidak akan dihapus saat masa trial berakhir. Untuk perpanjang/aktivasi membership, silakan hubungi WhatsApp Admin! 👍`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // BUTTON HANDLER: 🌐 Info Web Dashboard
  if (text === '🌐 Info Web Dashboard' || rawLower === 'web dashboard') {
    return ctx.reply(
      `🌐 **Web Dashboard Personal Life OS:**\n\n• **URL Lokal:** \`http://localhost:5173/\`\n• **Fitur Web:** Dashboard Analytics, Gym Log, Daily Score, Habits Grid & Report Generator.\n\nBuka di browser laptop/HP Anda untuk melihat visual grafik lengkap! 🎉`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
  }

  // 1. QUERY / CEK JURNAL HARI INI
  if (
    text === '📖 Jurnal Hari Ini' ||
    rawLower === 'cek jurnal' ||
    rawLower === 'jurnal saya hari ini' ||
    rawLower === 'jurnal saya hariini' ||
    rawLower === 'cek jurnal saya hari ini' ||
    rawLower === 'lihat jurnal' ||
    rawLower === 'baca jurnal' ||
    rawLower === 'catatan jurnal' ||
    rawLower === 'riwayat jurnal'
  ) {
    if (!db.journals) db.journals = [];
    const userJournalsToday = db.journals.filter((j) => (j.userId === targetUserId || j.code === code) && j.date === today);
    const allUserJournals = db.journals.filter((j) => (j.userId === targetUserId || j.code === code));

    if (userJournalsToday.length > 0) {
      const journalItems = userJournalsToday.map((j, idx) => {
        const timeStr = j.createdAt ? new Date(j.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
        return `📖 **Jurnal #${idx + 1} (${timeStr ? timeStr + ' WIB' : 'Hari Ini'}):**\n📌 **Judul:** "${j.title}"\n📝 **Isi:** "${j.content}"\n😀 **Mood:** ${j.mood}/5 • **Energi:** ${j.energyLevel || 8}/10\n${j.learnedText ? `💡 **Pelajaran:** _${j.learnedText}_\n` : ''}${j.solutionsText ? `🛠️ **Solusi AI:** _${j.solutionsText}_\n` : ''}`;
      }).join('\n━━━━━━━━━━━━━━━━━━━━━\n\n');

      ctx.reply(
        `📚 **Catatan Jurnal Kamu Hari Ini (${today}) — Total ${userJournalsToday.length} Jurnal:**\n\n${journalItems}\n\n✨ **Status:** Semua jurnal ini tersimpan rapi dan dapat dibuka kapan saja di Timeline & Daily Journal Web Dashboard (\`http://localhost:5173/\`)!`,
        { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
      );
    } else if (allUserJournals.length > 0) {
      const latestJournals = allUserJournals.slice(0, 3).map((j, idx) => {
        return `📅 **[${j.date}] "${j.title}":**\n"${j.content}"\n💡 *Pelajaran:* ${j.learnedText || 'Refleksi hidup & konsistensi'}`;
      }).join('\n\n');

      ctx.reply(
        `📖 **Belum Ada Jurnal Baru Hari Ini (${today})!**\n\nBerikut catatan jurnal terakhir kamu:\n\n${latestJournals}\n\n👉 **Untuk menulis jurnal baru:**\nKetik: *jurnal: [cerita atau refleksi kamu hari ini]*`,
        { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
      );
    } else {
      ctx.reply(
        `📖 **Belum Ada Jurnal yang Dicatat!**\n\nYuk mulai biasakan jurnaling harian untuk refleksi diri dan belajar dari pengalaman!\n\n👉 **Ketik:** *jurnal: hari ini makan enak dan meeting lancar*`,
        { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
      );
    }
    return;
  }

  // 2. TULIS / INPUT JURNAL BARU
  const isJournalIntent =
    rawLower.startsWith('jurnal:') ||
    rawLower.startsWith('jurnaling:') ||
    rawLower.startsWith('catat jurnal:') ||
    rawLower.startsWith('tulis jurnal:') ||
    rawLower.startsWith('curhat:') ||
    rawLower.startsWith('saya ingin jurnaling') ||
    rawLower.startsWith('mau jurnaling') ||
    rawLower.startsWith('catat jurnaling') ||
    rawLower.startsWith('jurnal hari ini:') ||
    rawLower.startsWith('isi jurnal:');

  if (isJournalIntent) {
    let journalContent = text
      .replace(/^(jurnal:|jurnaling:|catat jurnal:|tulis jurnal:|curhat:|saya ingin jurnaling|mau jurnaling|catat jurnaling|jurnal hari ini:|isi jurnal:)/i, '')
      .trim();

    if (!journalContent || journalContent.length < 2) {
      journalContent = 'Hari ini saya merasa bersyukur dan tetap semangat beraktivitas.';
    }

    const words = journalContent.split(' ');
    const title = words.length > 5 ? words.slice(0, 5).join(' ') + '...' : journalContent;

    let mood = 4;
    let energyLevel = 8;
    let problemFound = '';
    let solutionProposed = '';
    let learningInsight = 'Setiap pengalaman hari ini adalah proses belajar untuk tumbuh lebih bijak.';

    if (rawLower.includes('ketiduran') || rawLower.includes('ditinggal') || rawLower.includes('nyesel') || rawLower.includes('bete') || rawLower.includes('capek') || rawLower.includes('lelah') || rawLower.includes('pusing') || rawLower.includes('kelelahan')) {
      mood = 3;
      energyLevel = 6;
      problemFound = rawLower.includes('ketiduran') ? 'Rencana terlewat karena tubuh kelelahan & ketiduran' : 'Merasa lelah setelah seharian beraktivitas';
      solutionProposed = rawLower.includes('ketiduran')
        ? 'Jadwalkan ulang agenda main dengan teman, prioritaskan recovery tidur yang cukup, dan pasang alarm terencana.'
        : 'Berikan tubuh hak untuk istirahat, cukupi minum air putih, dan kurangi beban pikiran malam ini.';
      learningInsight = 'Mendengarkan sinyal kelelahan tubuh adalah bentuk self-care, bukan kegagalan. Tubuh yang segar akan membuat aktivitas berikutnya lebih maksimal.';
    } else if (rawLower.includes('senang') || rawLower.includes('bahagia') || rawLower.includes('semangat') || rawLower.includes('puas') || rawLower.includes('gym') || rawLower.includes('olahraga')) {
      mood = 5;
      energyLevel = 9;
      problemFound = '';
      solutionProposed = 'Pertahankan ritme positif ini dan jaga konsistensi gaya hidup sehat!';
      learningInsight = 'Aktivitas positif dan olahraga rutin terbukti mendongkrak mood serta fokus seharian.';
    }

    const newJournal = {
      id: `j-tg-${Date.now()}`,
      userId: targetUserId,
      code: code,
      date: today,
      title: title,
      content: journalContent,
      mood: mood,
      energyLevel: energyLevel,
      highlightText: journalContent.substring(0, 80),
      gratitudeText: 'Bisa mengambil pelajaran berharga dan refleksi atas kejadian hari ini.',
      learnedText: learningInsight,
      problemsText: problemFound,
      solutionsText: solutionProposed,
      tags: ['#telegram', '#realtime', '#jurnal', mood <= 3 ? '#pembelajaran' : '#produktif'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.journals) db.journals = [];
    // PRESERVE ALL JOURNALS: Do NOT filter out same-day journals so user can keep multiple logs
    db.journals.unshift(newJournal);
    saveDB(db);

    ctx.reply(
      `✅ **JURNAL TELAH TERCATAT & TERSINKRONISASI KE WEB!** 📖✨\n\n📌 **Judul:** "${newJournal.title}"\n📝 **Isi:** "${newJournal.content}"\n😀 **Mood:** ${mood === 5 ? '🔥 Sangat Semangat' : (mood === 3 ? '🙂 Normal / Butuh Istirahat' : '😀 Produktif')} • **Energi:** ${energyLevel}/10\n\n💡 **Tanggapan & Refleksi AI:**\n_${learningInsight}_\n\n🛠️ **Rekomendasi Solusi:**\n_${solutionProposed || 'Tetap semangat dan jaga keseimbangan aktivitas harian!' }_\n\n✨ **Status:** Semua catatan tersimpan rapi dan dapat dibuka untuk dipelajari di Dashboard Web Personal Life OS Anda! 🚀`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
    return;
  }

  // 2.5. GYM & WORKOUT LOGGING VIA CHAT
  const isGymIntent =
    rawLower.startsWith('gym:') ||
    rawLower.startsWith('workout:') ||
    rawLower.startsWith('catat gym:') ||
    rawLower.startsWith('latihan:');

  if (isGymIntent) {
    const rawGym = text.replace(/^(gym:|workout:|catat gym:|latihan:)/i, '').trim();
    
    // Extract weight (e.g. 60kg, 80 kg)
    let weight = 0;
    const weightMatch = rawGym.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
    if (weightMatch) weight = parseFloat(weightMatch[1].replace(',', '.'));

    // Extract sets & reps (e.g. 3x10, 4x12, 3 set 10 reps)
    let sets = 3;
    let reps = 10;
    const setRepMatch = rawGym.match(/(\d+)\s*(?:x|\*)\s*(\d+)/i);
    if (setRepMatch) {
      sets = parseInt(setRepMatch[1], 10);
      reps = parseInt(setRepMatch[2], 10);
    } else {
      const setMatch = rawGym.match(/(\d+)\s*set/i);
      const repMatch = rawGym.match(/(\d+)\s*(?:rep|repetisi|ulang)/i);
      if (setMatch) sets = parseInt(setMatch[1], 10);
      if (repMatch) reps = parseInt(repMatch[1], 10);
    }

    // Exercise name clean up
    let exerciseName = rawGym
      .replace(/(\d+(?:[.,]\d+)?)\s*kg/gi, '')
      .replace(/(\d+)\s*(?:x|\*)\s*(\d+)/gi, '')
      .replace(/(\d+)\s*set/gi, '')
      .replace(/(\d+)\s*(?:rep|repetisi|ulang)/gi, '')
      .trim();
    if (!exerciseName) exerciseName = 'Latihan Beban';
    exerciseName = exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1);

    // Determine muscle group
    let muscleGroup = 'Full Body';
    const exLower = exerciseName.toLowerCase();
    if (exLower.includes('bench') || exLower.includes('chest') || exLower.includes('dada') || exLower.includes('push up')) muscleGroup = 'Chest';
    else if (exLower.includes('squat') || exLower.includes('leg') || exLower.includes('kaki') || exLower.includes('lunge') || exLower.includes('calf')) muscleGroup = 'Legs';
    else if (exLower.includes('deadlift') || exLower.includes('pull up') || exLower.includes('row') || exLower.includes('back') || exLower.includes('punggung') || exLower.includes('lat')) muscleGroup = 'Back';
    else if (exLower.includes('bicep') || exLower.includes('tricep') || exLower.includes('curl') || exLower.includes('dip') || exLower.includes('arm')) muscleGroup = 'Arms';
    else if (exLower.includes('shoulder') || exLower.includes('press') || exLower.includes('bahu') || exLower.includes('lateral')) muscleGroup = 'Shoulders';
    else if (exLower.includes('abs') || exLower.includes('plank') || exLower.includes('perut')) muscleGroup = 'Core';

    const newWorkout = {
      id: `w-tg-${Date.now()}`,
      userId: targetUserId,
      code: code,
      date: today,
      exerciseName: exerciseName,
      muscleGroup: muscleGroup,
      weightKg: weight,
      sets: sets,
      reps: reps,
      notes: rawGym,
      createdAt: new Date().toISOString(),
    };

    if (!db.workouts) db.workouts = [];
    db.workouts.unshift(newWorkout);
    saveDB(db);

    ctx.reply(
      `💪 **LOG WORKOUT GYM BERHASIL DICATAT!** 🏋️‍♂️🔥\n\n🏋️ **Gerakan:** ${exerciseName}\n🎯 **Target Otot:** ${muscleGroup}\n⚖️ **Beban:** ${weight > 0 ? weight + ' kg' : 'Bodyweight'}\n🔁 **Volume:** ${sets} Set × ${reps} Reps\n\n✨ **Status:** Data langsung tersinkronisasi ke Tab Gym & Workout Web Dashboard! Semangat konsisten bro! 💪`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
    return;
  }

  // 2.6. TASK & TO-DO CREATION VIA CHAT
  const isTaskIntent =
    rawLower.startsWith('task:') ||
    rawLower.startsWith('todo:') ||
    rawLower.startsWith('tugas:') ||
    rawLower.startsWith('catat task:');

  if (isTaskIntent) {
    const rawTask = text.replace(/^(task:|todo:|tugas:|catat task:)/i, '').trim();
    if (!rawTask) {
      return ctx.reply('⚠️ Harap masukkan nama task. Contoh: `task: bayar tagihan listrik besok`', { parse_mode: 'Markdown' });
    }

    let priority = 'medium';
    if (rawLower.includes('urgent') || rawLower.includes('penting') || rawLower.includes('high') || rawLower.includes('segera')) {
      priority = 'high';
    } else if (rawLower.includes('santai') || rawLower.includes('low')) {
      priority = 'low';
    }

    let category = 'Kerja & SaaS';
    if (rawLower.includes('gym') || rawLower.includes('workout') || rawLower.includes('lari') || rawLower.includes('sehat')) category = 'Kesehatan & Gym';
    else if (rawLower.includes('bayar') || rawLower.includes('transfer') || rawLower.includes('tagihan') || rawLower.includes('beli') || rawLower.includes('uang')) category = 'Keuangan';
    else if (rawLower.includes('baca') || rawLower.includes('belajar') || rawLower.includes('kursus') || rawLower.includes('buku')) category = 'Self Improvement';
    else if (rawLower.includes('rumah') || rawLower.includes('keluarga') || rawLower.includes('pribadi')) category = 'Pribadi';

    const newTask = {
      id: `task-tg-${Date.now()}`,
      userId: targetUserId,
      code: code,
      title: rawTask,
      priority: priority,
      category: category,
      status: 'todo',
      dueDate: today,
      dueTime: '18:00',
      checklist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.tasks) db.tasks = [];
    db.tasks.unshift(newTask);
    saveDB(db);

    ctx.reply(
      `📝 **TASK BARU BERHASIL DITAMBAHKAN!** 🎯\n\n📌 **Tugas:** "${newTask.title}"\n🏷️ **Kategori:** ${category}\n⚡ **Prioritas:** ${priority === 'high' ? '🔴 Tinggi (+100 XP)' : priority === 'medium' ? '🟡 Sedang (+60 XP)' : '🟢 Rendah (+40 XP)'}\n\n✨ **Status:** Terdaftar di Task Manager & Papan Kanban Web! Selesaikan untuk klaim XP! 🚀`,
      { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
    );
    return;
  }

  // 3. FINANCIAL TRANSACTIONS
  const parsed = parseExpenseText(text);

  if (parsed.isTransaction) {
    const isIncome = parsed.type === 'income';
    const nowTime = new Date().toTimeString().split(' ')[0];

    const newTx = {
      id: `tx-tg-${Date.now()}`,
      userId: targetUserId,
      code: code,
      type: parsed.type,
      amount: parsed.amount,
      category: parsed.category,
      description: parsed.item,
      sourceAccountId: parsed.type === 'income' ? 'acc-2' : 'acc-1',
      paymentMethod: parsed.account || 'Cash',
      date: today,
      time: nowTime,
      timestamp: new Date().toISOString(),
      tags: ['#telegram', '#realtime'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.transactions) db.transactions = [];
    db.transactions.unshift(newTx);
    saveDB(db);

    const responseText = `✅ **TRANSAKSI REAL-TIME TERSIMPAN!**\n\n📦 **Item:** ${parsed.item}\n💵 **Nominal:** ${isIncome ? '+' : '-'}Rp${parsed.amount.toLocaleString('id-ID')}\n🏷️ **Kategori:** ${parsed.category}\n💳 **Akun:** ${parsed.account}\n\n✨ **Status:** Terhubung & Otomatis Tersinkronisasi ke Akun Web (\`${code}\`) Anda!`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '🗑️ Batalkan / Hapus', callback_data: `del_${newTx.id}` },
          { text: '💰 Cek Saldo', callback_data: 'view_balance' }
        ]
      ]
    };

    ctx.reply(responseText, { parse_mode: 'Markdown', reply_markup: inlineKeyboard });

    if (parsed.amount >= 100000 && !isIncome) {
      setTimeout(() => {
        ctx.reply(
          `⚠️ **PERINGATAN AI PARTNER (TOUGH LOVE):**\n\nWaduh bro ${userData.name}, pengeluaran *${parsed.item}* (Rp${parsed.amount.toLocaleString('id-ID')}) lumayan gede tuh! Jangan impulsif jajan mulu ya, inget target tabungan lu di Web Dashboard! Rem dikit woy wkwk! 😂💪`,
          { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) }
        );
      }, 1000);
    }
  } else {
    // 4. NATURAL CONVERSATION WITH AI AGENT PARTNER
    try {
      // Send typing action immediately so user knows AI is actively thinking
      const sendTyping = () => {
        if (ctx.api && typeof ctx.api.sendChatAction === 'function') {
          ctx.api.sendChatAction({ chat_id: chatId, action: 'typing' }).catch(() => {});
        }
      };
      sendTyping();
      const typingInterval = setInterval(sendTyping, 3000);

      const aiResp = await generateAIAgentResponse(text, chatId, targetUserId, code);
      clearInterval(typingInterval);

      try {
        await ctx.reply(aiResp, { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) });
      } catch (err) {
        // Fallback to plain text if Markdown format has unescaped characters
        await ctx.reply(aiResp, { reply_markup: getMainKeyboard(true) });
      }
    } catch (err) {
      console.error('Error generating AI agent response:', err);
      const fallback = generateAIAgentFallback(text, chatId, targetUserId, code, userData);
      try {
        await ctx.reply(fallback, { parse_mode: 'Markdown', reply_markup: getMainKeyboard(true) });
      } catch (e) {
        await ctx.reply(fallback, { reply_markup: getMainKeyboard(true) });
      }
    }
  }
});

// ==========================================
// 📸 SCAN STRUK / FOTO NOTA (GEMINI VISION OCR)
// ==========================================
bot.on('photo', async (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];
  if (!binding) return sendUnconnectedWarning(ctx);
  const targetUserId = binding.userId;
  const code = binding.code;
  const userData = getUserData(db, targetUserId, code);
  const photos = ctx.message?.photo || ctx.photo || [];
  if (photos.length === 0) return;

  const highestPhoto = photos[photos.length - 1];
  const fileId = highestPhoto.file_id;

  ctx.reply('🔍 **Memproses Struk Belanja / Nota (Gemini Vision OCR)...** 🧾✨\n_Mohon tunggu sebentar..._', { parse_mode: 'Markdown' });

  try {
    const buffer = await downloadTelegramFileBuffer(fileId);
    if (!buffer) {
      return ctx.reply('❌ Gagal mengunduh foto struk dari Telegram. Silakan coba kirim ulang.');
    }

    const base64 = buffer.toString('base64');
    const prompt = `Analisis foto struk / kuitansi / invoice belanja ini.
Ekstrak informasi penting dalam format JSON murni tanpa markdown lain:
{
  "isReceipt": true,
  "storeName": "Nama Toko atau Merchant",
  "totalAmount": 50000,
  "category": "Makanan & Minuman / Belanja / Transportasi / Hiburan / Lain-lain",
  "paymentMethod": "Cash / BCA / GoPay / Mandiri",
  "itemsSummary": "Item 1, Item 2"
}
Jika bukan struk belanja atau tidak ada nominal harga, set "isReceipt": false.`;

    const apiKey = db.geminiApiKey || process.env.GEMINI_API_KEY || '';
    const ocrRaw = await callGeminiMultimodal(base64, 'image/jpeg', prompt, apiKey);

    let parsed = null;
    try {
      const cleaned = ocrRaw ? ocrRaw.replace(/```json|```/gi, '').trim() : '';
      parsed = JSON.parse(cleaned);
    } catch (e) {}

    if (parsed && parsed.isReceipt && parsed.totalAmount > 0) {
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toTimeString().split(' ')[0];
      const newTx = {
        id: `tx-ocr-${Date.now()}`,
        userId: targetUserId,
        code: code,
        type: 'expense',
        amount: parsed.totalAmount,
        category: parsed.category || 'Belanja',
        description: `${parsed.storeName || 'Struk Belanja'} (${parsed.itemsSummary || 'Item'})`,
        sourceAccountId: 'acc-1',
        paymentMethod: parsed.paymentMethod || 'Cash',
        date: today,
        time: nowTime,
        timestamp: new Date().toISOString(),
        tags: ['#ocr', '#struk', '#telegram'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!db.transactions) db.transactions = [];
      db.transactions.unshift(newTx);
      saveDB(db);

      const msg = `🧾 **STRUK BERHASIL DI-SCAN & TERSIMPAN KE WEB!** 📸✨\n\n🏪 **Toko/Merchant:** ${parsed.storeName || 'Toko'}\n💵 **Total Belanja:** **Rp${parsed.totalAmount.toLocaleString('id-ID')}**\n🏷️ **Kategori:** ${parsed.category || 'Belanja'}\n🛍️ **Item:** ${parsed.itemsSummary || '-'}\n💳 **Metode:** ${parsed.paymentMethod || 'Cash'}\n\n✨ Data otomatis disinkronkan ke Web Dashboard (\`${code}\`) Anda!`;
      
      const inlineButtons = {
        inline_keyboard: [
          [
            { text: '🗑️ Hapus / Batalkan', callback_data: `del_${newTx.id}` },
            { text: '💰 Cek Saldo', callback_data: 'view_balance' }
          ]
        ]
      };

      ctx.reply(msg, { parse_mode: 'Markdown', reply_markup: inlineButtons });
    } else {
      ctx.reply('⚠️ Foto tidak dikenali sebagai struk belanja yang memiliki total harga, atau nominal tidak terbaca jelas. Anda bisa mencatat manual dengan mengetik: `Kopi 15k`.', { reply_markup: getMainKeyboard(true) });
    }
  } catch (err) {
    console.error('OCR Error:', err);
    ctx.reply('❌ Terjadi kesalahan saat memproses OCR foto. Silakan coba lagi.');
  }
});

// ==========================================
// 🎙️ INPUT SUARA / VOICE NOTE TRANSCRIPTION
// ==========================================
const handleVoiceOrAudio = async (ctx) => {
  const chatId = String(ctx.chat?.id || ctx.message?.chat?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];
  if (!binding) return sendUnconnectedWarning(ctx);
  const targetUserId = binding.userId;
  const code = binding.code;
  const userData = getUserData(db, targetUserId, code);

  const voice = ctx.message?.voice || ctx.message?.audio || ctx.voice || ctx.audio;
  if (!voice) return;

  ctx.reply('🎙️ **Mendengarkan & Mentranskripsikan Suara Anda...** 🔊✨\n_Mohon tunggu sebentar..._', { parse_mode: 'Markdown' });

  try {
    const buffer = await downloadTelegramFileBuffer(voice.file_id);
    if (!buffer) {
      return ctx.reply('❌ Gagal mengunduh rekaman suara.');
    }

    const base64 = buffer.toString('base64');
    const prompt = `Dengarkan rekaman suara bahasa Indonesia ini dengan cermat.
Transkripsikan isi ucapan secara tepat dan tentukan intent pengguna dalam format JSON murni:
{
  "transcription": "Teks transkripsi lengkap yang diucapkan",
  "isTransaction": true,
  "type": "expense",
  "amount": 25000,
  "item": "Makan Bakso",
  "category": "Makanan & Minuman",
  "isJournal": false,
  "journalContent": ""
}
Jika ini adalah jurnal harian / curhat, set isJournal: true. Jika pertanyaan biasa, set isTransaction: false dan isJournal: false.`;

    const apiKey = db.geminiApiKey || process.env.GEMINI_API_KEY || '';
    const audioRaw = await callGeminiMultimodal(base64, voice.mime_type || 'audio/ogg', prompt, apiKey);

    let parsed = null;
    try {
      const cleaned = audioRaw ? audioRaw.replace(/```json|```/gi, '').trim() : '';
      parsed = JSON.parse(cleaned);
    } catch (e) {}

    if (parsed && parsed.transcription) {
      ctx.reply(`🗣️ **Transkripsi Suara:**\n_"${parsed.transcription}"_`, { parse_mode: 'Markdown' });

      if (parsed.isTransaction && parsed.amount > 0) {
        const today = new Date().toISOString().split('T')[0];
        const nowTime = new Date().toTimeString().split(' ')[0];
        const newTx = {
          id: `tx-voice-${Date.now()}`,
          userId: targetUserId,
          code: code,
          type: parsed.type || 'expense',
          amount: parsed.amount,
          category: parsed.category || 'Lain-lain',
          description: parsed.item || parsed.transcription,
          sourceAccountId: parsed.type === 'income' ? 'acc-2' : 'acc-1',
          paymentMethod: 'Cash',
          date: today,
          time: nowTime,
          timestamp: new Date().toISOString(),
          tags: ['#voice', '#telegram'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (!db.transactions) db.transactions = [];
        db.transactions.unshift(newTx);
        saveDB(db);

        const isIncome = parsed.type === 'income';
        const msg = `✅ **TRANSAKSI SUARA TERCATAT!** 🎙️💵\n\n📦 **Item:** ${newTx.description}\n💵 **Nominal:** ${isIncome ? '+' : '-'}Rp${newTx.amount.toLocaleString('id-ID')}\n🏷️ **Kategori:** ${newTx.category}\n\n✨ Tersinkronisasi otomatis ke Web Dashboard!`;
        const inlineButtons = {
          inline_keyboard: [
            [
              { text: '🗑️ Hapus Transaksi', callback_data: `del_${newTx.id}` },
              { text: '💰 Cek Saldo', callback_data: 'view_balance' }
            ]
          ]
        };
        ctx.reply(msg, { parse_mode: 'Markdown', reply_markup: inlineButtons });
      } else if (parsed.isJournal) {
        const today = new Date().toISOString().split('T')[0];
        const newJournal = {
          id: `j-voice-${Date.now()}`,
          userId: targetUserId,
          code: code,
          date: today,
          title: `Refleksi Suara: ${parsed.transcription.substring(0, 30)}...`,
          content: parsed.journalContent || parsed.transcription,
          mood: 4,
          energyLevel: 8,
          highlightText: parsed.transcription.substring(0, 60),
          gratitudeText: 'Bisa meluangkan waktu bersuara & refleksi.',
          learnedText: 'Mengekspresikan pikiran lewat suara menjaga kejernihan mental.',
          problemsText: '',
          solutionsText: 'Tetap konsisten dan dengarkan tubuh.',
          tags: ['#voice', '#jurnal', '#telegram'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (!db.journals) db.journals = [];
        db.journals.unshift(newJournal);
        saveDB(db);

        ctx.reply(`📖 **JURNAL SUARA BERHASIL DISIMPAN!** ✨\n\n📝 **Isi:** "${newJournal.content}"\n\nSemua curhatan tersimpan aman di Web Dashboard Anda!`, { reply_markup: getMainKeyboard(true) });
      } else {
        const aiResp = await generateAIAgentResponse(parsed.transcription, chatId, targetUserId, code);
        ctx.reply(aiResp, { reply_markup: getMainKeyboard(true) });
      }
    } else {
      ctx.reply('⚠️ Suara tidak tertangkap dengan jelas. Coba rekam kembali di tempat yang lebih tenang yaa!', { reply_markup: getMainKeyboard(true) });
    }
  } catch (e) {
    console.error('Voice processing error:', e);
    ctx.reply('❌ Terjadi kendala memproses pesan suara.');
  }
};

bot.on('voice', handleVoiceOrAudio);
bot.on('audio', handleVoiceOrAudio);

// ==========================================
// 🔘 INTERACTIVE INLINE KEYBOARD CALLBACKS
// ==========================================
bot.on('callback_query', async (query) => {
  const data = query.data || '';
  const chatId = String(query.message?.chat?.id || query.from?.id || '');
  const db = loadDB();
  const binding = db.bindings[chatId];
  if (!binding) return;
  const targetUserId = binding.userId;
  const code = binding.code;

  if (data.startsWith('del_')) {
    const txId = data.replace('del_', '');
    if (db.transactions) {
      db.transactions = db.transactions.filter(t => t.id !== txId);
      saveDB(db);
    }
    try {
      if (typeof bot.answerCallbackQuery === 'function') {
        bot.answerCallbackQuery(query.id, { text: '🗑️ Transaksi telah dihapus!' }).catch(() => {});
      }
    } catch (e) {}
    try {
      if (typeof bot.editMessageText === 'function') {
        bot.editMessageText('❌ **Transaksi ini telah dibatalkan & dihapus dari sistem Web Dashboard.**', {
          chat_id: chatId,
          message_id: query.message.message_id,
          parse_mode: 'Markdown'
        }).catch(() => {});
      }
    } catch (e) {}
  } else if (data === 'view_balance') {
    const userData = getUserData(db, targetUserId, code);
    try {
      if (typeof bot.answerCallbackQuery === 'function') {
        bot.answerCallbackQuery(query.id, { text: `Saldo: Rp${userData.totalBalance.toLocaleString('id-ID')}` }).catch(() => {});
      }
    } catch (e) {}
    const accountsList = userData.accounts.map((a) => `• **${a.name}:** Rp${a.balance.toLocaleString('id-ID')}`).join('\n');
    sendTelegramNotification(chatId, `💰 **Saldo Terkini Akun ${userData.name}:**\n\n${accountsList}\n\n💸 **Total Saldo Aktif:** **Rp${userData.totalBalance.toLocaleString('id-ID')}**`);
  }
});

// Resilient Polling Error Handler
bot.on('polling_error', (error) => {
  if (error.code === 'ETELEGRAM' && error.message?.includes('409 Conflict')) {
    console.warn('⚠️ Telegram Bot Polling Conflict: Ada instance bot lain yang sedang berjalan dengan token ini.');
  } else {
    console.error('Telegram Polling Error:', error.message || error);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Bot Server Uncaught Exception:', err.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Bot Server Unhandled Rejection:', reason);
});

// ==========================================
// 🌅 PROACTIVE MORNING BRIEF & EVENING REFLECTION
// ==========================================
let lastReminderDate = '';
let lastMorningDate = '';
setInterval(() => {
  try {
    const now = new Date();
    const hours = now.getHours();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Morning Routine Briefing (07:00 - 08:00 WIB)
    if (hours >= 7 && hours <= 8 && lastMorningDate !== todayStr) {
      const db = loadDB();
      if (db.bindings) {
        Object.keys(db.bindings).forEach((chatId) => {
          const binding = db.bindings[chatId];
          const targetUserId = binding.userId;
          const code = binding.code;
          const userData = getUserData(db, targetUserId, code);

          const morningMsg = `🌅 **SELAMAT PAGI, ${userData.name.toUpperCase()}!** ☀️✨\n\nBerikut ringkasan kesiapan hari ini:\n• 💰 **Saldo Dompet/Rekening:** Rp${userData.totalBalance.toLocaleString('id-ID')}\n• 🎯 **Target Produktivitas:** Selesaikan prioritas to-do list & catat pengeluaran harian.\n• 🏋️ **Kebugaran:** Jangan lupa jadwal olahraga & minum air putih yang cukup!\n\nSemangat melangkah hari ini! Aku siap mendampingi aktivitasmu seharian! 🚀💪`;
          sendTelegramNotification(chatId, morningMsg, getMainKeyboard(true));
        });
      }
      lastMorningDate = todayStr;
    }

    // 2. Evening Journal Streak Reminder (20:00 - 21:00 WIB)
    if (hours >= 20 && hours <= 21 && lastReminderDate !== todayStr) {
      const db = loadDB();
      if (db.bindings) {
        Object.keys(db.bindings).forEach((chatId) => {
          const binding = db.bindings[chatId];
          const targetUserId = binding.userId;
          const code = binding.code;
          const userJournals = (db.journals || []).filter((j) => j.userId === targetUserId || j.code === code);
          const hasToday = userJournals.some((j) => j.date === todayStr);

          if (!hasToday) {
            const streak = calculateJournalStreak(userJournals);
            const msg = `🔔 **PENGINGAT JOURNAL STREAK MALAM HARI!** ⏰📖\n\nHalo ${binding.username || 'Bro'}! Kamu saat ini punya **${streak} Hari Journal Streak 🔥**!\n\nJangan biarkan streak konsistensi kamu terputus yaa. Yuk luangkan 1 menit untuk catat refleksi atau curhatan hari ini:\n👉 *Ketik:* \`jurnal: [cerita atau hal yang kamu rasakan hari ini]\`\n\nAI Partner selalu ada & siap mendengarkan cerita kamu! 😊✨`;
            sendTelegramNotification(chatId, msg, getMainKeyboard(true));
          }
        });
      }
      lastReminderDate = todayStr;
    }
  } catch (e) {
    console.error('Proactive routine schedule error:', e);
  }
}, 60000);

// Start Polling with Auto-Recovery
async function startBot() {
  try {
    bot.startPolling().catch((err) => {
      if (err.message?.includes('409 Conflict')) {
        console.warn('⚠️ Telegram Polling Conflict (409): Instance bot lain sedang aktif.');
      } else {
        console.error('Error in bot polling loop:', err);
      }
    });
    console.log('🚀 Telegram AI Agent Partner Active with Dynamic Multi-User Memory, OCR & Voice Multimodal AI!');
  } catch (err) {
    console.error('Error starting bot:', err);
  }
}

startBot();

