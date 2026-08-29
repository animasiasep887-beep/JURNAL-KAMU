// ==========================================
// EXECUTIVE REPORT GENERATOR & EXPORT UTILITIES
// Generates clean, modern printable HTML/PDF reports and CSV spreadsheets
// ==========================================

import { Transaction, JournalEntry, Account, User } from '../types';
import { formatIDR } from './formatters';

export function exportExecutiveFinancialReport(
  user: User,
  accounts: Account[],
  transactions: Transaction[],
  journals: JournalEntry[]
) {
  const totalBalance = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Executive Life OS Financial Report - ${user.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 40px;
      margin: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 30px;
    }
    .brand {
      font-size: 24px;
      font-weight: 800;
      color: #4f46e5;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: #eef2ff;
      color: #4f46e5;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-top: 4px;
    }
    .grid-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 16px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }
    .card-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 13px;
    }
    th {
      text-align: left;
      padding: 10px 14px;
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
    .expense { color: #dc2626; }
    .income { color: #16a34a; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }
    @media print {
      body { padding: 15px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">PERSONAL LIFE OS</div>
      <div class="badge">Executive Financial & Habits Audit</div>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #475569;">
        Klien: <strong>${user.name}</strong> (${user.email})
      </p>
    </div>
    <div style="text-align: right;">
      <p style="font-size: 12px; color: #64748b; margin: 0;">Tanggal Laporan:</p>
      <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 2px 0 0 0;">${printDate}</p>
      <button class="no-print" onclick="window.print()" style="margin-top: 10px; background: #4f46e5; color: #fff; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 600; cursor: pointer;">
        🖨️ Cetak / Simpan PDF
      </button>
    </div>
  </div>

  <div class="grid-summary">
    <div class="card">
      <div class="card-title">Total Saldo Aktif</div>
      <div class="card-val">${formatIDR(totalBalance)}</div>
    </div>
    <div class="card">
      <div class="card-title">Total Pemasukan</div>
      <div class="card-val income">+${formatIDR(totalIncome)}</div>
    </div>
    <div class="card">
      <div class="card-title">Total Pengeluaran</div>
      <div class="card-val expense">-${formatIDR(totalExpense)}</div>
    </div>
    <div class="card">
      <div class="card-title">Net Saving Balance</div>
      <div class="card-val" style="color: ${netSavings >= 0 ? '#16a34a' : '#dc2626'}">
        ${netSavings >= 0 ? '+' : ''}${formatIDR(netSavings)}
      </div>
    </div>
  </div>

  <h3 style="font-size: 16px; margin: 24px 0 10px 0; color: #0f172a;">Rincian Transaksi Terbaru</h3>
  <table>
    <thead>
      <tr>
        <th>Tanggal</th>
        <th>Deskripsi Transaksi</th>
        <th>Kategori</th>
        <th>Metode Pembayaran</th>
        <th style="text-align: right;">Nominal</th>
      </tr>
    </thead>
    <tbody>
      ${transactions
        .slice(0, 30)
        .map(
          (t) => `
        <tr>
          <td class="mono">${t.date}</td>
          <td><strong>${t.description}</strong></td>
          <td><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 6px; font-size: 11px;">${t.category}</span></td>
          <td>${t.paymentMethod}</td>
          <td class="mono ${t.type === 'income' ? 'income' : 'expense'}" style="text-align: right; font-weight: 600;">
            ${t.type === 'income' ? '+' : '-'}${formatIDR(t.amount)}
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <span>Digenerate otomatis oleh Personal Life OS AI Executive Suite</span>
    <span>Halaman 1 dari 1</span>
  </div>
</body>
</html>
`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    alert('Popup diblokir browser. Izinkan popup untuk membuka laporan.');
  }
}
