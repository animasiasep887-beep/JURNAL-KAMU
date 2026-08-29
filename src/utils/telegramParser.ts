// ==========================================
// TELEGRAM NATURAL LANGUAGE PARSER ENGINE
// ==========================================

import type { ParsedTelegramExpense } from '../types/telegram';
import { getTodayString, getNowTimeString } from './formatters';

// Category keyword mappings for auto-categorization
const CATEGORY_MAP: Record<string, string[]> = {
  'Makanan & Minuman': ['kopi', 'makan', 'ayam', 'nasi', 'sarapan', 'jajan', 'minum', 'boba', 'es', 'teh', 'bakso', 'mie', 'sate', 'pizza', 'burger', 'restoran', 'cafe', 'telur'],
  'Transportasi': ['bensin', 'parkir', 'tol', 'gojek', 'grab', 'ojek', 'taksi', 'angkot', 'kereta', 'tiket', 'bengkel', 'oli'],
  'Belanja & Kebutuhan': ['sepatu', 'baju', 'kaos', 'celana', 'skincare', 'sabun', 'shampoo', 'supermarket', 'alfamart', 'indomaret', 'tokopedia', 'shopee', 'blibli', 'belanja', 'sempak', 'pakaian'],
  'Tagihan & Utilitas': ['listrik', 'air', 'wifi', 'indihome', 'pulsa', 'kuota', 'langganan', 'netflix', 'spotify', 'iCloud'],
  'Kesehatan & Fitnes': ['gym', 'fitness', 'protein', 'suplemen', 'obat', 'dokter', 'vitamin'],
  'Hiburan & Hobi': ['nonton', 'bioskop', 'game', 'steam', 'buku', 'liburan'],
  'Pemasukan': ['gaji', 'bonus', 'freelance', 'omset', 'dividen', 'cashback', 'proyek', 'thr', 'dapat uang', 'dapat gaji', 'tambahan uang', 'ada yang beli', 'penjualan', 'jual', 'laku', 'terima uang', 'pemasukan'],
};

export function parseTelegramMessage(text: string): ParsedTelegramExpense {
  const rawLower = text.toLowerCase().trim();
  const today = getTodayString();
  const time = getNowTimeString();

  // Check if text indicates income
  const isIncome = rawLower.includes('gaji') || rawLower.includes('pemasukan') || rawLower.includes('bonus') || rawLower.includes('omset') || rawLower.includes('cashback') || rawLower.includes('thr') || rawLower.includes('tambahan uang') || rawLower.includes('ada yang beli') || rawLower.includes('penjualan') || rawLower.includes('jual') || rawLower.includes('laku') || rawLower.includes('dapat uang');
  const isTransfer = rawLower.includes('transfer') || rawLower.includes('pindah');

  // Extract amount
  // Matches expressions like: 10k, 25k, 500k, 3jt, 3 juta, 10rb, 10 ribu, 15.000, 15000, rp10000
  let amount = 0;
  let confidence: 'high' | 'medium' | 'low' = 'low';

  // Pattern 1: Number + jt / juta (e.g. 3jt, 2.5 juta, 3 juta)
  const jtMatch = rawLower.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/);
  if (jtMatch) {
    amount = parseFloat(jtMatch[1].replace(',', '.')) * 1_000_000;
    confidence = 'high';
  }

  // Pattern 2: Number + k / rb / ribu (e.g. 10k, 25rb, 15 ribu)
  if (!amount) {
    const kMatch = rawLower.match(/(\d+(?:[.,]\d+)?)\s*(?:k|rb|ribu)/);
    if (kMatch) {
      amount = parseFloat(kMatch[1].replace(',', '.')) * 1_000;
      confidence = 'high';
    }
  }

  // Pattern 3: Explicit Rp or standalone 3+ digit numbers (e.g. Rp 15.000, 50000)
  if (!amount) {
    const rpMatch = rawLower.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/);
    if (rpMatch) {
      amount = parseInt(rpMatch[1].replace(/\./g, ''), 10);
      confidence = 'medium';
    }
  }

  // Detect Payment/Account type keywords
  let accountType: 'cash' | 'bank' | 'ewallet' | 'savings' | undefined = undefined;
  if (rawLower.includes('cash') || rawLower.includes('tunai')) accountType = 'cash';
  else if (rawLower.includes('bank') || rawLower.includes('bca') || rawLower.includes('mandiri') || rawLower.includes('bni') || rawLower.includes('bri')) accountType = 'bank';
  else if (rawLower.includes('ewallet') || rawLower.includes('gopay') || rawLower.includes('ovo') || rawLower.includes('dana') || rawLower.includes('shopeepay')) accountType = 'ewallet';
  else if (rawLower.includes('tabungan') || rawLower.includes('simpanan')) accountType = 'savings';

  // Auto-categorization
  let category = isIncome ? 'Pemasukan' : 'Lain-lain';
  for (const [catName, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some((kw) => rawLower.includes(kw))) {
      category = catName;
      break;
    }
  }

  // Clean item description by removing amount, account words, and relative time fillers
  let item = text
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta|k|rb|ribu)/gi, '')
    .replace(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,9})/gi, '')
    .replace(/\b(cash|tunai|bank|bca|mandiri|bni|bri|ewallet|gopay|ovo|dana|shopeepay|tabungan|tadi|barusan|beli|membeli|gw|harga|biji|butir|tambahan uang|ada yang|ada)\b/gi, '')
    .trim();

  if (!item || item.length < 2) {
    item = category !== 'Lain-lain' ? category : (isIncome ? 'Pemasukan' : 'Pengeluaran');
  }

  // Capitalize first letter
  item = item.charAt(0).toUpperCase() + item.slice(1);

  const isTransaction = amount > 0;

  return {
    isTransaction,
    type: isTransfer ? 'transfer' : (isIncome ? 'income' : 'expense'),
    item,
    amount,
    category,
    accountType: accountType || 'cash',
    confidence: isTransaction ? confidence : 'low',
    rawMessage: text,
    date: today,
    time: time,
  };
}
