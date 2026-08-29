import React, { useState } from 'react';
import { exportExecutiveFinancialReport } from '../../utils/executiveReport';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { audioSynth } from '../../utils/audioSynth';
import { Download, Upload, Database, FileSpreadsheet, ShieldCheck, Printer, Sparkles, Table } from 'lucide-react';

export const DataExportBackup: React.FC = () => {
  const { exportBackup, restoreBackup, accounts, transactions, journals } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();
  const [jsonInput, setJsonInput] = useState('');

  const handleExecutiveReport = () => {
    if (!currentUser) return;
    audioSynth.playClick();
    exportExecutiveFinancialReport(currentUser, accounts, transactions, journals);
    showToast('Laporan Executive Life OS berhasil dibuka!');
  };

  const handleDownloadCSV = () => {
    audioSynth.playClick();
    if (!transactions || transactions.length === 0) {
      showToast('Belum ada data transaksi untuk diekspor.', 'error');
      return;
    }

    // CSV with UTF-8 BOM so Excel opens IDR and Indonesian text cleanly
    const headers = ['ID Transaksi', 'Tanggal', 'Waktu', 'Deskripsi', 'Tipe', 'Kategori', 'Metode Pembayaran', 'Nominal (IDR)', 'Tags'];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.time || ''}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}"`,
      `"${t.category}"`,
      `"${t.paymentMethod || 'Cash'}"`,
      t.amount,
      `"${(t.tags || []).join(', ')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LifeOS_Transaksi_Keuangan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    audioSynth.playSuccess(0.1);
    showToast('File CSV/Excel transaksi berhasil diunduh!');
  };

  const handleDownloadJSON = () => {
    audioSynth.playClick();
    const dataStr = exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PersonalLifeOS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    audioSynth.playSuccess(0.1);
    showToast('Backup data JSON berhasil diunduh!');
  };

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;
    const success = restoreBackup(jsonInput);
    if (success) {
      audioSynth.playSuccess(0.15);
      showToast('Database berhasil dipulihkan!');
      setJsonInput('');
    } else {
      showToast('Format JSON backup tidak valid!', 'error');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Ekspor Data & Backup / Restore Database</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Simpan salinan data lengkap atau ekspor ke PDF, Excel/CSV, dan JSON.</p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Executive PDF Report Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/40 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Laporan Audit Eksekutif (PDF / Print)</h4>
              <p className="text-xs text-slate-300 mt-0.5">Format laporan bersih, rapi, dan siap cetak/arsip dengan ringkasan saldo & riwayat.</p>
            </div>
          </div>
          <button
            onClick={handleExecutiveReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Buka & Cetak Laporan PDF</span>
          </button>
        </div>

        {/* CSV / Excel Export Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-500/40 flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Ekspor ke Excel / CSV Spreadsheet</h4>
              <p className="text-xs text-slate-300 mt-0.5">Unduh data transaksi dalam format .csv yang rapi untuk diolah di Microsoft Excel atau Google Sheets.</p>
            </div>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* JSON Backup & Restore Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="font-bold text-xs text-slate-200">Unduh Backup Data (Full Database JSON)</div>
          <p className="text-xs text-slate-400">Unduh seluruh data keuangan, jurnal, task, gym, dan habit dalam format JSON aman.</p>
          <button
            onClick={handleDownloadJSON}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Unduh Full JSON Backup
          </button>
        </div>

        <form onSubmit={handleRestore} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="font-bold text-xs text-slate-200">Restore Backup Data</div>
          <textarea
            rows={3}
            placeholder="Paste string JSON backup di sini..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 text-xs font-mono outline-none"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Restore Database
          </button>
        </form>
      </div>
    </div>
  );
};
